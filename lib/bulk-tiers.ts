/**
 * Bulk Discount Tiers — single source of truth used by both client and server.
 *
 * Tiers are evaluated in DESCENDING order of minQty so the best applicable
 * tier is matched first.
 *
 * discount_type:
 *   "free_kits"   — freeKits kits are deducted at the per-kit price
 *   "percentage"  — flat % off the kit subtotal
 */

export interface BulkTier {
  minQty: number;
  label: string;           // shown in cart / checkout
  promoLabel: string;      // short badge e.g. "2 FREE"
  discount_type: "free_kits" | "percentage";
  freeKits?: number;       // used when discount_type === "free_kits"
  percentage?: number;     // used when discount_type === "percentage"
}

export const BULK_TIERS: BulkTier[] = [
  {
    minQty: 20,
    label: "10% off — bulk order",
    promoLabel: "10% OFF",
    discount_type: "percentage",
    percentage: 10,
  },
  {
    minQty: 10,
    label: "2 kits free — bulk order",
    promoLabel: "2 FREE",
    discount_type: "free_kits",
    freeKits: 2,
  },
  {
    minQty: 6,
    label: "1 kit free — bulk order",
    promoLabel: "1 FREE",
    discount_type: "free_kits",
    freeKits: 1,
  },
];

/** Returns the best applicable tier for a given kit quantity, or null. */
export function getApplicableTier(kitQty: number): BulkTier | null {
  // Tiers are already in descending order; return first match
  return BULK_TIERS.find((t) => kitQty >= t.minQty) ?? null;
}

/**
 * Next tier the customer can unlock, with kits needed.
 * Returns null when already at the highest tier.
 */
export function getNextTier(kitQty: number): { tier: BulkTier; kitsNeeded: number } | null {
  // Find the lowest-minQty tier that hasn't been reached yet
  const unmet = [...BULK_TIERS]
    .reverse() // ascending
    .find((t) => kitQty < t.minQty);
  if (!unmet) return null;
  return { tier: unmet, kitsNeeded: unmet.minQty - kitQty };
}

/**
 * Calculate the monetary discount amount for the active tier.
 * kitUnitPrice — price of a single kit (used for free_kits tiers).
 * kitSubtotal  — total value of all kit items (used for percentage tiers).
 */
export function calcBulkDiscount(
  tier: BulkTier,
  kitUnitPrice: number,
  kitSubtotal: number
): number {
  if (tier.discount_type === "free_kits" && tier.freeKits) {
    return Math.round(tier.freeKits * kitUnitPrice * 100) / 100;
  }
  if (tier.discount_type === "percentage" && tier.percentage) {
    return Math.round((kitSubtotal * tier.percentage) / 100 * 100) / 100;
  }
  return 0;
}
