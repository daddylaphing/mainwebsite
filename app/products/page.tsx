import { getProducts } from "@/lib/products";
import { ProductListClient } from "./product-list-client";

export const metadata = {
  title: "Our Collection - Authentic Tibetan Laphing & Sides | Laphing Daddy",
  description: "Browse our complete catalog of authentic Tibetan Laphing, freshly made starch sheets, crispy Corn Dogs, and extra side portions.",
};

export default async function ProductsListPage() {
  const products = await getProducts(); // Fetches all active products

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6E1D25] bg-[#6E1D25]/10 px-3.5 py-1 rounded-full">
            Our Collection
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mt-4"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}
          >
            LAPHING & SIDES
          </h1>
          <p
            className="text-[#7A7570] text-sm mt-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Handcrafted fresh daily with premium ingredients and our signature spices.
          </p>
        </div>

        {/* Client product filter section */}
        <ProductListClient initialProducts={products || []} />
      </div>
    </div>
  );
}
