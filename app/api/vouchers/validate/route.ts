/**
 * POST /api/vouchers/validate
 *
 * Validates a voucher code server-side against the authenticated user's cart.
 * Returns the discount amount if valid — the frontend NEVER calculates this.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { voucherService } from "@/lib/services/vouchers/voucher-service";
import { ValidateVoucherApiSchema } from "@/lib/services/vouchers/voucher-schemas";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse & validate body
    const rawBody = await request.json();
    const parseResult = ValidateVoucherApiSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { code, subtotal, product_ids, category_ids } = parseResult.data;

    // Get user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = profile?.role ?? "customer";

    // IP address (best effort)
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined;

    const result = await voucherService.validateVoucher({
      code,
      userId: user.id,
      userRole,
      subtotal,
      productIds: product_ids,
      categoryIds: category_ids,
      ipAddress,
    });

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          error: result.error,
          message: result.message,
        },
        { status: 422 }
      );
    }

    // Return only what the UI needs — never send full voucher config to client
    return NextResponse.json({
      valid: true,
      voucher_id: result.voucher!.id,
      code: result.voucher!.code,
      description: result.voucher!.description,
      discount_type: result.voucher!.discount_type,
      discount_amount: result.discount_amount,
      free_delivery: result.free_delivery,
      message: `Voucher applied! You save ₹${result.discount_amount}`,
    });
  } catch (err) {
    console.error("[vouchers/validate]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
