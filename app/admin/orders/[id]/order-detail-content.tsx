"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Send,
  AlertTriangle
} from "lucide-react";

import type { Order, OrderItem } from "@/types";

interface OrderDetailContentProps {
  order: Order & {
    order_items?: OrderItem[];
    payment_method?: string;
    notes?: string;
  };
}

const STATUS_STEPS = [
  { value: "pending", label: "Pending", description: "Customer placed order" },
  { value: "confirmed", label: "Confirmed", description: "Order confirmed by staff" },
  { value: "preparing", label: "Preparing", description: "Preparing fresh laphing sheets" },
  { value: "packed", label: "Packed", description: "Packed & ready for dispatch" },
  { value: "out_for_delivery", label: "Out for Delivery", description: "Out with delivery agent" },
  { value: "delivered", label: "Delivered", description: "Successfully delivered" },
];

export function OrderDetailContent({ order: initialOrder }: OrderDetailContentProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const response = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          status,
          note: note || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setOrder({ ...order, status });
        setNote("");
        alert("Order status updated successfully!");
        router.refresh();
      } else {
        alert(data.error || "Failed to update order status");
      }
    } catch {
      alert("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };


  const toggleItemCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getStatusStepIndex = (currentStatus: string) => {
    return STATUS_STEPS.findIndex(step => step.value === currentStatus);
  };

  const currentStepIndex = getStatusStepIndex(order.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Order details & items */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header Summary */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E1D25] bg-[#6E1D25]/10 px-2.5 py-1 rounded-full">
              Order Details
            </span>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Order #{order.order_number}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A7570] font-medium mt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(order.created_at).toLocaleString("en-IN")}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 capitalize">
                <CreditCard className="h-3.5 w-3.5" />
                {order.payment_method} ({order.payment_status})
              </span>
            </div>
          </div>
          <div className="text-right md:self-end">
            <span className="text-xs text-[#7A7570] font-bold block mb-0.5">TOTAL VALUE</span>
            <span className="text-2xl font-black text-[#6E1D25]" style={{ fontFamily: "'Playfair Display', serif" }}>
              ₹{order.total}
            </span>
          </div>
        </div>

        {/* Visual Timeline (Progress Bar) */}
        {order.status !== "cancelled" && (
          <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Fulfillment Timeline
            </h3>
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;

                return (
                  <div key={step.value} className="flex md:flex-col items-center md:text-center flex-1 gap-3 relative z-10 w-full">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted 
                        ? "bg-[#6E1D25] border-[#6E1D25] text-white shadow-sm"
                        : "bg-white border-[#E6DFD5] text-[#7A7570]"
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? "text-[#6E1D25]" : "text-[#7A7570]"}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-[#7A7570] mt-0.5 max-w-[120px] md:mx-auto">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              {/* Connector line for desktop */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#E6DFD5] hidden md:block -z-10" />
              <div 
                className="absolute top-4 left-4 h-0.5 bg-[#6E1D25] hidden md:block -z-10 transition-all duration-500" 
                style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 96}%` }}
              />
            </div>
          </div>
        )}

        {/* Packing Checklist & Items */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#E6DFD5]/40 pb-3">
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
              Order Items & Checklist
            </h3>
            <span className="text-[10px] text-[#7A7570] font-bold uppercase tracking-wider">
              {Object.values(checkedItems).filter(Boolean).length} of {order.order_items?.length || 0} Packaged
            </span>
          </div>

          <div className="divide-y divide-[#E6DFD5]/40">
            {order.order_items && order.order_items.map((item: OrderItem) => (
              <div 
                key={item.id} 
                className={`py-4 flex items-center justify-between gap-4 transition-colors ${
                  checkedItems[item.id] ? "bg-[#F7F3EC]/20 opacity-70" : ""
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={!!checkedItems[item.id]}
                    onChange={() => toggleItemCheck(item.id)}
                    className="rounded border-[#E6DFD5] text-[#6E1D25] focus:ring-[#6E1D25] h-4 w-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-sm text-[#1A1A1A] block">
                      {item.name}
                    </span>
                    <span className="text-xs text-[#7A7570] font-medium block">
                      Qty: {item.quantity} · Price: ₹{item.price} each
                    </span>
                  </div>
                </div>
                <div className="font-bold text-sm text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="mt-6 pt-6 border-t border-[#E6DFD5] space-y-2 text-xs font-medium text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#1A1A1A]">₹{order.subtotal}</span>
            </div>
            {order.packaging_charge > 0 && (
              <div className="flex justify-between">
                <span>Packaging Fee</span>
                <span className="text-[#1A1A1A]">₹{order.packaging_charge}</span>
              </div>
            )}
            {order.shipping_charge > 0 && (
              <div className="flex justify-between">
                <span>Delivery / Shipping Fee</span>
                <span className="text-[#1A1A1A]">₹{order.shipping_charge}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax (GST)</span>
                <span className="text-[#1A1A1A]">₹{order.tax}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-[#E6DFD5]/40 text-sm font-bold text-[#1A1A1A]">
              <span>Grand Total</span>
              <span className="text-[#6E1D25] font-black" style={{ fontFamily: "'Playfair Display', serif" }}>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Customer Info & Status Controls */}
      <div className="space-y-6">
        {/* Status manager form */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest border-b border-[#E6DFD5]/40 pb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Order Management Action
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider">
              Transition Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "pending" | "confirmed" | "preparing" | "packed" | "out_for_delivery" | "delivered" | "cancelled")}
              className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-3 py-2.5 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] font-semibold"
            >
              <option value="pending">Pending Review</option>
              <option value="confirmed">Confirm Order</option>
              <option value="preparing">Start Preparing</option>
              <option value="packed">Packed</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Complete & Deliver</option>
              <option value="cancelled">Cancel Order</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider">
              Fulfillment Message Note (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for cancellation or delivery note to customer..."
              className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-3 py-2 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#6E1D25] resize-none"
            />
          </div>

          <button
            onClick={handleUpdateStatus}
            disabled={updating}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all disabled:opacity-60 shadow-sm"
          >
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Update Status
              </>
            )}
          </button>
        </div>

        {/* Customer Address Details Card */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest border-b border-[#E6DFD5]/40 pb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Customer Information
          </h3>

          <div className="space-y-4 text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Name */}
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-[#7A7570] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-[#7A7570] uppercase tracking-wider font-bold">NAME</p>
                <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">
                  {order.shipping_address?.full_name || "Guest User"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-[#7A7570] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-[#7A7570] uppercase tracking-wider font-bold">PHONE</p>
                <a href={`tel:${order.shipping_address?.phone}`} className="text-sm font-semibold text-[#6E1D25] hover:underline mt-0.5 block">
                  {order.shipping_address?.phone || "—"}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-[#7A7570] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-[#7A7570] uppercase tracking-wider font-bold">DELIVERY ADDRESS</p>
                <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5 leading-relaxed">
                  {order.shipping_address?.line1}
                  {order.shipping_address?.line2 && <span className="block">{order.shipping_address.line2}</span>}
                  <span className="block">{order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}</span>
                </p>
              </div>
            </div>

            {/* Notes */}
            {(order.delivery_notes || order.notes) && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-bold text-[10px] uppercase tracking-wider">Customer Delivery Notes</span>
                </div>
                <p className="text-xs font-semibold leading-relaxed">
                  &ldquo;{order.delivery_notes || order.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
