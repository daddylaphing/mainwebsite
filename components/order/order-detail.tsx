"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, CreditCard, MapPin, Package, Truck } from "lucide-react";
import type { Order, OrderItem } from "@/types";
import { WhatsAppContact } from "@/components/order/whatsapp-contact";

interface OrderDetailProps {
  order: Order & { order_items?: OrderItem[] };
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toUpperCase();
}

function statusColor(status: string) {
  switch (status) {
    case "pending":      return "bg-yellow-100 text-yellow-800";
    case "confirmed":    return "bg-blue-100 text-blue-800";
    case "preparing":    return "bg-orange-100 text-orange-800";
    case "packed":       return "bg-purple-100 text-purple-800";
    case "out_for_delivery": return "bg-cyan-100 text-cyan-800";
    case "delivered":    return "bg-green-100 text-green-800";
    case "cancelled":    return "bg-red-100 text-red-800";
    default:             return "bg-slate-100 text-slate-800";
  }
}

const RESTAURANT = {
  name: "Laphing Daddy Kitchen",
  line1: "Shop 12, Food Lane, Tibetan Street",
  line2: "Sector 18, Noida, Uttar Pradesh 201301",
  phone: "9354775439",
};

export function OrderDetail({ order }: OrderDetailProps) {
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const items = order.order_items ?? order.items ?? [];

  useEffect(() => {
    if (order.status === "confirmed" || order.status === "pending") {
      setShowDeliveryPopup(true);
    }
  }, [order.status]);

  return (
    <>
      {/* ── Delivery Booking Popup ── */}
      <Dialog open={showDeliveryPopup} onOpenChange={setShowDeliveryPopup}>
        <DialogContent className="bg-[#FAFAF8] border border-[#E6DFD5] max-w-lg rounded-3xl shadow-[0_24px_50px_rgba(26,26,26,0.15)] p-8">
          <DialogHeader>
            <DialogTitle
              className="text-2xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              🎉 Order Placed! Book Your Delivery
            </DialogTitle>
            <DialogDescription
              className="text-sm text-[#4A4540] mt-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Your order is confirmed. You need to arrange pickup delivery yourself.
              We recommend <strong className="text-[#1A1A1A]">Uncle Delivery</strong> — but you can
              use Rapido, Porter, or any preferred service.
            </DialogDescription>
          </DialogHeader>

          <div
            className="mt-5 rounded-2xl bg-white border border-[#E6DFD5] p-5 text-sm text-[#4A4540] space-y-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <p className="font-bold text-[#1A1A1A] mb-2">📍 Pickup From</p>
            <p className="font-semibold text-[#1A1A1A]">{RESTAURANT.name}</p>
            <p>{RESTAURANT.line1}</p>
            <p>{RESTAURANT.line2}</p>
            <p className="mt-2">
              <span className="text-[#7A7570]">Phone: </span>
              <a href={`tel:${RESTAURANT.phone}`} className="text-[#6E1D25] font-semibold hover:underline">
                {RESTAURANT.phone}
              </a>
            </p>
          </div>

          <div className="mt-4 rounded-2xl bg-[#FFF9E6] border border-[#D4A843]/30 p-4 text-xs text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="font-bold text-[#D4A843]">Tip:</span> Book your delivery rider to pick up
            from the address above and deliver to your address. Uncle Delivery is highly recommended.
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <WhatsAppContact
              orderNumber={order.order_number}
              total={order.total}
              items={items.map((i) => ({ name: i.name, quantity: i.quantity }))}
            />
            <DialogClose>
              <button
                className="rounded-full border border-[#E6DFD5] bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.32em] text-[#1A1A1A] hover:bg-[#F7F3EC] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Got it
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Order Page ── */}
      <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">

          {/* Header */}
          <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[#6E1D25] font-bold mb-3">
                  Order Confirmed
                </p>
                <h1
                  className="text-4xl font-black text-[#1A1A1A]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Thank you for your order!
                </h1>
                <p className="mt-3 text-sm text-[#7A7570] max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Payment successful. Your laphing kit is being freshly prepared.
                  Please arrange delivery pickup from the restaurant address below.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#6E1D25] transition-colors"
                >
                  Continue Shopping
                </Link>
                <WhatsAppContact
                  orderNumber={order.order_number}
                  total={order.total}
                  items={items.map((i) => ({ name: i.name, quantity: i.quantity }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-6">

              {/* Order meta */}
              <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#7A7570] font-semibold">
                      Order #{order.order_number}
                    </p>
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mt-1">₹{order.total}</h2>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold ${statusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
                <Separator className="my-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#7A7570] font-semibold mb-2">Placed</p>
                    <p>{new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#7A7570] font-semibold mb-2">Payment</p>
                    <p>{order.payment_method?.toUpperCase() ?? "RAZORPAY"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#7A7570] font-semibold mb-2">Items</p>
                    <p>{items.length} product{items.length === 1 ? "" : "s"}</p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer delivery address */}
                <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4 text-[#1A1A1A] font-bold text-sm">
                    <MapPin className="h-4 w-4 text-[#D4A843]" />
                    Your Delivery Address
                  </div>
                  <div className="text-sm text-[#4A4540] space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <p className="font-semibold text-[#1A1A1A]">{order.shipping_address.full_name}</p>
                    <p>{order.shipping_address.line1}</p>
                    {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                    <p className="mt-2">Phone: {order.shipping_address.phone}</p>
                  </div>
                </div>

                {/* Restaurant pickup address */}
                <div className="bg-[#FFF9E6] border border-[#D4A843]/30 rounded-3xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4 text-[#1A1A1A] font-bold text-sm">
                    <MapPin className="h-4 w-4 text-[#D4A843]" />
                    Pickup From (Restaurant)
                  </div>
                  <div className="text-sm text-[#4A4540] space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <p className="font-semibold text-[#1A1A1A]">{RESTAURANT.name}</p>
                    <p>{RESTAURANT.line1}</p>
                    <p>{RESTAURANT.line2}</p>
                    <p className="mt-2">
                      Phone:{" "}
                      <a href={`tel:${RESTAURANT.phone}`} className="text-[#6E1D25] font-semibold hover:underline">
                        {RESTAURANT.phone}
                      </a>
                    </p>
                    <p className="mt-3 text-xs text-[#7A7570] leading-relaxed">
                      Book a delivery rider (Uncle Delivery, Rapido, Porter etc.) to pick up from here and deliver to your address above.
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-[#1A1A1A] font-bold text-sm">
                  <Truck className="h-4 w-4 text-[#D4A843]" />
                  Delivery Instructions
                </div>
                <div className="text-sm text-[#4A4540] space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <p>Delivery is arranged by you. Use any preferred delivery service — <strong className="text-[#1A1A1A]">Uncle Delivery</strong> is our top recommendation.</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[#4A4540]">
                    <li>Wait for order confirmation (usually within 15–20 mins)</li>
                    <li>Open Uncle Delivery / Rapido / Porter app</li>
                    <li>Set pickup: <strong className="text-[#1A1A1A]">{RESTAURANT.line1}, {RESTAURANT.line2}</strong></li>
                    <li>Set drop: your delivery address</li>
                    <li>Book the ride and share ETA with us on WhatsApp</li>
                  </ol>
                  <div className="pt-2">
                    <WhatsAppContact
                      orderNumber={order.order_number}
                      total={order.total}
                      items={items.map((i) => ({ name: i.name, quantity: i.quantity }))}
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
                <div className="flex items-center gap-2 mb-4 text-[#1A1A1A] font-bold text-sm">
                  <Package className="h-4 w-4 text-[#D4A843]" />
                  Order Items
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 items-center border-t border-[#E6DFD5]/70 pt-4 first:border-t-0 first:pt-0">
                      <div>
                        <p className="font-semibold text-[#1A1A1A] text-sm">{item.name}</p>
                        <p className="text-xs text-[#7A7570] mt-0.5">Qty: {item.quantity} · ₹{item.price} each</p>
                      </div>
                      <div className="text-sm font-semibold text-[#1A1A1A]">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-[#1A1A1A] font-bold text-sm">
                  <CreditCard className="h-4 w-4 text-[#D4A843]" />
                  Payment Summary
                </div>
                <div className="space-y-2.5 text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging</span>
                    <span>₹{order.packaging_charge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{order.tax}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-[#1A1A1A] font-bold text-base">
                    <span>Total Paid</span>
                    <span className="text-[#6E1D25]">₹{order.total}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3 text-[#1A1A1A] font-bold text-sm">
                  <Clock className="h-4 w-4 text-[#D4A843]" />
                  Estimated Time
                </div>
                <p className="text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Fresh kits are prepared within <strong className="text-[#1A1A1A]">30–45 minutes</strong> of confirmation. Orders are available for pickup between <strong className="text-[#1A1A1A]">3 PM – 6 PM</strong>.
                </p>
              </div>

              <div className="bg-[#FFF9E6] border border-[#D4A843]/30 rounded-3xl p-6">
                <p className="text-xs font-bold text-[#D4A843] uppercase tracking-wider mb-2">Need Help?</p>
                <p className="text-sm text-[#4A4540] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Message us on WhatsApp with your order number for any queries.
                </p>
                <WhatsAppContact
                  orderNumber={order.order_number}
                  total={order.total}
                  items={items.map((i) => ({ name: i.name, quantity: i.quantity }))}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
