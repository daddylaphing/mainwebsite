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
    <div className="min-h-screen bg-[#090909] pt-24 md:pt-32 px-4 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="mb-16">
          <div className="inline-block px-3 py-1 bg-[#6E1D25]/10 border border-[#6E1D25]/30 rounded-full text-[10px] font-bold text-[#E7B52C] uppercase tracking-wider mb-6">
            Our Story
          </div>
          <h1
            className="font-black text-4xl md:text-[64px] text-[#F8F5EE] mb-6 leading-[1.1]"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.03em" }}
          >
            LAPHING <span className="text-[#E7B52C]">DADDY</span>
          </h1>
          <p
            className="text-[#C7BFB3] text-lg md:text-xl leading-relaxed max-w-2xl"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Born in the misty lanes of Darjeeling, Laphing Daddy started as a simple obsession:
            bringing the bold, fiery flavours of authentic Tibetan street laphing to every kitchen
            in India.
          </p>
        </div>

        {/* Story section */}
        <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-6 md:p-10 mb-8">
          <h2
            className="font-bold text-2xl text-[#F8F5EE] mb-4"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            How It Started
          </h2>
          <div className="space-y-4 text-[#C7BFB3] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="bg-[#141414] border border-white/[0.08] rounded-2xl p-6 hover:border-[#E7B52C]/20 transition-colors"
            >
              <div className="w-8 h-1 bg-[#E7B52C] rounded-full mb-4" />
              <h3
                className="text-white font-bold text-lg mb-2"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {v.title}
              </h3>
              <p className="text-[#C7BFB3] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 md:p-10 border border-white/[0.08] relative overflow-hidden"
          style={{ background: "#1B1B1B" }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#E7B52C]/5 rounded-full blur-3xl" />
          <h2
            className="font-black text-2xl md:text-3xl text-white mb-2 relative"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
          >
            Ready to taste the real thing?
          </h2>
          <p className="text-[#C7BFB3]/70 text-sm mb-6 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
            Order your Laphing Kit today and experience authentic Darjeeling street flavour at home.
          </p>
          <div className="flex flex-wrap gap-3 relative">
            <Link
              href="/#products"
              className="inline-flex items-center bg-[#E7B52C] text-black font-bold text-sm px-6 py-3 rounded-[14px] hover:bg-[#F4C542] hover:shadow-[0_8px_20px_rgba(231,181,44,0.25)] transition-all"
            >
              Shop Now
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center border border-white/10 text-[#C7BFB3] font-bold text-sm px-6 py-3 rounded-[14px] hover:bg-white/5 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
