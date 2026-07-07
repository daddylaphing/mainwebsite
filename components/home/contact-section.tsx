"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Phone, MapPin, Send, Camera, MessageCircle } from "lucide-react";

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "General Orders — Call",
    value: "9873052538",
    href: "tel:9873052538",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "9354775439",
    href: "https://wa.me/919354775439",
  },
  {
    icon: Phone,
    label: "Bulk Orders",
    value: "9211969977",
    href: "tel:9211969977",
  },
  {
    icon: MapPin,
    label: "Delivering To",
    value: "Delhi · Noida · Gurugram · Ghaziabad",
    href: null,
  },
  {
    icon: MapPin,
    label: "Booking Hours",
    value: "3:00 PM – 6:00 PM Only",
    href: null,
  },
  {
    icon: Phone,
    label: "Delivery Method",
    value: "Self-booked (Uber / Rapido / Porter) · Uncle Delivery Preferred",
    href: null,
  },
];

const SOCIALS = [
  {
    icon: Camera,
    label: "Instagram",
    href: "https://instagram.com/laphingdaddy",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/919354775439",
  },
];

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up to backend / email service
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="pt-10 md:pt-20 pb-10 border-t border-white/5">
      {/* Heading with small mustard line */}
      <div className="flex flex-col items-center md:items-start mb-8 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-3xl md:text-[48px] text-[#F8F5EE] leading-[1.2]"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
        >
          GET IN TOUCH
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[3px] w-16 bg-[#E7B52C] rounded-full mt-3 origin-left"
        />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="text-[#C7BFB3] text-[15px] mb-8 md:mb-12 max-w-lg -mt-4"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Questions about bulk orders, catering, or just want to say hi? We&apos;d love to hear from you.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* Left — form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-name"
                className="text-xs font-semibold text-white/40 uppercase tracking-wider"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="bg-[#141414] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="contact-email"
                className="text-xs font-semibold text-white/40 uppercase tracking-wider"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="bg-[#141414] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-message"
              className="text-xs font-semibold text-white/40 uppercase tracking-wider"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us what's on your mind…"
              className="bg-[#141414] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E7B52C]/60 transition-colors resize-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full bg-[#E7B52C] text-black font-bold text-sm py-3.5 rounded-[14px] hover:bg-[#F4C542] hover:shadow-[0_8px_20px_rgba(231,181,44,0.25)] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {sent ? (
              <>Message Sent!</>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Right — contact details + socials */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Contact cards */}
          <div className="flex flex-col gap-3">
            {CONTACT_DETAILS.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-4 bg-[#141414] border border-white/[0.08] rounded-xl hover:border-white/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E7B52C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E7B52C]/20 transition-colors">
                  <item.icon className="h-5 w-5 text-[#E7B52C]" />
                </div>
                <div>
                  <p
                    className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-[#F8F5EE] font-medium hover:text-[#E7B52C] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p
                      className="text-sm text-[#C7BFB3] font-medium"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Socials */}
          <div>
            <p
              className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Follow Us
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#181818] border border-white/5 rounded-xl text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <s.icon className="h-4 w-4" />
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Decorative Wholesale card */}
          <div
            className="mt-auto rounded-2xl p-6 border border-white/[0.08] relative overflow-hidden"
            style={{ background: "#1B1B1B" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E7B52C]/5 rounded-full blur-3xl" />
            <p
              className="text-white font-bold text-lg mb-1"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Wholesale / B2B Enquiries?
            </p>
            <p
              className="text-[#C7BFB3] text-sm mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Looking to stock Laphing Daddy at your café, restaurant, or store? Let&apos;s talk.
            </p>
            <a
              href="tel:9211969977"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#E7B52C] hover:text-[#F4C542] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Phone className="h-4 w-4" />
              9211969977
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
