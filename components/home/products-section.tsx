"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Phone } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { SuggestionModal } from "@/components/cart/suggestion-modal";
import type { Product } from "@/types";

export function ProductsSection({ products }: { products: Product[] }) {
  const { addItem, openCart } = useCart();
  const [kitQty, setKitQty] = useState(2);
  const [sheetQty, setSheetQty] = useState(5);
  const [showModal, setShowModal] = useState(false);

  const kitImage = "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/laphingkit.png";
  const sheetImage = "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/laphingsheet.png";
  const cornDogImage = "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/cheesecorndog.png";

  const finalKitProduct = {
    ...(products.find((p) => /kit/i.test(p.name)) || {
      id: "kit-id-fallback",
      name: "LAPHING KIT",
      price: 50,
      description: "Everything you need for authentic Tibetan laphing at home.",
    }),
    name: "LAPHING KIT",
    price: 50,
    image_url: kitImage,
    images: [kitImage],
  };

  const finalSheetProduct = {
    ...(products.find((p) => /sheet/i.test(p.name)) || {
      id: "sheet-id-fallback",
      name: "FRESH LAPHING SHEET",
      price: 20,
      description: "Freshly prepared laphing sheets. Minimum 5 sheets per order.",
    }),
    name: "FRESH LAPHING SHEET",
    price: 20,
    image_url: sheetImage,
    images: [sheetImage],
  };

  const finalCornDogProduct = {
    ...(products.find((p) => /corn.*dog|cheese.*corn/i.test(p.name)) || {
      id: "corndg-id-fallback",
      name: "CHEESE CORN DOG",
      price: 50,
      description: "Golden crispy corn dog with a gooey cheese pull.",
    }),
    name: "CHEESE CORN DOG",
    price: 50,
    image_url: cornDogImage,
    images: [cornDogImage],
  };

  return (
    <section className="pt-10 md:pt-20" id="products">
      {/* Title with small mustard line underneath */}
      <div className="flex flex-col items-center md:items-start mb-8 md:mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-3xl md:text-[48px] text-[#F8F5EE] leading-[1.2] text-center md:text-left"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
        >
          OUR PRODUCTS
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[3px] w-16 bg-[#E7B52C] rounded-full mt-3 origin-left"
        />
      </div>

      {/* 3-column product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">

        {/* ── Card 1: Laphing Kit ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#141414] border border-white/[0.08] rounded-[20px] overflow-hidden flex flex-col group hover:shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:-translate-y-1 transition-all duration-300"
        >
          {/* Photography occupies around 45% of card (increased image container to breathe) */}
          <div className="h-[250px] relative overflow-hidden shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${kitImage}')`, backgroundColor: "#141414" }}
            />
          </div>
          <div className="p-6 flex flex-col gap-4 flex-1">
            {/* Best Seller Pill: Mustard background, Black text */}
            <div className="inline-block px-3 py-1 bg-[#E7B52C] rounded-full text-[10px] font-bold text-black uppercase tracking-wider w-fit">
              Best Seller
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[20px] text-[#F8F5EE] leading-[1.3] tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {finalKitProduct.name}
              </h3>
              <p className="text-[#C7BFB3] mt-2 text-[14px] leading-[1.5]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {finalKitProduct.description}
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-end justify-between gap-2">
              <div>
                <p className="text-[11px] text-[#8F857B] mb-0.5 uppercase tracking-wider font-semibold">Per kit</p>
                <p className="font-bold text-[24px] text-[#E7B52C]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  ₹{finalKitProduct.price}
                </p>
              </div>
              {/* Stepper with dark surface, thin border, mustard active states */}
              <div className="flex items-center bg-[#1B1B1B] border border-white/[0.08] rounded-[10px] p-1 gap-1 h-9">
                <button
                  onClick={() => setKitQty(Math.max(2, kitQty - 1))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-[#E7B52C] hover:bg-white/[0.03] transition-all cursor-pointer font-bold text-sm"
                >−</button>
                <span className="w-7 text-center text-[#F8F5EE] text-sm font-semibold font-mono">{kitQty}</span>
                <button
                  onClick={() => setKitQty(kitQty + 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-[#E7B52C] hover:bg-white/[0.03] transition-all cursor-pointer font-bold text-sm"
                >+</button>
              </div>
            </div>
            <p className="text-[11px] text-[#8F857B] -mt-2">Min. 2 kits</p>
            <button
              onClick={() => { addItem(finalKitProduct as Product, kitQty); openCart(); }}
              className="w-full bg-[#E7B52C] text-black font-bold py-3 rounded-[14px] hover:bg-[#F4C542] hover:shadow-[0_8px_20px_rgba(231,181,44,0.25)] transition-all duration-200 cursor-pointer text-[14px]"
            >
              Add to Cart
            </button>
          </div>
        </motion.div>

        {/* ── Card 2: Fresh Laphing Sheet ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="bg-[#141414] border border-white/[0.08] rounded-[20px] overflow-hidden flex flex-col group hover:shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:-translate-y-1 transition-all duration-300"
        >
          {/* Photography occupies around 45% of card */}
          <div className="h-[250px] relative overflow-hidden shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${sheetImage}')`, backgroundColor: "#141414" }}
            />
          </div>
          <div className="p-6 flex flex-col gap-4 flex-1">
            {/* Wholesale Pill: Dark Maroon background, Muted yellow text */}
            <div className="inline-block px-3 py-1 bg-[#6E1D25] rounded-full text-[10px] font-bold text-[#E7B52C] uppercase tracking-wider w-fit">
              Wholesale
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[20px] text-[#F8F5EE] leading-[1.3] tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {finalSheetProduct.name}
              </h3>
              <p className="text-[#C7BFB3] mt-2 text-[14px] leading-[1.5]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {finalSheetProduct.description}
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08] flex items-end justify-between gap-2">
              <div>
                <p className="text-[11px] text-[#8F857B] mb-0.5 uppercase tracking-wider font-semibold">Per sheet · min 5</p>
                <p className="font-bold text-[24px] text-[#E7B52C]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  ₹{finalSheetProduct.price}
                </p>
                <p className="text-[11px] text-[#8F857B] mt-0.5">Bulk rate: <span className="text-[#F8F5EE] font-semibold">₹15/sheet</span></p>
              </div>
              {/* Stepper with dark surface, thin border, mustard active states */}
              <div className="flex items-center bg-[#1B1B1B] border border-white/[0.08] rounded-[10px] p-1 gap-1 h-9">
                <button
                  onClick={() => setSheetQty(Math.max(5, sheetQty - 1))}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-[#E7B52C] hover:bg-white/[0.03] transition-all cursor-pointer font-bold text-sm"
                >−</button>
                <span className="w-7 text-center text-[#F8F5EE] text-sm font-semibold font-mono">{sheetQty}</span>
                <button
                  onClick={() => setSheetQty(sheetQty + 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-[#E7B52C] hover:bg-white/[0.03] transition-all cursor-pointer font-bold text-sm"
                >+</button>
              </div>
            </div>
            <p className="text-[11px] text-[#8F857B] -mt-2">Min. 5 sheets</p>
            <button
              onClick={() => { addItem(finalSheetProduct as Product, sheetQty); openCart(); }}
              className="w-full bg-[#E7B52C] text-black font-bold py-3 rounded-[14px] hover:bg-[#F4C542] hover:shadow-[0_8px_20px_rgba(231,181,44,0.25)] transition-all duration-200 cursor-pointer text-[14px]"
            >
              Add to Cart
            </button>
          </div>
        </motion.div>

        {/* ── Card 3: Cheese Corn Dog ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="bg-[#141414] border border-white/[0.08] rounded-[20px] overflow-hidden flex flex-col group hover:shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:-translate-y-1 transition-all duration-300"
        >
          {/* Photography occupies around 45% of card */}
          <div className="h-[250px] relative overflow-hidden shrink-0">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${cornDogImage}')`, backgroundColor: "#141414" }}
            />
          </div>
          <div className="p-6 flex flex-col gap-4 flex-1">
            <div className="flex-1">
              <h3 className="font-bold text-[20px] text-[#F8F5EE] leading-[1.3] tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {finalCornDogProduct.name}
              </h3>
              <p className="text-[#C7BFB3] mt-2 text-[14px] leading-[1.5]" style={{ fontFamily: "'Inter', sans-serif" }}>
                {finalCornDogProduct.description}
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.08]">
              <p className="font-bold text-[24px] text-[#E7B52C]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                ₹{finalCornDogProduct.price}
              </p>
            </div>
            <div className="mt-auto pt-2" />
            <button
              onClick={() => { addItem(finalCornDogProduct as Product, 1); openCart(); }}
              className="w-full bg-[#E7B52C] text-black font-bold py-3 rounded-[14px] hover:bg-[#F4C542] hover:shadow-[0_8px_20px_rgba(231,181,44,0.25)] transition-all duration-200 cursor-pointer text-[14px]"
            >
              Add to Cart
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Bulk Order Banner (below cards) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] border border-white/[0.08] rounded-[20px] px-6 py-5 shadow-lg"
      >
        <div>
          <p className="text-[#F8F5EE] font-bold text-[16px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Need bulk quantities?
          </p>
          <p className="text-[#C7BFB3] text-[13px] mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            Contact us directly for wholesale pricing on any item.
          </p>
        </div>
        <a
          href="tel:9211969977"
          className="flex items-center gap-2 border border-[#E7B52C] text-[#E7B52C] font-bold px-5 py-2.5 rounded-[14px] hover:bg-[#E7B52C] hover:text-black transition-all whitespace-nowrap text-[14px] shrink-0 hover:shadow-[0_4px_15px_rgba(231,181,44,0.15)]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Phone className="h-4 w-4 shrink-0" />
          Contact for Bulk Orders — 9211969977
        </a>
      </motion.div>

      {/* Suggestion Modal */}
      <SuggestionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          addItem(finalKitProduct as Product, Math.max(2, kitQty));
          setShowModal(false);
          openCart();
        }}
      />
    </section>
  );
}
