"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItemUI, CartState, Product } from "@/types";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QTY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

interface CartContextType extends CartState {
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_PACKAGING_CHARGE = 30;
const BULK_PACKAGING_CHARGE = 50;
const BULK_KIT_THRESHOLD = 10;
const TAX_RATE = 0.05; // 5% GST

// ─── Reducer ──────────────────────────────────────────────────────────────────

function countKitQuantity(items: CartItemUI[]): number {
  return items
    .filter((i) => /kit/i.test(i.product.name) && !i.id.startsWith("addon"))
    .reduce((sum, i) => sum + i.quantity, 0);
}

function calcTotals(items: CartItemUI[]): Omit<CartState, "items" | "coupon"> {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 0;
  const kitQty = countKitQuantity(items);
  const packagingCharge =
    items.length > 0
      ? kitQty > BULK_KIT_THRESHOLD
        ? BULK_PACKAGING_CHARGE
        : BASE_PACKAGING_CHARGE
      : 0;
  const shippingCharge = 0; // Customer arranges own delivery
  const taxable = subtotal - discount + packagingCharge;
  const tax = Math.round(taxable * TAX_RATE);
  const total = taxable + shippingCharge + tax;
  return { subtotal, discount, packagingCharge, shippingCharge, tax, total };
}

interface FullCartState extends CartState {
  isOpen: boolean;
}

function cartReducer(state: FullCartState, action: CartAction): FullCartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.product.id === product.id);
      let items: CartItemUI[];
      if (existing) {
        items = state.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        items = [
          ...state.items,
          {
            id: product.id,
            product,
            quantity,
            price: product.sale_price ?? product.price,
          },
        ];
      }
      return { ...state, items, ...calcTotals(items), isOpen: true };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.id !== action.payload.id);
      return { ...state, items, ...calcTotals(items) };
    }
    case "UPDATE_QTY": {
      const items = state.items
        .map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { ...state, items, ...calcTotals(items) };
    }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        coupon: null,
        ...calcTotals([]),
      };
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

const INITIAL: FullCartState = {
  items: [],
  coupon: null,
  subtotal: 0,
  discount: 0,
  packagingCharge: 0,
  shippingCharge: 0,
  tax: 0,
  total: 0,
  isOpen: false,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL);

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    toast.success(`${product.name} added to cart`, {
      description: `Qty: ${quantity} • ₹${(product.sale_price ?? product.price) * quantity}`,
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQty = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
      }}
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
