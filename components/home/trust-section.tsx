"use client";

import { motion } from "framer-motion";
import { Flame, BookOpen, Truck } from "lucide-react";

const WHY_CHOOSE_US = [
  {
    icon: Flame,
    title: "Fresh Daily",
    desc: "Our starch noodles are extracted and set every morning for the perfect bouncy texture.",
  },
  {
    icon: BookOpen,
    title: "Authentic Recipe",
    desc: "Staying true to Tibetan roots with our proprietary spice blend and gluten extraction method.",
  },
  {
    icon: Truck,
    title: "Quick Delivery",
    desc: "Vacuum-sealed freshness delivered straight to your door in custom insulated packaging.",
  },
];

export function TrustSection() {
  return (
    <section className="py-24 bg-[#fff1ed] dark:bg-[#141210] border-t border-[#E4DDD5] dark:border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {WHY_CHOOSE_US.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#f4ded7] dark:bg-[#2A2520] rounded-full flex items-center justify-center mb-6 text-[#942e02] dark:text-[#ffb59d]">
                <item.icon className="h-7 w-7 stroke-[2]" />
              </div>
              <h3 className="font-sans font-bold text-2xl text-[#241915] dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="font-sans text-[#615e58] dark:text-[#cac6be] text-base leading-relaxed max-w-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
