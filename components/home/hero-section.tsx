"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import BlurText from "@/components/ui/blur-text";
import { useSplash } from "@/components/providers/splash-provider";

// ─── Framer Motion variants ───────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] as any },
});

// Character-split stagger group
const charContainer = (delay = 0) => ({
  initial: "hidden",
  animate: "show" as "show" | "hidden",
  variants: {
    hidden: {},
    show: { transition: { staggerChildren: 0.038, delayChildren: delay } },
  },
});

const charVariant = {
  hidden: { y: "135%", opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] as any },
  },
};

// ─── Split-text character animator ───────────────────────────────────────────
function SplitChars({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      {...charContainer(delay)}
      style={{ display: "inline-block", whiteSpace: "nowrap" }}
      aria-hidden
    >
      {text.split("").map((ch, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
          <motion.span variants={charVariant} style={{ display: "inline-block" }}>
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// ─── Inline Typewriter — pure setTimeout, no observer ────────────────────────
function Typewriter({
  text,
  startDelay = 1200,
  speed = 28,
  className = "",
}: {
  text: string;
  startDelay?: number;
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let intervalId: ReturnType<typeof setInterval>;
    const timerId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, ++i));
        } else {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [text, startDelay, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{displayed}</span>
      {!done && (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "#7A7570",
            verticalAlign: "text-bottom",
            marginLeft: "2px",
            animation: "tw-cursor-blink 0.85s step-end infinite",
          }}
        />
      )}
      <style>{`
        @keyframes tw-cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

// ─── Animated SVG underline ───────────────────────────────────────────────────
function DrawUnderline() {
  return (
    <svg width="240" height="14" viewBox="0 0 240 14" fill="none" aria-hidden className="overflow-visible">
      <motion.path
        d="M4 9 C50 3, 100 12, 150 7 S210 11, 236 8"
        stroke="#D4A843"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────
export function HeroSection() {
  const { splashDone } = useSplash();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Bowl tilt from mouse
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  // Subtle text parallax from mouse
  const textX = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  // Scroll animations
  const { scrollY } = useScroll();
  const plateScale = useTransform(scrollY, [0, 600], [1, 0.82]);
  const plateScrollY = useTransform(scrollY, [0, 600], [0, 60]);
  const contentOpacity = useTransform(scrollY, [0, 280], [1, 0]);
  const contentY = useTransform(scrollY, [0, 280], [0, -40]);
  const bowlScrollRotate = useTransform(scrollY, [0, 1000], [0, 360]);

  // Steam canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const W = (canvas.width = 240);
    const H = (canvas.height = 300);

    class Particle {
      x: number; y: number; vx: number; vy: number;
      alpha: number; size: number; fadeSpeed: number;
      constructor() {
        this.x = W / 2 + (Math.random() - 0.5) * 70;
        this.y = H - 60;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -0.5 - Math.random() * 0.55;
        this.alpha = 0.01;
        this.size = 14 + Math.random() * 20;
        this.fadeSpeed = 0.001 + Math.random() * 0.002;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < H / 2) this.alpha -= this.fadeSpeed * 1.5;
        else if (this.alpha < 0.12) this.alpha += 0.002;
      }
      draw(c: CanvasRenderingContext2D) {
        c.save();
        const g = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        g.addColorStop(0, `rgba(255,255,255,${this.alpha})`);
        g.addColorStop(0.6, `rgba(255,255,255,${this.alpha * 0.15})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    let particles: Particle[] = [];
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      if (particles.length < 12 && Math.random() < 0.05) particles.push(new Particle());
      particles = particles.filter(p => p.alpha > 0 && p.y > 0);
      particles.forEach(p => { p.update(); p.draw(ctx); });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  };

  return (
    <header
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen lg:h-screen flex items-center justify-center overflow-hidden py-12 lg:py-0"
      style={{ background: "#F7F3EC", perspective: "1400px" }}
    >
      {/* ── Main Background with Wooden Log ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.png"
          alt="Warm backdrop with wooden log table"
          fill priority quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F7F3EC]/30" />
      </div>

      {/* ── Ambient spice flakes ───────────────────────────────────── */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[
          { top: "22%", right: "16%", w: 12, h: 12, color: "#6E1D25", delay: 0, dur: 7 },
          { top: "55%", right: "33%", w: 8, h: 10, color: "#D4A843", delay: 1.2, dur: 8 },
          { top: "40%", right: "48%", w: 10, h: 6, color: "#6E1D25", delay: 2, dur: 6 },
          { top: "68%", right: "20%", w: 6, h: 6, color: "#D4A843", delay: 0.5, dur: 9 },
          { top: "30%", right: "28%", w: 8, h: 8, color: "#8B3A3A", delay: 1.8, dur: 7.5 },
        ].map((f, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 5, 0], rotate: [0, 40, -25, 0] }}
            transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
            style={{
              position: "absolute", top: f.top, right: f.right,
              width: f.w, height: f.h,
              backgroundColor: f.color,
              borderRadius: "50%",
              opacity: 0.45,
              x: useTransform(springX, [-0.5, 0.5], [-18, 18]),
            }}
          />
        ))}
      </div>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 min-h-full flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 pt-16 lg:pt-0">

        {/* LEFT — Text Column */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY, x: textX }}
          className="w-full lg:w-[48%] flex flex-col items-start text-left gap-5 lg:gap-6"
        >
          {/* Heritage tag */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex items-center gap-2.5"
          >
            <span className="w-1.5 h-1.5 bg-[#6E1D25] rounded-full" />
            <span
              className="text-[#6E1D25] text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.25em]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Heritage Tibetan Brand
            </span>
            <motion.span
              className="h-px bg-[#6E1D25] opacity-60 inline-block"
              initial={{ width: 0 }}
              animate={{ width: 36 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            />
          </motion.div>

          {/* Headline */}
          <div className="flex flex-col gap-0.5">
            {/* "The Art Of" — simple slide-up */}
            <div style={{ overflow: "hidden" }}>
              <motion.h2
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.72, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#1A1A1A] font-light italic leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(24px, 4vw, 40px)",
                  fontWeight: 300,
                }}
              >
                The Art Of
              </motion.h2>
            </div>

            {/* AUTHENTIC — character split */}
            <h1
              className="text-[#1A1A1A] font-black tracking-tight leading-none"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(46px, 8vw, 86px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
              aria-label="Authentic Laphing"
            >
              <BlurText
                text="AUTHENTIC"
                delay={50}
                animateBy="letters"
                direction="bottom"
                className="text-[#1A1A1A] font-black inline-flex"
                trigger={splashDone}
              />
              <br />
              <BlurText
                text="LAPHING"
                delay={50}
                animateBy="letters"
                direction="bottom"
                className="text-[#1A1A1A] font-black inline-flex"
                trigger={splashDone}
              />
            </h1>

            {/* Drawn underline */}
            <DrawUnderline />
          </div>

          {/* Typewriter subtitle */}
          <p
            className="text-[#4A4540] text-[15px] sm:text-base leading-relaxed max-w-md"
            style={{ fontFamily: "'Inter', sans-serif", minHeight: "3.5em" }}
          >
            <Typewriter
              text="Artisanal cold starch sheets, glazed in aromatic garlic water, slow-cooked chilli oil, and traditional Tibetan spice dust. Crafted fresh, delivered straight."
              startDelay={1300}
              speed={26}
            />
          </p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="flex items-center gap-6 md:gap-8"
          >
            {[
              { value: "500+", label: "Happy Customers" },
              { value: "3 min", label: "Ready in" },
              { value: "4.9★", label: "Avg Rating" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span
                  className="text-[#1A1A1A] font-bold text-base sm:text-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-[#4A4540] text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              onClick={scrollToProducts}
              className="group relative inline-flex items-center gap-2.5 bg-[#1A1A1A] text-white px-9 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full shadow-[0_12px_30px_rgba(26,26,26,0.2)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(110,29,37,0.3)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Hover fill from left */}
              <motion.span
                className="absolute inset-0 bg-[#6E1D25]"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
              <span className="relative z-10">Order Now</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* RIGHT — Bowl on wooden log table */}
        <div className="hidden lg:flex lg:w-[52%] items-end justify-end pb-[13vh] pr-[0.9vw] h-full">
          <motion.div
            style={{
              scale: plateScale,
              y: plateScrollY,
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-[clamp(220px,30vw,480px)] aspect-[4/3] flex items-center justify-center origin-center"
          >
            {/* Steam */}
            <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-25 mix-blend-screen">
              <canvas ref={canvasRef} className="w-[240px] h-[300px]" />
            </div>

            {/* Static shadow on the wooden log table top */}
            <div
              className="absolute bottom-[2%] left-[10%] w-[80%] h-8 pointer-events-none z-0"
              style={{
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(12px)",
              }}
            />

            {/* Floating bowl */}
            <motion.div
              animate={{ y: [0, -14, 4, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full flex items-center justify-center z-10"
            >
              <div className="w-full h-full flex items-center justify-center select-none pointer-events-none">
                <Image
                  src="/bowl.png"
                  alt="Tibetan Laphing Bowl on wooden log table"
                  width={580}
                  height={435}
                  priority
                  quality={95}
                  className="object-contain scale-[1.15]"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
