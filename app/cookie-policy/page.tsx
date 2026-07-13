import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Laphing Daddy",
  description: "Information about how we use cookies and tracking technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-bold text-4xl md:text-[56px] text-[#1A1A1A] mb-8 leading-none"
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em" }}
        >
          COOKIE <span className="text-[#D4A843] italic font-light">POLICY</span>
        </h1>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              1. What Are Cookies
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Cookies are small text files stored on your device when you visit our website. They help us make the website work correctly, provide a more secure user experience, and analyze site performance.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2. How We Use Cookies
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              We use necessary cookies for authentication, session handling, security, and cart persistence. We also use analytics cookies (e.g. Google Analytics) to measure site traffic and functional cookies to remember your preferences.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              3. Managing Preferences
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              You can change your cookie preferences at any time using our cookie consent banner or by clearing your browser cookies. Rejecting non-essential cookies will not affect your ability to browse our website or make purchases.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-xl text-[#1A1A1A] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              4. Contact Support
            </h2>
            <p className="text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              For any questions regarding our cookie policy, please contact privacy@laphingdaddy.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
