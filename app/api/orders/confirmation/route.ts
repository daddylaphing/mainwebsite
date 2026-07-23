import { sendOrderConfirmationEmail } from "@/lib/emails";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Must be authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, orderNumber, items, subtotal, packaging, shipping, tax, total, shippingAddress, deliveryNotes, pickupAddress } = body;

    if (!email || !name || !orderNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Only allow sending to the authenticated user's own email
    if (email !== user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await sendOrderConfirmationEmail({
      email,
      name,
      orderNumber,
      items,
      subtotal,
      packaging,
      shipping,
      tax,
      total,
      shippingAddress,
      deliveryNotes,
      pickupAddress,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order confirmation email error:", error);
    return NextResponse.json(
      { error: "Failed to send order confirmation email" },
      { status: 500 }
    );
  }
}
