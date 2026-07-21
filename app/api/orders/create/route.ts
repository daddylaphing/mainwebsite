import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { orderService } from "@/lib/services/orders/order-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    if (!body.shipping_address) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    // Create order
    const result = await orderService.createOrder({
      user_id: user.id,
      items: body.items,
      shipping_address: body.shipping_address,
      subtotal: body.subtotal,
      tax: body.tax || 0,
      shipping_charge: body.shipping_charge || 0,
      packaging_charge: body.packaging_charge || 0,
      discount: body.discount || 0,
      total: body.total,
      delivery_notes: body.delivery_notes,
      coupon_code: body.coupon_code,
    });

    return NextResponse.json({
      success: true,
      order_id: result.orderId,
      order_number: result.orderNumber,
      razorpay_order_id: result.razorpayOrderId,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
