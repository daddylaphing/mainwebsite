import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Laphing Daddy",
  description: "Our privacy policy and data protection practices.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-black text-5xl md:text-[64px] text-white mb-8 leading-[1.1]"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.03em" }}
        >
          PRIVACY <span className="text-[#E7B52C]">POLICY</span>
        </h1>

        <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              1. Information We Collect
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              We collect information that you provide directly to us, including name, email address,
              phone number, delivery address, and payment information when you place an order.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              2. How We Use Your Information
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              Your information is used to process orders, communicate about your purchases, improve our
              services, and send promotional materials (with your consent).
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              3. Data Security
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              We implement industry-standard security measures to protect your personal information
              from unauthorized access, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              4. Contact Us
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              For questions about this privacy policy, please contact us at privacy@laphingdaddy.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
