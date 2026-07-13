"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

// Helper function to get primary product image
function getProductImage(product: Product): string {
  return product.images?.[0] || "/placeholder-product.png";
}

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleToggleActive = async (productId: string, currentActive: boolean) => {
    const supabase = createBrowserClient();
    
    const { error } = await supabase
      .from("products")
      .update({ active: !currentActive })
      .eq("id", productId);

    if (!error) {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, active: !currentActive } : p
      ));
    }
  };

  const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
    const supabase = createBrowserClient();
    
    const { error } = await supabase
      .from("products")
      .update({ featured: !currentFeatured })
      .eq("id", productId);

    if (!error) {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, featured: !currentFeatured } : p
      ));
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(productId);
    const supabase = createBrowserClient();
    
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (!error) {
      setProducts(products.filter(p => p.id !== productId));
    }
    setIsDeleting(null);
  };

  return (
    <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F3EC]/50 border-b border-[#E6DFD5]">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Product
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Category
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Price
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Inventory
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Status
              </th>
              <th className="text-right p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[#E6DFD5]/40 hover:bg-[#F7F3EC]/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-[#F7F3EC] rounded-lg overflow-hidden shrink-0 border border-[#E6DFD5]/40">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-[#1A1A1A] text-sm flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {product.name}
                        {product.featured && (
                          <Star className="h-3 w-3 text-[#6E1D25] fill-[#6E1D25]" />
                        )}
                      </div>
                      <div className="text-xs text-[#7A7570] font-medium">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-[#F7F3EC] border border-[#E6DFD5]/60 rounded-lg text-xs text-[#7A7570] font-semibold capitalize">
                    {product.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm text-[#1A1A1A] font-semibold">₹{product.price}</div>
                  {product.bulk_price && (
                    <div className="text-xs text-[#7A7570] font-medium">Bulk: ₹{product.bulk_price}</div>
                  )}
                </td>
                <td className="p-4">
                  <div className={`text-sm font-semibold ${product.inventory <= 10 ? 'text-orange-600 font-bold' : 'text-[#1A1A1A]'}`}>
                    {product.inventory}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleActive(product.id, product.active)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      product.active 
                        ? 'bg-green-500/10 text-green-700' 
                        : 'bg-red-500/10 text-red-700'
                    }`}
                  >
                    {product.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {product.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleFeatured(product.id, product.featured)}
                      className={`p-2 rounded-lg border transition-all ${
                        product.featured
                          ? 'bg-[#6E1D25]/10 border-[#6E1D25]/20 text-[#6E1D25]'
                          : 'bg-white border-[#E6DFD5] text-[#7A7570] hover:text-[#6E1D25]'
                      }`}
                      title={product.featured ? "Remove from featured" : "Add to featured"}
                    >
                      <Star className={`h-4 w-4 ${product.featured ? 'fill-[#6E1D25]' : ''}`} />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      className="p-2 bg-white border border-[#E6DFD5] hover:bg-[#F7F3EC] text-[#7A7570] hover:text-[#1A1A1A] rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={isDeleting === product.id}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-750 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            No products found. Create your first product to get started.
          </div>
        </div>
      )}
    </div>
  );
}
