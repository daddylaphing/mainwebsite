"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface ToastProps {
  open: boolean;
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({
  open,
  message,
  variant = "success",
  onClose,
  duration = 3500,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold max-w-xs ${
          variant === "success"
            ? "bg-white border-green-200 text-green-800"
            : "bg-white border-red-200 text-red-800"
        }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
        role="alert"
      >
        {variant === "success" ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 shrink-0 text-red-600" />
        )}
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
