"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { Separator } from "@/components/ui/separator";

// Extend window type for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open(): void;
      on(event: string, handler: (response: Record<string, unknown>) => void): void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    packagingCharge,
    shippingCharge,
    tax,
    total,
    clearCart,
  } = useCart();
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

  // UI Flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refundAccepted, setRefundAccepted] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirectTo=/checkout");
    }
  }, [user, authLoading, router]);

  // Pre-fill profile
  useEffect(() => {
    if (!user) return;
    import("@/lib/supabase/client").then(({ createClient }) => {
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
    });
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (items.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="h-16 w-16 text-[#7A7570]/30" />
        <h2
          className="text-xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your Cart is Empty
        </h2>
        <p
          className="text-[#7A7570] text-sm"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
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

  // ─── Main payment handler ──────────────────────────────────────────────────
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (!razorpayLoaded || !window.Razorpay) {
      setErrorMessage(
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // STEP 1 — Create order in our backend (which calls Razorpay + inserts to DB)
      const createRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product.id.startsWith("addon")
              ? null
              : item.product.id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.product.images?.[0] ?? undefined,
          })),
          shipping_address: {
            full_name: name,
            phone,
            line1,
            line2: line2 || undefined,
            city,
            state,
            pincode,
          },
          subtotal,
          tax,
          shipping_charge: shippingCharge,
          packaging_charge: packagingCharge,
          discount: 0,
          total,
          delivery_notes: notes || undefined,
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData.order_id) {
        throw new Error(createData.error || "Failed to create order.");
      }

      const { order_id: dbOrderId, razorpay_order_id: rzpOrderId } = createData;

      // If Razorpay order was not created, hard fail — never skip payment
      if (!rzpOrderId) {
        throw new Error("Payment gateway order could not be created. Please try again or contact support.");
      }

      // STEP 2 — Open Razorpay checkout modal
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "";

      if (!razorpayKeyId) {
        throw new Error(
          "Razorpay public key is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local and Vercel."
        );
      }

      const options = {
        key: razorpayKeyId,
        amount: Math.round(total * 100), // paise
        currency: "INR",
        name: "Laphing Daddy",
        description: "Authentic Tibetan Laphing Kit",
        order_id: rzpOrderId,
        prefill: {
          name,
          contact: phone,
          email: user.email ?? "",
        },
        theme: { color: "#6E1D25" },

        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // STEP 3 — Verify payment signature on our backend
          try {
            // Debug: check what the server computes
            const debugRes = await fetch("/api/debug-rzp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const debugData = await debugRes.json();
            console.log("[RZP DEBUG]", debugData);

            const verifyRes = await fetch("/api/orders/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: dbOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setPaymentSuccess(true);
            clearCart();
            setTimeout(() => {
              router.push("/account");
              router.refresh();
            }, 3000);
          } catch (err: unknown) {
            setErrorMessage(
              (err instanceof Error ? err.message : null) || "Payment verification failed. Please contact support."
            );
          } finally {
            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setErrorMessage(
              "Payment was cancelled. You can try again when ready."
            );
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: Record<string, unknown>) => {
        setIsProcessing(false);
        setErrorMessage(
          `Payment failed: ${(response.error as { description?: string } | undefined)?.description || "Unknown error"}. Please try again.`
        );
      });

      rzp.open();
    } catch (err: unknown) {
      setIsProcessing(false);
      setErrorMessage((err instanceof Error ? err.message : null) || "An unexpected error occurred.");
    }
  };

  return (
    <>
      {/* Load Razorpay checkout.js */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() =>
          setErrorMessage(
            "Failed to load payment gateway. Please refresh the page."
          )
        }
      />

      <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h1
            className="text-3xl md:text-4xl font-black text-[#1A1A1A] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
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
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Important Delivery &amp; Booking Info
                    </span>
                  </div>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <div className="space-y-1.5">
                      <p className="text-[#4A4540]">
                        <span className="font-bold text-[#1A1A1A]">
                          Delivery Areas:
                        </span>{" "}
                        Delhi, Noida, Gurugram, Ghaziabad only
                      </p>
                      <p className="text-[#4A4540]">
                        <span className="font-bold text-[#1A1A1A]">
                          Booking Window:
                        </span>{" "}
                        Between 3 PM to 6 PM only
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[#4A4540]">
                        <span className="font-bold text-[#1A1A1A]">
                          Delivery Method:
                        </span>{" "}
                        Arrange your own ride via{" "}
                        <span className="text-[#1A1A1A] font-medium">
                          Uber, Rapido, or Porter
                        </span>
                        .
                      </p>
                      <p className="text-[#4A4540]">
                        <span className="font-bold text-[#1A1A1A]">
                          Preference:
                        </span>{" "}
                        Uncle Delivery is highly recommended
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#E6DFD5] text-[11px] text-[#7A7570] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6E1D25]" />
                    <span>
                      All orders are strictly{" "}
                      <strong className="text-[#6E1D25]">Non-Refundable</strong>
                      .
                    </span>
                  </div>
                </div>

                {/* Address Card */}
                <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6 space-y-4">
                  <h2
                    className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2 mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <MapPin className="h-4 w-4 text-[#D4A843]" />
                    Shipping Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                        Recipient Name
                      </label>
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
                      <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                        Contact Number
                      </label>
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
                    <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                      Street Address
                    </label>
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
                    <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                      Landmark / Suite (Optional)
                    </label>
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
                      <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                        City
                      </label>
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
                      <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                        State
                      </label>
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
                      <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                        Pincode
                      </label>
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
                    <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Instructions for the courier partner..."
                      className="bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#7A7570]/30 focus:outline-none focus:border-[#D4A843] resize-none"
                    />
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-6 space-y-3">
                  <h2
                    className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <CreditCard className="h-4 w-4 text-[#D4A843]" />
                    Payment via Razorpay
                  </h2>
                  <p
                    className="text-xs text-[#7A7570] leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    After clicking below, Razorpay&apos;s secure payment modal will
                    open. You can pay using UPI, Card, Net Banking, or Wallets.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["UPI", "Cards", "Net Banking", "Wallets"].map((m) => (
                      <span
                        key={m}
                        className="px-3 py-1 bg-white border border-[#E6DFD5] rounded-full text-[10px] font-bold text-[#7A7570] uppercase tracking-wider"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
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
                      <p
                        className="text-sm text-[#4A4540] leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        I have read and agree to the{" "}
                        <a
                          href="/refund"
                          target="_blank"
                          className="text-[#D4A843] hover:underline font-bold"
                        >
                          Refund Policy
                        </a>
                        . I understand that all orders are{" "}
                        <strong className="text-[#1A1A1A]">
                          strictly non-refundable
                        </strong>{" "}
                        once placed.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isProcessing || !refundAccepted || !razorpayLoaded}
                  className="w-full h-14 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest rounded-[14px] hover:bg-[#6E1D25] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      CREATING ORDER…
                    </>
                  ) : !razorpayLoaded ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      LOADING PAYMENT…
                    </>
                  ) : (
                    `PAY ₹${total} via Razorpay`
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
              <h2
                className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Order Details
              </h2>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-[#1A1A1A] font-bold truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[#7A7570] text-xs mt-0.5">
                        Qty: {item.quantity} · ₹{item.price}/ea
                      </p>
                    </div>
                    <span className="text-[#1A1A1A] font-semibold font-mono">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-[#E6DFD5]" />

              <div
                className="space-y-2 text-sm text-[#4A4540]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1A1A1A] font-semibold">
                    ₹{subtotal}
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

              <div className="pt-2 flex items-center justify-center gap-2 text-[#7A7570]/50 text-xs">
                <ShieldCheck className="h-4 w-4" />
                <span>Razorpay Secured 256-Bit SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Processing overlay */}
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
                <h2 className="text-lg font-bold text-[#1A1A1A] tracking-wider uppercase font-mono">
                  Opening Razorpay…
                </h2>
                <p className="text-[#7A7570] text-xs max-w-xs leading-relaxed">
                  Creating a secure order session with Razorpay.
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
                <h2
                  className="text-2xl font-black text-[#1A1A1A] tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Payment Successful!
                </h2>
                <p className="text-[#7A7570] text-sm max-w-xs leading-relaxed mx-auto">
                  Your order is confirmed and payment verified. Redirecting to
                  your orders…
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
