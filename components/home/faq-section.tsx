"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [open, setOpen] = useState<number | null>(null);

  const published = faqs
    .filter((f) => f.is_published)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="faq" className="bg-[#FAFAF8]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-24 md:py-32">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16 md:mb-20">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#D4A843]" />
              <span
                className="text-label-caps text-[#D4A843]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Questions — 06
              </span>
              <div className="w-6 h-px bg-[#D4A843]" />
            </div>
            <h2
              className="text-[#1A1A1A] text-center"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(36px, 5vw, 64px)",
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
              }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <p
            className="text-[#7A7570] text-sm max-w-lg leading-relaxed text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Everything you need to know before ordering your first Laphing Daddy kit.
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          {published.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-[rgba(26,26,26,0.1)]"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group"
                aria-expanded={open === i}
              >
                <div className="flex items-center gap-6 pr-6">
                  <span
                    className="text-label-caps text-[rgba(26,26,26,0.25)] shrink-0 group-hover:text-[#D4A843] transition-colors duration-200"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-base md:text-lg font-medium transition-colors duration-200 ${open === i ? "text-[#1A1A1A]" : "text-[#444748] group-hover:text-[#1A1A1A]"}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={`shrink-0 w-8 h-8 border flex items-center justify-center transition-colors duration-200 ${open === i ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FAFAF8]" : "border-[rgba(26,26,26,0.2)] text-[#7A7570]"}`}
                >
                  <Plus className="h-4 w-4" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p
                      className="pl-14 pr-12 pb-7 text-[#7A7570] text-sm md:text-base leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {faq.answer}
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
