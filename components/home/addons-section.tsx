"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Layers } from "lucide-react";

const ADDONS = [
  {
    id: "sheet",
    name: "Extra Sheet",
    price: 20,
    icon: Layers,
    image: null,
  },
  {
    id: "chili",
    name: "Chilli Oil",
    price: 15,
    icon: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClgDGSj2MvrRKnCyQvRf5hR26ClEsZHv5_9oVXPExfJnIt11PXwcrv6IuyCP3nU0cg2eFpMRWHL9HQr1yT8rxllIzYLBqnyMvybWY-_sbDGkIbc7wMNe6IFgpd5Kx9k-45692xE1Z6ndVz8efCdxIQSFaT7PnDFGcVqiCWWyW_EUjnC3JQ947AeCIjhFIPhIvm9ptKIoaifhdrojiD2slT_EoTQt_2vwDzsquRCdfZmMhCAx-Ngv5kU24Wf5Gel97KthQZiDjFisA",
  },
  {
    id: "garlic",
    name: "Garlic Water",
    price: 10,
    icon: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBE1escMZ2XpAKgYpGryURihqjikyEj7e4gb2AWeyQTrIOWQsM78JnhV5d--6kRwVt4MiQadAk25tK-ywHoIP_hrpddZzdN7UH-EfH8NGteiscTKSUgtZJg_4GdjYCF21rG8wgxoOyPD5mxcQTw5vyv7ngw8CTV65bgsJ1RtXTe27m2KbIBmeoja16XH0D_FyJngCEKwYlZYlbf2X92cfOOSPkkpRppCC98wO87eVRDVyqt7pa8oW2PMcglJR0mUm22A90rDgUXQ50",
  },
];

export function AddonsSection() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    sheet: 0,
    chili: 0,
    garlic: 0,
  });

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  const setQuantity = (id: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  return (
    <section className="pt-20 pb-20 border-t border-white/5">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-bold text-[32px] text-white mb-6 leading-[1.3]"
        style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.01em" }}
      >
        ADD EXTRA (A LA CARTE)
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-[#C7BFB3] mb-12 text-[16px] leading-[1.5]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Customize your experience with additional portions.
      </motion.p>

      <div className="flex flex-col gap-4">
        {ADDONS.map((addon, index) => (
          <motion.div
            key={addon.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-[#141414] border border-white/[0.08] rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-[#111111] flex items-center justify-center border border-white/[0.08] overflow-hidden">
                {addon.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={addon.image} alt={addon.name} className="w-full h-full object-cover rounded opacity-80" />
                ) : addon.icon ? (
                  <addon.icon className="text-white/50" size={24} />
                ) : null}
              </div>
              <div>
                <h4
                  className="font-bold text-white text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {addon.name}
                </h4>
                <p className="text-xs text-[#E7B52C] font-semibold">₹{addon.price}</p>
              </div>
            </div>

            <div className="flex items-center bg-[#111111] border border-white/[0.08] rounded-lg overflow-hidden h-8">
              <button
                onClick={() => updateQuantity(addon.id, -1)}
                className="px-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm"
              >
                -
              </button>
              <input
                className="w-8 bg-transparent border-none text-center text-white text-xs focus:ring-0 p-0"
                type="number"
                min="0"
                value={quantities[addon.id]}
                onChange={(e) => setQuantity(addon.id, parseInt(e.target.value) || 0)}
              />
              <button
                onClick={() => updateQuantity(addon.id, 1)}
                className="px-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm"
              >
                +
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
