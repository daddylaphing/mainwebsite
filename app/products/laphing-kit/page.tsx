import { Metadata } from "next";
import { LaphingKitProduct } from "@/components/product/laphing-kit-product";
import { RecipeGuideSection } from "@/components/home/recipe-guide-section";
import { createClient } from "@/lib/supabase/server";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const metadata: Metadata = {
  title: "Laphing Kit - Authentic Home Kit | Laphing Daddy",
  description:
    "Complete Laphing Kit with everything you need. Includes fresh sheet, signature chilli oil, garlic water, and all seasonings. Minimum 2 kits.",
};

import { notFound } from "next/navigation";

export default async function LaphingKitPage() {
  const supabase = await createClient();
  
  // Fetch the kit product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", "laphing-kit")
    .single();

  if (!product || !product.active) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36">
      {/* Product customizer container */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-16 pb-20">
        <ErrorBoundary>
          <LaphingKitProduct product={product} />
        </ErrorBoundary>
      </div>

      {/* Recipe guide positioned directly here */}
      <div className="border-t border-[rgba(26,26,26,0.08)] bg-[#F7F3EC]">
        <ErrorBoundary>
          <RecipeGuideSection />
        </ErrorBoundary>
      </div>
    </div>
  );
}
