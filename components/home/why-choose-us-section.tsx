"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { MaskReveal, CountUp, WordReveal } from "@/components/ui/text-reveal";

const STORY_IMAGE = "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/media/laphing.png";

export function WhyChooseUsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTiltX(-y / (rect.height / 2) * 15);
    setTiltY(x / (rect.width / 2) * 15);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  return (
    <section id="story" className="bg-[#F7F3EC] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-24 md:py-32">

        {/* Top: section label */}
        <div className="flex items-center gap-4 mb-14 md:mb-20">
          <div className="w-6 h-px bg-[#D4A843]" />
          <span
            className="text-label-caps text-[#D4A843]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Our Story — 01
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Editorial text */}
          <div className="relative">
            {/* Ghost number */}
            <span
              className="ghost-number -top-8 -left-4 text-[180px] md:text-[240px]"
              aria-hidden="true"
            >
              01
            </span>

            <div className="relative z-10">
              <h2
                className="text-headline-xl text-[#1A1A1A] mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <MaskReveal delay={0.1}>
                  What is
                </MaskReveal>
                <br />
                <MaskReveal delay={0.3} color="#6E1D25">
                  <em className="text-[#6E1D25]">Tibetan Laphing?</em>
                </MaskReveal>
              </h2>

              <div className="space-y-5">
                <p
                  className="text-[#444748] text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  <WordReveal
                    text="Laphing is a beloved Tibetan street food — silky starch sheets made from mung bean, served cold with layers of aromatic garlic water, slow-cooked chilli oil, and a secret spice blend."
                    delay={0.4}
                    stagger={0.015}
                  />
                </p>
                <p
                  className="text-[#7A7570] text-base md:text-lg leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <WordReveal
                    text="Born on the streets of Lhasa and beloved across the Himalayas, laphing has found a new home in Delhi NCR — delivered fresh to your doorstep, ready in minutes."
                    delay={0.7}
                    stagger={0.015}
                  />
                </p>
              </div>

              <div className="mt-12">
                <hr className="ink-divider mb-8" />
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p
                      className="text-[#1A1A1A] text-2xl md:text-3xl font-bold mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      <CountUp target={3} suffix=" min" />
                    </p>
                    <p
                      className="text-[#A09890] text-[11px] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Prep time
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-[#1A1A1A] text-2xl md:text-3xl font-bold mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      <CountUp target={500} suffix="+" />
                    </p>
                    <p
                      className="text-[#A09890] text-[11px] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Customers
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-[#1A1A1A] text-2xl md:text-3xl font-bold mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      100%
                    </p>
                    <p
                      className="text-[#A09890] text-[11px] uppercase tracking-[0.1em]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Fresh made
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer"
            style={{ perspective: "1000px" }}
          >
            {/* Offset block decoration */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-[#D4A843]/15 z-0" />
            <motion.div
              style={{
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: "preserve-3d",
              }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="relative z-10 aspect-[4/5] w-full overflow-hidden"
            >
              <Image
                src={STORY_IMAGE}
                alt="Close-up of fresh Tibetan Laphing with spicy chilli oil"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Floating caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-[#FAFAF8] border border-[rgba(26,26,26,0.1)] px-5 py-4 z-20"
            >
              <p className="text-[#1A1A1A] text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Fresh Tibetan Laphing
              </p>
              <p className="text-[#A09890] text-[10px] uppercase tracking-[0.1em] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Made every morning
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
