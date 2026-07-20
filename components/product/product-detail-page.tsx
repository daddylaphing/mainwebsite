"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  ChefHat,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { ProductQuantitySelector } from "./product-quantity-selector";
import { MinOrderWarning } from "./min-order-warning";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import type { Product } from "@/types";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { MaskReveal } from "@/components/ui/text-reveal";

interface ProductDetailPageProps {
  product: Product;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(product.minimum_quantity || 1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const meetsMinimum = quantity >= (product.minimum_quantity || 1);
  const effectivePrice =
    product.bulk_price && quantity >= (product.minimum_quantity || 1)
      ? product.bulk_price
      : product.price;
  const totalPrice = effectivePrice * quantity;

  const handleAddToCart = async () => {
    if (!meetsMinimum) {
      toast.error(
        `Minimum order quantity is ${product.minimum_quantity} units`
      );
      return;
    }

    setIsAdding(true);
    try {
      addItem(product, quantity);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-5 md:px-16">
        {/* Back Button */}
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 text-[#7A7570] hover:text-[#1A1A1A] transition-colors mb-10 text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square overflow-hidden bg-[#F0EBE0] border border-[rgba(26,26,26,0.08)]"
            >
              <Image
                src={getProxiedImageUrl(product.images[selectedImage]) || "/placeholder-product.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-[#D4A843] text-[#1A1A1A] text-[9px] font-bold px-3 py-1.5 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  BEST SELLER
                </div>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square overflow-hidden border transition-all ${
                      selectedImage === idx
                        ? "border-[#D4A843]"
                        : "border-[rgba(26,26,26,0.08)] hover:border-[rgba(26,26,26,0.2)]"
                    }`}
                  >
                    <Image
                      src={getProxiedImageUrl(image)}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div>
              {product.category === "wholesale" && (
                <span className="inline-block text-label-caps text-[#D4A843] mb-3">
                  Wholesale Sheet
                </span>
              )}
              <h1
                className="text-display-sm text-[#1A1A1A] mb-4 leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(36px, 5vw, 52px)",
                  letterSpacing: "-0.025em",
                }}
              >
                <MaskReveal delay={0.1}>
                  {product.name}
                </MaskReveal>
              </h1>

              {product.short_description && (
                <p 
                  className="text-[#444748] text-base leading-relaxed mb-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {product.short_description}
                </p>
              )}

              <hr className="ink-divider my-6" />

              <div className="flex items-baseline gap-3">
                <span
                  className="text-[#1A1A1A] font-bold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(32px, 5vw, 44px)",
                  }}
                >
                  ₹{effectivePrice}
                </span>
                <span className="text-[#A09890] text-xs uppercase tracking-wider">
                  {product.category === "wholesale" ? "per sheet" : "each"}
                </span>
              </div>
            </div>

            {/* Quantity Selector or Bulk Notice */}
            {product.slug === "wholesale-momos" ? (
              <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.08)] p-6 space-y-3">
                <div className="text-sm font-bold text-[#6E1D25] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Bulk Purchase Only
                </div>
                <p className="text-xs text-[#7A7570] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  This product is manufactured exclusively for wholesale partners, restaurants, and catering services. Standard retail checkout is unavailable.
                </p>
              </div>
            ) : (
              <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.08)] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[#1A1A1A] font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Quantity</label>
                  <ProductQuantitySelector
                    quantity={quantity}
                    onChange={setQuantity}
                    min={product.minimum_quantity || 1}
                    size="md"
                  />
                </div>

                {!meetsMinimum && (
                  <MinOrderWarning
                    current={quantity}
                    minimum={product.minimum_quantity || 1}
                    productName={product.name}
                  />
                )}

                <div className="flex items-center justify-between text-base pt-4 border-t border-[rgba(26,26,26,0.08)]">
                  <span className="text-[#7A7570] text-sm">Total Price</span>
                  <span
                    className="text-2xl font-bold text-[#1A1A1A]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart or Contact Button */}
            {product.slug === "wholesale-momos" ? (
              <Link
                href="/#contact"
                className="btn-ink w-full justify-center text-sm inline-flex items-center"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Inquire for Bulk Order
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !meetsMinimum || product.inventory === 0}
                className="btn-ink w-full justify-center text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inventory === 0
                  ? "Out of Stock"
                  : isAdding
                  ? "Adding..."
                  : "Add to Cart"}
              </button>
            )}

            {/* Product Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.08)] p-4 flex items-start gap-3">
                  <Package className="h-5 w-5 text-[#D4A843] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[#1A1A1A] font-bold text-xs mb-1 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Includes
                    </div>
                    <div className="text-[#7A7570] text-xs">
                      {product.ingredients.length} items
                    </div>
                  </div>
                </div>
              )}

              {product.recipe_available && (
                <div className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.08)] p-4 flex items-start gap-3">
                  <ChefHat className="h-5 w-5 text-[#D4A843] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[#1A1A1A] font-bold text-xs mb-1 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Recipe Included
                    </div>
                    <div className="text-[#7A7570] text-xs">
                      Step-by-step instructions
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Tabs/Sections */}
        <div className="mt-20 space-y-12">
          {/* Description */}
          {product.description && (
            <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.06)] p-8 md:p-12">
              <h2
                className="text-2xl font-bold text-[#1A1A1A] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                About This Product
              </h2>
              <div className="prose prose-neutral max-w-none text-[#444748] leading-relaxed">
                <ReactMarkdown>
                  {product.description}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.08)] p-8 md:p-12">
              <h2
                className="text-2xl font-bold text-[#1A1A1A] mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                What&#39;s Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.ingredients.map((ingredient, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-[#F7F3EC]/50 border border-[rgba(26,26,26,0.05)] p-4"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                    <span className="text-[#1A1A1A] text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {product.related_products && product.related_products.length > 0 && (
            <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.06)] p-8 md:p-12">
              <h2
                className="text-2xl font-bold text-[#1A1A1A] mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.related_products.map((related) => (
                  <Link
                    key={related.id}
                    href={`/products/${related.slug}`}
                    className="group block"
                  >
                    <div className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.08)] group-hover:border-[rgba(26,26,26,0.2)] transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={getProxiedImageUrl(related.images[0]) || "/placeholder-product.png"}
                          alt={related.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <h3 
                          className="text-[#1A1A1A] font-bold text-lg mb-2 group-hover:text-[#D4A843] transition-colors"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {related.name}
                        </h3>
                        <p className="text-[#D4A843] font-bold text-sm">₹{related.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
