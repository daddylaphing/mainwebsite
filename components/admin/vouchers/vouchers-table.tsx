"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Copy,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  ChevronDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import type { Voucher } from "@/types";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expired" },
];

function getVoucherStatus(v: Voucher): "active" | "inactive" | "expired" {
  if (!v.is_active) return "inactive";
  if (v.expiry_date && new Date(v.expiry_date) < new Date()) return "expired";
  return "active";
}

function statusBadge(status: "active" | "inactive" | "expired") {
  const styles = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-50 text-gray-500 border-gray-200",
    expired: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${styles[status]}`}>
      {status}
    </span>
  );
}

function discountLabel(v: Voucher): string {
  switch (v.discount_type) {
    case "percentage":
      return `${v.discount_value}%${v.max_discount ? ` (max ₹${v.max_discount})` : ""}`;
    case "fixed_amount":
      return `₹${v.discount_value}`;
    case "free_delivery":
      return "Free Delivery";
    case "buy_x_get_y":
      return "Buy X Get Y";
    default:
      return `${v.discount_value}`;
  }
}

interface VouchersTableProps {
  initialVouchers: Voucher[];
  initialTotal: number;
}

export function VouchersTable({ initialVouchers, initialTotal }: VouchersTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [total] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Client-side search + filter (already fetched from server)
  const filtered = vouchers.filter((v) => {
    const matchesSearch =
      !search ||
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      (v.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      !statusFilter || getVoucherStatus(v) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleActive = async (v: Voucher) => {
    setTogglingId(v.id);
    try {
      const res = await fetch(`/api/admin/vouchers/${v.id}/activate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !v.is_active }),
      });
      if (!res.ok) throw new Error();
      setVouchers((prev) =>
        prev.map((item) =>
          item.id === v.id ? { ...item, is_active: !item.is_active } : item
        )
      );
      toast.success(`Voucher ${!v.is_active ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update voucher status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (v: Voucher) => {
    if (!confirm(`Delete voucher "${v.code}"? This cannot be undone.`)) return;
    setDeletingId(v.id);
    try {
      const res = await fetch(`/api/admin/vouchers/${v.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setVouchers((prev) => prev.filter((item) => item.id !== v.id));
      toast.success(`Voucher "${v.code}" deleted`);
    } catch {
      toast.error("Failed to delete voucher");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (v: Voucher) => {
    setDuplicatingId(v.id);
    try {
      const res = await fetch(`/api/admin/vouchers/${v.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVouchers((prev) => [data.voucher, ...prev]);
      toast.success(`Duplicated as "${data.voucher.code}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to duplicate");
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleRefresh = () => {
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code or description…"
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-[#D4A843]"
          />
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filter
          <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        <button
          onClick={handleRefresh}
          disabled={isPending}
          className="px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          title="Refresh"
        >
          ↻
        </button>

        <Link
          href="/admin/vouchers/new"
          className="flex items-center gap-2 bg-[#6E1D25] hover:bg-[#5A1520] text-white font-bold text-sm px-4 py-2 rounded transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Voucher
        </Link>
      </div>

      {/* Filter bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">Status:</span>
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    statusFilter === f.value
                      ? "bg-[#6E1D25] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count */}
      <p className="text-xs text-gray-400">
        Showing {filtered.length} of {total} vouchers
      </p>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Status", "Code", "Type", "Value", "Uses", "Remaining", "Expiry", "Created", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                    No vouchers found
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const status = getVoucherStatus(v);
                  const remaining =
                    v.max_global_uses !== null ? v.max_global_uses - v.used_count : "∞";
                  const isLoading =
                    deletingId === v.id || togglingId === v.id || duplicatingId === v.id;

                  return (
                    <>
                      <tr
                        key={v.id}
                        className={`hover:bg-gray-50 transition-colors ${isLoading ? "opacity-60" : ""}`}
                      >
                        <td className="px-4 py-3">{statusBadge(status)}</td>
                        <td className="px-4 py-3 font-mono font-bold text-gray-900 text-xs">
                          {v.code}
                        </td>
                        <td className="px-4 py-3 text-gray-600 capitalize text-xs">
                          {v.discount_type.replace("_", " ")}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap text-xs">
                          {discountLabel(v)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {v.used_count}{v.max_global_uses ? `/${v.max_global_uses}` : ""}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{remaining}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                          {v.expiry_date
                            ? new Date(v.expiry_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "No expiry"}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(v.created_at).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {/* Toggle active */}
                            <button
                              onClick={() => handleToggleActive(v)}
                              disabled={isLoading}
                              title={v.is_active ? "Deactivate" : "Activate"}
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500"
                            >
                              {v.is_active ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            {/* Expand for history */}
                            <button
                              onClick={() =>
                                setExpandedId((prev) => (prev === v.id ? null : v.id))
                              }
                              title="View history"
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {/* Edit */}
                            <Link
                              href={`/admin/vouchers/${v.id}/edit`}
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicate(v)}
                              disabled={isLoading}
                              title="Duplicate"
                              className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(v)}
                              disabled={isLoading}
                              title="Delete"
                              className="p-1.5 rounded hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded: redemption summary */}
                      {expandedId === v.id && (
                        <tr key={`${v.id}-expanded`}>
                          <td colSpan={9} className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                            <VoucherExpandedRow voucherId={v.id} />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Lazy-loaded expanded row ────────────────────────────────────────────────

function VoucherExpandedRow({ voucherId }: { voucherId: string }) {
  const [data, setData] = useState<{
    redemptions: Array<{ id: string; user_id: string; discount_amount: number; status: string; created_at: string }>;
    audit_logs: Array<{ id: string; action: string; admin_id: string | null; created_at: string }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!loaded && !loading) {
    setLoading(true);
    fetch(`/api/admin/vouchers/${voucherId}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoaded(true);
      })
      .catch(() => setLoaded(true))
      .finally(() => setLoading(false));
  }

  if (loading) {
    return <p className="text-xs text-gray-400">Loading history…</p>;
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      {/* Redemption history */}
      <div>
        <p className="font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">
          Redemption History ({data.redemptions.length})
        </p>
        {data.redemptions.length === 0 ? (
          <p className="text-gray-400">No redemptions yet.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left pb-1">Date</th>
                <th className="text-left pb-1">Discount</th>
                <th className="text-left pb-1">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.redemptions.slice(0, 10).map((r) => (
                <tr key={r.id}>
                  <td className="py-1 text-gray-500">
                    {new Date(r.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-1 font-semibold text-gray-700">₹{r.discount_amount}</td>
                  <td className="py-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        r.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : r.status === "restored"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Audit log */}
      <div>
        <p className="font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">
          Admin Audit Log ({data.audit_logs.length})
        </p>
        {data.audit_logs.length === 0 ? (
          <p className="text-gray-400">No audit entries.</p>
        ) : (
          <div className="space-y-1">
            {data.audit_logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center gap-2 text-gray-500">
                <span className="text-[9px] text-gray-400 w-20 shrink-0">
                  {new Date(log.created_at).toLocaleDateString("en-IN")}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    log.action === "created"
                      ? "bg-blue-100 text-blue-700"
                      : log.action === "deleted"
                      ? "bg-red-100 text-red-700"
                      : log.action === "activated"
                      ? "bg-green-100 text-green-700"
                      : log.action === "deactivated"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
