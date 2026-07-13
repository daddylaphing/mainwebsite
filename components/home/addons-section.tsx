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
    <section className="pt-20 pb-20 border-t border-[#E6DFD5]">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-bold text-[28px] text-[#1A1A1A] mb-4 leading-[1.3]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Add Extra (A La Carte)
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="text-[#7A7570] mb-8 text-[14px] leading-[1.5]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Customize your experience with additional portions.
      </motion.p>

      <div className="flex flex-col gap-3">
        {ADDONS.map((addon, index) => (
          <motion.div
            key={addon.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white border border-[#E6DFD5] rounded-xl hover:bg-[#F7F3EC]/30 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#F7F3EC] flex items-center justify-center border border-[#E6DFD5]/40 overflow-hidden shrink-0">
                {addon.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={addon.image} alt={addon.name} className="w-full h-full object-cover rounded" />
                ) : addon.icon ? (
                  <addon.icon className="text-[#7A7570]" size={20} />
                ) : null}
              </div>
              <div>
                <h4
                  className="font-bold text-[#1A1A1A] text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {addon.name}
                </h4>
                <p className="text-xs text-[#6E1D25] font-semibold">₹{addon.price}</p>
              </div>
            </div>

            <div className="flex items-center bg-[#F7F3EC] border border-[#E6DFD5] rounded-lg overflow-hidden h-8">
              <button
                onClick={() => updateQuantity(addon.id, -1)}
                className="px-3 text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#E6DFD5]/40 transition-colors text-sm font-semibold"
              >
                -
              </button>
              <input
                className="w-8 bg-transparent border-none text-center text-[#1A1A1A] text-xs font-semibold focus:ring-0 p-0"
                type="number"
                min="0"
                value={quantities[addon.id]}
                onChange={(e) => setQuantity(addon.id, parseInt(e.target.value) || 0)}
              />
              <button
                onClick={() => updateQuantity(addon.id, 1)}
                className="px-3 text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#E6DFD5]/40 transition-colors text-sm font-semibold"
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
