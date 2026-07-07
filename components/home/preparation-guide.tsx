"use client";

import { motion } from "framer-motion";
import { Clock, ChefHat } from "lucide-react";
import { useState } from "react";

const STEPS = [
  {
    step: 1,
    title: "Prepare the Sheet",
    description: "Remove the fresh laphing sheet from its vacuum-sealed packaging and lay it flat on a clean plate or cutting board.",
    time: "30s",
  },
  {
    step: 2,
    title: "Apply Garlic Water",
    description: "Drizzle our aromatic garlic water evenly over the entire surface of the sheet to build the base flavor profile.",
    time: "30s",
  },
  {
    step: 3,
    title: "Add Signature Chilli Oil",
    description: "Spread our slow-cooked, handcrafted chilli oil across the sheet. Adjust the amount to suit your personal spice threshold.",
    time: "30s",
  },
  {
    step: 4,
    title: "Drizzle Laphing Sauce",
    description: "Drizzle the signature soy-umami sauce base over the sheet to balance the heat with rich savory depth.",
    time: "30s",
  },
  {
    step: 5,
    title: "Sprinkle Seasoning Mix",
    description: "Dust our secret blend of spices and salt evenly over the layers to bind the flavor combinations together.",
    time: "15s",
  },
  {
    step: 6,
    title: "Roll, Cut & Serve",
    description: "Roll the sheet tightly into a cylinder, slice it into bite-sized pieces, and serve immediately for peak texture and taste.",
    time: "60s",
  },
];

export function PreparationGuide() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="pt-10 md:pt-20 border-t border-white/5" id="how-to-prepare">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6E1D25]/10 border border-[#6E1D25]/30 rounded-full text-[10px] font-bold text-[#E7B52C] uppercase tracking-wider mb-4">
          <ChefHat className="h-3 w-3" />
          Easy 3-Minute Guide
        </div>
        <div className="flex flex-col items-center mb-2">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-black text-3xl md:text-[48px] text-[#F8F5EE] leading-[1.2]"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
          >
            STEP-BY-STEP PREPARATION
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[3px] w-16 bg-[#E7B52C] rounded-full mt-3 origin-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Side: Step List */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {STEPS.map((s, index) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveStep(index)}
              className={`group flex items-start gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeStep === index
                  ? "bg-[#E7B52C]/5 border-[#E7B52C]/20 shadow-[0_10px_30px_rgba(231,181,44,0.05)]"
                  : "bg-[#141414] border-white/[0.05] hover:border-white/10 hover:bg-[#1a1a1a]"
              }`}
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors duration-300 ${
                  activeStep === index
                    ? "bg-[#E7B52C] text-black"
                    : "bg-white/5 text-[#C7BFB3]/40 group-hover:text-white"
                }`}
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    className={`font-bold text-sm md:text-base transition-colors duration-300 ${
                      activeStep === index ? "text-[#F8F5EE]" : "text-[#C7BFB3]/60 group-hover:text-white"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {s.title}
                  </h3>
                  <span className="flex items-center gap-1 text-[11px] text-[#8F857B] font-mono shrink-0">
                    <Clock className="h-3 w-3" />
                    {s.time}
                  </span>
                </div>
                <p
                  className={`text-xs md:text-sm leading-relaxed transition-colors duration-300 ${
                    activeStep === index ? "text-[#C7BFB3]" : "text-[#8F857B]/60 group-hover:text-[#8F857B]"
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Side: Guide Image Display */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] aspect-square max-w-[450px] mx-auto w-full group"
          >
            {/* Ambient Yellow Glow Behind Image */}
            <div className="absolute inset-0 bg-[#E7B52C]/5 rounded-2xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/guide.png"
              alt="Step by Step Preparation Guide"
              className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
            />

            {/* Premium Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 z-20 flex flex-col gap-1.5">
              <span
                className="text-[#E7B52C] font-bold text-[10px] tracking-wider uppercase font-mono"
              >
                Visual Guide
              </span>
              <h4
                className="text-[#F8F5EE] font-bold text-lg leading-tight"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Assemble in Minutes
              </h4>
              <p
                className="text-[#C7BFB3]/70 text-xs leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                The complete visual reference included with every standard Laphing Daddy kit.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
