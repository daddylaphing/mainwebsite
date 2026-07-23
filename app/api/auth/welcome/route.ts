import { sendWelcomeEmail } from "@/lib/emails";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 2 welcome emails per IP per day
    const ip = getClientIp(request);
    const limit = checkRateLimit({
      id: "welcome",
      identifier: ip,
      limit: 2,
      windowSeconds: 24 * 60 * 60,
    });

    if (!limit.allowed) {
      // Silently ignore — don't leak rate limit info on auth endpoints
      return NextResponse.json({ success: true });
    }

    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Prevent duplicate welcome emails
    if (user && user.user_metadata?.welcome_sent === true) {
      return NextResponse.json({ success: true, message: "Welcome email already sent" });
    }

    await sendWelcomeEmail({ email, name });

    if (user) {
      await supabase.auth.updateUser({
        data: { welcome_sent: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}