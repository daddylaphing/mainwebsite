import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the password reset link clicked from email.
 * Supabase sends: /auth/reset-password?code=xxx
 * We exchange the code for a session, then redirect to the update-password page.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the page where the user sets their new password
      return NextResponse.redirect(`${origin}/update-password`);
    }
  }

  // If no code or exchange failed, send back to forgot-password with error
  return NextResponse.redirect(`${origin}/forgot-password?error=invalid_reset_link`);
}
