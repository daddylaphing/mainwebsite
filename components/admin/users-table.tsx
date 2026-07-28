"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Shield, ShieldOff, User, Search, X, Trash2,
  ChevronRight, Package, Clock, Phone, Mail,
  Filter, ArrowUpDown, ExternalLink,
} from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Toast } from "@/components/ui/toast";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  payment_status: string;
  created_at: string;
}

interface UsersTableProps {
  users: Profile[];
}

const ROLE_COLORS: Record<string, string> = {
  admin:     "bg-[#6E1D25]/10 text-[#6E1D25] border border-[#6E1D25]/20",
  wholesale: "bg-blue-500/10 text-blue-700 border border-blue-200",
  customer:  "bg-[#F7F3EC] text-[#7A7570] border border-[#E6DFD5]",
};

const STATUS_COLORS: Record<string, string> = {
  pending:          "bg-yellow-50 text-yellow-700",
  confirmed:        "bg-blue-50 text-blue-700",
  preparing:        "bg-orange-50 text-orange-700",
  packed:           "bg-indigo-50 text-indigo-700",
  out_for_delivery: "bg-purple-50 text-purple-700",
  delivered:        "bg-green-50 text-green-700",
  cancelled:        "bg-red-50 text-red-700",
};

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "admin" | "wholesale">("all");
  const [sortField, setSortField] = useState<"name" | "joined">("joined");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Confirm modals
  const [confirmRole, setConfirmRole] = useState<{ open: boolean; userId: string; currentRole: string }>({ open: false, userId: "", currentRole: "" });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; userId: string; name: string }>({ open: false, userId: "", name: "" });

  // Slide-out panel
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [toast, setToast] = useState<{ open: boolean; message: string; variant: "success" | "error" }>({ open: false, message: "", variant: "success" });
  const showToast = (message: string, variant: "success" | "error" = "success") => setToast({ open: true, message, variant });

  // ── Filtered + sorted users ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.phone || "").includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== "all") list = list.filter(u => u.role === roleFilter);
    list.sort((a, b) => {
      let va = sortField === "name" ? (a.full_name || "").toLowerCase() : a.created_at;
      let vb = sortField === "name" ? (b.full_name || "").toLowerCase() : b.created_at;
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [users, search, roleFilter, sortField, sortDir]);

  // ── Fetch orders when panel opens ────────────────────────────────────────
  useEffect(() => {
    if (!selectedUser) return;
    setOrdersLoading(true);
    setUserOrders([]);
    const supabase = createBrowserClient();
    supabase
      .from("orders")
      .select("id, order_number, status, total, payment_status, created_at")
      .eq("user_id", selectedUser.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setUserOrders((data as Order[]) || []);
        setOrdersLoading(false);
      });
  }, [selectedUser]);

  // ── Role toggle ──────────────────────────────────────────────────────────
  const handleRoleConfirm = useCallback(async () => {
    const { userId, currentRole } = confirmRole;
    setConfirmRole(c => ({ ...c, open: false }));
    setIsUpdating(userId);
    const newRole = currentRole === "admin" ? "customer" : "admin";
    try {
      const res = await fetch("/api/admin/users/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        if (selectedUser?.id === userId) setSelectedUser(u => u ? { ...u, role: newRole } : u);
        showToast(newRole === "admin" ? "User promoted to admin." : "Admin demoted to customer.");
      } else showToast(data.error || "Failed to update role.", "error");
    } catch { showToast("Network error.", "error"); }
    setIsUpdating(null);
  }, [confirmRole, selectedUser]);

  // ── Delete user ──────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    const { userId } = confirmDelete;
    setConfirmDelete(c => ({ ...c, open: false }));
    setIsUpdating(userId);
    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        if (selectedUser?.id === userId) setSelectedUser(null);
        showToast("User deleted.");
      } else showToast(data.error || "Failed to delete user.", "error");
    } catch { showToast("Network error.", "error"); }
    setIsUpdating(null);
  }, [confirmDelete, selectedUser]);

  const toggleSort = (field: "name" | "joined") => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const confirmingRole = users.find(u => u.id === confirmRole.userId);

  return (
    <>
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A09890]" />
          <input
            type="text"
            placeholder="Search by name, phone, ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E6DFD5] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A09890] focus:outline-none focus:border-[#6E1D25]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A09890] hover:text-[#1A1A1A]">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#A09890] shrink-0" />
          {(["all", "customer", "admin", "wholesale"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${roleFilter === r ? "bg-[#1A1A1A] text-white" : "bg-white border border-[#E6DFD5] text-[#7A7570] hover:border-[#1A1A1A]"}`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="ml-auto text-xs text-[#A09890] self-center">
          {filtered.length} / {users.length} users
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F3EC]/50 border-b border-[#E6DFD5]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]">
                  <button className="flex items-center gap-1 hover:text-[#6E1D25] transition-colors" onClick={() => toggleSort("name")}>
                    User <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]">Phone</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]">
                  <button className="flex items-center gap-1 hover:text-[#6E1D25] transition-colors" onClick={() => toggleSort("joined")}>
                    Joined <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="text-right p-4 text-sm font-semibold text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr
                  key={user.id}
                  className={`border-b border-[#E6DFD5]/40 transition-colors cursor-pointer ${selectedUser?.id === user.id ? "bg-[#F7F3EC]" : "hover:bg-[#F7F3EC]/40"}`}
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#6E1D25]/10 rounded-full flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-[#6E1D25]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A] text-sm">{user.full_name || "No name"}</div>
                        <div className="text-[10px] text-[#A09890] font-mono">{user.id.slice(0, 12)}…</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#7A7570]">{user.phone || "—"}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${ROLE_COLORS[user.role] ?? ROLE_COLORS.customer}`}>
                      {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[#7A7570]">
                    {new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                      {/* Role toggle */}
                      <button
                        onClick={() => setConfirmRole({ open: true, userId: user.id, currentRole: user.role })}
                        disabled={isUpdating === user.id}
                        title={user.role === "admin" ? "Demote to customer" : "Make admin"}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${user.role === "admin" ? "bg-red-500/10 text-red-600 hover:bg-red-500/20" : "bg-[#6E1D25]/10 text-[#6E1D25] hover:bg-[#6E1D25]/20"}`}
                      >
                        {user.role === "admin" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setConfirmDelete({ open: true, userId: user.id, name: user.full_name || "this user" })}
                        disabled={isUpdating === user.id}
                        title="Delete user"
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {/* View details */}
                      <button
                        onClick={() => setSelectedUser(user)}
                        title="View details"
                        className="p-1.5 rounded-lg bg-[#F7F3EC] text-[#7A7570] hover:bg-[#E6DFD5] transition-all"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#7A7570] text-sm">
            {search || roleFilter !== "all" ? "No users match your search." : "No users found."}
          </div>
        )}
      </div>

      {/* ── Slide-out Detail Panel ───────────────────────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setSelectedUser(null)}>
          {/* Overlay */}
          <div className="flex-1 bg-black/30 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="w-full max-w-md bg-[#FAFAF8] h-full overflow-y-auto shadow-2xl border-l border-[#E6DFD5] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E6DFD5] px-6 py-5 flex items-start justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#6E1D25]/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-[#6E1D25]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1A1A1A] text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {selectedUser.full_name || "No name"}
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${ROLE_COLORS[selectedUser.role] ?? ROLE_COLORS.customer}`}>
                    <span className="capitalize">{selectedUser.role}</span>
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 rounded-lg text-[#7A7570] hover:bg-[#F0EBE3] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 px-6 py-5 space-y-6">
              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-[#E6DFD5] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-3.5 w-3.5 text-[#A09890]" />
                    <span className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider">Phone</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{selectedUser.phone || "—"}</p>
                </div>
                <div className="bg-white border border-[#E6DFD5] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3.5 w-3.5 text-[#A09890]" />
                    <span className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider">Joined</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">
                    {new Date(selectedUser.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#E6DFD5] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-3.5 w-3.5 text-[#A09890]" />
                  <span className="text-[10px] font-bold text-[#A09890] uppercase tracking-wider">User ID</span>
                </div>
                <p className="text-xs font-mono text-[#7A7570] break-all">{selectedUser.id}</p>
              </div>

              {/* Orders */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#6E1D25]" />
                    Orders
                    {!ordersLoading && (
                      <span className="text-xs font-bold text-[#A09890] bg-[#F7F3EC] px-2 py-0.5 rounded-full">
                        {userOrders.length}
                      </span>
                    )}
                  </h3>
                </div>

                {ordersLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-[#F7F3EC] rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="bg-[#F7F3EC] rounded-xl p-6 text-center text-sm text-[#A09890]">
                    No orders placed yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userOrders.map(order => (
                      <a
                        key={order.id}
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center justify-between bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 hover:border-[#6E1D25]/30 hover:bg-[#F7F3EC]/50 transition-all group"
                      >
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">#{order.order_number}</p>
                          <p className="text-[11px] text-[#A09890]">
                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {order.status.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm font-bold text-[#1A1A1A]">₹{order.total}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-[#A09890] group-hover:text-[#6E1D25] transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Activity summary */}
              {!ordersLoading && userOrders.length > 0 && (
                <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-xl p-4">
                  <h4 className="text-xs font-bold text-[#7A7570] uppercase tracking-wider mb-3">Activity Summary</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>{userOrders.length}</p>
                      <p className="text-[10px] text-[#A09890] uppercase tracking-wide">Orders</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        ₹{userOrders.reduce((s, o) => s + Number(o.total), 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-[#A09890] uppercase tracking-wide">Total Spent</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {userOrders.filter(o => o.status === "delivered").length}
                      </p>
                      <p className="text-[10px] text-[#A09890] uppercase tracking-wide">Delivered</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Panel footer actions */}
            <div className="sticky bottom-0 bg-[#FAFAF8]/95 backdrop-blur-md border-t border-[#E6DFD5] px-6 py-4 flex gap-3">
              <button
                onClick={() => setConfirmRole({ open: true, userId: selectedUser.id, currentRole: selectedUser.role })}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${selectedUser.role === "admin" ? "bg-red-500/10 text-red-700 hover:bg-red-500/20" : "bg-[#6E1D25]/10 text-[#6E1D25] hover:bg-[#6E1D25]/20"}`}
              >
                {selectedUser.role === "admin" ? <><ShieldOff className="h-4 w-4" /> Demote</> : <><Shield className="h-4 w-4" /> Make Admin</>}
              </button>
              <button
                onClick={() => setConfirmDelete({ open: true, userId: selectedUser.id, name: selectedUser.full_name || "this user" })}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-red-500/10 text-red-700 hover:bg-red-500/20 transition-all"
              >
                <Trash2 className="h-4 w-4" /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Modals ───────────────────────────────────────────────── */}
      <ConfirmModal
        open={confirmRole.open}
        title={confirmRole.currentRole === "admin" ? "Demote Admin" : "Promote to Admin"}
        message={
          confirmRole.currentRole === "admin"
            ? `Remove admin privileges from ${confirmingRole?.full_name || "this user"}?`
            : `Grant admin access to ${confirmingRole?.full_name || "this user"}? They will have full control of the admin panel.`
        }
        confirmLabel={confirmRole.currentRole === "admin" ? "Demote" : "Make Admin"}
        variant={confirmRole.currentRole === "admin" ? "danger" : "default"}
        onConfirm={handleRoleConfirm}
        onCancel={() => setConfirmRole(c => ({ ...c, open: false }))}
      />

      <ConfirmModal
        open={confirmDelete.open}
        title="Delete User"
        message={`Permanently delete ${confirmDelete.name}? This will remove their account and all associated data. This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(c => ({ ...c, open: false }))}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast(t => ({ ...t, open: false }))}
      />
    </>
  );
}
