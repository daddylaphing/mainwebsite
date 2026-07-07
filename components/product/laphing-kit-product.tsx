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
import { Check, Package } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface LaphingKitProductProps {
  product: Product | null;
}

export function LaphingKitProduct({ product }: LaphingKitProductProps) {
  const { data: config } = useSiteConfig();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(config?.min_kit_qty || 2);
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

  const minQty = config?.min_kit_qty || 2;
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
      // 1. Add main kit product
      addItem(product, quantity);

      // 2. Add extra addon items if selected
      if (extras.extra_sheets > 0) {
        addItem({
          id: "addon-sheet",
          name: "Extra Laphing Sheet",
          price: 20,
          images: ["https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/laphingsheet.png"],
          is_active: true,
        } as Product, extras.extra_sheets);
      }

      if (extras.extra_chilli_oil > 0) {
        addItem({
          id: "addon-chili",
          name: "Extra Chilli Oil",
          price: 15,
          images: ["https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/signaturechillioil.png"],
          is_active: true,
        } as Product, extras.extra_chilli_oil);
      }

      if (extras.extra_garlic_water > 0) {
        addItem({
          id: "addon-garlic",
          name: "Extra Garlic Water",
          price: 10,
          images: ["https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/garlicwater.png"],
          is_active: true,
        } as Product, extras.extra_garlic_water);
      }

      toast.success("Added to cart successfully!");
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
    { name: "Fresh Laphing Sheet", icon: Package },
    { name: "Signature Chilli Oil", icon: Package },
    { name: "Garlic Water", icon: Package },
    { name: "Laphing Sauce", icon: Package },
    { name: "Seasoning Mix", icon: Package },
    { name: "Step-by-Step Guide", icon: Package },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="rounded-2xl overflow-hidden bg-[#141414] border border-white/[0.08]">
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
                <Package className="h-32 w-32 text-white/20" />
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="inline-block px-3 py-1 bg-[#E7B52C] rounded-full text-[10px] font-bold text-black uppercase tracking-wider mb-3">
              Best Seller
            </div>
            <h1
              className="font-black text-4xl md:text-5xl text-[#F8F5EE] mb-4 leading-[1.1]"
              style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
            >
              LAPHING KIT
            </h1>
            <p className="text-lg text-[#C7BFB3] leading-relaxed">
              The complete artisanal experience. Everything you need to prepare authentic servings at
              home in minutes.
            </p>
          </div>

          {/* Price */}
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="text-4xl font-black text-[#E7B52C]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                ₹{kitPrice}
              </span>
              <span className="text-[#8F857B]">per kit</span>
            </div>
            <p className="text-sm text-[#8F857B]">
              Minimum order: {minQty} kits • Serves 4 per kit
            </p>
          </div>

          {/* What's Included */}
          <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-6">
            <h3 className="font-bold text-lg text-[#F8F5EE] mb-4">What&apos;s Included</h3>
            <div className="grid grid-cols-2 gap-3">
              {kitIncludes.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#E7B52C]" />
                  <span className="text-sm text-[#C7BFB3]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-semibold text-[#F8F5EE] mb-3">
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
            <div className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#C7BFB3]">Subtotal</span>
                <span className="text-[#E7B52C] font-bold text-xl">₹{calculateTotal().toFixed(2)}</span>
              </div>
              <p className="text-xs text-[#8F857B]">
                +₹{packagingCharge} packaging charge at checkout
              </p>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!meetsMinimum || isAdding}
              className="w-full bg-[#E7B52C] hover:bg-[#F4C542] text-black font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-[14px] hover:shadow-[0_8px_25px_rgba(231,181,44,0.25)] transition-all duration-200"
              style={{ boxShadow: meetsMinimum ? "0 0 20px rgba(231,181,44,0.15)" : "none" }}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
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
