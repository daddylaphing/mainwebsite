"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Settings, Package, LogOut, ChevronRight, ShoppingBag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import type { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-800 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-800 border-blue-500/20",
  preparing: "bg-orange-500/10 text-orange-800 border-orange-500/20",
  packed: "bg-purple-500/10 text-purple-800 border-purple-500/20",
  out_for_delivery: "bg-cyan-500/10 text-cyan-800 border-cyan-500/20",
  delivered: "bg-green-500/10 text-green-800 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-800 border-red-500/20",
};

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setOrdersLoading(false);
      });
  }, [user]);

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

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
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
          {/* Avatar */}
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
              {displayName}
            </h1>
            <p className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{user.email}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar quick links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            {[
              { icon: User, label: "Account Overview", href: "/account", active: true },
              { icon: Settings, label: "Settings", href: "/account/settings", active: false },
              { icon: Package, label: "My Orders", href: "#orders", active: false },
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

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2 flex flex-col gap-6"
          >
            {/* Profile card */}
            <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Profile Information
                </h2>
                <Link href="/account/settings" className="text-xs text-[#D4A843] hover:underline font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Edit Settings
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div>
                  <p className="text-[#7A7570] text-xs uppercase tracking-wider mb-1">Name</p>
                  <p className="text-[#1A1A1A] font-semibold">{displayName}</p>
                </div>
                <div>
                  <p className="text-[#7A7570] text-xs uppercase tracking-wider mb-1">Email</p>
                  <p className="text-[#1A1A1A] font-semibold truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-[#7A7570] text-xs uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-[#1A1A1A] font-semibold">{profile?.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[#7A7570] text-xs uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-[#1A1A1A] font-semibold">
                    {new Date(user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders */}
            <div id="orders" className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6">
              <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Recent Orders
              </h2>

              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#6E1D25] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <ShoppingBag className="h-10 w-10 text-[#7A7570]/30" />
                  <p className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>No orders yet</p>
                  <Link href="/#products" className="text-[#D4A843] text-sm font-semibold hover:underline">
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E6DFD5]">
                      <div style={{ fontFamily: "'Inter', sans-serif" }}>
                        <p className="text-[#1A1A1A] font-bold text-sm">#{order.order_number}</p>
                        <p className="text-[#7A7570] text-xs mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN")} · ₹{order.total}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? "bg-[#1A1A1A]/5 text-[#1A1A1A]/40 border-[#1A1A1A]/10"}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
