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
      <div className="border-t border-[#E6DFD5] pt-6">
        <h3
          className="font-bold text-2xl text-[#1A1A1A] mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Customize Your Kit
        </h3>
        <p className="text-sm text-[#7A7570] mb-6">
          Every kit includes 3 fresh laphing sheets and materials to make 3 portions: signature chilli oil, garlic water, soya chunks, and crispy wai wai topping. Add extras below.
        </p>

        <div className="space-y-4">
          {addons.map((addon) => (
            <div
              key={addon.key}
              className="flex items-center justify-between p-4 bg-[#F7F3EC] border border-[#E6DFD5] rounded-xl hover:bg-[#E6DFD5]/20 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {addon.image && (
                  <div className="w-12 h-12 rounded bg-white border border-[#E6DFD5] overflow-hidden flex-shrink-0">
                    <Image
                      src={addon.image}
                      alt={addon.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h4 className="font-bold text-[#1A1A1A] text-sm mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{addon.name}</h4>
                  <p className="text-xs text-[#7A7570]">{addon.description}</p>
                  <p className="text-xs text-[#6E1D25] font-bold mt-1">+₹{addon.price} each</p>
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
        <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-xl p-4">
          <div className="flex items-center justify-between text-sm mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="text-[#4A4540]">Base Kit × {kitQuantity}</span>
            <span className="text-[#1A1A1A] font-semibold">
              ₹{((config?.laphing_kit_price || 50) * kitQuantity).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="text-[#4A4540]">Extras</span>
            <span className="text-[#1A1A1A] font-semibold">₹{calculateExtrasCost().toFixed(2)}</span>
          </div>
          <div className="border-t border-[#E6DFD5] pt-2 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="flex items-center justify-between">
              <span className="text-[#1A1A1A] font-bold">Subtotal</span>
              <span className="text-[#6E1D25] font-bold text-lg">
                ₹
                {((config?.laphing_kit_price || 50) * kitQuantity + calculateExtrasCost()).toFixed(
                  2
                )}
              </span>
            </div>
            <p className="text-xs text-[#7A7570] mt-1">
              +₹{config?.packaging_charge || 30} packaging charge at checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
