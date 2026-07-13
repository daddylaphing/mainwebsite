import { sendOrderConfirmationEmail } from "@/lib/emails";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, orderNumber, items, subtotal, packaging, shipping, tax, total, shippingAddress, deliveryNotes } = body;

    if (!email || !name || !orderNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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