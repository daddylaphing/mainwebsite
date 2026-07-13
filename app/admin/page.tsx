import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import {
  ShoppingBag,
  Package,
  Star,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default async function AdminDashboard() {
  await requireAdmin();

  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalReviews },
    { count: totalUsers },
    { data: recentOrders },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("id, name, inventory")
      .lte("inventory", 10)
      .eq("active", true)
      .order("inventory", { ascending: true })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders || 0,
      icon: ShoppingBag,
      iconBg: "bg-[#6E1D25]/10",
      iconColor: "text-[#6E1D25]",
      border: "border-l-[#6E1D25]",
    },
    {
      label: "Products",
      value: totalProducts || 0,
      icon: Package,
      iconBg: "bg-[#D4A843]/10",
      iconColor: "text-[#D4A843]",
      border: "border-l-[#D4A843]",
    },
    {
      label: "Reviews",
      value: totalReviews || 0,
      icon: Star,
      iconBg: "bg-[#E8763A]/10",
      iconColor: "text-[#E8763A]",
      border: "border-l-[#E8763A]",
    },
    {
      label: "Users",
      value: totalUsers || 0,
      icon: Users,
      iconBg: "bg-[#3B82F6]/10",
      iconColor: "text-[#3B82F6]",
      border: "border-l-[#3B82F6]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1
          className="text-2xl md:text-3xl font-bold text-gray-900"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
          Welcome to Laphing Daddy Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white border border-gray-200 border-l-4 ${stat.border} rounded p-4 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded flex items-center justify-center ${stat.iconBg}`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </div>
              <div
                className="text-2xl font-bold text-gray-900 mb-0.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs text-gray-500 font-medium uppercase tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2
              className="text-sm font-bold text-gray-800 uppercase tracking-wide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Recent Orders
            </h2>
            <TrendingUp className="h-4 w-4 text-[#6E1D25]" />
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div
                      className="font-semibold text-gray-800 text-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {order.order_number}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-bold text-[#6E1D25] text-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      ₹{order.total}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                      {order.status.replace("_", " ")}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-gray-200 rounded shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2
              className="text-sm font-bold text-gray-800 uppercase tracking-wide"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Low Stock Alert
            </h2>
            <AlertCircle className="h-4 w-4 text-[#E8763A]" />
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="font-semibold text-gray-800 text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {product.name}
                  </div>
                  <span className="px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold rounded uppercase tracking-wide">
                    {product.inventory} left
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                All products well stocked
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
