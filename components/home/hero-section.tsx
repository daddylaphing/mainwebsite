"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (bgRef.current && scrolled < window.innerHeight) {
        bgRef.current.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative w-full h-screen min-h-[600px] md:min-h-[800px] flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0tL6CHSmGOjtE07asT61lZQgA86olm1v8ByllWNbWT-Icu8-D4vUO1fJjH2EpNqU9dG2kxtXLkRW8HoGuLD2Uh-F7lH3mywRiFA6WV6M59MnDJ7ryc1YOI5XVka5ON1fSzr01Bc6O7B50eDtAE5MQ0fpIR2iss1nnZXRCF4TpKeOHIqIWbuHXr37RVRTEXPHb8VQu5mE02whR8-tyY1PEp-xtBgaLwh_8AKyfjq2UsUlJuTE72GS7Gl6ZcPDV6qsST2AXF-KLblc')",
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#090909] via-[#090909]/80 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#090909]/90 via-transparent to-[#090909]/90" />

      <div className="relative z-20 w-full max-w-[1440px] px-5 md:px-20 text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-[80px] font-black text-white uppercase tracking-tighter mb-4 md:mb-6 leading-[1.1]"
          style={{
            fontFamily: "'Manrope', sans-serif",
            letterSpacing: "-0.04em",
            textShadow: "0 0 20px rgba(255,255,255,0.2)",
          }}
        >
          LAPHING
          <br />
          <span className="text-[#E7B52C]">MADE EASY</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-base md:text-[18px] text-[#C7BFB3] max-w-2xl mb-8 md:mb-10 leading-[1.6] px-2 md:px-0"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Authentic Tibetan Laphing delivered to your doorstep. Premium kits,
          fresh sheets and street-style flavors — ready in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => {
              const el = document.getElementById("products");
              if (el) {
                const offset = 90;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = el.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
              }
            }}
            className="bg-[#E7B52C] text-black font-bold text-[15px] leading-[1] tracking-[0.02em] px-8 py-4 rounded-[14px] hover:bg-[#F4C542] hover:shadow-[0_8px_25px_rgba(231,181,44,0.3)] transition-all duration-200"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Order Now
          </button>
        </motion.div>
      </div>
    </header>
  );
}
