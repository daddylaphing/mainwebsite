"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppContactProps {
  orderNumber: string;
  total: number;
  items: Array<{ name: string; quantity: number }>;
}

export function WhatsAppContact({ orderNumber, total, items }: WhatsAppContactProps) {
  const phone = "919667414181";

  const itemsList = items
    .map((i) => `  • ${i.name} × ${i.quantity}`)
    .join("\n");

  const message = encodeURIComponent(
    `Hi Laphing Daddy! 👋\n\nI'd like to check on my order:\n\n` +
    `*Order #${orderNumber}*\n` +
    `Amount: ₹${total}\n\n` +
    `Items:\n${itemsList}\n\n` +
    `Could you please update me on the status? Thank you!`
  );

  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-full transition-colors shadow-sm"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <MessageCircle className="h-4 w-4" />
      Ask on WhatsApp
    </a>
  );
}
