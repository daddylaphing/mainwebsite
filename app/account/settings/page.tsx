"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Settings, Package, LogOut, ChevronRight,
  Loader2, CheckCircle2, Eye, EyeOff, Lock, Mail, Shield, Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: User,     label: "Account Overview", href: "/account",          active: false },
  { icon: Settings, label: "Settings",          href: "/account/settings", active: true  },
  { icon: Package,  label: "My Orders",         href: "/account/orders",   active: false },
];

export default function AccountSettingsPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  // ── Profile state ──────────────────────────────────────────────────────────
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // ── Password state ─────────────────────────────────────────────────────────
  const [oldPassword,  setOldPassword]  = useState("");
  const [newPassword,  setNewPassword]  = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld,  setShowOld]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [sendingReset,   setSendingReset]   = useState(false);

  // ── Detect if user signed in via OAuth (no password to change) ─────────────
  const isOAuthUser = !!(user?.app_metadata?.provider && user.app_metadata.provider !== "email");

  // ── Populate form from profile ─────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    } else if (user) {
      setName(user.user_metadata?.full_name ?? "");
    }
  }, [profile, user]);

  // ── Save profile ───────────────────────────────────────────────────────────
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: name, phone, updated_at: new Date().toISOString() });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile saved.");
    }
    setSavingProfile(false);
  }

  // ── Change password via old password ──────────────────────────────────────
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    const supabase = createClient();

    // Re-authenticate with old password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: oldPassword,
    });

    if (signInError) {
      toast.error("Current password is incorrect.");
      setSavingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  }

  // ── Send password reset email ──────────────────────────────────────────────
  async function handleSendResetEmail() {
    if (!user?.email) return;
    setSendingReset(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Reset link sent to ${user.email}`);
    }
    setSendingReset(false);
  }

  // ── Sign out ───────────────────────────────────────────────────────────────
  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6E1D25] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || "User";
  const avatarUrl   = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-5 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-5 mb-10"
        >
          <div className="w-16 h-16 rounded-full bg-[#D4A843]/15 border border-[#D4A843]/30 flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#D4A843] font-black text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                {initials}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}>
              Account Settings
            </h1>
            <p className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{user.email}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  item.active
                    ? "bg-[#6E1D25]/10 border border-[#6E1D25]/20 text-[#6E1D25]"
                    : "bg-[#F7F3EC] border border-[#E6DFD5] text-[#4A4540] hover:text-[#1A1A1A] hover:bg-[#E6DFD5]/40"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-[#F7F3EC] border border-[#E6DFD5] text-[#7A7570] hover:text-[#6E1D25] hover:border-[#6E1D25]/30 hover:bg-[#6E1D25]/5 transition-colors mt-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </motion.div>

          {/* Main panels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2 flex flex-col gap-6"
          >

            {/* ── 1. Personal Information ───────────────────────────────── */}
            <section className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-4 w-4 text-[#D4A843]" />
                <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Personal Information
                </h2>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="s-name" className="text-xs font-bold text-[#7A7570] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Full Name
                    </label>
                    <input
                      id="s-name" type="text" value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="s-phone" className="text-xs font-bold text-[#7A7570] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Phone
                    </label>
                    <input
                      id="s-phone" type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Email — read-only */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Mail className="h-3 w-3" /> Email
                  </label>
                  <input
                    type="email" value={user.email ?? ""} readOnly
                    className="bg-[#FAFAF8] border border-[#E6DFD5]/70 rounded-xl px-4 py-3 text-[#7A7570]/50 text-sm cursor-not-allowed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <p className="text-[#7A7570]/60 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Email cannot be changed.</p>
                </div>

                <button
                  type="submit" disabled={savingProfile}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-[14px] hover:bg-[#6E1D25] transition-colors disabled:opacity-60"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4" /> Save Changes</>}
                </button>
              </form>
            </section>

            {/* ── 2. Password & Security ────────────────────────────────── */}
            <section className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-4 w-4 text-[#D4A843]" />
                <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Password &amp; Security
                </h2>
              </div>

              {isOAuthUser ? (
                <p className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  You signed in with Google. Password management is handled by your Google account.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Change via old password */}
                  <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                    <p className="text-xs text-[#7A7570] font-semibold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Change Password
                    </p>

                    {/* Current password */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="s-old-pw" className="text-xs font-bold text-[#7A7570] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                        <input
                          id="s-old-pw"
                          type={showOld ? "text" : "password"}
                          required value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Your current password"
                          className="w-full bg-white border border-[#E6DFD5] rounded-xl pl-10 pr-10 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25] transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                        <button type="button" onClick={() => setShowOld(v => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09890] hover:text-[#1A1A1A]"
                          aria-label="Toggle password visibility">
                          {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-new-pw" className="text-xs font-bold text-[#7A7570] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                          <input
                            id="s-new-pw"
                            type={showNew ? "text" : "password"}
                            required value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            className="w-full bg-white border border-[#E6DFD5] rounded-xl pl-10 pr-10 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25] transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                          <button type="button" onClick={() => setShowNew(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09890] hover:text-[#1A1A1A]"
                            aria-label="Toggle password visibility">
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="s-confirm-pw" className="text-xs font-bold text-[#7A7570] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
                          <input
                            id="s-confirm-pw"
                            type={showNew ? "text" : "password"}
                            required value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            className="w-full bg-white border border-[#E6DFD5] rounded-xl pl-10 pr-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25] transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit" disabled={savingPassword}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-[14px] hover:bg-[#6E1D25] transition-colors disabled:opacity-60"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="h-4 w-4" /> Update Password</>}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#E6DFD5]" />
                    <span className="text-[10px] text-[#A09890] uppercase tracking-widest font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>or</span>
                    <div className="flex-1 h-px bg-[#E6DFD5]" />
                  </div>

                  {/* Reset via email */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Forgot your current password? We&apos;ll email you a secure reset link.
                    </p>
                    <button
                      type="button" onClick={handleSendResetEmail} disabled={sendingReset}
                      className="flex items-center gap-2 w-full sm:w-auto sm:self-start border border-[#E6DFD5] bg-white text-[#1A1A1A] font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-[14px] hover:border-[#6E1D25]/40 hover:bg-[#6E1D25]/5 transition-colors disabled:opacity-60"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {sendingReset ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="h-4 w-4" /> Send Reset Link</>}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* ── 3. Danger Zone ───────────────────────────────────────── */}
            <section className="bg-white border border-red-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trash2 className="h-4 w-4 text-red-400" />
                <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Danger Zone
                </h2>
              </div>
              <p className="text-[#7A7570] text-sm mb-4 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Signing out will end your session on this device. To permanently delete your account and all associated data, please contact us at{" "}
                <a href="mailto:laphingdaddy@gmail.com" className="text-[#6E1D25] font-semibold hover:underline">
                  laphingdaddy@gmail.com
                </a>.
              </p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-[14px] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
