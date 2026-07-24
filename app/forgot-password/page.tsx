"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <Link href="/" className="block text-center mb-8">
          <span className="font-bold text-2xl text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Laphing <span className="text-[#D4A843] italic">Daddy</span>
          </span>
        </Link>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-10 shadow-[0_12px_40px_rgba(26,26,26,0.03)]">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#F7F3EC] flex items-center justify-center mx-auto mb-6 border border-[rgba(26,26,26,0.05)]">
                <Mail className="h-6 w-6 text-[#D4A843]" />
              </div>
              <h1 className="text-xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Check your email
              </h1>
              <p className="text-[#7A7570] text-xs leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                We&apos;ve sent a password reset link to <span className="text-[#1A1A1A] font-semibold">{email}</span>. The link expires in 1 hour.
              </p>
              <Link href="/login" className="text-[#D4A843] hover:text-[#6E1D25] text-xs font-bold uppercase tracking-wider">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Forgot password?
              </h1>
              <p className="text-[#7A7570] text-xs mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reset-email" className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none pl-10 pr-4 py-3.5 text-[#1A1A1A] text-sm placeholder-[#A09890]/50 focus:outline-none focus:border-[#D4A843] transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-white text-xs bg-[#6E1D25] border border-[#6E1D25]/10 rounded-none px-3 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ink w-full py-4 text-xs font-bold uppercase tracking-wider"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </button>
              </form>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 mt-6 text-[#A09890] hover:text-[#1A1A1A] text-xs font-semibold uppercase tracking-wider"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
