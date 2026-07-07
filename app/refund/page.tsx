import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - Laphing Daddy",
  description: "Laphing Daddy refund policy. All orders are non-refundable once placed.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-black text-5xl md:text-[64px] text-white mb-8 leading-[1.1]"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.03em" }}
        >
          REFUND <span className="text-[#E7B52C]">POLICY</span>
        </h1>

        {/* Non-Refundable Banner */}
        <div className="bg-[#6E1D25]/20 border border-[#6E1D25]/30 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[#6E1D25] flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white font-black text-sm">!</span>
          </div>
          <div>
            <p
              className="text-white font-bold text-lg mb-1"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              All Orders Are NON-REFUNDABLE
            </p>
            <p className="text-[#C7BFB3]/70 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              By placing an order with Laphing Daddy, you acknowledge and agree that all sales are
              final. No refunds, cancellations, or returns will be accepted once an order is confirmed.
            </p>
          </div>
        </div>

        <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              1. No Refund Policy
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              All orders placed on Laphing Daddy are <strong className="text-white">strictly non-refundable</strong>.
              Once an order is confirmed and payment is processed, the transaction is considered final.
              We do not accept cancellations, exchanges, or returns under any circumstances.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              2. Why We Have This Policy
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our products are fresh, perishable food items — laphing sheets, cookies, sauces, and kits — prepared
              and dispatched on the day of order. Due to the nature of fresh food delivery, we are unable
              to accept returns or issue refunds after an order is placed.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              3. Order Accuracy
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Please review your order carefully before completing checkout. Ensure your delivery address,
              product quantities, and customizations are correct. Once placed, orders cannot be modified
              or cancelled.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              4. Delivery Concerns
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              We deliver only within <strong className="text-white">Delhi, Noida, and Gurgaon</strong>.
              If a delivery issue arises due to an incorrect address provided by the customer, no refund
              will be issued. For delivery-partner related issues, please contact us directly and we will
              do our best to assist within reason.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              5. Contact Us
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              For any concerns regarding your order, please reach out to us before placing your order:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-[#C7BFB3] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                General Orders:{" "}
                <a href="tel:9873052538" className="text-[#E7B52C] hover:text-[#F4C542] hover:underline font-semibold">
                  9873052538
                </a>
              </p>
              <p className="text-[#C7BFB3] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                WhatsApp:{" "}
                <a href="https://wa.me/919354775439" className="text-[#E7B52C] hover:text-[#F4C542] hover:underline font-semibold">
                  9354775439
                </a>
              </p>
              <p className="text-[#C7BFB3] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Bulk Orders:{" "}
                <a href="tel:9211969977" className="text-[#E7B52C] hover:text-[#F4C542] hover:underline font-semibold">
                  9211969977
                </a>
              </p>
            </div>
          </section>
        </div>

        <p
          className="text-[#8F857B] text-xs mt-8 text-center"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Last updated: July 2025
        </p>
      </div>
    </div>
  );
}
