"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      try {
        await fetch("/api/auth/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });
      } catch (err) {
        console.error("Failed to send welcome email:", err);
      }
      
      setSuccess(true);
      setLoading(false);
    }
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

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-5 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border border-[rgba(26,26,26,0.08)] p-10 text-center shadow-[0_12px_40px_rgba(26,26,26,0.03)] z-10"
        >
          <div className="w-16 h-16 rounded-full bg-[#F7F3EC] flex items-center justify-center mx-auto mb-6 border border-[rgba(26,26,26,0.05)]">
            <Mail className="h-6 w-6 text-[#D4A843]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Check your email
          </h2>
          <p className="text-[#7A7570] text-xs mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            We&apos;ve sent a verification link to <span className="text-[#1A1A1A] font-semibold">{email}</span>. Click the link to activate your account.
          </p>
          <Link href="/login" className="text-[#D4A843] hover:text-[#6E1D25] text-xs font-bold uppercase tracking-wider">
            Back to Login
          </Link>
        </motion.div>
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
          <span className="font-bold text-2xl text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Laphing <span className="text-[#D4A843] italic">Daddy</span>
          </span>
        </Link>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-10 shadow-[0_12px_40px_rgba(26,26,26,0.03)]">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Create account
          </h1>
          <p className="text-[#7A7570] text-xs mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            Join Laphing Daddy and start ordering
          </p>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#FAFAF8] border border-[rgba(26,26,26,0.15)] text-[#1A1A1A] font-semibold text-xs py-3.5 hover:bg-[#F7F3EC] transition-colors mb-6 disabled:opacity-60 uppercase tracking-wider"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-[1px] bg-[rgba(26,26,26,0.08)]" />
            <span className="text-[#A09890] text-[10px] font-bold uppercase tracking-wider">or</span>
            <div className="flex-1 h-[1px] bg-[rgba(26,26,26,0.08)]" />
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                <input
                  id="signup-name"
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
              <label htmlFor="signup-email" className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                <input
                  id="signup-password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-white border border-[rgba(26,26,26,0.08)] rounded-none pl-10 pr-11 py-3.5 text-[#1A1A1A] text-sm placeholder-[#A09890]/50 focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09890] hover:text-[#1A1A1A] transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-xs text-center bg-[#6E1D25] border border-[#6E1D25]/10 rounded-none px-3 py-2.5"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-ink w-full py-4 text-xs font-bold uppercase tracking-wider"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-[#7A7570] text-xs mt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-[#D4A843] hover:text-[#6E1D25] font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
