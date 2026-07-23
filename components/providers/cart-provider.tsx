"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItemUI, CartState, Product } from "@/types";
import { getApplicableTier, calcBulkDiscount, type BulkTier } from "@/lib/bulk-tiers";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

export interface CartContextType extends CartState {
  isOpen: boolean;
  /** Active bulk tier, or null */
  bulkTier: BulkTier | null;
  /** Discount purely from the bulk tier (not voucher) */
  bulkDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PACKAGING_CHARGE = 30; // up to 9 kits
const BULK_PACKAGING_CHARGE = 60; // 10+ kits
const BULK_KIT_THRESHOLD    = 10;
const TAX_RATE              = 0.05;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isKitItem(item: CartItemUI): boolean {
  return /kit/i.test(item.product.name) && !item.id.startsWith("addon");
}

function countKitQty(items: CartItemUI[]): number {
  return items.filter(isKitItem).reduce((s, i) => s + i.quantity, 0);
}

/**
 * Returns the unit price of the cheapest kit in the cart.
 * Used to value "free kit" discounts.
 */
function kitUnitPrice(items: CartItemUI[]): number {
  const kits = items.filter(isKitItem);
  if (!kits.length) return 0;
  return Math.min(...kits.map((i) => i.price));
}

function kitSubtotal(items: CartItemUI[]): number {
  return items.filter(isKitItem).reduce((s, i) => s + i.price * i.quantity, 0);
}

interface CalcResult extends Omit<CartState, "items" | "coupon"> {
  bulkTier: BulkTier | null;
  bulkDiscount: number;
}

function calcTotals(items: CartItemUI[]): CalcResult {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const kitQty    = countKitQty(items);
  const tier      = getApplicableTier(kitQty);
  const bulkDisco = tier
    ? calcBulkDiscount(tier, kitUnitPrice(items), kitSubtotal(items))
    : 0;

  const packagingCharge =
    items.length > 0
      ? kitQty >= BULK_KIT_THRESHOLD
        ? BULK_PACKAGING_CHARGE
        : BASE_PACKAGING_CHARGE
      : 0;

  const shippingCharge = 0;
  const taxable        = subtotal - bulkDisco + packagingCharge;
  const tax            = Math.round(taxable * TAX_RATE);
  const total          = Math.max(0, taxable + shippingCharge + tax);

  return {
    subtotal,
    discount:       bulkDisco,
    packagingCharge,
    shippingCharge,
    tax,
    total,
    bulkTier:       tier,
    bulkDiscount:   bulkDisco,
  };
}

// ─── State ────────────────────────────────────────────────────────────────────

interface FullCartState extends CartState {
  isOpen: boolean;
  bulkTier: BulkTier | null;
  bulkDiscount: number;
}

const INITIAL: FullCartState = {
  items:          [],
  coupon:         null,
  subtotal:       0,
  discount:       0,
  packagingCharge:0,
  shippingCharge: 0,
  tax:            0,
  total:          0,
  isOpen:         false,
  bulkTier:       null,
  bulkDiscount:   0,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: FullCartState, action: CartAction): FullCartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      const items: CartItemUI[] = existing
        ? state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [
            ...state.items,
            {
              id: product.id,
              product,
              quantity,
              price: product.sale_price ?? product.price,
            },
          ];
      return { ...state, items, ...calcTotals(items), isOpen: true };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.payload.id);
      return { ...state, items, ...calcTotals(items) };
    }
    case "UPDATE_QTY": {
      const items = state.items
        .map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        )
        .filter((i) => i.quantity > 0);
      return { ...state, items, ...calcTotals(items) };
    }
    case "CLEAR_CART":
      return { ...state, items: [], coupon: null, ...calcTotals([]) };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL);

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    toast.success(`${product.name} added to cart`, {
      description: `Qty: ${quantity} • ₹${(product.sale_price ?? product.price) * quantity}`,
    });
  }, []);

  const removeItem  = useCallback((id: string) => dispatch({ type: "REMOVE_ITEM", payload: { id } }), []);
  const updateQty   = useCallback((id: string, quantity: number) => dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }), []);
  const clearCart   = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openCart    = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart   = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQty, clearCart, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
