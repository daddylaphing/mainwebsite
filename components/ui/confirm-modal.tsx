"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus confirm button when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmColors = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    default: "bg-[#1A1A1A] hover:bg-[#6E1D25] text-white",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-[#E6DFD5] w-full max-w-sm p-6 flex flex-col gap-4">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#7A7570] hover:text-[#1A1A1A] transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon + title */}
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
              variant === "danger"
                ? "bg-red-500/10"
                : variant === "warning"
                ? "bg-amber-500/10"
                : "bg-[#6E1D25]/10"
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 ${
                variant === "danger"
                  ? "text-red-600"
                  : variant === "warning"
                  ? "text-amber-600"
                  : "text-[#6E1D25]"
              }`}
            />
          </div>
          <div>
            <h2
              id="confirm-modal-title"
              className="font-bold text-[#1A1A1A] text-base leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {title}
            </h2>
            <p
              className="text-sm text-[#7A7570] mt-1 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-[#E6DFD5] text-sm font-bold text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${confirmColors[variant]}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
