import { Metadata } from "next";
import { LaphingKitProduct } from "@/components/product/laphing-kit-product";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Laphing Kit - Authentic Home Kit | Laphing Daddy",
  description:
    "Complete Laphing Kit with everything you need. Includes fresh sheet, signature chilli oil, garlic water, and all seasonings. Minimum 2 kits.",
};

export default async function LaphingKitPage() {
  const supabase = await createClient();
  
  // Fetch the kit product
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", "laphing-kit")
    .single();

  return (
    <div className="min-h-screen bg-[#090909] pt-32 px-5 md:px-20 pb-20">
      <div className="max-w-[1200px] mx-auto">
        <LaphingKitProduct product={product} />
      </div>
    </div>
  );
}
