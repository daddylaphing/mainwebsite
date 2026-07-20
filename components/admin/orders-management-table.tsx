"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  shipping_address: {
    full_name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  order_items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface OrdersManagementTableProps {
  orders: Order[];
}

const STATUS_OPTIONS = [
  { value: "pending",          label: "Pending",          color: "bg-yellow-500/10 text-yellow-800 border-yellow-200" },
  { value: "confirmed",        label: "Confirmed",        color: "bg-blue-500/10 text-blue-800 border-blue-200" },
  { value: "preparing",        label: "Preparing",        color: "bg-orange-500/10 text-orange-800 border-orange-200" },
  { value: "packed",           label: "Packed",           color: "bg-purple-500/10 text-purple-800 border-purple-200" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "bg-indigo-500/10 text-indigo-800 border-indigo-200" },
  { value: "delivered",        label: "Delivered",        color: "bg-green-500/10 text-green-800 border-green-200" },
  { value: "cancelled",        label: "Cancelled",        color: "bg-red-500/10 text-red-800 border-red-200" },
];


export function OrdersManagementTable({ orders: initialOrders }: OrdersManagementTableProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);

    try {
      const response = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
      } else {
        alert("Failed to update order status");
      }
    } catch {
      alert("Error updating order status");
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || "bg-[#F7F3EC] text-[#7A7570]";
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
            filter === "all"
              ? "bg-[#6E1D25] border-[#6E1D25] text-white shadow-sm"
              : "bg-white border-[#E6DFD5] text-[#7A7570] hover:bg-[#F7F3EC] hover:text-[#1A1A1A]"
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          All Orders
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
              filter === status.value
                ? "bg-[#6E1D25] border-[#6E1D25] text-white shadow-sm"
                : "bg-white border-[#E6DFD5] text-[#7A7570] hover:bg-[#F7F3EC] hover:text-[#1A1A1A]"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F3EC]/50 border-b border-[#E6DFD5]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Order
                </th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Customer
                </th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Items
                </th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Total
                </th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Payment
                </th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Date
                </th>
                <th className="text-right p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#E6DFD5]/40 hover:bg-[#F7F3EC]/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-[#1A1A1A] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {order.order_number}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-[#1A1A1A]">
                      {order.shipping_address?.full_name || "N/A"}
                    </div>
                    <div className="text-xs text-[#7A7570] font-medium">
                      {order.shipping_address?.phone || ""}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[#1A1A1A]">
                      {order.order_items?.length || 0} items
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-[#6E1D25]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ₹{order.total}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                      order.payment_status === 'paid' 
                        ? 'bg-green-500/10 text-green-800' 
                        : order.payment_status === 'failed'
                        ? 'bg-red-500/10 text-red-800'
                        : 'bg-yellow-500/10 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={isUpdating === order.id || order.status === 'delivered' || order.status === 'cancelled'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${getStatusColor(order.status)} border border-[#E6DFD5] bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-[#6E1D25]`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-[#7A7570]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-[#7A7570] font-medium mt-0.5">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="p-2 bg-white border border-[#E6DFD5] hover:bg-[#F7F3EC] text-[#7A7570] hover:text-[#1A1A1A] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              No orders found.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
