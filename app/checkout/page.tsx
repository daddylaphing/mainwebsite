"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, MapPin, CreditCard, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, packagingCharge, shippingCharge, tax, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UI Flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refundAccepted, setRefundAccepted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirectTo=/checkout");
    }
  }, [user, authLoading, router]);

  // Load profile default values
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.full_name) setName(data.full_name);
          if (data.phone) setPhone(data.phone);
        }
      });
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirecting...
  }

  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="h-16 w-16 text-[#7A7570]/30" />
        <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your Cart is Empty
        </h2>
        <p className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          You cannot checkout with an empty cart.
        </p>
        <Link
          href="/#products"
          className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-[#1A1A1A] hover:bg-[#6E1D25] text-white text-xs font-bold uppercase tracking-widest transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          View Collection
        </Link>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate Payment delay (simulate Razorpay transaction authorization)
    setTimeout(async () => {
      try {
        const supabase = createClient();

        // 1. Create Order
        const { data: orderData, error: orderErr } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            total,
            subtotal,
            shipping: shippingCharge,
            tax,
            packaging: packagingCharge,
            status: "pending",
            payment_method: paymentMethod,
            shipping_name: name,
            shipping_phone: phone,
            shipping_line1: line1,
            shipping_line2: line2 || null,
            shipping_city: city,
            shipping_state: state,
            shipping_pincode: pincode,
            notes: notes || null,
          })
          .select()
          .single();

        if (orderErr) throw new Error(orderErr.message);

        // 2. Insert Order Items
        const orderItemsPayload = items.map((item) => ({
          order_id: orderData.id,
          product_id: item.product.id.startsWith("addon") ? null : item.product.id,
          addon_id: item.product.id.startsWith("addon") ? item.product.id.replace("addon-", "") : null,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: itemsErr } = await supabase.from("order_items").insert(orderItemsPayload);
        if (itemsErr) throw new Error(itemsErr.message);

        // 3. Mark payment as completed and status as "confirmed"
        const txId = `pay_sim_${Math.random().toString(36).substring(2, 15)}`;
        const { error: updateErr } = await supabase
          .from("orders")
          .update({
            status: "confirmed",
            payment_id: txId,
          })
          .eq("id", orderData.id);

        if (updateErr) throw new Error(updateErr.message);

        // Success Flow
        setIsProcessing(false);
        setPaymentSuccess(true);
        clearCart();

        // Redirect to Account / Orders page
        setTimeout(() => {
          router.push("/account");
          router.refresh();
        }, 3000);
      } catch (error: any) {
        setIsProcessing(false);
        setErrorMessage(error.message || "An unexpected error occurred during authorization.");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          CHECKOUT
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Delivery Info Banner */}
              <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#D4A843]">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>Important Delivery & Booking Info</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="space-y-1.5">
                    <p className="text-[#4A4540]">
                      <span className="font-bold text-[#1A1A1A]">Delivery Areas:</span> Delhi, Noida, Gurugram, Ghaziabad only
                    </p>
                    <p className="text-[#4A4540]">
                      <span className="font-bold text-[#1A1A1A]">Booking Window:</span> Between 3 PM to 6 PM only
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[#4A4540]">
                      <span className="font-bold text-[#1A1A1A]">Delivery Method:</span> Arrange your own ride via <span className="text-[#1A1A1A] font-medium">Uber, Rapido, or Porter</span>.
                    </p>
                    <p className="text-[#4A4540]">
                      <span className="font-bold text-[#1A1A1A]">Preference:</span> Uncle Delivery is highly recommended
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E6DFD5] text-[11px] text-[#7A7570] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6E1D25]" />
                  <span>All orders are strictly <strong className="text-[#6E1D25]">Non-Refundable</strong>.</span>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6 space-y-4">
                <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <MapPin className="h-4 w-4 text-[#D4A843]" />
                  Shipping Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Contact Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="House / Flat / Area"
                    className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Landmark / Suite (Optional)</label>
                  <input
                    type="text"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Apartment, suite, unit etc."
                    className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6-digit ZIP"
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">Delivery Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instructions for the courier partner..."
                    className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843] resize-none"
                  />
                </div>
              </div>

              {/* Payment Gateway Card */}
              <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6 space-y-4">
                <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <CreditCard className="h-4 w-4 text-[#D4A843]" />
                  Simulated Razorpay Gateway
                </h2>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "upi", label: "UPI / QR" },
                      { id: "card", label: "Card Payment" },
                      { id: "netbanking", label: "NetBanking" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`py-3 rounded-xl border text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all ${
                        paymentMethod === m.id
                          ? "bg-[#D4A843]/10 border-[#D4A843]/50 text-[#D4A843]"
                          : "bg-white border-[#E6DFD5] text-[#7A7570] hover:text-[#1A1A1A]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Sub-Forms for Payment Methods */}
                <AnimatePresence mode="wait">
                  {paymentMethod === "upi" && (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3 pt-2"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider">UPI Address</label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okaxis"
                          className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                        />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3 pt-2"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider">Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          placeholder="4111 2222 3333 4444"
                          className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider">Expiry Date</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider">CVV</label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <motion.div
                      key="netbanking"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3 pt-2 text-xs text-[#7A7570]"
                    >
                      <p>You will be securely redirected to select and authenticate with your preferred banking institution.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Refund Policy Acceptance */}
              <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={refundAccepted}
                    onChange={(e) => setRefundAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#E6DFD5] bg-white accent-[#6E1D25] shrink-0 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm text-[#4A4540] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      I have read and agree to the{" "}
                      <a href="/refund" target="_blank" className="text-[#D4A843] hover:underline font-bold">
                        Refund Policy
                      </a>.
                      I understand that all orders are{" "}
                      <strong className="text-[#1A1A1A]">strictly non-refundable</strong>{" "}
                      once placed.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={isProcessing || !refundAccepted}
                className="w-full h-14 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest rounded-[14px] hover:bg-[#6E1D25] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    CONTACTING GATEWAY...
                  </>
                ) : (
                  `AUTHORIZE PAYMENT: ₹${total}`
                )}
              </button>

              {errorMessage && (
                <p className="text-center text-xs text-white bg-[#6E1D25] border border-[#6E1D25]/20 rounded-xl py-3 font-medium">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Order Details
            </h2>

            {/* List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="min-w-0 pr-4">
                    <p className="text-[#1A1A1A] font-bold truncate">{item.product.name}</p>
                    <p className="text-[#7A7570] text-xs mt-0.5">Qty: {item.quantity} · ₹{item.price}/ea</p>
                  </div>
                  <span className="text-[#1A1A1A] font-semibold font-mono">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <Separator className="bg-[#E6DFD5]" />

            {/* Price breakdown */}
            <div className="space-y-2 text-sm text-[#4A4540]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1A1A1A] font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging Charges</span>
                <span className="text-[#1A1A1A] font-semibold">₹{packagingCharge}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[#1A1A1A] font-semibold">
                  {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="text-[#1A1A1A] font-semibold">₹{tax}</span>
              </div>
              <Separator className="bg-[#E6DFD5]" />
              <div className="flex justify-between text-[#1A1A1A] font-bold text-base">
                <span>Total Amount</span>
                <span className="text-[#6E1D25] font-bold">₹{total}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[#7A7570]/50 text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Razorpay Secured 256-Bit SSL Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Processing Modal */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#FAFAF8]/95 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-4"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#E6DFD5] rounded-full" />
                <div className="absolute inset-0 border-4 border-t-[#6E1D25] rounded-full animate-spin" />
              </div>
              <h2 className="text-lg font-bold text-[#1A1A1A] tracking-wider uppercase font-mono">Simulating Razorpay Overlay</h2>
              <p className="text-[#7A7570] text-xs max-w-xs leading-relaxed">
                Communicating with gateway... verifying credentials, authorization token and bank response code.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {paymentSuccess && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#FAFAF8]/95 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Payment Authorized Successfully</h2>
              <p className="text-[#7A7570] text-sm max-w-xs leading-relaxed mx-auto">
                Your order is confirmed! Redirecting you to your account orders history...
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
