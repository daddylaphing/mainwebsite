"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Settings, Package, LogOut, ChevronRight,
  ShoppingBag, ArrowLeft, Clock, Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import type { Order } from "@/types";

// ── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  pending:          "bg-yellow-50 text-yellow-800 border-yellow-200",
  confirmed:        "bg-blue-50 text-blue-800 border-blue-200",
  preparing:        "bg-orange-50 text-orange-800 border-orange-200",
  packed:           "bg-purple-50 text-purple-800 border-purple-200",
  out_for_delivery: "bg-cyan-50 text-cyan-800 border-cyan-200",
  delivered:        "bg-green-50 text-green-800 border-green-200",
  cancelled:        "bg-red-50 text-red-800 border-red-200",
};

const STATUS_DOT: Record<string, string> = {
  pending:          "bg-yellow-400",
  confirmed:        "bg-blue-400",
  preparing:        "bg-orange-400",
  packed:           "bg-purple-400",
  out_for_delivery: "bg-cyan-400",
  delivered:        "bg-green-400",
  cancelled:        "bg-red-400",
};

const STATUS_LABELS = [
  "all", "pending", "confirmed", "preparing",
  "packed", "out_for_delivery", "delivered", "cancelled",
];

function formatStatus(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Sidebar nav ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: User,     label: "Account Overview", href: "/account",          active: false },
  { icon: Settings, label: "Settings",          href: "/account/settings", active: false },
  { icon: Package,  label: "My Orders",         href: "/account/orders",   active: true  },
];

export default function OrdersPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders]           = useState<Order[]>([]);
  const [ordersLoading, setLoading2]  = useState(true);
  const [filter, setFilter]           = useState("all");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setLoading2(false);
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
  const avatarUrl   = profile?.avatar_url || user.user_metadata?.avatar_url;
  const initials    = displayName.slice(0, 2).toUpperCase();

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Count per status for filter badges
  const counts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

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
              My Orders
            </h1>
            <p className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
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

          {/* Orders list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2 flex flex-col gap-4"
          >
            {/* Filter bar */}
            {orders.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-3.5 w-3.5 text-[#A09890] shrink-0" />
                {STATUS_LABELS.filter((s) => s === "all" || counts[s]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      filter === s
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-white text-[#7A7570] border-[#E6DFD5] hover:border-[#1A1A1A]/30"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {s === "all" ? `All (${orders.length})` : `${formatStatus(s)} (${counts[s] ?? 0})`}
                  </button>
                ))}
              </div>
            )}

            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-[#6E1D25] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl flex flex-col items-center py-16 gap-4">
                <ShoppingBag className="h-12 w-12 text-[#7A7570]/25" />
                <p className="text-[#7A7570] font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>No orders yet</p>
                <Link
                  href="/#products"
                  className="bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Start Shopping
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl flex flex-col items-center py-12 gap-3">
                <p className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  No {formatStatus(filter)} orders
                </p>
                <button
                  onClick={() => setFilter("all")}
                  className="text-[#D4A843] text-xs font-bold hover:underline"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Show all orders
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((order, i) => {
                  const items = order.order_items ?? [];
                  const itemNames = items.map((it) => it.name).join(", ");
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                    >
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="block bg-white border border-[#E6DFD5] rounded-2xl p-5 hover:border-[#D4A843]/50 hover:shadow-[0_4px_16px_rgba(26,26,26,0.06)] transition-all group"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-[#1A1A1A] font-bold text-sm group-hover:text-[#6E1D25] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                              #{order.order_number}
                            </p>
                            <p className="text-[#7A7570] text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                              {" · "}
                              {new Date(order.created_at).toLocaleTimeString("en-IN", {
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[order.status] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.status] ?? "bg-slate-400"}`} />
                            {formatStatus(order.status)}
                          </span>
                        </div>

                        {/* Items preview */}
                        {itemNames && (
                          <p className="text-xs text-[#7A7570] mb-3 line-clamp-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {itemNames}
                          </p>
                        )}

                        {/* Bottom row */}
                        <div className="flex items-center justify-between border-t border-[#F0EBE0] pt-3 mt-1">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-[10px] text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Items</p>
                              <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {items.reduce((s, it) => s + it.quantity, 0) || "—"}
                              </p>
                            </div>
                            <div className="w-px h-6 bg-[#E6DFD5]" />
                            <div className="text-center">
                              <p className="text-[10px] text-[#A09890] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Total</p>
                              <p className="text-sm font-bold text-[#6E1D25]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                ₹{order.total}
                              </p>
                            </div>
                            {order.status === "delivering" || order.status === "out_for_delivery" ? (
                              <>
                                <div className="w-px h-6 bg-[#E6DFD5]" />
                                <div className="flex items-center gap-1 text-cyan-700">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    On the way
                                  </span>
                                </div>
                              </>
                            ) : null}
                          </div>
                          <span className="text-[#A09890] text-xs font-semibold group-hover:text-[#6E1D25] transition-colors flex items-center gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            View details <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
