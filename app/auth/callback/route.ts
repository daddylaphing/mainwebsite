import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler — Supabase exchanges the code for a session.
 * This route handles: Google OAuth, Magic Link, Email verification
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to intended destination or home
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to error page
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
