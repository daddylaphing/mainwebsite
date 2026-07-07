"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#090909] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#E7B52C]/10 rounded-full blur-[80px]"
        />
      </div>

      <div className="flex flex-col items-center relative z-10">
        {/* Animated outer rings */}
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-[#E7B52C]/20 border-t-[#E7B52C] rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border border-white/5 border-b-white/20 rounded-full"
          />
          {/* Brand Letter logo */}
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl font-black text-[#E7B52C]"
          >
            L
          </motion.div>
        </div>

        {/* Animated letter reveal */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "-0.05em" }}
          animate={{ opacity: 1, letterSpacing: "0.2em" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-white font-black text-xl tracking-widest uppercase font-mono pl-[0.2em]"
        >
          Laphing Daddy
        </motion.h1>

        {/* Progress Bar Indicator */}
        <div className="w-32 h-[2px] bg-white/5 rounded-full mt-4 overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-gradient-to-r from-transparent via-[#E7B52C] to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
