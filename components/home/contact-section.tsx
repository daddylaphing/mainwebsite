"use client";

import { useState } from "react";
import { Phone, Send, Camera, MessageCircle, Loader2, Check, Clock, Globe } from "lucide-react";
import { toast } from "sonner";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent! We'll get back to you soon.");
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
      setLoading(false);
      setTimeout(() => setSent(false), 4000);
    }
  };

  return (
    <section id="contact" className="bg-[#FAFAF8] relative overflow-hidden">
      {/* Decorative top divider line */}
      <div className="absolute top-0 inset-x-0 h-px bg-[#E6DFD5]" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column — Info Directory (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-6 h-px bg-[#D4A843]" />
                <span
                  className="text-label-caps text-[#D4A843]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Contact — 07
                </span>
              </div>
              <h2
                className="text-[#1A1A1A] mb-6"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(36px, 5vw, 64px)",
                  letterSpacing: "-0.03em",
                  lineHeight: "1",
                }}
              >
                Get In<br />Touch
              </h2>
              <p
                className="text-[#7A7570] text-sm leading-relaxed max-w-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Have questions about bulk orders, home delivery, or event catering? Reach out directly or send us a message through the form.
              </p>
            </div>

            {/* Direct Communication Channels */}
            <div className="flex flex-col gap-6">
              <h3 
                className="text-[11px] font-bold text-[#A09890] uppercase tracking-wider border-b border-[#E6DFD5] pb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Direct Hotlines
              </h3>
              
              <div className="flex flex-col gap-4">
                {/* Channel 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 bg-white border border-[#E6DFD5] rounded-full flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-[#D4A843]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>General Orders</h4>
                    <div className="flex flex-wrap gap-x-3 text-sm text-[#7A7570]">
                      <a href="tel:9873052538" className="text-[#1A1A1A] font-semibold hover:text-[#6E1D25] transition-colors">Call: 9873052538</a>
                      <span>·</span>
                      <a href="https://wa.me/919354775439" target="_blank" rel="noopener noreferrer" className="text-[#1A1A1A] font-semibold hover:text-[#6E1D25] transition-colors">WhatsApp: 9354775439</a>
                    </div>
                  </div>
                </div>

                {/* Channel 2 */}
                <div className="flex gap-4 items-start">
                  <div className="w-9 h-9 bg-white border border-[#E6DFD5] rounded-full flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-[#D4A843]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Bulk & Catering</h4>
                    <a href="tel:9211969977" className="text-sm text-[#1A1A1A] font-semibold hover:text-[#6E1D25] transition-colors">Call: 9211969977</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Guide Cards */}
            <div className="flex flex-col gap-6">
              <h3 
                className="text-[11px] font-bold text-[#A09890] uppercase tracking-wider border-b border-[#E6DFD5] pb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Delivery Guidelines
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#F7F3EC]/50 border border-[#E6DFD5]/60 rounded-xl p-4 flex gap-3 items-start">
                  <Globe className="h-4 w-4 text-[#D4A843] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Coverage Zones</h5>
                    <p className="text-xs text-[#7A7570] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>Delhi · Noida · Gurugram · Ghaziabad</p>
                  </div>
                </div>

                <div className="bg-[#F7F3EC]/50 border border-[#E6DFD5]/60 rounded-xl p-4 flex gap-3 items-start">
                  <Clock className="h-4 w-4 text-[#D4A843] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Delivery Hours</h5>
                    <p className="text-xs text-[#7A7570] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>10:00 AM – 8:00 PM Daily</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Connect */}
            <div>
              <p
                className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Follow The Story
              </p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/laphingdaddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E6DFD5] hover:border-[#1A1A1A] text-[#7A7570] hover:text-[#1A1A1A] transition-all text-xs font-semibold uppercase tracking-wider rounded-xl shadow-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Camera className="h-3.5 w-3.5" />
                  Instagram
                </a>
                <a
                  href="https://wa.me/919354775439"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E6DFD5] hover:border-[#1A1A1A] text-[#7A7570] hover:text-[#1A1A1A] transition-all text-xs font-semibold uppercase tracking-wider rounded-xl shadow-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right Column — Postcard Style Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#F7F3EC] border border-[#E6DFD5] rounded-3xl p-6 md:p-10 lg:p-12 shadow-sm flex flex-col gap-8">
            <div>
              <h3 
                className="text-2xl font-bold text-[#1A1A1A]" 
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Send Us A Message
              </h3>
              <p 
                className="text-xs text-[#7A7570] mt-1" 
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                We usually reply to queries within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-name"
                    className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider"
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
                    className="bg-transparent border-b border-[#E6DFD5] py-2 focus:border-[#6E1D25] focus:outline-none transition-colors text-base text-[#1A1A1A] placeholder-[#A09890]/50"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-email"
                    className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider"
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
                    placeholder="you@example.com"
                    className="bg-transparent border-b border-[#E6DFD5] py-2 focus:border-[#6E1D25] focus:outline-none transition-colors text-base text-[#1A1A1A] placeholder-[#A09890]/50"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-subject"
                  className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="What is this regarding?"
                  className="bg-transparent border-b border-[#E6DFD5] py-2 focus:border-[#6E1D25] focus:outline-none transition-colors text-base text-[#1A1A1A] placeholder-[#A09890]/50"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us details about your query..."
                  className="bg-transparent border-b border-[#E6DFD5] py-2 focus:border-[#6E1D25] focus:outline-none transition-colors text-base text-[#1A1A1A] placeholder-[#A09890]/50 resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Action */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold uppercase tracking-widest bg-[#1A1A1A] hover:bg-[#6E1D25] text-white transition-all rounded-[14px]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Enquiry...
                  </>
                ) : sent ? (
                  <>
                    <Check className="h-4 w-4" />
                    Enquiry Sent!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
