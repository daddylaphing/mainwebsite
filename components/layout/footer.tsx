"use client";

import Link from "next/link";
import { Camera, MessageCircle, Phone, ArrowUpRight } from "lucide-react";

const LINK_GROUPS = [
  {
    heading: "Menu",
    links: [
      { href: "/#products", label: "Products" },
      { href: "/how-it-works", label: "How to Prepare" },
      { href: "/#faq", label: "FAQ" },
      { href: "/#contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/refund", label: "Refund Policy" },
      { href: "/shipping", label: "Shipping Policy" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    heading: "Contact",
    links: [
      { href: "tel:9873052538", label: "9873052538" },
      { href: "tel:9354775439", label: "9354775439" },
      { href: "tel:9211969977", label: "Bulk: 9211969977" },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com/laphingdaddy", icon: Camera, label: "Instagram", ariaLabel: "Follow us on Instagram" },
  { href: "https://wa.me/919354775439", icon: MessageCircle, label: "WhatsApp", ariaLabel: "Chat with us on WhatsApp" },
  { href: "tel:9873052538", icon: Phone, label: "Call", ariaLabel: "Call us" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] text-[#FAFAF8]">
      {/* Top story strip */}
      <div className="border-b border-white/[0.06] overflow-hidden">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-marquee flex items-center shrink-0">
              {["HANDCRAFTED", "AUTHENTIC", "TIBETAN", "FRESH DAILY", "DELHI NCR"].map((text) => (
                <span key={text} className="inline-flex items-center gap-6 px-6 py-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-label-caps text-[#D4A843] text-[10px] tracking-[0.15em]">{text}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D4A843]/40" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main body */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-14 md:gap-20">

          {/* Left: brand */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div>
              <div
                className="text-[40px] font-bold text-[#FAFAF8] leading-none tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em" }}
              >
                Laphing <span className="italic text-[#D4A843]">Daddy</span>
              </div>
              <p
                className="text-[#7A7570] text-[13px] leading-relaxed mt-4 max-w-[280px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Authentic Tibetan Laphing delivered to your doorstep. Premium kits, fresh sheets — straight from our kitchen.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#D4A843]" />
              <span
                className="text-[10px] text-[#7A7570] uppercase tracking-[0.1em] font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Delhi · Noida · Gurugram · Ghaziabad
              </span>
            </div>

            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.ariaLabel}
                  className="group flex items-center gap-1.5 border border-white/[0.1] px-3 py-2 text-[#7A7570] hover:text-[#D4A843] hover:border-[#D4A843]/40 transition-all duration-200 text-[11px] font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <s.icon className="h-3 w-3" />
                  {s.label}
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: links */}
          <div className="grid grid-cols-3 gap-8 md:gap-14">
            {LINK_GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/20 mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {group.heading}
                </p>
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-[#7A7570] hover:text-[#D4A843] transition-colors duration-150 font-medium leading-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p
              className="text-[11px] text-white/20 tracking-widest uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              © 2025 Laphing Daddy. All rights reserved.
            </p>
            <Link
              href="/admin"
              className="text-[11px] text-white/20 hover:text-[#D4A843] tracking-widest uppercase transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Admin Portal
            </Link>
          </div>
          <p
            className="text-[11px] text-white/15"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Made with care for laphing lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
