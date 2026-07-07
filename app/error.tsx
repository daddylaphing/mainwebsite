"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to monitoring service in production
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#6E1D25]/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-[#6E1D25]/20 border border-[#6E1D25]/40 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-[#E7B52C]" />
        </div>

        <h1
          className="text-3xl font-black text-white mb-3"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
        >
          Something went wrong
        </h1>
        <p
          className="text-[#C7BFB3] text-sm mb-8 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          We encountered an unexpected error. Our team has been notified. You can try again or return home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-[#6E1D25] text-white font-bold px-6 py-3 rounded-[14px] hover:bg-[#8B252E] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", boxShadow: "0 8px 20px rgba(110,29,37,0.15)" }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-white/10 text-[#C7BFB3] font-bold px-6 py-3 rounded-[14px] hover:bg-white/5 hover:text-white transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
