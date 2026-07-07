"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductQuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) =>  void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProductQuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 9999,
  disabled = false,
  size = "md",
}: ProductQuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    const clamped = Math.max(min, Math.min(max, value));
    onChange(clamped);
  };

  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const inputSizeClasses = {
    sm: "w-12 text-sm",
    md: "w-16 text-base",
    lg: "w-20 text-lg",
  };

  const buttonSizeClasses = {
    sm: "px-2",
    md: "px-3",
    lg: "px-4",
  };

  return (
    <div
      className={cn(
        "flex items-center bg-[#1B1B1B] border border-white/[0.08] rounded-[10px] overflow-hidden",
        sizeClasses[size]
      )}
    >
      <button
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        className={cn(
          "text-white/50 hover:text-[#E7B52C] hover:bg-white/[0.03] transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
          buttonSizeClasses[size]
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className={cn(
          "bg-transparent border-none text-center text-[#F8F5EE] focus:ring-0 focus:outline-none p-0 disabled:opacity-50 font-mono font-bold",
          inputSizeClasses[size]
        )}
      />

      <button
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        className={cn(
          "text-white/50 hover:text-[#E7B52C] hover:bg-white/[0.03] transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
          buttonSizeClasses[size]
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
