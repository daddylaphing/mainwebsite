import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/emails";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

    const supabase = await createClient();
    let serviceSupabase;
    try {
      serviceSupabase = createServiceClient();
    } catch (err) {
      console.error("[verify-payment] createServiceClient failed:", err);
      return NextResponse.json({ error: "Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is not set" }, { status: 500 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.order_id || !body.razorpay_payment_id || !body.razorpay_signature || !body.razorpay_order_id) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // Read secret fresh every request
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!keySecret) {
      console.error("[verify-payment] RAZORPAY_KEY_SECRET is not set");
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const razorpayOrderId = String(body.razorpay_order_id).trim();
    const razorpayPaymentId = String(body.razorpay_payment_id).trim();
    const razorpaySignature = String(body.razorpay_signature).trim();

    // Compute expected signature
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    const isValid =
      generatedSignature.length === razorpaySignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature, "utf8"),
        Buffer.from(razorpaySignature, "utf8")
      );

    console.log("[verify-payment]", {
      isValid,
      secretLength: keySecret.length,
      payload,
      generated: generatedSignature,
      received: body.razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed — signature mismatch" },
        { status: 400 }
      );
    }

    // Verify order belongs to user
    const { data: order } = await supabase
      .from("orders")
      .select("user_id, payment_status")
      .eq("id", body.order_id)
      .single();

    if (!order || order.user_id !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Already verified — idempotent
    if (order.payment_status === "paid") {
      return NextResponse.json({ success: true, message: "Already verified" });
    }

    // Mark as paid using the service role client so RLS policies do not block trusted server-side updates.
    const { error: updateError } = await serviceSupabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_id: body.razorpay_payment_id,
        status: "confirmed",
      })
      .eq("id", body.order_id);

    if (updateError) {
      console.error("[verify-payment] DB update failed:", updateError);
      return NextResponse.json({ error: "Failed to update order: " + (updateError.message || JSON.stringify(updateError)) }, { status: 500 });
    }

    const { data: fullOrder, error: orderDetailsError } = await serviceSupabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", body.order_id)
      .single();

    if (orderDetailsError) {
      console.error("[verify-payment] order fetch failed:", orderDetailsError);
    } else if (fullOrder) {
      try {
        await sendOrderConfirmationEmail({
          email: user.email ?? "",
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer",
          orderNumber: fullOrder.order_number,
          items: (fullOrder.order_items ?? []).map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: fullOrder.subtotal,
          packaging: fullOrder.packaging_charge,
          shipping: fullOrder.shipping_charge,
          tax: fullOrder.tax,
          total: fullOrder.total,
          shippingAddress: fullOrder.shipping_address,
          deliveryNotes: fullOrder.delivery_notes,
          orderLink: `${siteUrl}/account/orders/${fullOrder.id}`,
          pickupAddress: process.env.NEXT_PUBLIC_RESTAURANT_PICKUP_ADDRESS || "Shop 12, Food Lane, Tibetan Street, Sector 18, Noida, Uttar Pradesh 201301",
        });
      } catch (emailError) {
        console.error("[verify-payment] order confirmation email failed:", emailError);
      }
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully" });

  } catch (error) {
    console.error("[verify-payment] Unexpected error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
