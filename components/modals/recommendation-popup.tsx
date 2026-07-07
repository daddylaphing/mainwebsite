"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

interface RecommendationPopupProps {
  isOpen: boolean;
  currentKitQty: number;
  currentExtraSheets: number;
  kitPrice: number;
  extraSheetPrice: number;
  onAddKit: () => void;
  onDismiss: () => void;
}

export function RecommendationPopup({
  isOpen,
  currentExtraSheets,
  kitPrice,
  extraSheetPrice,
  onAddKit,
  onDismiss,
}: RecommendationPopupProps) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  const handleAddKit = () => {
    onAddKit();
    setShow(false);
  };

  const handleContinue = () => {
    onDismiss();
    setShow(false);
  };

  const savings = currentExtraSheets * extraSheetPrice - kitPrice;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="bg-[#141414] border border-white/[0.08] max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E7B52C] to-[#F4C542] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-black" />
              </div>
              <DialogTitle className="text-2xl font-black text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Better Value Alert!
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-[#C7BFB3] leading-relaxed">
            Looks like you&apos;re purchasing <strong>{currentExtraSheets} extra sheets</strong>.
          </p>

          <div className="bg-[#1B1B1B] border border-white/[0.08] rounded-xl p-4 space-y-3">
            <p className="text-sm text-[#C7BFB3]">
              Adding <strong>one more Laphing Kit</strong> may be a better value because it already
              includes:
            </p>
            <ul className="space-y-2 text-sm text-[#C7BFB3]/80">
              <li className="flex items-start gap-2">
                <span className="text-[#E7B52C] mt-0.5 font-bold">✔</span>
                <span>1 Fresh Laphing Sheet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E7B52C] mt-0.5 font-bold">✔</span>
                <span>All essential sauces and seasonings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E7B52C] mt-0.5 font-bold">✔</span>
                <span>Preparation guide</span>
              </li>
            </ul>
          </div>

          {savings > 0 && (
            <div className="bg-gradient-to-r from-[#E7B52C]/10 to-[#F4C542]/10 border border-[#E7B52C]/30 rounded-xl p-3">
              <p className="text-center text-sm font-bold text-white">
                You could save approximately ₹{savings.toFixed(0)} or more!
              </p>
            </div>
          )}

          <p className="text-xs text-[#8F857B] italic">
            This suggestion is based on your current selections. You can always customize your order.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleAddKit}
            className="flex-1 bg-[#E7B52C] hover:bg-[#F4C542] text-black font-bold rounded-[14px]"
            style={{ boxShadow: "0 8px 15px rgba(231,181,44,0.15)" }}
          >
            Add Another Kit
          </Button>
          <Button
            onClick={handleContinue}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/5 rounded-[14px]"
          >
            Continue Anyway
          </Button>
        </div>

        <button
          onClick={handleContinue}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
