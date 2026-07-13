import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { ShoppingBag, Star, LayoutGrid, CheckCircle } from "lucide-react";

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const supabase = await createClient();

  // Fetch all products to aggregate categories
  const { data: products } = await supabase
    .from("products")
    .select("category, active, price");

  const categoriesMap: Record<string, { total: number; active: number; avgPrice: number; totalPrice: number }> = {
    kit: { total: 0, active: 0, avgPrice: 0, totalPrice: 0 },
    corndog: { total: 0, active: 0, avgPrice: 0, totalPrice: 0 },
    wholesale: { total: 0, active: 0, avgPrice: 0, totalPrice: 0 },
    addon: { total: 0, active: 0, avgPrice: 0, totalPrice: 0 },
    general: { total: 0, active: 0, avgPrice: 0, totalPrice: 0 },
  };

  products?.forEach(p => {
    const cat = p.category || "general";
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = { total: 0, active: 0, avgPrice: 0, totalPrice: 0 };
    }
    categoriesMap[cat].total += 1;
    if (p.active) categoriesMap[cat].active += 1;
    categoriesMap[cat].totalPrice += p.price || 0;
  });

  const categories = Object.entries(categoriesMap).map(([name, stats]) => ({
    name,
    totalProducts: stats.total,
    activeProducts: stats.active,
    avgPrice: stats.total > 0 ? Math.round(stats.totalPrice / stats.total) : 0,
  }));

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Product Categories
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Review and audit inventory categories count, visibility, and listing price aggregates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-[#F7F3EC]/50 border-b border-[#E6DFD5]">
              <tr>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Category</th>
                <th className="text-center p-4 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Active / Total</th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Avg Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]/40 text-sm">
              {categories.map((cat) => (
                <tr key={cat.name} className="hover:bg-[#F7F3EC]/10 transition-colors">
                  <td className="p-4 font-bold text-[#1A1A1A] capitalize flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-[#7A7570]" />
                    {cat.name}
                  </td>
                  <td className="p-4 text-center font-semibold text-[#7A7570]">
                    {cat.activeProducts} / {cat.totalProducts}
                  </td>
                  <td className="p-4 text-right font-black text-[#6E1D25]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ₹{cat.avgPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar Info Card */}
        <div className="bg-[#F7F3EC]/40 border border-[#E6DFD5] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#6E1D25]" />
            Category Layout Mapping
          </h3>
          <p className="text-xs text-[#7A7570] leading-relaxed">
            Categories map directly to user catalog sorting options. Any product marked as <strong>Active</strong> in one of these categories will automatically surface on the corresponding storefront collection tab.
          </p>
          <div className="pt-2 border-t border-[#E6DFD5] space-y-2 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-[#7A7570]">Laphing Kits:</span>
              <span className="text-[#1A1A1A]">vacuum sealed DIY sets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A7570]">Corn Dogs:</span>
              <span className="text-[#1A1A1A]">crispy street food snacks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A7570]">Addons:</span>
              <span className="text-[#1A1A1A]">extra sauces and side sheets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
