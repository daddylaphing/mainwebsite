import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Laphing Daddy",
  description: "Information about how we use cookies and tracking technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-5 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1
          className="font-black text-5xl md:text-[64px] text-white mb-8 leading-[1.1]"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.03em" }}
        >
          COOKIE <span className="text-[#E7B52C]">POLICY</span>
        </h1>

        <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-8 md:p-12 space-y-8">
          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              1. What Are Cookies
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              Cookies are small text files stored on your device when you visit our website. They help us make the website work correctly, provide a more secure user experience, and analyze site performance.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              2. How We Use Cookies
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              We use necessary cookies for authentication, session handling, security, and cart persistence. We also use analytics cookies (e.g. Google Analytics) to measure site traffic and functional cookies to remember your preferences.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              3. Managing Preferences
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              You can change your cookie preferences at any time using our cookie consent banner or by clearing your browser cookies. Rejecting non-essential cookies will not affect your ability to browse our website or make purchases.
            </p>
          </section>

          <section>
            <h2
              className="font-bold text-2xl text-white mb-4"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              4. Contact Support
            </h2>
            <p className="text-[#C7BFB3] leading-relaxed">
              For any questions regarding our cookie policy, please contact privacy@laphingdaddy.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
