import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { ProductsTable } from "@/components/admin/products-table";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-6">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Products
          </h1>
          <p
            className="text-[#7A7570] mt-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      <ProductsTable products={products || []} />
    </div>
  );
}
