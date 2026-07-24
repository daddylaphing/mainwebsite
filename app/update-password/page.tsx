"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  // Verify there's an active recovery session
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/forgot-password?error=session_expired");
      } else {
        setSessionReady(true);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.replace("/login"), 2500);
    }
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
          <span
            className="font-bold text-2xl text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Laphing <span className="text-[#D4A843] italic">Daddy</span>
          </span>
        </Link>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-10 shadow-[0_12px_40px_rgba(26,26,26,0.03)]">
          {done ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#F7F3EC] flex items-center justify-center mx-auto mb-6 border border-[rgba(26,26,26,0.05)]">
                <CheckCircle2 className="h-6 w-6 text-[#D4A843]" />
              </div>
              <h1
                className="text-xl font-bold text-[#1A1A1A] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Password updated
              </h1>
              <p
                className="text-[#7A7570] text-xs leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Your password has been changed. Redirecting you to login...
              </p>
            </div>
          ) : (
            <>
              <h1
                className="text-2xl font-bold text-[#1A1A1A] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Set new password
              </h1>
              <p
                className="text-[#7A7570] text-xs mb-8"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* New password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="new-password"
                    className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none pl-10 pr-10 py-3.5 text-[#1A1A1A] text-sm placeholder-[#A09890]/50 focus:outline-none focus:border-[#D4A843] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09890] hover:text-[#1A1A1A]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="confirm-password"
                    className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none pl-10 pr-10 py-3.5 text-[#1A1A1A] text-sm placeholder-[#A09890]/50 focus:outline-none focus:border-[#D4A843] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09890] hover:text-[#1A1A1A]"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    className="text-white text-xs bg-[#6E1D25] border border-[#6E1D25]/10 rounded-none px-3 py-2.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ink w-full py-4 text-xs font-bold uppercase tracking-wider mt-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
