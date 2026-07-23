"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Voucher, VoucherDiscountType } from "@/types";

const DISCOUNT_TYPES: { value: VoucherDiscountType; label: string; description: string }[] = [
  { value: "percentage", label: "Percentage (%)", description: "e.g. 10% off subtotal" },
  { value: "fixed_amount", label: "Fixed Amount (₹)", description: "e.g. ₹50 off" },
  { value: "free_delivery", label: "Free Delivery", description: "Waives shipping charge" },
  { value: "buy_x_get_y", label: "Buy X Get Y", description: "Architecture ready" },
];

const USER_ROLES = ["customer", "admin", "wholesale"];

interface VoucherFormProps {
  voucher?: Voucher;
  isEditing?: boolean;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function toDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export function VoucherForm({ voucher, isEditing = false }: VoucherFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: voucher?.code ?? "",
    description: voucher?.description ?? "",
    discount_type: voucher?.discount_type ?? "fixed_amount" as VoucherDiscountType,
    discount_value: voucher?.discount_value ?? 0,
    max_discount: voucher?.max_discount ?? null as number | null,
    min_order_value: voucher?.min_order_value ?? null as number | null,
    max_order_value: voucher?.max_order_value ?? null as number | null,
    start_date: toDatetimeLocal(voucher?.start_date),
    expiry_date: toDatetimeLocal(voucher?.expiry_date),
    max_global_uses: voucher?.max_global_uses ?? null as number | null,
    max_uses_per_user: voucher?.max_uses_per_user ?? 1,
    applicable_user_roles: voucher?.applicable_user_roles ?? [] as string[],
    first_order_only: voucher?.first_order_only ?? false,
    new_customers_only: voucher?.new_customers_only ?? false,
    existing_customers_only: voucher?.existing_customers_only ?? false,
    is_stackable: voucher?.is_stackable ?? false,
    free_delivery: voucher?.free_delivery ?? false,
    is_active: voucher?.is_active ?? true,
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
        expiry_date: form.expiry_date ? new Date(form.expiry_date).toISOString() : null,
        applicable_product_ids: [],
        excluded_product_ids: [],
        applicable_category_ids: [],
        excluded_category_ids: [],
      };

      const url = isEditing
        ? `/api/admin/vouchers/${voucher!.id}`
        : "/api/admin/vouchers";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to save voucher");
        return;
      }

      toast.success(isEditing ? "Voucher updated!" : "Voucher created!");
      router.push("/admin/vouchers");
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#D4A843] w-full transition-colors";
  const labelClass = "text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 block";

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl"
    >
      {/* ── Core Settings ─────────────────────────────────────────────────── */}
      <section className="bg-white border border-gray-200 rounded shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3">
          Core Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Code */}
          <div>
            <label className={labelClass}>Voucher Code *</label>
            <div className="flex gap-2">
              <input
                required
                type="text"
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="e.g. SAVE50"
                maxLength={30}
                className={inputClass + " font-mono"}
              />
              <button
                type="button"
                onClick={() => set("code", generateCode())}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold text-gray-600 transition-colors flex items-center gap-1 whitespace-nowrap"
                title="Generate random code"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                className="w-4 h-4 accent-[#6E1D25]"
              />
              <span className="text-sm font-semibold text-gray-800">Active</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Internal notes about this voucher"
            className={inputClass + " resize-none"}
          />
        </div>

        {/* Discount Type */}
        <div>
          <label className={labelClass}>Discount Type *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DISCOUNT_TYPES.map((dt) => (
              <button
                key={dt.value}
                type="button"
                onClick={() => set("discount_type", dt.value)}
                className={`p-3 rounded border text-left transition-all ${
                  form.discount_type === dt.value
                    ? "border-[#6E1D25] bg-[#6E1D25]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="text-xs font-bold text-gray-800">{dt.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{dt.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Discount Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Discount Value {form.discount_type === "percentage" ? "(%)" : "(₹)"} *
            </label>
            <input
              required
              type="number"
              min="0"
              max={form.discount_type === "percentage" ? "100" : undefined}
              step="0.01"
              value={form.discount_value}
              onChange={(e) => set("discount_value", parseFloat(e.target.value) || 0)}
              className={inputClass}
            />
          </div>

          {form.discount_type === "percentage" && (
            <div>
              <label className={labelClass}>Max Discount Cap (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.max_discount ?? ""}
                onChange={(e) => set("max_discount", e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="No cap"
                className={inputClass}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Order Requirements ─────────────────────────────────────────────── */}
      <section className="bg-white border border-gray-200 rounded shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3">
          Order Requirements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Minimum Order Value (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.min_order_value ?? ""}
              onChange={(e) =>
                set("min_order_value", e.target.value ? parseFloat(e.target.value) : null)
              }
              placeholder="No minimum"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Maximum Order Value (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.max_order_value ?? ""}
              onChange={(e) =>
                set("max_order_value", e.target.value ? parseFloat(e.target.value) : null)
              }
              placeholder="No maximum"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ── Validity Period ────────────────────────────────────────────────── */}
      <section className="bg-white border border-gray-200 rounded shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3">
          Validity Period
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date</label>
            <input
              type="datetime-local"
              value={form.start_date}
              onChange={(e) => set("start_date", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Expiry Date</label>
            <input
              type="datetime-local"
              value={form.expiry_date}
              onChange={(e) => set("expiry_date", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ── Usage Limits ───────────────────────────────────────────────────── */}
      <section className="bg-white border border-gray-200 rounded shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3">
          Usage Limits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Max Global Uses</label>
            <input
              type="number"
              min="1"
              value={form.max_global_uses ?? ""}
              onChange={(e) =>
                set("max_global_uses", e.target.value ? parseInt(e.target.value) : null)
              }
              placeholder="Unlimited"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Max Uses Per User *</label>
            <input
              required
              type="number"
              min="1"
              value={form.max_uses_per_user}
              onChange={(e) => set("max_uses_per_user", parseInt(e.target.value) || 1)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* ── Customer Eligibility ───────────────────────────────────────────── */}
      <section className="bg-white border border-gray-200 rounded shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3">
          Customer Eligibility
        </h3>

        {/* Role restrictions */}
        <div>
          <label className={labelClass}>Applicable User Roles (empty = all)</label>
          <div className="flex gap-3 flex-wrap mt-1">
            {USER_ROLES.map((role) => (
              <label key={role} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.applicable_user_roles.includes(role)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      set("applicable_user_roles", [...form.applicable_user_roles, role]);
                    } else {
                      set("applicable_user_roles", form.applicable_user_roles.filter((r) => r !== role));
                    }
                  }}
                  className="w-4 h-4 accent-[#6E1D25]"
                />
                <span className="text-sm text-gray-700 capitalize">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer type restrictions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: "first_order_only" as const, label: "First Order Only" },
            { key: "new_customers_only" as const, label: "New Customers Only" },
            { key: "existing_customers_only" as const, label: "Existing Customers Only" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer p-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="w-4 h-4 accent-[#6E1D25]"
              />
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="bg-white border border-gray-200 rounded shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3">
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "is_stackable" as const, label: "Stackable", desc: "Can be combined with other vouchers" },
            { key: "free_delivery" as const, label: "Free Delivery", desc: "Waives shipping charge" },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded border border-gray-200 hover:border-gray-300">
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="w-4 h-4 accent-[#6E1D25] mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* ── Submit ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-[#6E1D25] hover:bg-[#5A1520] text-white font-bold text-sm px-6 py-3 rounded transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isEditing ? "Save Changes" : "Create Voucher"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-3 rounded border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}
