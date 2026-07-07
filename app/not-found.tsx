"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center px-4 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E7B52C]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <p
          className="text-[140px] md:text-[200px] font-black text-white/5 leading-none select-none"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          404
        </p>

        <div className="-mt-12 md:-mt-20">
          <h1
            className="text-3xl md:text-5xl font-black text-white mb-3"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
          >
            PAGE NOT <span className="text-[#E7B52C]">FOUND</span>
          </h1>
          <p
            className="text-[#C7BFB3] text-base md:text-lg mb-10 max-w-md mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#E7B52C] text-black font-bold px-6 py-3 rounded-[14px] hover:bg-[#F4C542] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif", boxShadow: "0 8px 20px rgba(231,181,44,0.15)" }}
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 border border-white/10 text-[#C7BFB3] font-bold px-6 py-3 rounded-[14px] hover:bg-white/5 hover:text-white transition-colors"
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
