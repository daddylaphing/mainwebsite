"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { useState } from "react";
import { RecipeModal } from "@/components/modals/recipe-modal";
import { useProxiedUrl } from "@/lib/hooks/use-proxied-url";

const STEPS = [
  { step: "01", title: "Prepare the Sheet", description: "Remove the fresh laphing sheet from its vacuum-sealed packaging and lay it flat on a clean plate or cutting board.", time: "30s" },
  { step: "02", title: "Apply Garlic Water", description: "Drizzle our aromatic garlic water evenly over the entire surface of the sheet to build the base flavor profile.", time: "30s" },
  { step: "03", title: "Add Signature Chilli Oil", description: "Spread our slow-cooked, handcrafted chilli oil across the sheet. Adjust the amount to suit your personal spice threshold.", time: "30s" },
  { step: "04", title: "Drizzle Laphing Sauce", description: "Drizzle the signature soy-umami sauce base over the sheet to balance the heat with rich savory depth.", time: "30s" },
  { step: "05", title: "Sprinkle Seasoning Mix", description: "Dust our secret blend of spices and salt evenly over the layers to bind the flavor combinations together.", time: "15s" },
  { step: "06", title: "Roll, Cut & Serve", description: "Roll the sheet tightly into a cylinder, slice it into bite-sized pieces, and serve immediately for peak texture and taste.", time: "60s" },
];

export function RecipeGuideSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const guideImageUrl = useProxiedUrl(
    "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/guide.png"
  );

  return (
    <>
      <section id="recipe-guide" className="bg-[#F7F3EC]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-24 md:py-32">

          {/* Header */}
          <div className="mb-16 md:mb-20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-px bg-[#D4A843]" />
              <span
                className="text-label-caps text-[#D4A843]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                How To Prepare — 04
              </span>
            </div>
            <h2
              className="text-[#1A1A1A]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "-0.03em",
                lineHeight: "1",
              }}
            >
              The Recipe
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-12 lg:gap-20 items-start">

            {/* Steps */}
            <div className="space-y-0">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActiveStep(i)}
                  className={`group border-b border-[rgba(26,26,26,0.1)] cursor-pointer transition-all duration-300 ${activeStep === i ? "bg-[#FFFFFF]" : "hover:bg-[rgba(255,255,255,0.5)]"}`}
                >
                  <div className="flex items-start gap-6 px-0 py-6">
                    {/* Step number */}
                    <span
                      className={`text-4xl md:text-5xl font-bold leading-none shrink-0 transition-colors duration-300 ${activeStep === i ? "text-[#D4A843]" : "text-[rgba(26,26,26,0.12)] group-hover:text-[rgba(26,26,26,0.25)]"}`}
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
                    >
                      {s.step}
                    </span>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h3
                          className={`font-semibold text-base md:text-lg transition-colors duration-300 ${activeStep === i ? "text-[#1A1A1A]" : "text-[#7A7570] group-hover:text-[#444748]"}`}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {s.title}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0 text-[#A09890]">
                          <Clock className="h-3 w-3" />
                          <span className="text-[11px]" style={{ fontFamily: "'Inter', sans-serif" }}>{s.time}</span>
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {activeStep === i && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[#7A7570] text-sm md:text-base leading-relaxed overflow-hidden"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {s.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: image + CTA */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-square overflow-hidden cursor-pointer group"
                onClick={() => setIsModalOpen(true)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={guideImageUrl}
                  alt="Step by Step Preparation Guide"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p
                    className="text-label-caps text-[#D4A843] mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Visual Guide Included
                  </p>
                  <p
                    className="text-[#FAFAF8] text-xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Assemble in Minutes
                  </p>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#D4A843]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-ink w-full justify-center"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                View Full Recipe Guide
                <span className="ml-2">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <RecipeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
