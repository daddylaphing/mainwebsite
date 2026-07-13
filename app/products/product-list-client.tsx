"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import type { Product } from "@/types";
import { toast } from "sonner";

interface ProductListClientProps {
  initialProducts: Product[];
}

const CATEGORY_TABS = [
  { value: "all", label: "All Items" },
  { value: "kit", label: "Laphing Kits" },
  { value: "corndog", label: "Corn Dogs" },
  { value: "wholesale", label: "Wholesale" },
];

export function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem } = useCart();

  // Filter products based on search and category tab
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.short_description?.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, search, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#E6DFD5]/60 pb-8">
        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                selectedCategory === tab.value
                  ? "bg-[#6E1D25] border-[#6E1D25] text-white shadow-sm"
                  : "bg-white border-[#E6DFD5] text-[#7A7570] hover:bg-[#F7F3EC] hover:text-[#1A1A1A]"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E6DFD5] rounded-full pl-11 pr-5 py-3 text-sm text-[#1A1A1A] placeholder-[#7A7570]/40 focus:outline-none focus:border-[#6E1D25] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
          <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-[#7A7570]/40" />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const mainImage = product.images?.[0] || "/placeholder-product.png";
          const isKit = product.category === "kit";

          return (
            <article
              key={product.id}
              className="bg-white border border-[#E6DFD5] rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              {/* Image box */}
              <Link
                href={`/products/${product.slug}`}
                className="relative aspect-[4/3] bg-[#F7F3EC] overflow-hidden block"
              >
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-[#FAFAF8] text-[#1A1A1A] font-bold text-[10px] tracking-wider uppercase px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md">
                    View Product <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
                {/* Bestseller Badge */}
                {product.featured && (
                  <span className="absolute top-4 left-4 bg-[#6E1D25] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Featured
                  </span>
                )}
              </Link>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex-1 space-y-2">
                  <span className="text-[10px] font-bold text-[#D4A843] uppercase tracking-wider block" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {product.category === "kit" ? "Laphing Kit" : product.category === "corndog" ? "Corn Dog" : product.category === "wholesale" ? "Wholesale Sheets" : "Sides & More"}
                  </span>
                  <h3
                    className="text-xl font-bold text-[#1A1A1A]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    <Link href={`/products/${product.slug}`} className="hover:underline">
                      {product.name}
                    </Link>
                  </h3>
                  <p
                    className="text-[#7A7570] text-xs leading-relaxed line-clamp-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {product.short_description || "Fresh ingredients prepared by hand daily."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E6DFD5]/40">
                  <span className="text-lg font-black text-[#6E1D25]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ₹{product.price}
                  </span>
                  {isKit ? (
                    <Link
                      href={`/products/${product.slug}`}
                      className="bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-[10px] uppercase tracking-widest px-5 py-3 rounded-full transition-all flex items-center gap-1.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Configure Kit
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        addItem(product);
                        toast.success(`${product.name} added to cart!`);
                      }}
                      className="bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-[10px] uppercase tracking-widest px-5 py-3 rounded-full transition-all flex items-center gap-1.5"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-20 flex flex-col items-center gap-3">
            <ShoppingBag className="h-14 w-14 text-[#7A7570]/20" />
            <h3
              className="text-xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No products found
            </h3>
            <p className="text-sm text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Try adjusting your filters or search keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
