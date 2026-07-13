"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Context so any component can know when splash has fully exited ────────────
interface SplashContextType {
  splashDone: boolean;
}
export const SplashContext = createContext<SplashContextType>({ splashDone: false });
export const useSplash = () => useContext(SplashContext);


const CULINARY_STEPS = [
  "Preheating the traditional steamers...",
  "Gently lifting fresh starch sheets...",
  "Tempering the slow-cooked chilli oil...",
  "Glazing with custom spice dust...",
  "Infusing fresh garlic water...",
  "Plating Tibetan comfort...",
];

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  const [splashDone, setSplashDone] = useState(false);

  // Cycle through culinary steps for restaurant pacing (every 1.5s)
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % CULINARY_STEPS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    // Premium initial brand linger delay (2.8s) to show the elegant story-loader
    const timer = setTimeout(() => {
      setLoading(false);
      // Mark splash fully done after exit animation (0.8s) completes
      setTimeout(() => setSplashDone(true), 800);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#FAFAF8] z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          >
            {/* Loading Background Texture */}
            <div 
              className="absolute inset-0 z-0 opacity-90 pointer-events-none" 
              style={{
                backgroundImage: "url('/loadingbg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Decorative ambient gold glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#D4A843]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-[#6E1D25]/3 rounded-full blur-[90px] pointer-events-none" />

            {/* Content Container */}
            <div className="flex flex-col items-center relative z-10 text-center px-6">
              
              {/* Restaurant Branding Tag */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
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

              {/* Steamer & Chopsticks SVG Loader */}
              <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
                
                {/* Dashed outer gold spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-[#D4A843]/30 rounded-full"
                />
                
                {/* Solid thin inner track spinner */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border border-[#1A1A1A]/5 rounded-full"
                />

                {/* Vector Steamer Icon */}
                <svg 
                  width="52" 
                  height="52" 
                  viewBox="0 0 64 64" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10"
                >
                  {/* Dynamic rising steam paths */}
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

                  {/* Bowl/Steamer outline */}
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
                  <line x1="20" y1="42" x2="44" y2="42" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="24" y1="48" x2="40" y2="48" stroke="#1A1A1A" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Chopsticks holding laphing noodles */}
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
                    <line x1="10" y1="20" x2="48" y2="28" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="17" x2="50" y2="26" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
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
              <div className="h-8 overflow-hidden relative w-64 md:w-80">
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

              {/* Slower, smooth progress scanner bar */}
              <div className="w-36 h-[2px] bg-[#1A1A1A]/5 rounded-full mt-6 overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-[#D4A843] to-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Content - only visible/interactive when loader completes */}
      <SplashContext.Provider value={{ splashDone }}>
        <div
          className={loading ? "opacity-0 invisible overflow-hidden h-screen" : "opacity-100 transition-opacity duration-700 ease-out"}
        >
          {children}
        </div>
      </SplashContext.Provider>
    </>
  );
}
