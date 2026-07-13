"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CULINARY_STEPS = [
  "Preheating the traditional steamers...",
  "Gently lifting fresh starch sheets...",
  "Tempering the slow-cooked chilli oil...",
  "Glazing with custom spice dust...",
  "Infusing fresh garlic water...",
  "Plating with absolute intention...",
];

export default function Loading() {
  const [stepIndex, setStepIndex] = useState(0);

  // Cycle through culinary steps every 1.8 seconds for restaurant pacing
  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % CULINARY_STEPS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Plaster Shadow Background Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: "url('/plaster-wall-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
        }}
      />

      {/* Decorative ambient gold glow in top right */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#D4A843]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        
        {/* Restaurant Branding Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-2 mb-8"
        >
          <span className="w-1.5 h-1.5 bg-[#D4A843] rounded-full" />
          <span 
            className="text-[#D4A843] text-[10px] font-bold uppercase tracking-[0.25em]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            LAPHING DADDY
          </span>
          <span className="w-1.5 h-1.5 bg-[#D4A843] rounded-full" />
        </motion.div>

        {/* Premium Restaurant Steamer/Bowl SVG Loader */}
        <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
          
          {/* Animated concentric gold rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-dashed border-[#D4A843]/30 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border border-[#1A1A1A]/5 rounded-full"
          />

          {/* Steaming Ceramic Bowl and Chopsticks SVG Illustration */}
          <svg 
            width="52" 
            height="52" 
            viewBox="0 0 64 64" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Steam Line 1 */}
            <motion.path
              d="M26 14 Q24 9 26 5 T24 1"
              stroke="#D4A843"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                y: [0, -4, 0],
                opacity: [0.3, 0.8, 0.3],
                pathLength: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Steam Line 2 */}
            <motion.path
              d="M32 16 Q30 10 32 6 T30 2"
              stroke="#D4A843"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                y: [-1, -5, -1],
                opacity: [0.4, 0.9, 0.4],
                pathLength: [0.9, 1.1, 0.9]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
            {/* Steam Line 3 */}
            <motion.path
              d="M38 14 Q36 9 38 5 T36 1"
              stroke="#D4A843"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                y: [0, -3, 0],
                opacity: [0.2, 0.7, 0.2],
                pathLength: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8
              }}
            />

            {/* Steamer Basket / Bowl Main Body */}
            <motion.path
              d="M14 36 C14 48 22 54 32 54 C42 54 50 48 50 36 H14 Z"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2.5"
              strokeLinejoin="round"
              animate={{
                y: [0, -2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Steamer Pattern details */}
            <line x1="20" y1="42" x2="44" y2="42" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="24" y1="48" x2="40" y2="48" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Chopsticks holding laphing noodle sheet */}
            <motion.g
              animate={{
                rotate: [0, -2, 2, 0],
                y: [0, -1, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Chopstick 1 */}
              <line x1="10" y1="20" x2="48" y2="28" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
              {/* Chopstick 2 */}
              <line x1="12" y1="17" x2="50" y2="26" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
              {/* Starch sheet hanging */}
              <path
                d="M26 24 C28 29 32 29 34 24"
                fill="none"
                stroke="#D4A843"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </motion.g>
          </svg>
        </div>

        {/* Dynamic Culinary Stage Messages */}
        <div className="h-7 overflow-hidden relative w-64 md:w-80">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="text-[#1A1A1A] font-medium text-xs md:text-sm tracking-wide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {CULINARY_STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Loading Progress Indicator Sub-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-[#7A7570] text-[10px] uppercase tracking-widest mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Please wait a moment
        </motion.p>
      </div>

      {/* Minimalist framing/border styling for luxury feeling */}
      <div className="absolute top-6 bottom-6 left-6 right-6 border border-[#1A1A1A]/[0.03] pointer-events-none z-20" />
    </div>
  );
}
