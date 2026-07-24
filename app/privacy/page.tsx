import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Laphing Daddy",
  description: "Our privacy policy and data protection practices.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-bold text-4xl md:text-[56px] text-[#1A1A1A] mb-8 leading-none"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em" }}
        >
          PRIVACY <span className="text-[#D4A843] italic font-light">POLICY</span>
        </h1>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              1. Information We Collect
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              We collect information that you provide directly to us, including name, email address,
              phone number, delivery address, and payment information when you place an order.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2. How We Use Your Information
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your information is used to process orders, communicate about your purchases, improve our
              services, and send promotional materials (with your consent).
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              3. Data Security
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              We implement industry-standard security measures to protect your personal information
              from unauthorized access, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              4. Contact Us
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              For questions about this privacy policy, please contact us at laphingdaddy@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
