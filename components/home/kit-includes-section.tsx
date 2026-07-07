"use client";

import { motion } from "framer-motion";

const KIT_ITEMS = [
  { name: "Fresh Laphing Sheet", note: "Handmade & freshly prepared" },
  { name: "Signature Chilli Oil", note: "Handcrafted house blend" },
  { name: "Garlic Water", note: "Aromatic essence" },
  { name: "Wai Wai", note: "Classic crunch topping" },
  { name: "Soya Granules", note: "Protein-rich texture" },
  { name: "Vinegar Mix", note: "Tangy finishing touch" },
  { name: "Spicy Peanut Sauce", note: "Nutty heat in every bite" },
  { name: "Fork", note: "Ready to eat, right out of the box" },
  { name: "Tissues", note: "Included for convenience" },
  { name: "Premium Packaging", note: "Sealed fresh, delivered clean" },
  { name: "Preparation Guide", note: "Step-by-step instructions" },
  { name: "Branding", note: "Laphing Daddy, proudly yours" },
];

export function KitIncludesSection() {
  return (
    <section className="pt-10 md:pt-20 relative" id="kit-includes">
      {/* Title with small centered mustard line */}
      <div className="flex flex-col items-center mb-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-3xl md:text-[48px] text-[#F8F5EE] leading-[1.2] text-center"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
        >
          WHAT&apos;S IN THE KIT
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[3px] w-16 bg-[#E7B52C] rounded-full mt-3 origin-center"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        className="text-center text-[#C7BFB3] text-[15px] mb-10 md:mb-12"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Everything you need — in one premium box.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="bg-[#141414] border border-white/[0.08] rounded-[20px] p-6 md:p-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-0">
          {KIT_ITEMS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
              className="flex items-start gap-3 py-3.5 border-b border-white/[0.05] last:border-0"
            >
              {/* Bullet: Mustard Yellow */}
              <span
                className="mt-[5px] shrink-0 w-2 h-2 rounded-full bg-[#E7B52C]"
                aria-hidden="true"
              />
              <div>
                <p
                  className="text-[#F8F5EE] font-semibold text-[14px] leading-snug"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.name}
                </p>
                <p
                  className="text-[#8F857B] text-[12px] mt-0.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom tag */}
        <div className="mt-6 pt-5 border-t border-white/[0.05] flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E7B52C] shrink-0" />
          <p
            className="text-[#C7BFB3] text-[13px] text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            12 items · Premium packaging · Delivered fresh
          </p>
        </div>
      </motion.div>
    </section>
  );
}
