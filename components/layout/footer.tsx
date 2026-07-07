"use client";

import Link from "next/link";
import { Camera, MessageCircle, Phone } from "lucide-react";

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
  {
    href: "https://instagram.com/laphingdaddy",
    icon: Camera,
    label: "Instagram",
    ariaLabel: "Follow us on Instagram",
  },
  {
    href: "https://wa.me/919354775439",
    icon: MessageCircle,
    label: "WhatsApp",
    ariaLabel: "Chat with us on WhatsApp",
  },
  {
    href: "tel:9873052538",
    icon: Phone,
    label: "Call us",
    ariaLabel: "Call us",
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#090909] border-t border-white/[0.06]">
      {/* Main footer body */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-16">

          {/* Left — Brand block */}
          <div className="flex flex-col gap-5 max-w-xs">
            {/* Wordmark */}
            <div>
              <div
                className="font-black text-[32px] md:text-[38px] text-white leading-none tracking-tight"
                style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.03em" }}
              >
                Laphing <span className="text-[#E7B52C]">Daddy</span>
              </div>
              <p
                className="text-[#8F857B] text-[13px] leading-relaxed mt-2.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Authentic Tibetan Laphing delivered to your doorstep. Premium kits, fresh sheets — straight from our kitchen.
              </p>
            </div>

            {/* Delivery badge */}
            <div className="flex items-center gap-2 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E7B52C] shrink-0" />
              <span
                className="text-[11px] text-[#8F857B] uppercase tracking-[0.08em] font-semibold"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Delhi · Noida · Gurugram · Ghaziabad
              </span>
            </div>

            {/* Social pills */}
            <div className="flex gap-2 flex-wrap">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.ariaLabel}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 bg-white/[0.03] text-white/40 hover:text-[#E7B52C] hover:border-[#E7B52C]/30 hover:bg-[#E7B52C]/5 transition-all duration-200 text-[12px] font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <s.icon className="h-3 w-3 text-[#C7BFB3] group-hover:text-[#E7B52C]" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — Link columns */}
          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {LINK_GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/20 mb-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {group.heading}
                </p>
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-[#C7BFB3] hover:text-[#E7B52C] transition-colors duration-150 font-medium leading-none"
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
      <div className="border-t border-white/[0.05] mx-5 md:mx-16" />
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p
          className="text-[11px] text-white/20 tracking-widest uppercase"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          © 2025 Laphing Daddy. All rights reserved.
        </p>
        <p
          className="text-[11px] text-white/15"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Made with ❤️ for laphing lovers
        </p>
      </div>
    </footer>
  );
}
