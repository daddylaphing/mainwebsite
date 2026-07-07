import { Metadata } from "next";
import { Phone, Mail, Building2, Package, Truck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Wholesale & B2B | Laphing Daddy",
  description:
    "Partner with Laphing Daddy for wholesale Tibetan Laphing. Perfect for restaurants, cafes, and retailers.",
  alternates: {
    canonical: "/wholesale",
  },
};

const BENEFITS = [
  {
    icon: Package,
    title: "Bulk Pricing",
    description: "Competitive wholesale rates for large orders. Volume discounts available.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description: "Scheduled deliveries to keep your stock fresh and consistent.",
  },
  {
    icon: Building2,
    title: "Custom Solutions",
    description: "Tailored product offerings to match your business needs.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Direct line to our team for quick responses and assistance.",
  },
];

const PARTNERS = [
  "Restaurants & Cafes",
  "Cloud Kitchens",
  "Catering Services",
  "Retail Stores",
  "Corporate Cafeterias",
  "Event Organizers",
];

export default function WholesalePage() {
  return (
    <div className="min-h-screen bg-[#090909]">
      <main className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1
            className="font-black text-4xl md:text-5xl lg:text-6xl text-white mb-4"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
          >
            Wholesale & <span className="text-[#E7B52C]">B2B</span>
          </h1>
          <p
            className="text-[#C7BFB3] text-base md:text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Partner with Laphing Daddy to bring authentic Tibetan Laphing to your customers. 
            Competitive pricing, reliable supply, and quality you can trust.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-[#141414] border border-white/[0.08] rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E7B52C]/10 flex items-center justify-center shrink-0">
                  <benefit.icon className="h-6 w-6 text-[#E7B52C]" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-white font-bold text-lg mb-2"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-[#C7BFB3] text-sm leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Who We Work With */}
        <div className="bg-[#1B1B1B] border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-12">
          <h2
            className="text-white font-bold text-2xl mb-6"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Who We Work With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                className="bg-[#141414] border border-white/[0.06] rounded-xl px-4 py-3 text-center"
              >
                <span
                  className="text-[#C7BFB3] text-sm font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-[#E7B52C]/10 to-[#F4C542]/5 border border-[#E7B52C]/20 rounded-2xl p-8 md:p-10">
          <h2
            className="text-white font-bold text-2xl md:text-3xl mb-4 text-center"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Let's Talk Business
          </h2>
          <p
            className="text-[#C7BFB3] text-center mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Ready to partner with us? Get in touch to discuss pricing, minimum order quantities, and delivery schedules.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a
              href="tel:9211969977"
              className="flex items-center justify-center gap-3 bg-[#E7B52C] hover:bg-[#F4C542] text-black font-bold px-6 py-4 rounded-xl transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Phone className="h-5 w-5" />
              <div className="text-left">
                <div className="text-xs opacity-70">Call Us</div>
                <div>9211969977</div>
              </div>
            </a>

            <a
              href="https://wa.me/919211969977"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#141414] hover:bg-[#1B1B1B] border border-white/20 text-white font-bold px-6 py-4 rounded-xl transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Mail className="h-5 w-5" />
              <div className="text-left">
                <div className="text-xs opacity-70">WhatsApp</div>
                <div>Message Us</div>
              </div>
            </a>
          </div>

          <p
            className="text-[#8F857B] text-xs text-center mt-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Business hours: 3:00 PM - 6:00 PM (Mon-Sun)
          </p>
        </div>
      </main>
    </div>
  );
}
