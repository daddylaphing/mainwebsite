"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, X } from "lucide-react";

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SuggestionModal({ isOpen, onClose, onConfirm }: SuggestionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#141210] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-10"
          >
            {/* Header Accent Bar */}
            <div className="h-1.5 w-full bg-[#d61f26]" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#d61f26]/10 flex items-center justify-center mb-6">
                <ShoppingBag className="h-6 w-6 text-[#d61f26]" />
              </div>

              <h3
                className="text-white font-black text-xl mb-3 leading-snug"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Better Value, One Kit Away
              </h3>

              <div className="space-y-3 text-sm leading-relaxed text-[#fbdbd8]/70 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p>
                  You&apos;re just one more kit away from{" "}
                  <span className="text-white font-bold">better value.</span>
                </p>
                <div className="p-4 rounded-xl bg-[#1c1a18] border border-white/5 text-xs text-left space-y-2">
                  <p className="flex items-center gap-2 text-white/90">
                    <span className="font-semibold">Why add another kit?</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-white/60">
                    <li>More value than buying extra sheets separately</li>
                    <li>Complete kit with all ingredients included</li>
                    <li>Same ₹50 — full Laphing experience</li>
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col w-full gap-2.5">
                <button
                  onClick={onConfirm}
                  className="w-full flex items-center justify-center gap-2 bg-[#d61f26] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#d61f26]/90 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif", boxShadow: "0 0 20px rgba(214,31,38,0.25)" }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add Another Kit
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-white/40 hover:text-white text-xs font-semibold py-2.5 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
