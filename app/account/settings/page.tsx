"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Settings, Package, LogOut, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";

export default function AccountSettingsPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: name, phone, updated_at: new Date().toISOString() });

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E7B52C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || "User";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#090909] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-5 mb-10"
        >
          <div className="w-16 h-16 rounded-full bg-[#E7B52C]/20 border border-[#E7B52C]/30 flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#E7B52C] font-black text-xl" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {initials}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}>
              Account Settings
            </h1>
            <p className="text-white/40 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{user.email}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            {[
              { icon: User, label: "Account Overview", href: "/account", active: false },
              { icon: Settings, label: "Settings", href: "/account/settings", active: true },
              { icon: Package, label: "My Orders", href: "/account#orders", active: false },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-[#E7B52C]/10 border border-[#E7B52C]/20 text-[#E7B52C]"
                    : "bg-[#141414] border border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <ChevronRight className="h-4 w-4 ml-auto opacity-40" />
              </Link>
            ))}

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-[#141414] border border-white/5 text-white/40 hover:text-[#6E1D25] hover:border-[#6E1D25]/20 transition-colors mt-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </motion.div>

          {/* Settings form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2"
          >
            <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Personal Information
              </h2>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-name" className="text-xs font-semibold text-white/40 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Full Name
                    </label>
                    <input
                      id="settings-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-phone" className="text-xs font-semibold text-white/40 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Phone
                    </label>
                    <input
                      id="settings-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    className="bg-[#111] border border-white/5 rounded-xl px-4 py-3 text-white/30 text-sm cursor-not-allowed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <p className="text-white/20 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Email cannot be changed
                  </p>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white text-xs bg-[#6E1D25] border border-[#6E1D25]/20 rounded-lg px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start bg-[#E7B52C] text-black font-bold text-sm px-8 py-3 rounded-[14px] hover:bg-[#F4C542] transition-colors disabled:opacity-60"
                  style={{ fontFamily: "'Inter', sans-serif", boxShadow: "0 8px 20px rgba(231,181,44,0.15)" }}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
