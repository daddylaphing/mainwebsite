"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A843]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <p
          className="text-[140px] md:text-[200px] font-black text-[#1A1A1A]/5 leading-none select-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          404
        </p>

        <div className="-mt-12 md:-mt-20">
          <h1
            className="text-3xl md:text-5xl font-black text-[#1A1A1A] mb-3"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}
          >
            PAGE NOT <span className="text-[#6E1D25]">FOUND</span>
          </h1>
          <p
            className="text-[#7A7570] text-base md:text-lg mb-10 max-w-md mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 border border-[#E6DFD5] text-[#4A4540] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-all"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Search className="h-4 w-4" />
              Browse Products
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
