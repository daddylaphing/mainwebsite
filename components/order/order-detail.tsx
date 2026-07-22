import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, CreditCard, MapPin, Package, Truck } from "lucide-react";
import type { Order, OrderItem } from "@/types";
import { DeliveryBookingCard } from "@/components/order/order-delivery-card";

interface OrderDetailProps {
  order: Order & { order_items?: OrderItem[] };
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ").toUpperCase();
}

function statusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "packed":
      return "bg-purple-100 text-purple-800";
    case "out_for_delivery":
      return "bg-cyan-100 text-cyan-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export function OrderDetail({ order }: OrderDetailProps) {
  const items = order.order_items ?? order.items ?? [];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
        <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#6E1D25] font-bold mb-3">Order confirmed</p>
              <h1 className="text-4xl font-black text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Thank you for your order
              </h1>
              <p className="mt-3 text-sm text-[#7A7570] max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
                Your payment is successful and your laphing kit is now being prepared fresh. You can track the order details below, print the invoice, or continue shopping.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#6E1D25] transition-colors"
              >
                Continue shopping
              </Link>
              <a
                href={`/account/orders/${order.id}`}
                className="inline-flex items-center justify-center rounded-full border border-[#E6DFD5] bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#F7F3EC] transition-colors"
              >
                Refresh order status
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-[#7A7570] font-semibold">Order #{order.order_number}</p>
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mt-2">₹{order.total}</h2>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-4 text-[#1A1A1A] font-bold">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </div>
                <div className="text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <p className="font-semibold text-[#1A1A1A]">{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.line1}</p>
                  {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                  <p className="mt-3">Phone: {order.shipping_address.phone}</p>
                </div>
              </div>

              <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-4 text-[#1A1A1A] font-bold">
                  <Truck className="h-4 w-4" />
                  Delivery & Tracking
                </div>
                <div className="text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <p className="font-semibold text-[#1A1A1A]">Borzo delivery integration ready</p>
                  <p className="mt-2">Your order will be dispatched from the restaurant and handed over to our delivery partner once the pickup is confirmed.</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.32em] text-[#7A7570]">What happens next</p>
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    <li>Kitchen receives the order and begins preparation.</li>
                    <li>Once packed, the order is booked with Borzo.</li>
                    <li>You can track delivery status in real time.</li>
                  </ul>
                  <DeliveryBookingCard
                    orderId={order.id}
                    orderNumber={order.order_number}
                    shippingAddress={order.shipping_address}
                    total={order.total}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4 text-[#1A1A1A] font-bold">
                <Package className="h-4 w-4" />
                Order Items
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 items-center border-t border-[#E6DFD5]/70 pt-4">
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
                      <p className="text-xs text-[#7A7570] mt-1">Qty: {item.quantity} · ₹{item.price} each</p>
                    </div>
                    <div className="text-right text-sm font-semibold text-[#1A1A1A]">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4 text-[#1A1A1A] font-bold">
                <CreditCard className="h-4 w-4" />
                Payment Summary
              </div>
              <div className="space-y-3 text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging</span>
                  <span>₹{order.packaging_charge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹{order.shipping_charge}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{order.tax}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-[#1A1A1A] font-bold">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E6DFD5] rounded-3xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4 text-[#1A1A1A] font-bold">
                <Clock className="h-4 w-4" />
                Estimated delivery
              </div>
              <p className="text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Fresh kits usually ship within 30–45 minutes after confirmation. Tracking details will appear here once Borzo booking is complete.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
