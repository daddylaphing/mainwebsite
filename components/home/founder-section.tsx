"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";

export function FounderSection() {
  return (
    <section id="founder" className="bg-[#FAFAF8] overflow-hidden py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-0">{/* Changed ratio to make right side narrower */}

        {/* Left: Editorial content */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 order-2 lg:order-1">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-6 h-px bg-[#D4A843]" />
            <span
              className="text-label-caps text-[#D4A843]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              The Founder — 04
            </span>
          </div>

          {/* Giant quote */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-[#D4A843] text-6xl md:text-7xl font-bold leading-none mb-6 select-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
              aria-hidden
            >
              {'“'}
            </p>
            <blockquote
              className="text-[#1A1A1A]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 500,
                fontSize: "clamp(22px, 3vw, 36px)",
                lineHeight: "1.4",
                letterSpacing: "-0.01em",
              }}
            >
              I wanted to bring the soul of Tibetan street food into every home in Delhi NCR.
            </blockquote>
          </motion.div>

          {/* Attribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 mb-10"
          >
            <div className="w-10 h-px bg-[#1A1A1A]/20 mb-5" />
            <p
              className="text-[#1A1A1A] font-bold text-xl mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Paras Chopra
            </p>
            <p
              className="text-label-caps text-[#A09890]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Founder, Laphing Daddy
            </p>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 mb-10 max-w-md"
          >
            <p
              className="text-[#7A7570] text-base leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Growing up in Delhi, Paras fell in love with the bold, spicy flavors of Tibetan laphing from street-side stalls. After months of experimenting, Laphing Daddy was born.
            </p>
            <p
              className="text-[#A09890] text-sm leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Today, every sheet is handcrafted fresh daily. Every sauce is slow-cooked to perfection. Every kit is packaged with care.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3"
          >
            <a href="tel:9873052538" className="btn-ink flex items-center gap-2 text-xs px-5 py-3">
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
            <a
              href="https://wa.me/919354775439"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-ink flex items-center gap-2 text-xs px-5 py-3"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <a
              href="https://instagram.com/laphingdaddy"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-ink flex items-center gap-2 text-xs px-5 py-3"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              Instagram
            </a>
          </motion.div>
        </div>

        {/* Right: portrait image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[400px] sm:h-[450px] lg:h-[500px] order-1 lg:order-2 overflow-hidden px-8 md:px-16 lg:px-20 flex items-center"
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[#F0EBE0]" />
            <Image
              src="/paraschopra.jpeg"
              alt="Paras Chopra — Founder of Laphing Daddy"
              fill
              className="object-cover object-[center_15%]"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            {/* Subtle bottom vignette */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAFAF8]/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
