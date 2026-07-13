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

  // Always use production domain for redirects (handles custom domain properly)
  const productionDomain = "https://laphingdaddy.com";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Trigger welcome email for new Google / OAuth signups
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !user.user_metadata?.welcome_sent) {
        const email = user.email;
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";
        if (email) {
          try {
            await sendWelcomeEmail({ email, name });
            await supabase.auth.updateUser({
              data: { welcome_sent: true }
            });
          } catch (welcomeErr) {
            console.error("OAuth welcome email error:", welcomeErr);
          }
        }
      }

      // Redirect to intended destination on custom domain
      return NextResponse.redirect(`${productionDomain}${next}`);
    }
  }

  // Auth error — redirect to error page on custom domain
  return NextResponse.redirect(`${productionDomain}/login?error=auth_callback_failed`);
}
