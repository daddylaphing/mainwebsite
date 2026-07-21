"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { ShoppingBag, Trash2, Plus, Minus, ShieldCheck, Leaf, Zap, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/cart-provider";
import { SuggestionModal } from "@/components/cart/suggestion-modal";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import type { Product } from "@/types";

// ─── Addons definition ────────────────────────────────────────────────────────

const ADDONS = [
  {
    id: "sheet",
    name: "Extra Laphing Sheet",
    price: 20,
    icon: Layers,
    image: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/freshsheet.png",
  },
  {
    id: "chili",
    name: "Extra Chilli Oil",
    price: 15,
    icon: null,
    image: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/signaturechillioil.png",
  },
  {
    id: "garlic",
    name: "Extra Garlic Water",
    price: 10,
    icon: null,
    image: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/garlicwater.png",
  },
  {
    id: "sauce",
    name: "Extra Laphing Sauce",
    price: 15,
    icon: null,
    image: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/laphingsauce.png",
  },
  {
    id: "seasoning",
    name: "Extra Seasoning Mix",
    price: 10,
    icon: null,
    image: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/seasoningmix.png",
  },
  {
    id: "waiwai",
    name: "Extra Wai Wai",
    price: 20,
    icon: null,
    image: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/waiwai.png",
  },
];

function isKitProduct(name: string): boolean {
  return /laphing|kit/i.test(name);
}

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Leaf, label: "Fresh & Hygienic" },
  { icon: Zap, label: "Fast Delivery" },
];

export function CartSheet() {
  const {
    isOpen,
    closeCart,
    items,
    subtotal,
    packagingCharge,
    shippingCharge,
    tax,
    total,
    discount,
    removeItem,
    updateQty,
    addItem,
  } = useCart();

  const [showSuggestion, setShowSuggestion] = useState(false);
  const [upsellDismissed, setUpsellDismissed] = useState(false);

  // Compute quantities of each addon from the cart items
  const addonQtys = useMemo(() => {
    return {
      sheet: items.find((i) => i.id === "addon-sheet")?.quantity || 0,
      chili: items.find((i) => i.id === "addon-chili")?.quantity || 0,
      garlic: items.find((i) => i.id === "addon-garlic")?.quantity || 0,
      sauce: items.find((i) => i.id === "addon-sauce")?.quantity || 0,
      seasoning: items.find((i) => i.id === "addon-seasoning")?.quantity || 0,
      waiwai: items.find((i) => i.id === "addon-waiwai")?.quantity || 0,
    } as Record<string, number>;
  }, [items]);

  // Upsell: 1 Kit + 2 Extra Sheets → suggest adding another kit
  const kitQty = useMemo(
    () =>
      items
        .filter((i) => isKitProduct(i.product.name) && !i.id.startsWith("addon"))
        .reduce((s, i) => s + i.quantity, 0),
    [items]
  );
  const extraSheetQty = addonQtys.sheet || 0;

  useEffect(() => {
    if (kitQty === 1 && extraSheetQty >= 2 && !upsellDismissed) {
      setShowSuggestion(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kitQty, extraSheetQty]);

  const updateAddon = (id: string, delta: number) => {
    const addon = ADDONS.find((a) => a.id === id);
    if (!addon) return;

    const addonProductId = `addon-${id}`;
    const existing = items.find((i) => i.id === addonProductId);

    if (delta > 0) {
      const addonProduct = {
        id: addonProductId,
        name: addon.name,
        price: addon.price,
        images: addon.image ? [addon.image] : [],
        is_active: true,
      } as unknown as Product;
      addItem(addonProduct, 1);
    } else if (existing) {
      updateQty(addonProductId, existing.quantity - 1);
    }
  };

  const confirmKeepSheet = () => {
    setShowSuggestion(false);
    setUpsellDismissed(true);
  };

  const confirmSwitchToKit = () => {
    // Add another kit
    const kitItem = items.find((i) => isKitProduct(i.product.name) && !i.id.startsWith("addon"));
    const kitProduct = kitItem
      ? kitItem.product
      : ({
          id: "kit-id-fallback",
          name: "LAPHING KIT",
          price: 50,
          images: ["https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/laphingkit.png"],
          is_active: true,
        } as unknown as Product);
    addItem(kitProduct, 1);
    setShowSuggestion(false);
    setUpsellDismissed(true);
  };

  const hasKitItem = useMemo(
    () => items.some((item) => isKitProduct(item.product.name)),
    [items]
  );

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
        <SheetContent
          side="right"
          className="w-full sm:w-[420px] bg-[#FAFAF8] border-l border-[#E6DFD5] p-0 flex flex-col"
        >
          {/* Header */}
          <SheetHeader className="px-5 py-4 border-b border-[#E6DFD5] flex-row items-center justify-between space-y-0">
            <SheetTitle className="text-[#1A1A1A] font-bold text-xs uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
              YOUR CART ({items.reduce((s, i) => s + i.quantity, 0)})
            </SheetTitle>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            {/* Items */}
            <div className="px-5 py-4">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 py-16"
                  >
                    <ShoppingBag className="h-16 w-16 text-[#7A7570]/20" />
                    <p className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Your cart is empty</p>
                    <Link
                      href="/#products"
                      onClick={closeCart}
                      className="inline-flex items-center justify-center h-9 px-6 rounded-full bg-[#1A1A1A] hover:bg-[#6E1D25] text-white text-xs font-bold uppercase tracking-widest transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Start Shopping
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 p-3 bg-[#F7F3EC] rounded-lg border border-[#E6DFD5]"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-md bg-white overflow-hidden shrink-0 border border-[#E6DFD5]">
                          {item.product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getProxiedImageUrl(item.product.images[0])}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#FAFAF8]">
                              <ShoppingBag className="h-5 w-5 text-[#7A7570]/30" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1A1A1A] text-sm font-semibold truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {item.product.name}
                          </p>
                          <p className="text-[#6E1D25] text-sm font-bold mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </p>

                          {/* Qty Controls */}
                          <div className="flex items-center bg-white border border-[#E6DFD5] rounded-lg p-0.5 gap-0.5 mt-2 w-max">
                            <button
                              onClick={() => {
                                // If they decrease a Wholesale product, make sure it stays above minimum
                                const isWholesale = /wholesale/i.test(item.product.name);
                                const isKit = isKitProduct(item.product.name) && !item.id.startsWith("addon");
                                const min = isWholesale ? 5 : isKit ? 2 : 1;
                                if (item.quantity > min) {
                                  updateQty(item.id, item.quantity - 1);
                                } else if (item.quantity === min) {
                                  removeItem(item.id);
                                }
                              }}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#FAFAF8] transition-colors cursor-pointer text-xs font-bold"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-[#1A1A1A] font-semibold text-xs w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#FAFAF8] transition-colors cursor-pointer text-xs font-bold"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#7A7570]/40 hover:text-destructive transition-colors self-start p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Add Extra (A La Carte) — shown only when a kit/laphing in cart */}
            <AnimatePresence>
              {hasKitItem && items.length > 0 && (
                <motion.div
                  key="addons"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 border-t border-[#E6DFD5] pt-4">
                    <p className="text-[#1A1A1A] font-bold text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      ADD EXTRA (A LA CARTE)
                    </p>
                    <p className="text-[#7A7570] text-xs mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Customize your kit with additional portions
                    </p>
                    <div className="flex flex-col gap-2">
                      {ADDONS.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between p-3 bg-[#F7F3EC] rounded-lg border border-[#E6DFD5] hover:border-[#D4A843]/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-white flex items-center justify-center border border-[#E6DFD5] overflow-hidden shrink-0">
                              {addon.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={addon.image}
                                  alt={addon.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : addon.icon ? (
                                <addon.icon className="text-[#7A7570]/40" size={18} />
                              ) : null}
                            </div>
                            <div>
                              <p className="text-[#1A1A1A] text-xs font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{addon.name}</p>
                              <p className="text-[#6E1D25] text-xs font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>₹{addon.price}</p>
                            </div>
                          </div>
                          {/* Stepper */}
                          <div className="flex items-center bg-white border border-[#E6DFD5] rounded-lg p-0.5 gap-0.5 h-7">
                            <button
                              onClick={() => updateAddon(addon.id, -1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#FAFAF8] transition-colors cursor-pointer text-xs font-bold leading-none"
                              aria-label={`Decrease ${addon.name}`}
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-[#1A1A1A] text-xs font-semibold">
                              {addonQtys[addon.id] || 0}
                            </span>
                            <button
                              onClick={() => updateAddon(addon.id, 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#FAFAF8] transition-colors cursor-pointer text-xs font-bold leading-none"
                              aria-label={`Increase ${addon.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-[#E6DFD5] space-y-3 bg-[#F7F3EC]">
              {/* Breakdown */}
              <div className="space-y-1.5 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex justify-between text-[#4A4540]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#4A4540]">
                  <span>Packaging Charges</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{packagingCharge}</span>
                </div>
                <div className="flex justify-between text-[#4A4540]">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{tax}</span>
                </div>
                <Separator className="bg-[#E6DFD5] my-2" />
                <div className="flex justify-between text-[#1A1A1A] font-bold text-base">
                  <span>Total</span>
                  <span className="text-[#6E1D25]">₹{total}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full h-12 flex items-center justify-center rounded-[14px] bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                PROCEED TO CHECKOUT →
              </Link>

              {/* Trust Badges */}
              <div className="flex items-center justify-between pt-1">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center gap-1 text-[#7A7570]/50">
                    <badge.icon className="h-4 w-4" />
                    <span className="text-[9px] font-semibold text-center leading-tight">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Suggestion Modal */}
      <SuggestionModal
        isOpen={showSuggestion}
        onClose={confirmKeepSheet}
        onConfirm={confirmSwitchToKit}
      />
    </>
  );
}
