"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Gift, Zap } from "lucide-react";
import { BULK_TIERS, getApplicableTier, getNextTier } from "@/lib/bulk-tiers";

interface BulkTierBannerProps {
  kitQty: number;
  kitUnitPrice: number;
}

export function BulkTierBanner({ kitQty, kitUnitPrice }: BulkTierBannerProps) {
  const activeTier = getApplicableTier(kitQty);
  const next = getNextTier(kitQty);

  // Nothing to show if no kits in cart
  if (kitQty === 0) return null;

  // Progress toward the next tier (or 100% if at max)
  const highestTier = BULK_TIERS[0]; // 20 kits
  const lowestTier  = BULK_TIERS[BULK_TIERS.length - 1]; // 6 kits

  let progressPct = 100;
  if (next) {
    // range: from previous tier (or 1) to next.tier.minQty
    const prevMin = activeTier?.minQty ?? 1;
    const range   = next.tier.minQty - prevMin;
    const filled  = kitQty - prevMin;
    progressPct   = Math.round((filled / range) * 100);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="mx-5 mb-3 rounded-xl border border-[#D4A843]/30 bg-gradient-to-r from-[#FDF8EC] to-[#F7F3EC] p-3 space-y-2.5">

          {/* Active tier badge */}
          <AnimatePresence mode="wait">
            {activeTier && (
              <motion.div
                key={activeTier.minQty}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-center gap-2"
              >
                <span className="flex items-center gap-1 bg-[#6E1D25] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                  <Gift className="h-3 w-3" />
                  {activeTier.promoLabel}
                </span>
                <span className="text-xs font-semibold text-[#1A1A1A]">
                  {activeTier.discount_type === "free_kits"
                    ? `${activeTier.freeKits} kit${activeTier.freeKits! > 1 ? "s" : ""} free (₹${(activeTier.freeKits! * kitUnitPrice).toFixed(0)} off)`
                    : `${activeTier.percentage}% off your order`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next tier nudge + progress bar */}
          {next && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="font-bold text-[#1A1A1A]">
                    Add {next.kitsNeeded} more kit{next.kitsNeeded > 1 ? "s" : ""}
                  </span>
                  {" "}to unlock{" "}
                  <span className="font-bold text-[#6E1D25]">{next.tier.promoLabel}</span>
                </p>
                <span className="text-[10px] font-bold text-[#D4A843]">
                  {kitQty}/{next.tier.minQty}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#E6DFD5] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D4A843] to-[#6E1D25] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* At highest tier */}
          {!next && activeTier && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#6E1D25] font-bold">
              <Zap className="h-3.5 w-3.5" />
              Maximum bulk discount applied!
            </div>
          )}

          {/* All tier milestones — mini legend */}
          {!activeTier && (
            <div className="flex items-center gap-3 flex-wrap">
              {[...BULK_TIERS].reverse().map((t) => (
                <span key={t.minQty} className="text-[10px] text-[#7A7570]">
                  <span className="font-bold text-[#1A1A1A]">{t.minQty}+</span> kits → {t.promoLabel}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
