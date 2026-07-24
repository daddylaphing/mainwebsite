import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/emails";

/**
 * OAuth callback handler — Supabase exchanges the code for a session.
 * This route handles: Google OAuth, Magic Link, Email verification
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  const requestUrl = new URL(request.url);
  const currentOrigin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Only send welcome email for new OAuth signups, not password resets
      const isPasswordReset = next === "/auth/reset-password";
      if (!isPasswordReset) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && !user.user_metadata?.welcome_sent) {
          const email = user.email;
          const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";
          if (email) {
            try {
              await sendWelcomeEmail({ email, name });
              await supabase.auth.updateUser({
                data: { welcome_sent: true },
              });
            } catch (welcomeErr) {
              console.error("OAuth welcome email error:", welcomeErr);
            }
          }
        }
      }

      const redirectPath = next?.startsWith("/") ? next : `/${next}`;
      return NextResponse.redirect(`${currentOrigin}${redirectPath}`);
    }
  }

  return NextResponse.redirect(`${currentOrigin}/login?error=auth_callback_failed`);
}
