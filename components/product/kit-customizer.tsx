"use client";

import { useState, useEffect } from "react";
import { ProductQuantitySelector } from "./product-quantity-selector";
import { useSiteConfig } from "@/lib/hooks/use-site-config";
import Image from "next/image";

interface KitCustomizerProps {
  kitQuantity: number;
  onChange: (extras: KitExtras) => void;
  disabled?: boolean;
}

export interface KitExtras {
  extra_sheets: number;
  extra_chilli_oil: number;
  extra_garlic_water: number;
  extra_sauce: number;
  extra_seasoning: number;
}

export function KitCustomizer({ kitQuantity, onChange, disabled = false }: KitCustomizerProps) {
  const { data: config } = useSiteConfig();
  const [extras, setExtras] = useState<KitExtras>({
    extra_sheets: 0,
    extra_chilli_oil: 0,
    extra_garlic_water: 0,
    extra_sauce: 0,
    extra_seasoning: 0,
  });

  useEffect(() => {
    onChange(extras);
  }, [extras, onChange]);

  const updateExtra = (key: keyof KitExtras, value: number) => {
    setExtras((prev) => ({ ...prev, [key]: value }));
  };

  const calculateExtrasCost = () => {
    if (!config) return 0;
    return (
      extras.extra_sheets * config.extra_sheet_price +
      extras.extra_chilli_oil * config.extra_chilli_oil_price +
      extras.extra_garlic_water * config.extra_garlic_water_price +
      extras.extra_sauce * (config.extra_sauce_price || 15) +
      extras.extra_seasoning * (config.extra_seasoning_price || 10)
    );
  };

  const addons = [
    {
      key: "extra_sheets" as keyof KitExtras,
      name: "Extra Laphing Sheet",
      price: config?.extra_sheet_price || 20,
      image: config?.product_images.laphing_sheet_wholesale,
      description: "Fresh, handmade laphing sheet",
    },
    {
      key: "extra_chilli_oil" as keyof KitExtras,
      name: "Extra Chilli Oil",
      price: config?.extra_chilli_oil_price || 15,
      image: config?.product_images.chilli_oil,
      description: "Signature spicy chilli oil",
    },
    {
      key: "extra_garlic_water" as keyof KitExtras,
      name: "Extra Garlic Water",
      price: config?.extra_garlic_water_price || 10,
      image: config?.product_images.garlic_water,
      description: "Aromatic garlic water",
    },
    {
      key: "extra_sauce" as keyof KitExtras,
      name: "Extra Sauce",
      price: config?.extra_sauce_price || 15,
      image: null,
      description: "Spicy peanut sauce",
    },
    {
      key: "extra_seasoning" as keyof KitExtras,
      name: "Extra Seasoning",
      price: config?.extra_seasoning_price || 10,
      image: null,
      description: "Signature seasoning mix",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-t border-white/10 pt-6">
        <h3
          className="font-bold text-2xl text-white mb-2"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Customize Your Kit
        </h3>
        <p className="text-sm text-[#C7BFB3] mb-6">
          Every kit includes one of each ingredient. Add extras below.
        </p>

        <div className="space-y-4">
          {addons.map((addon) => (
            <div
              key={addon.key}
              className="flex items-center justify-between p-4 bg-[#141414] border border-white/[0.05] rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {addon.image && (
                  <div className="w-12 h-12 rounded bg-[#111111] border border-white/[0.08] overflow-hidden flex-shrink-0">
                    <Image
                      src={addon.image}
                      alt={addon.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h4 className="font-bold text-[#F8F5EE] text-sm mb-0.5">{addon.name}</h4>
                  <p className="text-xs text-[#8F857B]">{addon.description}</p>
                  <p className="text-xs text-[#C7BFB3] font-semibold mt-1">+₹{addon.price} each</p>
                </div>
              </div>

              <ProductQuantitySelector
                quantity={extras[addon.key]}
                onChange={(value) => updateExtra(addon.key, value)}
                min={0}
                max={50}
                disabled={disabled}
                size="sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Extras Summary */}
      {calculateExtrasCost() > 0 && (
        <div className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#C7BFB3]">Base Kit × {kitQuantity}</span>
            <span className="text-[#F8F5EE] font-semibold">
              ₹{((config?.laphing_kit_price || 50) * kitQuantity).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#C7BFB3]">Extras</span>
            <span className="text-[#F8F5EE] font-semibold">₹{calculateExtrasCost().toFixed(2)}</span>
          </div>
          <div className="border-t border-white/[0.08] pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-[#F8F5EE] font-bold">Subtotal</span>
              <span className="text-[#E7B52C] font-bold text-lg">
                ₹
                {((config?.laphing_kit_price || 50) * kitQuantity + calculateExtrasCost()).toFixed(
                  2
                )}
              </span>
            </div>
            <p className="text-xs text-[#8F857B] mt-1">
              +₹{config?.packaging_charge || 30} packaging charge at checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
