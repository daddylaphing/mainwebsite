"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import { CharReveal, CountUp, WordReveal } from "@/components/ui/text-reveal";

const CTA_IMAGE = "https://lh3.googleusercontent.com/aida/AP1WRLtxnb5-ZPaLVTl4owQzHVJ6uwyVDZTWfhfeXxHyrPD18a8-GAwTLcOwF-b94dAxITu_Z9FLDNpQd350TVJg26db-vlbQwm5op6_vCVMODdkWgwRf5pvMdsWPNXazIfzfabBz8YmFUjqUz7bIye9utnNnQbg-MYEWPz_5r_oThpDHj7gb8-vEBQiDjE_8fSMyLwB9P2yZh70y-I5CzKUVkczq5Czobyb4iPC5ga1xGZAFuEyBQ_EFG-z9Q";

export function CTASection() {
  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="cta" className="relative overflow-hidden bg-[#F7F3EC] border-t border-b border-[#E6DFD5] min-h-[80vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={CTA_IMAGE}
          alt="Laphing Daddy — Order Now"
          fill
          className="object-cover opacity-[0.06] scale-105 transition-transform duration-[10000ms] hover:scale-100 mix-blend-multiply"
          sizes="100vw"
        />
        {/* Soft light vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F3EC] via-[#F7F3EC]/95 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-16 w-full py-24 md:py-32">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-6 h-px bg-[#6E1D25]" />
          <span
            className="text-label-caps text-[#6E1D25]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Order Now — Daily 3 PM to 6 PM
          </span>
        </motion.div>

        {/* Giant headline */}
        <h2
          className="text-[#1A1A1A] mb-10"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "clamp(52px, 9vw, 110px)",
            letterSpacing: "-0.03em",
            lineHeight: "0.95",
          }}
        >
          <CharReveal text="Taste" delay={0.1} className="block" />
          <span className="block text-[#6E1D25] italic font-medium">
            <CharReveal text="Authentic" delay={0.3} />
          </span>
          <CharReveal text="Laphing." delay={0.55} className="block" />
        </h2>

        <div
          className="text-[#7A7570] text-base md:text-lg max-w-md leading-relaxed mb-12"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <WordReveal
            text="Handcrafted fresh every morning. Delivered across Delhi, Noida, Gurugram and Ghaziabad. Ready in 3 minutes."
            delay={0.7}
            stagger={0.015}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-4"
        >
          <button
            onClick={scrollToProducts}
            className="group inline-flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 rounded-full shadow-[0_8px_20px_rgba(26,26,26,0.15)] hover:shadow-[0_12px_24px_rgba(110,29,37,0.25)]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Shop Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <a
            href="tel:9211969977"
            className="inline-flex items-center gap-3 border border-[#E6DFD5] bg-white text-[#1A1A1A] hover:bg-[#FAFAF8] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] rounded-full transition-colors duration-300 shadow-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Phone className="h-4 w-4 text-[#6E1D25]" />
            Bulk Orders
          </a>
        </motion.div>

        {/* Stats row */}
        <div className="mt-20 md:mt-24 pt-10 border-t border-[#E6DFD5] flex flex-wrap gap-10">
          <div>
            <p
              className="text-[#1A1A1A] text-3xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <CountUp target={500} suffix="+" />
            </p>
            <p className="text-label-caps text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Happy Customers
            </p>
          </div>

          <div>
            <p
              className="text-[#1A1A1A] text-3xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <CountUp target={4} suffix=".9" />
            </p>
            <p className="text-label-caps text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Average Rating
            </p>
          </div>

          <div>
            <p
              className="text-[#1A1A1A] text-3xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Daily
            </p>
            <p className="text-label-caps text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Fresh Made
            </p>
          </div>

          <div>
            <p
              className="text-[#1A1A1A] text-3xl font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <CountUp target={3} suffix=" min" />
            </p>
            <p className="text-label-caps text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Prep Time
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
