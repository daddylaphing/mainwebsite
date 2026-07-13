"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import { TiltCard } from "@/components/ui/tilt-card";

const INGREDIENTS = [

  {
    name: "Chilli Oil",
    desc: "Slow-cooked, handcrafted with whole spices. The soul of laphing.",
    imageUrl: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/signaturechillioil.png",
    delay: 0,
    rotateRange: [0, 8, -4, 0],
    yRange: [0, -18, 12, 0],
  },
  {
    name: "Garlic Water",
    desc: "Aromatic and bright. Builds the delicate base flavor of every sheet.",
    imageUrl: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/garlicwater.png",
    delay: 0.1,
    rotateRange: [0, -6, 8, 0],
    yRange: [0, 14, -14, 0],
  },
  {
    name: "Laphing Sheet",
    desc: "Made fresh from mung bean starch. Silky, chewy, and handset every morning.",
    imageUrl: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/freshlaphingsheet.png",
    delay: 0.2,
    rotateRange: [0, 4, -8, 0],
    yRange: [0, -22, 10, 0],
  },
  {
    name: "Spice Mix",
    desc: "A secret proprietary blend. Ties together heat, umami and warmth.",
    imageUrl: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/seasoningmix.png",
    delay: 0.3,
    rotateRange: [0, -8, 6, 0],
    yRange: [0, -12, 16, 0],
  },
];

export function IngredientsSection() {
  return (
    <section id="ingredients" className="bg-[#FFFFFF] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-24 md:py-32">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 md:mb-24">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-px bg-[#D4A843]" />
              <span
                className="text-label-caps text-[#D4A843]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                What&#39;s Inside — 03
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
              The Ingredients
            </h2>
          </div>
          <p
            className="text-[#7A7570] text-base max-w-xs leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Every kit contains everything you need. No additional pantry items required.
          </p>
        </div>

        {/* Ingredients grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12" style={{ perspective: "1000px" }}>
          {INGREDIENTS.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: ing.delay, ease: [0.16, 1, 0.3, 1] }}
              className="flex"
            >
              <TiltCard className="flex flex-col items-center text-center group cursor-pointer w-full bg-[#FAFAF8]/50 border border-[rgba(26,26,26,0.05)] rounded-2xl p-6 hover:bg-[#F7F3EC]/40 transition-colors duration-300">
                {/* Floating ingredient image with 3D Rotation */}
                <motion.div 
                  animate={{
                    y: ing.yRange,
                    rotateY: ing.rotateRange,
                    rotateX: ing.yRange.map(val => val * 0.3),
                  }}
                  transition={{
                    duration: 8 + i * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.08, rotateY: 15 }}
                  className="w-24 h-24 md:w-32 md:h-32 relative mb-6 cursor-pointer rounded-full overflow-hidden"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 bg-[#F7F3EC] rounded-full transition-colors duration-300 group-hover:bg-[#EAE4D8]" />
                  <Image
                    src={getProxiedImageUrl(ing.imageUrl)}
                    alt={ing.name}
                    fill
                    unoptimized
                    className="object-cover rounded-full drop-shadow-[0_12px_24px_rgba(26,26,26,0.08)]"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                  {/* Subtle shadow */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-[rgba(26,26,26,0.06)] rounded-full blur-sm" />
                </motion.div>

                {/* Number */}
                <span
                  className="text-label-caps text-[#D4A843] mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  0{i + 1}
                </span>

                {/* Name */}
                <h3
                  className="text-[#1A1A1A] text-lg font-bold mb-2 group-hover:text-[#D4A843] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {ing.name}
                </h3>

                {/* Description */}
                <p
                  className="text-[#7A7570] text-[13px] leading-relaxed max-w-[200px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {ing.desc}
                </p>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 md:mt-24 pt-10 border-t border-[rgba(26,26,26,0.08)]"
        >
          <p
            className="text-[#A09890] text-[13px] text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            All ingredients are freshly prepared. No preservatives. Best consumed within 2 days of delivery.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
