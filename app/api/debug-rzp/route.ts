import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();

  const razorpayOrderId = String(body.razorpay_order_id || "").trim();
  const razorpayPaymentId = String(body.razorpay_payment_id || "").trim();
  const razorpaySignature = String(body.razorpay_signature || "").trim();
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const generated = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const generatedBuffer = Buffer.from(generated, "utf8");
  const receivedBuffer = Buffer.from(razorpaySignature, "utf8");
  const match =
    generatedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(generatedBuffer, receivedBuffer);

  return NextResponse.json({
    key_id: keyId,
    secret_length: secret.length,
    payload,
    generated_signature: generated,
    received_signature: razorpaySignature,
    match,
    received_length: receivedBuffer.length,
    generated_length: generatedBuffer.length,
  });
}
