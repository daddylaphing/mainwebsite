import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Laphing Daddy",
  description: "Terms and conditions for using our services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-black text-5xl md:text-[64px] text-white mb-8 leading-[1.1]"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.03em" }}
        >
          TERMS OF <span className="text-[#E7B52C]">SERVICE</span>
        </h1>

        <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              1. Acceptance of Terms
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              By accessing and using Laphing Daddy&apos;s services, you accept and agree to be bound by these
              Terms of Service.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              2. Product Availability
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              All products are subject to availability. We reserve the right to limit quantities and
              discontinue products without prior notice.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              3. Pricing and Payment
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              Prices are subject to change without notice. Payment must be received before order
              fulfillment. We accept major credit cards and digital payment methods.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              4. Limitation of Liability
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              Laphing Daddy shall not be liable for any indirect, incidental, or consequential damages
              arising from the use of our products or services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
