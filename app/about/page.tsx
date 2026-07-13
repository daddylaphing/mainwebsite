import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - Laphing Daddy",
  description:
    "Learn the story behind Laphing Daddy — authentic Tibetan street food kits crafted with love in Darjeeling, West Bengal.",
};

const VALUES = [
  { title: "Authenticity", desc: "Every ingredient sourced from the hills of Darjeeling. No shortcuts, no compromises." },
  { title: "Freshness", desc: "Prepared in small batches and vacuum-sealed to lock in flavour. No preservatives, ever." },
  { title: "Community", desc: "We work directly with local farmers and artisans, keeping the supply chain hyper-local." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 pb-20">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="inline-block bg-[#D4A843] text-white text-[9px] font-bold px-3 py-1.5 uppercase tracking-wider mb-6">
            Our Story
          </div>
          <h1
            className="font-bold text-[#1A1A1A] mb-6 leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 6vw, 64px)",
              letterSpacing: "-0.02em",
            }}
          >
            LAPHING <span className="text-[#D4A843] italic">DADDY</span>
          </h1>
          <p
            className="text-[#7A7570] text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Born in the misty lanes of Darjeeling, Laphing Daddy started as a simple obsession:
            bringing the bold, fiery flavours of authentic Tibetan street laphing to every kitchen
            in India.
          </p>
        </div>

        {/* Story section */}
        <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.06)] p-8 md:p-12 mb-12">
          <h2
            className="font-bold text-2xl text-[#1A1A1A] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How It Started
          </h2>
          <div className="space-y-5 text-[#7A7570] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p>
              Our founder grew up watching his grandmother make laphing from scratch — kneading the
              starch sheets by hand at dawn, slow-cooking the chilli oil for hours, balancing each
              sauce to a precise, addictive flavour. It was never written down. It was always
              just <em>known</em>.
            </p>
            <p>
              After years of seeing people struggle to recreate authentic laphing outside Darjeeling
              — settling for diluted, flavourless versions — Laphing Daddy was born with a mission:
              democratise the real thing. No restaurant. No middlemen. Just the kit, delivered to
              your door, so you can make it exactly the way it&apos;s supposed to taste.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-white border border-[rgba(26,26,26,0.08)] p-6 transition-all hover:border-[rgba(26,26,26,0.2)]"
            >
              <div className="w-8 h-[2px] bg-[#D4A843] mb-4" />
              <h3
                className="text-[#1A1A1A] font-bold text-lg mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {v.title}
              </h3>
              <p className="text-[#7A7570] text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.08)] p-8 md:p-12 text-center relative overflow-hidden">
          <h2
            className="font-bold text-2xl md:text-3xl text-[#1A1A1A] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to taste the real thing?
          </h2>
          <p className="text-[#7A7570] text-sm mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            Order your Laphing Kit today and experience authentic Darjeeling street flavour at home.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#products"
              className="btn-ink px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full"
            >
              Shop Now
            </Link>
            <Link
              href="/#contact"
              className="btn-outline-ink px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full border border-[rgba(26,26,26,0.15)]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
