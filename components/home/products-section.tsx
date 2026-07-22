"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { ProductQuantitySelector } from "@/components/product/product-quantity-selector";
import { MaskReveal } from "@/components/ui/text-reveal";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import type { Product } from "@/types";

// Helper
function getProductImage(product: Product): string {
  return getProxiedImageUrl(product.images?.[0]) || "/placeholder-product.png";
}

// Full-width product panel — alternating layouts
function ProductPanel({
  product,
  index,
  quantity,
  onQuantityChange,
  onAddToCart,
}: {
  product: Product;
  index: number;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
}) {
  const isEven = index % 2 === 0 ?
  const sectionNumber = String(index + 1).padStart(2, "0");
  const panelRef = useRef<HTMLDivElement>(null);

  // Parallax Scroll logic for the image
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={panelRef}>
      <motion.article
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative min-h-[85vh] flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-stretch border-b border-[rgba(26,26,26,0.08)]`}
      >
        {/* Image side — 60% with parallax & link */}
        <Link 
          href={`/products/${product.slug}`}
          className="relative w-full lg:w-[60%] overflow-hidden bg-[#F0EBE0] min-h-[50vh] lg:min-h-0 block group cursor-pointer"
        >
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="absolute inset-0 w-full h-[120%] -top-[10%]"
          >
            <Image
              src={getProductImage(product)}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 group-hover:brightness-95"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>

          {/* Subtle overlay */}
          <div className={`absolute inset-0 bg-gradient-to-${isEven ? "r" : "l"} from-transparent to-[rgba(26,26,26,0.12)]`} />

          {/* View Details Hover Badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
            <span className="bg-[#FAFAF8] text-[#1A1A1A] font-semibold text-xs tracking-widest uppercase px-6 py-3 shadow-lg rounded-full flex items-center gap-2">
              View Details <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Section number ghost */}
          <span
            className="absolute bottom-4 right-4 font-display text-[120px] font-black text-white/10 leading-none select-none pointer-events-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
            aria-hidden
          >
            {sectionNumber}
          </span>
        </Link>

        {/* Content side — 40% */}
        <div className={`w-full lg:w-[40%] flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 lg:py-24 bg-[#FAFAF8]`}>

          {/* Section marker */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-[#D4A843]" />
            <span
              className="text-label-caps text-[#D4A843]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {product.featured ? "Best Seller" : product.category === "wholesale" ? "Wholesale" : "Product"} — {sectionNumber}
            </span>
          </div>

          {/* Product name linked */}
          <h2
            className="text-[#1A1A1A] leading-none mb-6 hover:text-[#D4A843] transition-colors"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(36px, 4vw, 56px)",
              letterSpacing: "-0.025em",
              lineHeight: "1.05",
            }}
          >
            <Link href={`/products/${product.slug}`}>
              <MaskReveal delay={0.1}>
                {product.name}
              </MaskReveal>
            </Link>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#7A7570] text-base leading-relaxed mb-10 max-w-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {product.short_description}
          </motion.p>

          <hr className="ink-divider mb-8" />

          {/* Price + qty */}
          <div className="flex items-end justify-between gap-6 mb-8">
            <div>
              <p
                className="text-[10px] text-[#A09890] uppercase tracking-[0.12em] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {product.category === "wholesale"
                  ? product.name.toLowerCase().includes("momo")
                    ? `Per plate · min ${product.minimum_quantity}`
                    : `Per sheet · min ${product.minimum_quantity}`
                  : "Per kit"}
              </p>
              <p
                className="text-[#1A1A1A] font-bold leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px, 4vw, 48px)",
                }}
              >
                ₹{product.price}
              </p>
              {product.bulk_price && (
                <p className="text-[#A09890] text-[11px] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Bulk: <span className="text-[#444748] font-medium">₹{product.bulk_price}/item</span>
                </p>
              )}
            </div>
            <ProductQuantitySelector
              quantity={quantity}
              onChange={onQuantityChange}
              min={product.minimum_quantity || 1}
              size="sm"
            />
          </div>

          {product.minimum_quantity && product.minimum_quantity > 1 && (
            <p className="text-[11px] text-[#A09890] -mt-4 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Minimum order: {product.minimum_quantity} {product.category === "kit" ? "kits" : "items"}
            </p>
          )}

          {/* Add to cart */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onAddToCart}
              disabled={!product}
              className="btn-ink w-full justify-center text-sm disabled:opacity-50"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Add to Cart
              <span className="ml-2">→</span>
            </motion.button>
            <Link 
              href={`/products/${product.slug}`}
              className="btn-outline-ink w-full justify-center text-sm text-center flex items-center"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              View Story
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function ProductsSection({ products }: { products: Product[] }) {
  const { addItem, openCart } = useCart();

  const kitProduct     = products.find((p) => p.category === "kit") || products[0];
  const sheetProduct   = products.find((p) => p.category === "wholesale") || products[1];
  const cornDogProduct = products.find((p) => p.category === "corndog") || products[2];

  const [kitQty, setKitQty]         = useState(kitProduct?.minimum_quantity || 3);
  const [sheetQty, setSheetQty]     = useState(sheetProduct?.minimum_quantity || 5);
  const [cornDogQty, setCornDogQty] = useState(1);

  const handleAddKit     = () => { if (kitProduct)     { addItem(kitProduct, kitQty); openCart(); } };
  const handleAddSheet   = () => { if (sheetProduct)   { addItem(sheetProduct, sheetQty); openCart(); } };
  const handleAddCornDog = () => { if (cornDogProduct) { addItem(cornDogProduct, cornDogQty); openCart(); } };

  const displayProducts = [
    { product: kitProduct,     qty: kitQty,     setQty: setKitQty,     onAdd: handleAddKit },
    { product: sheetProduct,   qty: sheetQty,   setQty: setSheetQty,   onAdd: handleAddSheet },
    { product: cornDogProduct, qty: cornDogQty, setQty: setCornDogQty, onAdd: handleAddCornDog },
  ];

  return (
    <section id="products" className="bg-[#FAFAF8]">
      {/* Section header */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 pt-20 md:pt-28 pb-16">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-6 h-px bg-[#D4A843]" />
              <span
                className="text-label-caps text-[#D4A843]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Our Products
              </span>
            </div>
            <h2
              className="text-[#1A1A1A]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(40px, 6vw, 80px)",
                letterSpacing: "-0.03em",
                lineHeight: "1",
              }}
            >
              The Collection
            </h2>
          </div>
          <p
            className="hidden md:block text-[#7A7570] text-sm max-w-[240px] text-right leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Handcrafted laphing kits, fresh sheets, and street-style corn dogs — delivered daily.
          </p>
        </div>
      </div>

      {/* Full-width product panels */}
      <div className="border-t border-[rgba(26,26,26,0.08)]">
        {displayProducts.map((item, index) =>
          item.product ? (
            <ProductPanel
              key={item.product.id}
              product={item.product}
              index={index}
              quantity={item.qty}
              onQuantityChange={item.setQty}
              onAddToCart={item.onAdd}
            />
          ) : null
        )}
      </div>

      {/* View All Products button */}
      <div className="flex justify-center py-12 bg-[#FAFAF8] border-b border-[rgba(26,26,26,0.08)]">
        <Link
          href="/products"
          className="bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-8 py-4.5 rounded-full transition-colors flex items-center gap-2 shadow-sm"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          View All Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Bulk order banner */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-6 px-10 md:px-16 py-10 md:py-12"
        >
          <div>
            <p
              className="text-[#FAFAF8] text-2xl md:text-3xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Need bulk quantities?
            </p>
            <p
              className="text-[#7A7570] text-[14px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Contact us directly for wholesale pricing on any item.
            </p>
          </div>
          <a
            href="tel:9211969977"
            className="btn-cream flex items-center gap-3 shrink-0"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Phone className="h-4 w-4" />
            Call: 9211969977
          </a>
        </motion.div>
      </div>
    </section>
  );
}
