"use client";

import { useMemo, useState } from "react";
import { TrendingUp, ShoppingBag, Award, BarChart3, HelpCircle } from "lucide-react";

interface AnalyticsDashboardProps {
  orders: any[];
  products: any[];
}

export function AnalyticsDashboard({ orders, products }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "all">("all");

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    if (timeRange === "all") return orders;

    const now = new Date();
    const limitDate = new Date();
    if (timeRange === "7days") {
      limitDate.setDate(now.getDate() - 7);
    } else if (timeRange === "30days") {
      limitDate.setDate(now.getDate() - 30);
    }

    return orders.filter(o => new Date(o.created_at) >= limitDate);
  }, [orders, timeRange]);

  // Compute overall stats
  const stats = useMemo(() => {
    const activeOrders = filteredOrders.filter(o => o.status !== "cancelled");
    const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const orderCount = activeOrders.length;
    const aov = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

    let totalItemsSold = 0;
    activeOrders.forEach(o => {
      o.order_items?.forEach((item: any) => {
        totalItemsSold += item.quantity || 0;
      });
    });

    return {
      totalRevenue,
      orderCount,
      aov,
      totalItemsSold,
    };
  }, [filteredOrders]);

  // Compute product sales leaderboard
  const productLeaderboard = useMemo(() => {
    const salesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};

    filteredOrders.forEach(order => {
      if (order.status === "cancelled") return;

      order.order_items?.forEach((item: any) => {
        const name = item.name;
        if (!salesMap[name]) {
          salesMap[name] = { name, quantity: 0, revenue: 0 };
        }
        salesMap[name].quantity += item.quantity || 0;
        salesMap[name].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });

    return Object.values(salesMap).sort((a, b) => b.quantity - a.quantity);
  }, [filteredOrders]);

  // Compute sales by category
  const categorySales = useMemo(() => {
    const productCategoryMap: Record<string, string> = {};
    products.forEach(p => {
      productCategoryMap[p.name] = p.category || "general";
    });

    const categoryMap: Record<string, { quantity: number; revenue: number }> = {
      kit: { quantity: 0, revenue: 0 },
      corndog: { quantity: 0, revenue: 0 },
      wholesale: { quantity: 0, revenue: 0 },
      addon: { quantity: 0, revenue: 0 },
      general: { quantity: 0, revenue: 0 },
    };

    filteredOrders.forEach(order => {
      if (order.status === "cancelled") return;

      order.order_items?.forEach((item: any) => {
        const category = productCategoryMap[item.name] || "general";
        if (categoryMap[category]) {
          categoryMap[category].quantity += item.quantity || 0;
          categoryMap[category].revenue += (item.price || 0) * (item.quantity || 0);
        } else {
          categoryMap["general"].quantity += item.quantity || 0;
          categoryMap["general"].revenue += (item.price || 0) * (item.quantity || 0);
        }
      });
    });

    return Object.entries(categoryMap).map(([name, val]) => ({
      name,
      ...val,
    })).filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products]);

  // Compute daily trend for charts
  const dailyTrend = useMemo(() => {
    const daysMap: Record<string, { dateStr: string; label: string; revenue: number; orders: number }> = {};

    // Get last 7 days of dates to ensure they all appear
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
      daysMap[dateStr] = { dateStr, label, revenue: 0, orders: 0 };
    }

    filteredOrders.forEach(order => {
      if (order.status === "cancelled") return;

      const dateStr = order.created_at.split("T")[0];
      if (daysMap[dateStr]) {
        daysMap[dateStr].revenue += order.total || 0;
        daysMap[dateStr].orders += 1;
      }
    });

    return Object.values(daysMap);
  }, [filteredOrders]);

  const maxDailyRevenue = useMemo(() => {
    const max = Math.max(...dailyTrend.map(d => d.revenue), 100);
    return max;
  }, [dailyTrend]);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-xl p-1 flex gap-1 text-xs font-bold uppercase tracking-wider">
          {[
            { value: "7days", label: "7 Days" },
            { value: "30days", label: "30 Days" },
            { value: "all", label: "All Time" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setTimeRange(tab.value as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === tab.value
                  ? "bg-[#6E1D25] text-white shadow-sm"
                  : "text-[#7A7570] hover:text-[#1A1A1A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#7A7570] font-bold uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-700 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-[#7A7570] mt-1 font-semibold uppercase tracking-wider">
            Excluding cancelled orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#7A7570] font-bold uppercase tracking-wider">
              Orders Placed
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.orderCount}
          </p>
          <p className="text-[10px] text-[#7A7570] mt-1 font-semibold uppercase tracking-wider">
            Completed / Active sales
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#7A7570] font-bold uppercase tracking-wider">
              Avg Order Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-700 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            ₹{stats.aov}
          </p>
          <p className="text-[10px] text-[#7A7570] mt-1 font-semibold uppercase tracking-wider">
            Mean basket revenue
          </p>
        </div>

        {/* Total Items Sold */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#7A7570] font-bold uppercase tracking-wider">
              Portions Sold
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-700 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.totalItemsSold}
          </p>
          <p className="text-[10px] text-[#7A7570] mt-1 font-semibold uppercase tracking-wider">
            Total individual units
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend (7-Day chart) */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest border-b border-[#E6DFD5]/40 pb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Daily Revenue Trend (Past 7 Days)
          </h3>
          <div className="h-60 flex items-end justify-between gap-4 pt-8 pb-2">
            {dailyTrend.map((day) => {
              const heightPct = Math.round((day.revenue / maxDailyRevenue) * 100);
              return (
                <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A1A1A] text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none mb-1">
                    ₹{day.revenue} ({day.orders} orders)
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full bg-[#E6DFD5] group-hover:bg-[#6E1D25] rounded-t-lg transition-all duration-300 relative"
                    style={{ height: `${Math.max(heightPct, 6)}%` }}
                  />
                  {/* Label */}
                  <span className="text-[10px] font-bold text-[#7A7570] text-center select-none truncate w-full mt-1.5">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share (pure CSS) */}
        <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest border-b border-[#E6DFD5]/40 pb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Sales by Category
          </h3>
          <div className="space-y-4 pt-2">
            {categorySales.map((cat) => {
              const pct = stats.totalRevenue > 0 ? Math.round((cat.revenue / stats.totalRevenue) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-[#1A1A1A]">{cat.name}</span>
                    <span className="text-[#7A7570]">{pct}% (₹{cat.revenue})</span>
                  </div>
                  <div className="w-full bg-[#FAFAF8] border border-[#E6DFD5]/40 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#6E1D25] h-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {categorySales.length === 0 && (
              <p className="text-center text-xs text-[#7A7570] py-8 font-medium">
                No categorical sales logged
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#E6DFD5]/40">
          <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
            Top Performing Products
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F3EC]/50 border-b border-[#E6DFD5]">
              <tr>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Product Name
                </th>
                <th className="text-center p-4 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Units Sold
                </th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Total Sales (₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]/40">
              {productLeaderboard.map((item, idx) => (
                <tr key={item.name} className="hover:bg-[#F7F3EC]/20 transition-colors">
                  <td className="p-4 text-sm font-semibold text-[#1A1A1A]">
                    <span className="inline-block w-5 text-xs text-[#7A7570] font-bold">
                      {idx + 1}.
                    </span>
                    {item.name}
                  </td>
                  <td className="p-4 text-sm text-[#1A1A1A] text-center font-bold">
                    {item.quantity}
                  </td>
                  <td className="p-4 text-sm text-[#6E1D25] text-right font-black" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ₹{item.revenue.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
              {productLeaderboard.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-xs text-[#7A7570] font-medium">
                    No product transactions logged
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
