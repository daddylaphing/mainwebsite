"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export interface AppliedVoucher {
  voucher_id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_amount: number;
  free_delivery: boolean;
}

interface VoucherInputProps {
  subtotal: number;
  productIds: string[];
  appliedVoucher: AppliedVoucher | null;
  onApply: (voucher: AppliedVoucher) => void;
  onRemove: () => void;
}

type ValidationState = "idle" | "loading" | "success" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CODE: "Invalid voucher code.",
  EXPIRED: "This voucher has expired.",
  NOT_STARTED: "This voucher is not active yet.",
  DISABLED: "This voucher has been disabled.",
  USAGE_LIMIT_REACHED: "This voucher has reached its usage limit.",
  ALREADY_USED: "You have already used this voucher.",
  MIN_ORDER_NOT_MET: "Your order doesn't meet the minimum order value.",
  MAX_ORDER_EXCEEDED: "Your order exceeds the maximum value for this voucher.",
  NOT_APPLICABLE: "This voucher doesn't apply to items in your cart.",
  FIRST_ORDER_ONLY: "This voucher is only valid on your first order.",
  NEW_CUSTOMERS_ONLY: "This voucher is only for new customers.",
  EXISTING_CUSTOMERS_ONLY: "This voucher is only for existing customers.",
  ROLE_NOT_ELIGIBLE: "This voucher is not available for your account type.",
};

export function VoucherInput({
  subtotal,
  productIds,
  appliedVoucher,
  onApply,
  onRemove,
}: VoucherInputProps) {
  const [code, setCode] = useState("");
  const [validationState, setValidationState] = useState<ValidationState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleApply = async () => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) return;

    setValidationState("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/vouchers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: trimmedCode,
          subtotal,
          product_ids: productIds,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        const msg =
          (data.error && ERROR_MESSAGES[data.error]) ||
          data.message ||
          "Invalid voucher code.";
        setErrorMessage(msg);
        setValidationState("error");
        return;
      }

      setValidationState("success");
      setCode("");
      onApply({
        voucher_id: data.voucher_id,
        code: data.code,
        description: data.description ?? null,
        discount_type: data.discount_type,
        discount_amount: data.discount_amount,
        free_delivery: data.free_delivery ?? false,
      });
    } catch {
      setErrorMessage("Could not validate voucher. Please try again.");
      setValidationState("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCode(value);
    // Reset validation state when user types again
    if (validationState !== "idle") {
      setValidationState("idle");
      setErrorMessage(null);
    }
    // Optional: auto-apply after typing stops (debounced)
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  const handleRemove = () => {
    setValidationState("idle");
    setErrorMessage(null);
    setCode("");
    onRemove();
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider flex items-center gap-1.5">
        <Tag className="h-3.5 w-3.5" />
        Voucher / Coupon Code
      </label>

      <AnimatePresence mode="wait">
        {appliedVoucher ? (
          /* ── Applied state ─────────────────────────────────────────────────── */
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <div>
                <p className="text-green-800 font-bold text-sm font-mono">
                  {appliedVoucher.code}
                </p>
                {appliedVoucher.discount_amount > 0 && (
                  <p className="text-green-600 text-xs">
                    You save ₹{appliedVoucher.discount_amount.toFixed(0)}
                  </p>
                )}
                {appliedVoucher.free_delivery && (
                  <p className="text-green-600 text-xs">Free delivery applied</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-green-600 hover:text-green-800 transition-colors p-1 rounded"
              aria-label="Remove voucher"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          /* ── Input state ───────────────────────────────────────────────────── */
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1.5"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter code (e.g. SAVE10)"
                maxLength={30}
                disabled={validationState === "loading"}
                className={`flex-1 bg-white border rounded-xl px-4 py-3 text-[#1A1A1A] text-sm font-mono uppercase
                  placeholder-[#7A7570]/30 focus:outline-none transition-colors
                  disabled:opacity-60 disabled:cursor-not-allowed
                  ${
                    validationState === "error"
                      ? "border-red-300 focus:border-red-400"
                      : "border-[#E6DFD5] focus:border-[#D4A843]"
                  }`}
                aria-label="Voucher code"
                aria-describedby={validationState === "error" ? "voucher-error" : undefined}
              />
              <button
                type="button"
                onClick={handleApply}
                disabled={!code.trim() || validationState === "loading"}
                className="px-5 py-3 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white text-xs font-bold uppercase
                  tracking-widest rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-1.5 whitespace-nowrap"
              >
                {validationState === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>

            <AnimatePresence>
              {validationState === "error" && errorMessage && (
                <motion.p
                  id="voucher-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1.5 text-red-600 text-xs font-medium"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
