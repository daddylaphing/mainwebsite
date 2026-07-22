"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";

interface LiveOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
}

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "packed", "out_for_delivery"];

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  packed: "Packed",
  out_for_delivery: "Out for Delivery",
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-yellow-400",
  confirmed: "bg-blue-400",
  preparing: "bg-orange-400",
  packed: "bg-purple-400",
  out_for_delivery: "bg-cyan-400",
};

export function LiveOrderWidget() {
  const { user } = useAuth();
  const [order, setOrder] = useState<LiveOrder | null>(null);
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

    // Poll every 30 seconds for status updates
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (!order || dismissed) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1A1A1A] text-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden max-w-[260px]">
        <Link href={`/account/orders/${order.id}`} className="block p-4 hover:bg-[#2A2A2A] transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#6E1D25]/80 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A7570] mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Active Order
              </p>
              <p className="text-sm font-bold text-white truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                #{order.order_number}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${STATUS_DOT[order.status] ?? "bg-green-400"}`} />
                <span className="text-[11px] text-[#A0A0A0] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {STATUS_LABEL[order.status] ?? order.status} · Rs.{order.total}
                </span>
              </div>
            </div>
          </div>
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-[#7A7570] hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
