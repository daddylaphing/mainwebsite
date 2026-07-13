"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const INGREDIENTS = [
  {
    name: "Chilli Oil",
    desc: "Slow-cooked, handcrafted with whole spices. The soul of laphing.",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLvBuRYxFMqCo4-l1h0AX9jYFUUcDpq5EKOjIwbpJEK7HWxgzy0wW_hNdJM43i8KePHovpHSv-k5ugua0pYTXyhYq6kNKLOlQqOkkEW8vHW3dbu4Zwj4HyN0Ti7uGPN1se8_CPCb-ImGGGeGPuVqn-fUV5D63ceUERr0FIR7lM0lXhpOlCaT6eSDdM7KbCgVu_kzGxfYq-lwmSLRNpJA57vTmICENK7gDt93Aldtetl_8oMffkkB0u3w290",
    delay: 0,
    rotateRange: [0, 8, -4, 0],
    yRange: [0, -18, 12, 0],
  },
  {
    name: "Garlic Water",
    desc: "Aromatic and bright. Builds the delicate base flavor of every sheet.",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLub7DjxWevkd0HyPBF-WWmTexGnYACDC6J378IdZM_NaUc4PwG5wmOw7vcFOP1R0U8VWMmsGYAn_6noBZ7XtMB8M13EtTtkqnIOUeuSgAwkJx_zPdvq9Q3An62saqKQuZf_49H0mul2COV-25V1oNV9QQoKyPbXEHND7Mi9mVhgPKdU4rfdAS7JgB5bousAZf3yH-MKkJ_-PnXQWT7kFTOYkE900mAs6LWhh2oLxUFNwh0SGGrh7GPP8_M",
    delay: 0.1,
    rotateRange: [0, -6, 8, 0],
    yRange: [0, 14, -14, 0],
  },
  {
    name: "Laphing Sheet",
    desc: "Made fresh from mung bean starch. Silky, chewy, and handset every morning.",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLs1dRNSwRoNwzz6lIT2B61o0jtNxVh_H5nZVImv2JlnYBpPqmJe3hW_MSxGbB1my_6jv-0TpvOjQcwwr-RhzCEfzL33EvK94c61qbWFrelKc0YiuXgqtGIono9Rvv1uHWMefDhdIH5vgFUdhMs74PQL9UKwpi0LqYMqA08ZCJdD6d-g5qcVDxeZlSqIHh5nq0JZ7Mo97IuFtwrKRMBl26FIYwNlaBf6qjLkVuN6KcvMuyupGLezWquQ17c",
    delay: 0.2,
    rotateRange: [0, 4, -8, 0],
    yRange: [0, -22, 10, 0],
  },
  {
    name: "Spice Mix",
    desc: "A secret proprietary blend. Ties together heat, umami and warmth.",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLsAq-flFff5_tFKm3lw3RQLcPR6pICuavMOQJy8gj-Tu0kiTvc1VLSdbkb3Mr0o_aOkJP_ZWX-hGvHWW2fixK1-PXds4HQ1pbP_MWzdQKlgUCEXXNrVSkqvlVs4nfB1z3dIFapuUn_WW00mBKbAKwPHK-HMVu8APBFFPFfKFgH9A063zaoKAxV2hPGZQBzgiSxzRdcadkt1xOX1IQqzZoBKN7AbB7oIV6-GCdrN8KGB9vH6CnEpTCwQDx8",
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
              className="flex flex-col items-center text-center group"
            >
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
                className="w-32 h-32 md:w-44 md:h-44 relative mb-6 cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 bg-[#F7F3EC] rounded-full transition-colors duration-300 group-hover:bg-[#EAE4D8]" />
                <Image
                  src={ing.imageUrl}
                  alt={ing.name}
                  fill
                  unoptimized
                  className="object-contain p-4 drop-shadow-[0_12px_24px_rgba(26,26,26,0.08)]"
                  sizes="(max-width: 768px) 128px, 176px"
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
                className="text-[#1A1A1A] text-lg md:text-xl font-bold mb-2 group-hover:text-[#D4A843] transition-colors"
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
