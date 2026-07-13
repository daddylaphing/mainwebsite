import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { 
  ShoppingBag, 
  Package, 
  Star, 
  Users, 
  TrendingUp,
  AlertCircle 
} from "lucide-react";

export default async function AdminDashboard() {
  await requireAdmin();

  const supabase = await createClient();

  // Fetch dashboard stats
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
      color: "bg-[#6E1D25]/10 text-[#6E1D25]",
    },
    {
      label: "Products",
      value: totalProducts || 0,
      icon: Package,
      color: "bg-[#D4A843]/10 text-[#D4A843]",
    },
    {
      label: "Reviews",
      value: totalReviews || 0,
      icon: Star,
      color: "bg-[#E8763A]/10 text-[#E8763A]",
    },
    {
      label: "Users",
      value: totalUsers || 0,
      icon: Users,
      color: "bg-[#B5451B]/10 text-[#B5451B]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Dashboard
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Welcome to Laphing Daddy Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-[#E6DFD5] rounded-2xl p-6 hover:border-[#6E1D25]/30 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div
                className="text-3xl font-bold text-[#1A1A1A] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm text-[#7A7570] font-semibold"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Recent Orders
            </h2>
            <TrendingUp className="h-5 w-5 text-[#6E1D25]" />
          </div>
          <div className="space-y-3">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-[#F7F3EC]/50 border border-[#E6DFD5]/40 rounded-xl"
                >
                  <div>
                    <div
                      className="font-bold text-[#1A1A1A] text-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {order.order_number}
                    </div>
                    <div className="text-xs text-[#7A7570] font-medium mt-0.5">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-bold text-[#6E1D25]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      ₹{order.total}
                    </div>
                    <div className="text-[10px] text-[#7A7570] uppercase tracking-wider font-bold mt-0.5">
                      {order.status.replace("_", " ")}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#7A7570] text-sm">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Low Stock Alert
            </h2>
            <AlertCircle className="h-5 w-5 text-[#E8763A]" />
          </div>
          <div className="space-y-3">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-[#F7F3EC]/50 border border-[#E8763A]/20 rounded-xl"
                >
                  <div
                    className="font-bold text-[#1A1A1A] text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {product.name}
                  </div>
                  <div className="px-2.5 py-1 bg-[#E8763A]/10 rounded-full text-xs font-bold text-[#E8763A] border border-[#E8763A]/20">
                    {product.inventory} left
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#7A7570] text-sm">
                All products well stocked
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
