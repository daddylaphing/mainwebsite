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
    if (!body.order_id || !body.razorpay_payment_id || !body.razorpay_signature || !body.razorpay_order_id) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // Verify order belongs to user
    const { data: order } = await supabase
      .from("orders")
      .select("user_id")
      .eq("id", body.order_id)
      .single();

    if (!order || order.user_id !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update payment status
    const success = await orderService.updatePaymentStatus(
      body.order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
      body.razorpay_order_id
    );

    if (!success) {
      console.error("Signature verification failed for order:", body.order_id, {
        razorpay_order_id: body.razorpay_order_id,
        razorpay_payment_id: body.razorpay_payment_id,
        key_configured: !!process.env.RAZORPAY_KEY_SECRET,
      });
      return NextResponse.json(
        { error: "Payment verification failed — signature mismatch" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
