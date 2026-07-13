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
      <DialogContent className="bg-[#FAFAF8] border border-[#E6DFD5] max-w-md rounded-3xl shadow-[0_24px_50px_rgba(26,26,26,0.15)]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6E1D25] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Better Value Alert!
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-[#7A7570] leading-relaxed text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Looks like you&apos;re purchasing <strong>{currentExtraSheets} extra sheets</strong>.
          </p>

          <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-xl p-4 space-y-3">
            <p className="text-sm text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Adding <strong>one more Laphing Kit</strong> may be a better value because it already
              includes:
            </p>
            <ul className="space-y-2 text-sm text-[#7A7570]">
              <li className="flex items-start gap-2">
                <span className="text-[#6E1D25] mt-0.5 font-bold">✔</span>
                <span>1 Fresh Laphing Sheet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6E1D25] mt-0.5 font-bold">✔</span>
                <span>All essential sauces and seasonings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#6E1D25] mt-0.5 font-bold">✔</span>
                <span>Preparation guide</span>
              </li>
            </ul>
          </div>

          {savings > 0 && (
            <div className="bg-[#6E1D25]/10 border border-[#6E1D25]/20 rounded-xl p-3">
              <p className="text-center text-sm font-bold text-[#6E1D25]" style={{ fontFamily: "'Inter', sans-serif" }}>
                You could save approximately ₹{savings.toFixed(0)} or more!
              </p>
            </div>
          )}

          <p className="text-xs text-[#7A7570]/70 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
            This suggestion is based on your current selections. You can always customize your order.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleAddKit}
            className="flex-1 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold rounded-xl transition-all shadow-sm"
          >
            Add Another Kit
          </Button>
          <Button
            onClick={handleContinue}
            variant="outline"
            className="flex-1 border-[#E6DFD5] bg-white text-[#1A1A1A] hover:bg-[#F7F3EC] rounded-xl transition-all shadow-sm font-bold"
          >
            Continue Anyway
          </Button>
        </div>

        <button
          onClick={handleContinue}
          className="absolute top-4 right-4 text-[#7A7570] hover:text-[#1A1A1A] transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
