import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Laphing Daddy",
  description: "Terms and conditions for using our services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-bold text-4xl md:text-[56px] text-[#1A1A1A] mb-8 leading-none"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em" }}
        >
          TERMS OF <span className="text-[#D4A843] italic font-light">SERVICE</span>
        </h1>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              1. Acceptance of Terms
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              By accessing and using Laphing Daddy&apos;s services, you accept and agree to be bound by these
              Terms of Service.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2. Product Availability
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              All products are subject to availability. We reserve the right to limit quantities and
              discontinue products without prior notice.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              3. Pricing and Payment
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Prices are subject to change without notice. Payment must be received before order
              fulfillment. We accept major credit cards and digital payment methods.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              4. Limitation of Liability
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Laphing Daddy shall not be liable for any indirect, incidental, or consequential damages
              arising from the use of our products or services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
