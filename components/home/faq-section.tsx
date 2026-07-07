"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is Laphing?",
    a: "Laphing is a popular Tibetan/Nepalese street food made from starchy mung bean or potato starch sheets, served with a spicy chilli oil, garlic water, and special sauce.",
  },
  {
    q: "Where do you deliver?",
    a: "We deliver to Delhi, Noida, Gurugram (Gurgaon), and Ghaziabad only.",
  },
  {
    q: "How does delivery work?",
    a: "Delivery is arranged by you (the customer) through apps like Uber, Rapido, or Porter. Our top recommendation and preferred partner is Uncle Delivery for the best rates and handling.",
  },
  {
    q: "When can I place an order?",
    a: "Customers can book orders between 3:00 PM and 6:00 PM only.",
  },
  {
    q: "What is the refund policy?",
    a: "All orders are strictly non-refundable once placed.",
  },
  {
    q: "What is the minimum order?",
    a: "Laphing Kit: minimum 2 kits per order (₹50 each). Fresh Laphing Sheet: minimum 5 sheets (₹20 each). Cheese Corn Dog: no minimum. Packaging charge of ₹30 applies per order (₹50 for bulk orders above 10 kits).",
  },
  {
    q: "Are the sheets made fresh?",
    a: "Yes! All laphing sheets are made fresh to order every morning. We do not use any preservatives. Consume within 2 days of delivery.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-transparent py-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col items-center md:items-start"
        >
          <h2 className="font-black text-3xl md:text-4xl text-[#F8F5EE]" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Frequently Asked Questions
          </h2>
          <div className="h-[3px] w-12 bg-[#E7B52C] rounded-full mt-3" />
        </motion.div>

        <div className="max-w-2xl space-y-2 mx-auto md:mx-0">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left group"
                aria-expanded={open === i}
              >
                <span className="text-[#F8F5EE] font-medium pr-4 transition-colors group-hover:text-[#E7B52C]">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180 text-[#E7B52C]" : "text-white/40"}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-4 text-[#C7BFB3] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
