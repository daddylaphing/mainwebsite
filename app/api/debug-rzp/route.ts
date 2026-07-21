import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();

  const payload = `${body.razorpay_order_id}|${body.razorpay_payment_id}`;
  const generated = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  return NextResponse.json({
    key_id: keyId,
    secret_length: secret.length,
    secret_first4: secret.substring(0, 4),
    secret_last4: secret.substring(secret.length - 4),
    payload,
    generated_signature: generated,
    received_signature: body.razorpay_signature,
    match: generated === body.razorpay_signature,
  });
}
