"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      render: (el: HTMLElement, opts: Record<string, unknown>) => number;
      getResponse: (id?: number) => string;
      reset: (id?: number) => void;
    };
  }
}

type Step = "form" | "otp";

export default function SignupPage() {
  const router = useRouter();
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaWidgetId = useRef<number | null>(null);

  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const supabase = createClient();

  // Render reCAPTCHA widget after script loads
  function renderRecaptcha() {
    if (recaptchaRef.current && recaptchaWidgetId.current === null && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        if (recaptchaRef.current && recaptchaWidgetId.current === null) {
          recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            theme: "light",
            size: "normal",
          });
        }
      });
    }
  }

  // Also try on mount in case script already loaded (cached)
  useEffect(() => {
    if (step !== "form") return;
    if (window.grecaptcha) renderRecaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Verify reCAPTCHA
    const captchaToken = window.grecaptcha?.getResponse(recaptchaWidgetId.current ?? undefined);
    if (!captchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      setLoading(false);
      return;
    }

    const captchaRes = await fetch("/api/auth/verify-recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });
    if (!captchaRes.ok) {
      setError("reCAPTCHA verification failed. Please try again.");
      window.grecaptcha?.reset(recaptchaWidgetId.current ?? undefined);
      setLoading(false);
      return;
    }

    // 2. Sign up with Supabase — this creates the user and sends OTP
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // Don't use emailRedirectTo — we want OTP, not magic link
      },
    });

    if (signupError) {
      setError(signupError.message);
      window.grecaptcha?.reset(recaptchaWidgetId.current ?? undefined);
      setLoading(false);
      return;
    }

    // 3. Supabase sends a 6-digit OTP to the email — move to OTP step
    setStep("otp");
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: "signup",
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Send welcome email
      try {
        await fetch("/api/auth/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });
      } catch {
        // Non-blocking
      }
    }

    router.push("/account");
    router.refresh();
  }

  async function handleResendOtp() {
    setResending(true);
    setError(null);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) setError(error.message);
    setResending(false);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  const GoogleIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => renderRecaptcha()}
      />

      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-5 py-24 md:py-32">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md z-10"
        >
          <Link href="/" className="block text-center mb-8">
            <span className="font-bold text-2xl text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Laphing <span className="text-[#D4A843] italic">Daddy</span>
            </span>
          </Link>

          <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-10 shadow-[0_12px_40px_rgba(26,26,26,0.03)]">

            {step === "form" ? (
              <>
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Create account
                </h1>
                <p className="text-[#7A7570] text-xs mb-7" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Join Laphing Daddy and start ordering
                </p>

                {/* Google OAuth */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 bg-[#FAFAF8] border border-[rgba(26,26,26,0.15)] text-[#1A1A1A] font-semibold text-xs py-3.5 hover:bg-[#F7F3EC] transition-colors mb-6 disabled:opacity-60 uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-[1px] bg-[rgba(26,26,26,0.08)]" />
                  <span className="text-[#A09890] text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>or</span>
                  <div className="flex-1 h-[1px] bg-[rgba(26,26,26,0.08)]" />
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none pl-10 pr-4 py-3.5 text-[#1A1A1A] text-sm placeholder-[#A09890]/50 focus:outline-none focus:border-[#D4A843] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none pl-10 pr-4 py-3.5 text-[#1A1A1A] text-sm placeholder-[#A09890]/50 focus:outline-none focus:border-[#D4A843] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                      <input
                        type={showPw ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none pl-10 pr-11 py-3.5 text-[#1A1A1A] text-sm placeholder-[#A09890]/50 focus:outline-none focus:border-[#D4A843] transition-colors"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09890] hover:text-[#1A1A1A]">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="flex justify-center pt-1">
                    <div ref={recaptchaRef} />
                  </div>

                  {error && (
                    <p className="text-white text-xs text-center bg-[#6E1D25] px-3 py-2.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-ink w-full py-4 text-xs font-bold uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                  </button>
                </form>

                <p className="text-center text-[#7A7570] text-xs mt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#D4A843] hover:text-[#6E1D25] font-bold">Sign in</Link>
                </p>
              </>
            ) : (
              <>
                {/* OTP Step */}
                <div className="flex items-center justify-center mb-5">
                  <div className="w-14 h-14 rounded-full bg-[#F7F3EC] border border-[rgba(26,26,26,0.06)] flex items-center justify-center">
                    <Shield className="h-6 w-6 text-[#D4A843]" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Verify your email
                </h1>
                <p className="text-[#7A7570] text-xs mb-7 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  We sent a 6-digit code to <span className="text-[#1A1A1A] font-semibold">{email}</span>
                </p>

                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Verification Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none px-4 py-4 text-[#1A1A1A] text-2xl font-bold text-center tracking-[0.5em] placeholder-[#A09890]/30 focus:outline-none focus:border-[#D4A843] transition-colors"
                    />
                  </div>

                  {error && (
                    <p className="text-white text-xs text-center bg-[#6E1D25] px-3 py-2.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="btn-ink w-full py-4 text-xs font-bold uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Create Account"}
                  </button>
                </form>

                <div className="flex items-center justify-between mt-5 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <button
                    onClick={() => { setStep("form"); setOtp(""); setError(null); }}
                    className="text-[#7A7570] hover:text-[#1A1A1A] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-[#D4A843] hover:text-[#6E1D25] font-semibold transition-colors disabled:opacity-60"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
