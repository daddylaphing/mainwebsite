import { Metadata } from "next";
import { LaphingKitProduct } from "@/components/product/laphing-kit-product";
import { RecipeGuideSection } from "@/components/home/recipe-guide-section";
import { createClient } from "@/lib/supabase/server";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getRecipeGuide } from "@/lib/recipe-guides-server";

export const metadata: Metadata = {
  title: "Laphing Kit - Authentic Home Kit | Laphing Daddy",
  description:
    "Complete Laphing Kit with everything you need. Includes fresh sheet, signature chilli oil, garlic water, and all seasonings. Minimum 2 kits.",
};

import { notFound } from "next/navigation";

export default async function LaphingKitPage() {
  const supabase = await createClient();
  
  const [{ data: product }, recipeGuide] = await Promise.all([
    supabase.from("products").select("*").eq("slug", "laphing-kit").single(),
    getRecipeGuide(),
  ]);

  if (!product || !product.active) notFound();

  const recipeSteps = recipeGuide?.steps ?? [];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36">
      <div className="max-w-[1200px] mx-auto px-5 md:px-16 pb-20">
        <ErrorBoundary>
          <LaphingKitProduct product={product} />
        </ErrorBoundary>
      </div>
      <div className="border-t border-[rgba(26,26,26,0.08)] bg-[#F7F3EC]">
        <ErrorBoundary>
          <RecipeGuideSection steps={recipeSteps} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
