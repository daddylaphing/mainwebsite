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
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  preparing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  packed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  out_for_delivery: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
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
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E7B52C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
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
          {/* Avatar */}
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
              {displayName}
            </h1>
            <p className="text-white/40 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{user.email}</p>
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

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2 flex flex-col gap-6"
          >
            {/* Profile card */}
            <div className="bg-[#141414] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Profile
                </h2>
                <Link href="/account/settings" className="text-xs text-[#E7B52C] hover:underline font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Edit
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Name</p>
                  <p className="text-white font-medium">{displayName}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white font-medium truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-white font-medium">{profile?.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-white font-medium">
                    {new Date(user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            {/* Orders */}
            <div id="orders" className="bg-[#141414] border border-white/8 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Recent Orders
              </h2>

              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#E7B52C] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <ShoppingBag className="h-10 w-10 text-white/10" />
                  <p className="text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>No orders yet</p>
                  <Link href="/#products" className="text-[#E7B52C] text-sm font-semibold hover:underline">
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
                      <div style={{ fontFamily: "'Inter', sans-serif" }}>
                        <p className="text-white font-semibold text-sm">#{order.order_number}</p>
                        <p className="text-white/40 text-xs mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-IN")} · ₹{order.total}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? "bg-white/5 text-white/40 border-white/10"}`}>
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
