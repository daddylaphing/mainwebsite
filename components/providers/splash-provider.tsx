"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Elegant linger delay for the brand entry (1.8s)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#090909] z-[9999] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background glowing gradients */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#E7B52C]/15 rounded-full blur-[80px]"
              />
            </div>

            <div className="flex flex-col items-center relative z-10">
              {/* Animated outer rings */}
              <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-[#E7B52C]/20 border-t-[#E7B52C] rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border border-white/5 border-b-white/20 rounded-full"
                />
                {/* Brand Logo Letter */}
                <motion.div
                  animate={{ scale: [0.92, 1.08, 0.92] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-2xl font-black text-[#E7B52C]"
                >
                  L
                </motion.div>
              </div>

              {/* Animated letter reveal */}
              <motion.h1
                initial={{ opacity: 0, letterSpacing: "-0.05em" }}
                animate={{ opacity: 1, letterSpacing: "0.22em" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-white font-black text-xl tracking-widest uppercase font-mono pl-[0.22em]"
              >
                Laphing Daddy
              </motion.h1>

              {/* Slower, smooth progress scanner bar */}
              <div className="w-36 h-[2px] bg-white/5 rounded-full mt-5 overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-[#E7B52C] to-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Content - only visible/interactive when loader completes */}
      <div className={loading ? "opacity-0 invisible overflow-hidden h-screen" : "opacity-100 transition-opacity duration-700 ease-out"}>
        {children}
      </div>
    </>
  );
}
