"use client";

import { useState } from "react";
import { Product } from "@/types";
import { ProductQuantitySelector } from "./product-quantity-selector";
import { MinOrderWarning } from "./min-order-warning";
import { KitCustomizer, KitExtras } from "./kit-customizer";
import { RecommendationPopup } from "../modals/recommendation-popup";
import { useSiteConfig } from "@/lib/hooks/use-site-config";
import { useCartRecommendation } from "@/lib/hooks/use-cart-recommendation";
import { useCart } from "../providers/cart-provider";
import { Button } from "../ui/button";
import { Check, Package, Sparkles, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { MaskReveal, WordReveal } from "@/components/ui/text-reveal";

interface LaphingKitProductProps {
  product: Product | null;
}

export function LaphingKitProduct({ product }: LaphingKitProductProps) {
  const { data: config } = useSiteConfig();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(config?.min_kit_qty || 3);
  const [extras, setExtras] = useState<KitExtras>({
    extra_sheets: 0,
    extra_chilli_oil: 0,
    extra_garlic_water: 0,
    extra_sauce: 0,
    extra_seasoning: 0,
  });
  const [isAdding, setIsAdding] = useState(false);

  const { shouldShowRecommendation, dismiss } = useCartRecommendation(
    quantity,
    extras.extra_sheets
  );

  const minQty = config?.min_kit_qty || 3;
  const kitPrice = config?.laphing_kit_price || 50;
  const packagingCharge = config?.packaging_charge || 30;
  const meetsMinimum = quantity >= minQty;

  const calculateTotal = () => {
    const basePrice = kitPrice * quantity;
    const extrasPrice =
      extras.extra_sheets * (config?.extra_sheet_price || 20) +
      extras.extra_chilli_oil * (config?.extra_chilli_oil_price || 15) +
      extras.extra_garlic_water * (config?.extra_garlic_water_price || 10);
    return basePrice + extrasPrice;
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    try {
      addItem(product, quantity);

      if (extras.extra_sheets > 0) {
        addItem({
          id: "addon-sheet",
          name: "Extra Laphing Sheet",
          price: 20,
          images: ["https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/sheet.png"],
          is_active: true,
        } as unknown as Product, extras.extra_sheets);
      }

      if (extras.extra_chilli_oil > 0) {
        addItem({
          id: "addon-chili",
          name: "Extra Chilli Oil",
          price: 15,
          images: ["https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/signaturechillioil.png"],
          is_active: true,
        } as unknown as Product, extras.extra_chilli_oil);
      }

      if (extras.extra_garlic_water > 0) {
        addItem({
          id: "addon-garlic",
          name: "Extra Garlic Water",
          price: 10,
          images: ["https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/garlicwater.png"],
          is_active: true,
        } as unknown as Product, extras.extra_garlic_water);
      }

      toast.success("Added to cart successfully!");
      openCart();
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddKitFromRecommendation = () => {
    setQuantity((prev) => prev + 1);
    dismiss();
  };

  const kitIncludes = [
    { name: "3 Fresh Laphing Sheets", icon: Package },
    { name: "Signature Chilli Oil (3 Portions)", icon: Package },
    { name: "Garlic Water (3 Portions)", icon: Package },
    { name: "Soya Chunks", icon: Package },
    { name: "Wai Wai Crispy Topping", icon: Package },
    { name: "Step-by-Step Guide", icon: Package },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Product Image */}
        <div className="overflow-hidden bg-[#F0EBE0] border border-[rgba(26,26,26,0.08)]">
          <div className="aspect-square relative">
            {config?.product_images.laphing_kit ? (
              <Image
                src={config.product_images.laphing_kit}
                alt="Laphing Kit"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F0EBE0]">
                <Package className="h-32 w-32 text-[#7A7570]/30" />
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div>
            <div className="inline-block bg-[#D4A843] text-[#1A1A1A] text-[9px] font-bold px-3 py-1.5 uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5 inline mr-1" />
              Best Seller
            </div>
            <h1
              className="text-[#1A1A1A] mb-4 leading-none"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(38px, 5vw, 56px)",
                letterSpacing: "-0.025em",
              }}
            >
              <MaskReveal delay={0.1}>
                LAPHING KIT
              </MaskReveal>
            </h1>
            <p className="text-[#7A7570] text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              The complete artisanal experience. Everything you need to prepare authentic servings at
              home in minutes.
            </p>
          </div>

          {/* Price */}
          <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.08)] p-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="text-4xl font-bold text-[#1A1A1A]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                ₹{kitPrice}
              </span>
              <span className="text-[#A09890] text-xs uppercase tracking-wider">per kit</span>
            </div>
            <p className="text-xs text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Minimum order: {minQty} kits • Serves 3 per kit
            </p>
          </div>

          {/* What's Included */}
          <div className="bg-white border border-[rgba(26,26,26,0.08)] p-6">
            <h3 className="font-bold text-base text-[#1A1A1A] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>What&#39;s Included</h3>
            <div className="grid grid-cols-2 gap-3">
              {kitIncludes.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#D4A843]" />
                  <span className="text-sm text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Number of Kits
            </label>
            <ProductQuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              min={1}
              max={50}
              size="lg"
            />
          </div>

          {/* Minimum Order Warning */}
          <MinOrderWarning current={quantity} minimum={minQty} productName="Laphing Kit" />

          {/* Kit Customizer */}
          {meetsMinimum && (
            <KitCustomizer
              kitQuantity={quantity}
              onChange={setExtras}
              disabled={!meetsMinimum}
            />
          )}

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.08)] p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#7A7570] text-sm">Subtotal</span>
                <span className="text-[#1A1A1A] font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ₹{calculateTotal().toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-[#A09890]" style={{ fontFamily: "'Inter', sans-serif" }}>
                +₹{packagingCharge} packaging charge at checkout
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!meetsMinimum || isAdding}
              className="btn-ink w-full justify-center text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Recommendation Popup */}
      <RecommendationPopup
        isOpen={shouldShowRecommendation}
        currentKitQty={quantity}
        currentExtraSheets={extras.extra_sheets}
        kitPrice={kitPrice}
        extraSheetPrice={config?.extra_sheet_price || 20}
        onAddKit={handleAddKitFromRecommendation}
        onDismiss={dismiss}
      />
    </>
  );
}
