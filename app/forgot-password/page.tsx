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
      redirectTo: `${window.location.origin}/auth/reset-password`,
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
    <div className="min-h-screen bg-[#090909] flex items-center justify-center px-4 py-20">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#E7B52C]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <Link href="/" className="block text-center mb-8">
          <span className="font-black text-3xl text-white tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Laphing <span className="text-[#E7B52C]">Daddy</span>
          </span>
        </Link>

        <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#E7B52C]/10 flex items-center justify-center mx-auto mb-5">
                <Mail className="h-7 w-7 text-[#E7B52C]" />
              </div>
              <h1 className="text-xl font-black text-white mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Check your email
              </h1>
              <p className="text-[#C7BFB3] text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                We&apos;ve sent a password reset link to <span className="text-white">{email}</span>. The link expires in 1 hour.
              </p>
              <Link href="/login" className="text-[#E7B52C] text-sm font-semibold hover:underline">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-[#F8F5EE] mb-1" style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}>
                Forgot password?
              </h1>
              <p className="text-[#C7BFB3] text-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reset-email" className="text-xs font-semibold text-white/40 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#1B1B1B] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-[#F8F5EE] text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-white text-xs bg-[#6E1D25] border border-[#6E1D25]/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#E7B52C] text-black font-bold text-sm py-3.5 rounded-[14px] hover:bg-[#F4C542] transition-colors disabled:opacity-60 hover:shadow-[0_8px_20px_rgba(231,181,44,0.25)]"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </button>
              </form>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 mt-6 text-white/30 hover:text-white text-sm transition-colors"
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
