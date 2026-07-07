"use client";

import { useState } from "react";
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

  const supabase = createClient();

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
      setTimeout(() => router.push("/account"), 2500);
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
          {done ? (
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-[#E7B52C] mx-auto mb-4" />
              <h2 className="text-xl font-black text-white mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Password updated!
              </h2>
              <p className="text-[#C7BFB3] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Redirecting to your account…
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black text-[#F8F5EE] mb-1" style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}>
                Set new password
              </h1>
              <p className="text-[#C7BFB3] text-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleReset} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-[#1B1B1B] border border-white/[0.08] rounded-xl pl-10 pr-11 py-3 text-[#F8F5EE] text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-[#1B1B1B] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-[#F8F5EE] text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-white text-xs bg-[#6E1D25] border border-[#6E1D25]/20 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#E7B52C] text-black font-bold text-sm py-3.5 rounded-[14px] hover:bg-[#F4C542] transition-colors disabled:opacity-60"
                  style={{ boxShadow: "0 8px 20px rgba(231,181,44,0.15)" }}
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
