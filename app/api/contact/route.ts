import { NextResponse } from "next/server";
import { sendContactFormEmail, sendContactAcknowledgementEmail } from "@/lib/emails";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limit: 3 contact form submissions per IP per hour
    const ip = getClientIp(request);
    const limit = checkRateLimit({
      id: "contact",
      identifier: ip,
      limit: 3,
      windowSeconds: 60 * 60, // 1 hour
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${limit.resetIn} seconds.` },
        { status: 429 }
      );
    }

    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    await Promise.all([
      sendContactFormEmail({ name, email, subject, message }),
      sendContactAcknowledgementEmail({ name, email, subject }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
