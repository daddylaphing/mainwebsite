import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

import { AnalyticsDashboard } from "./analytics-dashboard";

export default async function AnalyticsPage() {
  await requireAdmin();

  const supabase = await createClient();

  // Fetch all orders with items
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      subtotal,
      status,
      created_at,
      order_items (
        id,
        name,
        quantity,
        price
      )
    `)
    .order("created_at", { ascending: false });

  // Fetch products to map category
  const { data: products } = await supabase
    .from("products")
    .select("name, slug, category");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Analytics & Insights
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Detailed business performance, sales metrics, and product insights
        </p>
      </div>

      <AnalyticsDashboard orders={orders || []} products={products || []} />
    </div>
  );
}
