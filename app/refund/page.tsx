import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - Laphing Daddy",
  description: "Laphing Daddy refund policy. All orders are non-refundable once placed.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-bold text-4xl md:text-[56px] text-[#1A1A1A] mb-8 leading-none"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em" }}
        >
          REFUND <span className="text-[#D4A843] italic font-light">POLICY</span>
        </h1>

        {/* Non-Refundable Banner */}
        <div className="bg-[#6E1D25] border border-[#6E1D25]/10 p-6 mb-8 flex items-start gap-4 text-white">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[#6E1D25] font-black text-sm">!</span>
          </div>
          <div>
            <p
              className="text-white font-bold text-lg mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              All Orders Are NON-REFUNDABLE
            </p>
            <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              By placing an order with Laphing Daddy, you acknowledge and agree that all sales are
              final. No refunds, cancellations, or returns will be accepted once an order is confirmed.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              1. No Refund Policy
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              All orders placed on Laphing Daddy are <strong className="text-[#1A1A1A]">strictly non-refundable</strong>.
              Once an order is confirmed and payment is processed, the transaction is considered final.
              We do not accept cancellations, exchanges, or returns under any circumstances.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2. Why We Have This Policy
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our products are fresh, perishable food items — laphing sheets, cookies, sauces, and kits — prepared
              and dispatched on the day of order. Due to the nature of fresh food delivery, we are unable
              to accept returns or issue refunds after an order is placed.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              3. Order Accuracy
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Please review your order carefully before completing checkout. Ensure your delivery address,
              product quantities, and customizations are correct. Once placed, orders cannot be modified
              or cancelled.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              4. Delivery Concerns
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              We deliver only within <strong className="text-[#1A1A1A]">Delhi, Noida, and Gurgaon</strong>.
              If a delivery issue arises due to an incorrect address provided by the customer, no refund
              will be issued. For delivery-partner related issues, please contact us directly and we will
              do our best to assist within reason.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              5. Contact Us
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              For any concerns regarding your order, please reach out to us before placing your order:
            </p>
            <div className="space-y-2 border-t border-[rgba(26,26,26,0.08)] pt-4 text-sm text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p>
                General Orders:{" "}
                <a href="tel:9873052538" className="text-[#D4A843] hover:underline font-semibold">
                  9873052538
                </a>
              </p>
              <p>
                WhatsApp:{" "}
                <a href="https://wa.me/919354775439" className="text-[#D4A843] hover:underline font-semibold">
                  9354775439
                </a>
              </p>
              <p>
                Bulk Orders:{" "}
                <a href="tel:9211969977" className="text-[#D4A843] hover:underline font-semibold">
                  9211969977
                </a>
              </p>
            </div>
          </section>
        </div>

        <p
          className="text-[#A09890] text-xs mt-8 text-center"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Last updated: July 2025
        </p>
      </div>
    </div>
  );
}
