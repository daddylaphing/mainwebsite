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
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#6E1D25] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || "User";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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

          {/* Settings form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2"
          >
            <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6">
              <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Personal Information
              </h2>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-name" className="text-xs font-bold text-[#7A7570] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Full Name
                    </label>
                    <input
                      id="settings-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="settings-phone" className="text-xs font-bold text-[#7A7570] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Phone
                    </label>
                    <input
                      id="settings-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#6E1D25] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    className="bg-[#FAFAF8] border border-[#E6DFD5]/70 rounded-xl px-4 py-3 text-[#7A7570]/50 text-sm cursor-not-allowed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <p className="text-[#7A7570]/60 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
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
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-[14px] hover:bg-[#6E1D25] transition-colors disabled:opacity-60"
                  style={{ fontFamily: "'Inter', sans-serif" }}
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
