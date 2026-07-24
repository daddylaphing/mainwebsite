"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EyeOff, Lock, Loader2, CheckCircle2, Eye as EyeIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null); // null = checking
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const supabase = createClient();

  // Verify there's a valid session (password reset token exchanges to session)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      if (!data.session) {
        // No valid reset session — redirect to forgot-password
        router.replace("/forgot-password?error=invalid_reset_link");
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    };
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      redirectTimer.current = setTimeout(() => router.push("/account"), 2500);
    }
  }

  // Show loading while checking session
  if (hasSession === null) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasSession) return null; // Redirecting

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
          {done ? (
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-[#D4A843] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Password updated!
              </h2>
              <p className="text-[#7A7570] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                Redirecting to your account…
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Set new password
              </h1>
              <p className="text-[#7A7570] text-xs mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleReset} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider">New Password</label>
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
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09890]">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none pl-10 pr-4 py-3.5 text-[#1A1A1A] text-sm placeholder-[#A09890]/50 focus:outline-none focus:border-[#D4A843] transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-white text-xs bg-[#6E1D25] border border-[#6E1D25]/10 rounded-none px-3 py-2.5">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ink w-full py-4 text-xs font-bold uppercase tracking-wider"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
