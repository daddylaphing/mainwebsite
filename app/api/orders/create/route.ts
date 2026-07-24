/**
 * POST /api/orders/create
 *
 * Creates an order with full server-side cart recalculation.
 * Client-side totals are IGNORED — everything is recomputed here.
 * Voucher is re-validated server-side; discount amounts from client are discarded.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { orderService } from "@/lib/services/orders/order-service";
import { voucherService } from "@/lib/services/vouchers/voucher-service";
import { getApplicableTier, calcBulkDiscount } from "@/lib/bulk-tiers";

const BASE_PACKAGING_CHARGE = 30;
const BULK_PACKAGING_CHARGE = 60;
const BULK_KIT_THRESHOLD = 10;
const TAX_RATE = 0.05;

interface IncomingItem {
  product_id: string | null;
  name: string;
  price?: number;
  quantity: number;
  image_url?: string;
  kit_config?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    if (!body.shipping_address) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    const serviceSupabase = createServiceClient();

    // ── Step 1: Re-fetch live product prices from DB (never trust client prices) ──
    const incomingItems: IncomingItem[] = body.items;
    const productIds = incomingItems
      .map((i) => i.product_id)
      .filter((id): id is string => typeof id === "string" && !id.startsWith("addon"));

    let productPriceMap: Record<string, number> = {};

    if (productIds.length > 0) {
      const { data: products } = await serviceSupabase
        .from("products")
        .select("id, price, sale_price")
        .in("id", productIds);

      if (products) {
        for (const p of products) {
          if (p.id) {
            productPriceMap[p.id] = Number(p.sale_price ?? p.price);
          }
        }
      }
    }

    // ── Step 2: Recalculate subtotal from authoritative prices ─────────────────
    const verifiedItems = incomingItems.map((item) => {
      let price: number;
      if (item.product_id && productPriceMap[item.product_id] !== undefined) {
        // Real product: use DB price
        price = productPriceMap[item.product_id];
      } else {
        // Addon or non-DB item: trust client price but clamp to reasonable range
        price = Math.max(0, Math.min(Number(item.price ?? 0), 500));
      }
      return { ...item, price };
    });

    const subtotal = verifiedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ── Step 3: Recalculate packaging, bulk tier discount, and tax ────────────
    const kitItems = verifiedItems.filter(
      (i) => /kit/i.test(i.name) && !i.product_id?.startsWith("addon")
    );
    const kitQty = kitItems.reduce((s, i) => s + i.quantity, 0);

    const packagingCharge = verifiedItems.length > 0
      ? kitQty >= BULK_KIT_THRESHOLD
        ? BULK_PACKAGING_CHARGE
        : BASE_PACKAGING_CHARGE
      : 0;

    const shippingCharge = 0;

    // ── Step 4: Apply bulk tier discount (server-authoritative) ───────────────
    const bulkTier = getApplicableTier(kitQty);
    const kitSubtotal = kitItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const lowestKitPrice = kitItems.length
      ? Math.min(...kitItems.map((i) => i.price))
      : 0;
    const bulkDiscountAmount = bulkTier
      ? calcBulkDiscount(bulkTier, lowestKitPrice, kitSubtotal)
      : 0;

    // ── Step 5: Validate voucher server-side (if provided) ─────────────────────
    let voucherDiscountAmount = 0;
    let voucherId: string | null = null;
    let voucherCode: string | null = body.coupon_code ?? null;

    if (voucherCode) {
      const { data: profile } = await serviceSupabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userRole = profile?.role ?? "customer";
      const allProductIds = verifiedItems
        .map((i) => i.product_id)
        .filter((id): id is string => Boolean(id));

      const ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        undefined;

      const validation = await voucherService.validateVoucher({
        code: voucherCode,
        userId: user.id,
        userRole,
        subtotal,
        productIds: allProductIds,
        ipAddress,
      });

      if (!validation.valid) {
        return NextResponse.json(
          { error: `Voucher invalid: ${validation.message}` },
          { status: 422 }
        );
      }

      voucherDiscountAmount = validation.discount_amount ?? 0;
      voucherId = validation.voucher!.id;
      voucherCode = validation.voucher!.code;
    }

    // ── Step 6: Compute server-authoritative total (bulk + voucher stack) ──────
    const totalDiscount = bulkDiscountAmount + voucherDiscountAmount;
    const taxable = subtotal - totalDiscount + packagingCharge;
    const tax = Math.round(taxable * TAX_RATE);
    const total = Math.max(0, taxable + shippingCharge + tax);

    // ── Step 7: Create order ───────────────────────────────────────────────────
    const result = await orderService.createOrder({
      user_id: user.id,
      items: verifiedItems,
      shipping_address: body.shipping_address,
      subtotal,
      tax,
      shipping_charge: shippingCharge,
      packaging_charge: packagingCharge,
      discount: totalDiscount,
      total,
      delivery_notes: body.delivery_notes,
      coupon_code: voucherCode ?? undefined,
    });

    // ── Step 8: Reserve voucher redemption (pending until payment confirms) ────
    if (voucherId) {
      await voucherService.reserveVoucher({
        voucherId,
        userId: user.id,
        orderId: result.orderId,
        discountAmount: voucherDiscountAmount,
        ipAddress:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          undefined,
      });
    }

    return NextResponse.json({
      success: true,
      order_id: result.orderId,
      order_number: result.orderNumber,
      razorpay_order_id: result.razorpayOrderId,
      computed: {
        subtotal,
        packaging_charge: packagingCharge,
        shipping_charge: shippingCharge,
        tax,
        bulk_discount: bulkDiscountAmount,
        voucher_discount: voucherDiscountAmount,
        discount: totalDiscount,
        total,
        bulk_tier_label: bulkTier?.label ?? null,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
