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
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 pb-20">
      <main className="w-full max-w-[1200px] mx-auto px-5 md:px-16">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
            <span className="text-label-caps text-[#D4A843]" style={{ fontFamily: "'Inter', sans-serif" }}>Partnership</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
          </div>
          <h1
            className="font-bold text-[#1A1A1A] mb-6 leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-0.02em",
            }}
          >
            Wholesale & <span className="text-[#D4A843] italic">B2B</span>
          </h1>
          <p
            className="text-[#7A7570] text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Partner with Laphing Daddy to bring authentic Tibetan Laphing to your customers. 
            Competitive pricing, reliable supply, and quality you can trust.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.08)] p-8 transition-all duration-300 hover:border-[rgba(26,26,26,0.2)]"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#F7F3EC] flex items-center justify-center shrink-0 border border-[rgba(26,26,26,0.05)]">
                  <benefit.icon className="h-5 w-5 text-[#D4A843]" />
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[#1A1A1A] font-bold text-lg mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-[#7A7570] text-sm leading-relaxed"
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
        <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.06)] p-8 md:p-10 mb-16">
          <h2
            className="text-[#1A1A1A] font-bold text-2xl mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Who We Work With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.05)] px-4 py-4 text-center"
              >
                <span
                  className="text-[#1A1A1A] text-sm font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.08)] p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2
            className="text-[#1A1A1A] font-bold text-2xl md:text-3xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Let&apos;s Talk Business
          </h2>
          <p
            className="text-[#7A7570] mb-8 max-w-xl mx-auto text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Ready to partner with us? Get in touch to discuss pricing, minimum order quantities, and delivery schedules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <a
              href="tel:9211969977"
              className="btn-cream flex items-center justify-center gap-3 py-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Phone className="h-4 w-4" />
              <div className="text-left leading-none">
                <div className="text-[9px] text-[#A09890] uppercase tracking-wider mb-1">Call Us</div>
                <div className="text-sm font-semibold text-[#1A1A1A]">9211969977</div>
              </div>
            </a>

            <a
              href="https://wa.me/919211969977"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ink flex items-center justify-center gap-3 py-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Mail className="h-4 w-4" />
              <div className="text-left leading-none">
                <div className="text-[9px] text-white/70 uppercase tracking-wider mb-1">WhatsApp</div>
                <div className="text-sm font-semibold text-white">Message Us</div>
              </div>
            </a>
          </div>

          <p
            className="text-[#A09890] text-xs mt-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Business hours: 10:00 AM - 8:00 PM (Mon-Sun)
          </p>
        </div>
      </main>
    </div>
  );
}
