"use client";

import React from "react";
import { ScrollStack, ScrollStackItem } from "@/components/ui/scroll-stack";
import { ChefHat, MoveDown, Sparkles } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Lay Starch Sheets Flat",
    description: "Unwrap our signature cold starch sheets (silky, chewy, and handset fresh every morning) and lay them flat on a clean board.",
    bgColor: "bg-[#F7F3EC] border border-[#E6DFD5]", // Light Cream
    textColor: "text-[#1A1A1A]",
    descriptionColor: "text-[#7A7570]",
    accentColor: "text-[#6E1D25]",
    tag: "Preparation",
    badgeColor: "border-black/10 bg-black/5 text-[#1A1A1A]",
    dotColor: "bg-[#6E1D25]",
  },
  {
    step: "02",
    title: "Infuse Garlic Water",
    description: "Drizzle the fresh garlic water evenly across the surface. This builds the foundational aromatic umami layer.",
    bgColor: "bg-[#FFFFFF] border border-[#E6DFD5]", // Crisp White
    textColor: "text-[#1A1A1A]",
    descriptionColor: "text-[#7A7570]",
    accentColor: "text-[#6E1D25]",
    tag: "Aroma Layer",
    badgeColor: "border-black/10 bg-black/5 text-[#1A1A1A]",
    dotColor: "bg-[#6E1D25]",
  },
  {
    step: "03",
    title: "Drizzle Chilli Oil",
    description: "Spread our slow-cooked, whole-spice-tempered chilli oil. Customize the quantity to balance the perfect heat level.",
    bgColor: "bg-[#6E1D25] border border-[#521319]", // Deep Maroon
    textColor: "text-[#FAFAF8]",
    descriptionColor: "text-white/80",
    accentColor: "text-[#D4A843]",
    tag: "The Signature Punch",
    badgeColor: "border-white/10 bg-white/5 text-[#FAFAF8]",
    dotColor: "bg-[#D4A843]",
  },
  {
    step: "04",
    title: "Glaze with Spice Dust",
    description: "Dust our proprietary Tibetan spice mix to tie all flavors together in a perfect, warm balance.",
    bgColor: "bg-[#F7F3EC] border border-[#E6DFD5]", // Light Cream
    textColor: "text-[#1A1A1A]",
    descriptionColor: "text-[#7A7570]",
    accentColor: "text-[#6E1D25]",
    tag: "Final Polish",
    badgeColor: "border-black/10 bg-black/5 text-[#1A1A1A]",
    dotColor: "bg-[#6E1D25]",
  },
  {
    step: "05",
    title: "Roll, Cut, and Enjoy!",
    description: "Roll the sheet tightly into a cylinder, cut it into bite-sized segments, and dive into authentic Tibetan comfort.",
    bgColor: "bg-[#D4A843] border border-[#B38C2B]", // Mustard Gold
    textColor: "text-[#1A1A1A]",
    descriptionColor: "text-[#33221C]/80",
    accentColor: "text-[#6E1D25]",
    tag: "Ready to Eat",
    badgeColor: "border-black/15 bg-black/5 text-[#1A1A1A]",
    dotColor: "bg-[#6E1D25]",
  },
];

export function PreparationScrollStack() {
  return (
    <section className="bg-[#FFFFFF] border-t border-[rgba(26,26,26,0.08)] py-20 lg:py-28 relative overflow-visible">
      {/* Title */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6E1D25]/10 border border-[#6E1D25]/30 rounded-full text-[10px] font-bold text-[#6E1D25] uppercase tracking-wider mb-4">
          <ChefHat className="h-3.5 w-3.5" />
          Easy 3-Minute Ritual
        </div>
        <h2
          className="text-[#1A1A1A]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "clamp(32px, 5vw, 64px)",
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
          }}
        >
          How to Assemble
        </h2>
        <p className="text-gray-500 text-sm mt-3 flex items-center gap-1.5 justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
          Scroll to stack steps<MoveDown className="h-3.5 w-3.5 animate-bounce" />
        </p>
      </div>

      {/* Stack Area */}
      <div className="relative max-w-[880px] mx-auto h-[600px] md:h-[650px] px-4 md:px-0">
        <ScrollStack
          useWindowScroll={false}
          baseScale={0.88}
          itemScale={0.03}
          itemDistance={40}
          itemStackDistance={15}
          rotationAmount={1.5}
          blurAmount={0.8}
        >
          {STEPS.map((step, i) => (
            <ScrollStackItem
              key={step.step}
              itemClassName={`${step.bgColor} shadow-2xl flex flex-col justify-between overflow-hidden`}
            >
              {/* Card Top */}
              <div className="flex items-start justify-between w-full">
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${step.badgeColor}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {step.tag}
                </span>
                <span
                  className={`text-6xl font-black ${step.accentColor} leading-none select-none`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {step.step}
                </span>
              </div>

              {/* Card Center */}
              <div className="my-auto pt-4">
                <h3
                  className={`text-2xl md:text-3xl font-black ${step.textColor} mb-3 flex items-center gap-2`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {step.title}
                  {i === STEPS.length - 1 && <Sparkles className="h-5 w-5 text-[#6E1D25] animate-pulse" />}
                </h3>
                <p
                  className={`text-xs md:text-sm leading-relaxed ${step.descriptionColor}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {step.description}
                </p>
              </div>

              {/* Card Bottom Decor */}
              <div className="flex justify-between items-center w-full pt-4 border-t border-white/5">
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${
                  step.textColor === "text-[#FAFAF8]" ? "text-white/40" : "text-black/40"
                }`}>
                  Ritual Portion · Step {i + 1}
                </span>
                <div className="flex gap-1.5">
                  {Array.from({ length: STEPS.length }).map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        dotIdx === i 
                          ? step.dotColor
                          : step.textColor === "text-[#FAFAF8]" ? "bg-white/10" : "bg-black/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
