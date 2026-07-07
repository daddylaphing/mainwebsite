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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E7B52C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="h-16 w-16 text-white/10" />
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>Your cart is empty</h1>
        <p className="text-white/40 text-sm">Add some Laphing kits to checkout!</p>
        <Link href="/#products" className="bg-[#E7B52C] text-black font-bold text-sm px-6 py-3 rounded-[14px] hover:bg-[#F4C542] transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate Payment Processing (Razorpay flow simulation)
    setTimeout(async () => {
      try {
        const supabase = createClient();
        
        // 1. Generate order number
        const orderNumber = "LD-" + Math.floor(100000 + Math.random() * 900000);
        
        // 2. Shipping Address structure
        const shippingAddress = {
          name,
          phone,
          line1,
          line2,
          city,
          state,
          pincode,
        };

        // 3. Insert order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            user_id: user.id,
            subtotal,
            tax,
            shipping_charge: shippingCharge,
            packaging_charge: packagingCharge,
            total,
            payment_status: "paid",
            payment_method: paymentMethod,
            payment_id: "pay_" + Math.random().toString(36).substring(2, 11),
            shipping_address: shippingAddress,
            delivery_notes: notes,
            status: "confirmed",
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 4. Insert order items
        const orderItemsToInsert = items.map((item) => ({
          order_id: order.id,
          product_id: item.product.id.startsWith("addon") ? null : item.product.id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.product.images?.[0] || null,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItemsToInsert);

        if (itemsError) throw itemsError;

        // 5. Insert initial status history
        await supabase
          .from("order_status_history")
          .insert({
            order_id: order.id,
            status: "confirmed",
            note: "Order placed successfully via simulated gateway",
          });

        // Success
        setPaymentSuccess(true);
        setIsProcessing(false);
        clearCart();
        
        setTimeout(() => {
          router.push(`/account`);
        }, 2000);

      } catch (err) {
        const error = err as Error;
        setErrorMessage(error.message || "Failed to process transaction. Please try again.");
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#090909] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-8" style={{ fontFamily: "'Manrope', sans-serif" }}>
          CHECKOUT
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Delivery Info Banner */}
              <div className="bg-[#141414] border border-white/8 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#E7B52C]">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Manrope', sans-serif" }}>Important Delivery & Booking Info</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="space-y-1.5">
                    <p className="text-white/70">
                      <span className="font-semibold text-white">Delivery Areas:</span> Delhi, Noida, Gurugram, Ghaziabad only
                    </p>
                    <p className="text-white/70">
                      <span className="font-semibold text-white">Booking Window:</span> Between 3 PM to 6 PM only
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-white/70">
                      <span className="font-semibold text-white">Delivery Method:</span> Arrange your own ride via <span className="text-white font-medium">Uber, Rapido, or Porter</span>.
                    </p>
                    <p className="text-white/70">
                      <span className="font-semibold text-white">Preference:</span> Uncle Delivery is highly recommended
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-[#C7BFB3]/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E7B52C]" />
                  <span>All orders are strictly <strong className="text-white">Non-Refundable</strong>.</span>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  <MapPin className="h-4 w-4 text-[#E7B52C]" />
                  Shipping Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Contact Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="House / Flat / Area"
                    className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Landmark / Suite (Optional)</label>
                  <input
                    type="text"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Apartment, suite, unit etc."
                    className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6-digit ZIP"
                      className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Delivery Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instructions for the courier partner..."
                    className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 resize-none"
                  />
                </div>
              </div>

              {/* Payment Gateway Card */}
              <div className="bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  <CreditCard className="h-4 w-4 text-[#E7B52C]" />
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
                      className={`py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                        paymentMethod === m.id
                          ? "bg-[#E7B52C]/10 border-[#E7B52C]/50 text-white"
                          : "bg-[#1a1a1a] border-white/5 text-white/40 hover:text-white"
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
                        <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">UPI Address</label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@okaxis"
                          className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/50"
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
                        <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          placeholder="4111 2222 3333 4444"
                          className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Expiry Date</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/50"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">CVV</label>
                          <input
                            type="password"
                            required
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/50"
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
                      className="space-y-3 pt-2 text-xs text-white/40"
                    >
                      <p>You will be securely redirected to select and authenticate with your preferred banking institution.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Refund Policy Acceptance */}
              <div className="bg-[#141414] border border-white/8 rounded-2xl p-5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={refundAccepted}
                    onChange={(e) => setRefundAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-[#1a1a1a] accent-[#E7B52C] shrink-0 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm text-white/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      I have read and agree to the{" "}
                      <a href="/refund" target="_blank" className="text-[#E7B52C] hover:underline font-semibold">
                        Refund Policy
                      </a>.
                      I understand that all orders are{" "}
                      <strong className="text-white">strictly non-refundable</strong>{" "}
                      once placed.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={isProcessing || !refundAccepted}
                className="w-full h-14 bg-[#E7B52C] text-black font-bold rounded-[14px] hover:bg-[#F4C542] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "0 8px 25px rgba(231,181,44,0.15)" }}
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
          <div className="lg:col-span-5 bg-[#141414] border border-white/8 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Order Details
            </h2>

            {/* List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="min-w-0 pr-4">
                    <p className="text-white font-semibold truncate">{item.product.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">Qty: {item.quantity} · ₹{item.price}/ea</p>
                  </div>
                  <span className="text-white/70 font-semibold font-mono">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <Separator className="bg-white/10" />

            {/* Price breakdown */}
            <div className="space-y-2 text-sm text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white/70">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging Charges</span>
                <span className="text-white/70">₹{packagingCharge}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white/70">
                  {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="text-white/70">₹{tax}</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex justify-between text-white font-bold text-base">
                <span>Total Amount</span>
                <span className="text-[#E7B52C] font-mono">₹{total}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="pt-2 flex items-center justify-center gap-2 text-white/20 text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Razorpay Secured 256-Bit SSL Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Processing Modal */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-4"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-[#E7B52C] rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide uppercase font-mono">Simulating Razorpay Overlay</h2>
              <p className="text-white/40 text-xs max-w-xs leading-relaxed">
                Communicating with gateway... verifying credentials, authorization token and bank response code.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {paymentSuccess && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>Payment Authorized Successfully</h2>
              <p className="text-white/50 text-sm max-w-xs leading-relaxed mx-auto">
                Your order is confirmed! Redirecting you to your account orders history...
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
