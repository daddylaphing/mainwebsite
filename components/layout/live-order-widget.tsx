"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";

interface LiveOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
}

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "packed", "out_for_delivery"];

const STATUS_CONFIG: Record<string, { label: string; dot: string; bar: string }> = {
  pending:          { label: "Pending",          dot: "bg-yellow-400",  bar: "bg-yellow-400" },
  confirmed:        { label: "Confirmed",         dot: "bg-blue-400",    bar: "bg-blue-400"   },
  preparing:        { label: "Preparing",         dot: "bg-orange-400",  bar: "bg-orange-400" },
  packed:           { label: "Packed & Ready",    dot: "bg-purple-400",  bar: "bg-purple-400" },
  out_for_delivery: { label: "Out for Delivery",  dot: "bg-[#D4A843]",   bar: "bg-[#D4A843]"  },
};

// Progress step 0–4 for the status bar
const STATUS_STEP: Record<string, number> = {
  pending: 0, confirmed: 1, preparing: 2, packed: 3, out_for_delivery: 4,
};
const STEPS = ["Placed", "Confirmed", "Preparing", "Packed", "On the way"];

export function LiveOrderWidget() {
  const { user } = useAuth();
  const [order, setOrder]       = useState<LiveOrder | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, status, total")
        .eq("user_id", user.id)
        .in("status", ACTIVE_STATUSES)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setOrder(data as LiveOrder);
        setDismissed(false);
      } else {
        setOrder(null);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const cfg  = order ? (STATUS_CONFIG[order.status] ?? STATUS_CONFIG.confirmed) : null;
  const step = order ? (STATUS_STEP[order.status] ?? 0) : 0;

  return (
    <AnimatePresence>
      {order && !dismissed && (
        <motion.div
          key="widget"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1     }}
          exit={{    opacity: 0, y: 16, scale: 0.95  }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-4 z-50 w-[280px]"
        >
          <div
            className="relative rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
            style={{ background: "linear-gradient(145deg, #1E1E1E 0%, #141414 100%)" }}
          >
            {/* Top accent bar — status colour */}
            <div className={`h-[3px] w-full ${cfg?.bar}`} />

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-all"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>

            <Link
              href={`/account/orders/${order.id}`}
              className="block px-4 pt-3.5 pb-4 group"
            >
              {/* Label */}
              <p
                className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30 mb-2.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Active Order
              </p>

              {/* Main row */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#6E1D25]/70 flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[15px] font-bold text-white leading-tight tracking-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    #{order.order_number}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dot} animate-pulse`} />
                    <span
                      className="text-[11px] text-white/55 font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {cfg?.label}
                    </span>
                    <span className="text-white/20 text-[11px]">·</span>
                    <span
                      className="text-[11px] text-[#D4A843] font-bold"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      ₹{order.total}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-0.5">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`h-[3px] w-full rounded-full transition-all duration-500 ${
                        i <= step ? cfg?.bar : "bg-white/10"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span
                  className="text-[9px] text-white/30 font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {STEPS[step]}
                </span>
                <span
                  className="text-[9px] text-white/30 font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {STEPS[STEPS.length - 1]}
                </span>
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
