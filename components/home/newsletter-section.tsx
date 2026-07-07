"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("You're subscribed! 🎉");
    setEmail("");
    setLoading(false);
  }

  return (
    <section className="bg-gradient-to-br from-[#3D1200] to-[#1a0800] py-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <h2 className="font-display text-3xl text-white mb-2">
            Get Exclusive Offers
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Subscribe to our newsletter for deals, new products and laphing tips.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 flex-1"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-white text-primary hover:bg-white/90 font-mono tracking-wider shrink-0"
            >
              {loading ? "..." : "Subscribe"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
