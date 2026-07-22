"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, CreditCard, MapPin, Package, MessageCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import type { Order, OrderItem } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface RestaurantInfo {
  name: string;
  line1: string;
  line2: string;
  phone: string;
  whatsapp: string;
}

interface OrderDetailProps {
  order: Order & { order_items?: OrderItem[] };
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(status: string) {
  switch (status) {
    case "pending":          return "bg-yellow-50 text-yellow-800 border border-yellow-200";
    case "confirmed":        return "bg-blue-50 text-blue-800 border border-blue-200";
    case "preparing":        return "bg-orange-50 text-orange-800 border border-orange-200";
    case "packed":           return "bg-purple-50 text-purple-800 border border-purple-200";
    case "out_for_delivery": return "bg-cyan-50 text-cyan-800 border border-cyan-200";
    case "delivered":        return "bg-green-50 text-green-800 border border-green-200";
    case "cancelled":        return "bg-red-50 text-red-800 border border-red-200";
    default:                 return "bg-slate-50 text-slate-700 border border-slate-200";
  }
}

const DEFAULT_RESTAURANT: RestaurantInfo = {
  name: "Laphing Daddy Kitchen",
  line1: "Address not configured",
  line2: "Update in admin settings",
  phone: "9667414181",
  whatsapp: "919667414181",
};

export function OrderDetail({ order }: OrderDetailProps) {
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [restaurant, setRestaurant] = useState<RestaurantInfo>(DEFAULT_RESTAURANT);
  const items = order.order_items ?? order.items ?? [];

  // Load restaurant info from DB
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "restaurant_info")
      .single()
      .then(({ data }) => {
        if (data?.value) setRestaurant(data.value as RestaurantInfo);
      });
  }, []);

  // Show popup on confirmed/pending
  useEffect(() => {
    if (order.status === "confirmed" || order.status === "pending") {
      const timer = setTimeout(() => setShowDeliveryPopup(true), 500);
      return () => clearTimeout(timer);
    }
  }, [order.status]);

  const whatsappMsg = encodeURIComponent(
    `Hi! I have a query about my order.\n\nOrder: #${order.order_number}\nAmount: Rs.${order.total}\nItems: ${items.map((i) => `${i.name} x${i.quantity}`).join(", ")}\n\nCould you please update me on the status?`
  );
  const whatsappUrl = `https://wa.me/${restaurant.whatsapp}?text=${whatsappMsg}`;

  return (
    <>
      {/* ── Delivery Booking Popup ── */}
      <Dialog open={showDeliveryPopup} onOpenChange={setShowDeliveryPopup}>
        <DialogContent className="bg-[#FAFAF8] border border-[#E6DFD5] max-w-md rounded-2xl shadow-xl p-7">
          <DialogHeader className="mb-4">
            <DialogTitle
              className="text-xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Order Placed — Book Your Delivery
            </DialogTitle>
            <DialogDescription
              className="text-sm text-[#4A4540] mt-1.5 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Your order is confirmed. Arrange a delivery rider to pick up from our kitchen.
              <br />
              <span className="font-semibold text-[#1A1A1A]">Uncle Delivery is recommended</span> — Rapido, Porter or any service works too.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-white border border-[#E6DFD5] p-4 text-sm text-[#4A4540] space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p className="font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider text-[#7A7570] mb-2">Pickup Location</p>
            <p className="font-semibold text-[#1A1A1A]">{restaurant.name}</p>
            <p>{restaurant.line1}</p>
            <p>{restaurant.line2}</p>
            <p className="pt-1">
              <a href={`tel:${restaurant.phone}`} className="text-[#6E1D25] font-semibold hover:underline">
                {restaurant.phone}
              </a>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Contact on WhatsApp
            </a>
            <DialogClose>
              <button
                className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#7A7570] hover:text-[#1A1A1A] border border-[#E6DFD5] rounded-xl hover:bg-[#F7F3EC] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Got it
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Main Order Page ── */}
      <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6">

          {/* Back + Header */}
          <div className="flex items-center gap-4">
            <Link href="/account" className="flex items-center gap-1.5 text-xs font-semibold text-[#7A7570] hover:text-[#1A1A1A] transition-colors uppercase tracking-wider">
              <ArrowLeft className="h-3.5 w-3.5" />
              My Orders
            </Link>
          </div>

          <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#7A7570] font-semibold mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Order #{order.order_number}
                </p>
                <h1 className="text-3xl font-black text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Thank you!
                </h1>
                <p className="text-sm text-[#7A7570] mt-2 max-w-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Payment successful. Please book a delivery rider to pick up your order from our kitchen.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor(order.status)}`}>
                  {formatStatus(order.status)}
                </span>
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Shop More
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#E6DFD5] hover:border-[#1A1A1A] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-xl transition-colors bg-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
            <div className="space-y-6">

              {/* Addresses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <MapPin className="h-3.5 w-3.5" />
                    Your Delivery Address
                  </div>
                  <div className="text-sm text-[#4A4540] space-y-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <p className="font-semibold text-[#1A1A1A]">{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.line1}</p>
                    {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                    <p className="pt-1 text-[#6E1D25] font-semibold">{order.shipping_address.phone}</p>
                  </div>
                </div>

                <div className="bg-[#F7F3EC] border border-[#D4A843]/30 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[#D4A843]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <MapPin className="h-3.5 w-3.5" />
                    Pickup From (Kitchen)
                  </div>
                  <div className="text-sm text-[#4A4540] space-y-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <p className="font-semibold text-[#1A1A1A]">{restaurant.name}</p>
                    <p>{restaurant.line1}</p>
                    <p>{restaurant.line2}</p>
                    <p className="pt-1">
                      <a href={`tel:${restaurant.phone}`} className="text-[#6E1D25] font-semibold hover:underline">
                        {restaurant.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery note */}
              <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5 text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A7570] mb-3">Delivery Instructions</p>
                <ol className="list-decimal list-inside space-y-1.5 text-[#4A4540]">
                  <li>Wait for order status to update to <strong className="text-[#1A1A1A]">Preparing</strong></li>
                  <li>Open Uncle Delivery, Rapido, or Porter app</li>
                  <li>Set pickup to the kitchen address above</li>
                  <li>Set drop to your delivery address</li>
                  <li>Book the rider and share ETA with us on WhatsApp</li>
                </ol>
              </div>

              {/* Items */}
              <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Package className="h-3.5 w-3.5" />
                  Order Items
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-t border-[#E6DFD5]/60 pt-3 first:border-t-0 first:pt-0">
                      <div>
                        <p className="font-semibold text-sm text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>{item.name}</p>
                        <p className="text-xs text-[#7A7570] mt-0.5">Qty {item.quantity} · Rs.{item.price} each</p>
                      </div>
                      <span className="text-sm font-bold text-[#1A1A1A]">Rs.{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <CreditCard className="h-3.5 w-3.5" />
                  Payment
                </div>
                <div className="space-y-2 text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="flex justify-between"><span>Subtotal</span><span>Rs.{order.subtotal}</span></div>
                  <div className="flex justify-between"><span>Packaging</span><span>Rs.{order.packaging_charge}</span></div>
                  <div className="flex justify-between"><span>GST (5%)</span><span>Rs.{order.tax}</span></div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-[#1A1A1A] font-bold text-base">
                    <span>Total Paid</span>
                    <span className="text-[#6E1D25]">Rs.{order.total}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E6DFD5] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Clock className="h-3.5 w-3.5" />
                  Estimated Time
                </div>
                <p className="text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Kits are prepared within <strong className="text-[#1A1A1A]">30–45 min</strong> of confirmation.
                  Available for pickup <strong className="text-[#1A1A1A]">3 PM – 6 PM</strong>.
                </p>
              </div>

              <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7A7570] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Need Help?</p>
                <p className="text-sm text-[#4A4540] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Message us with your order number for any queries.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp Us
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
