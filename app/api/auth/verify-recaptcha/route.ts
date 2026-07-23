import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per IP per 10 minutes
  const ip = getClientIp(request);
  const limit = checkRateLimit({
    id: "recaptcha",
    identifier: ip,
    limit: 5,
    windowSeconds: 10 * 60,
  });

  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: "Too many attempts" }, { status: 429 });
  }

  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, error: "No token" }, { status: 400 });
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ success: false, error: "reCAPTCHA not configured" }, { status: 500 });
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();

  if (!data.success) {
    return NextResponse.json({ success: false, error: "reCAPTCHA verification failed" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
