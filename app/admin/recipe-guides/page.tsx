import { requireAdmin } from "@/lib/admin/auth";
import { getAllRecipeGuides } from "@/lib/recipe-guides-server";
import { BookOpen } from "lucide-react";
import { RecipeGuideEditor } from "./recipe-guide-editor";

export default async function AdminRecipeGuidesPage() {
  await requireAdmin();
  const guides = await getAllRecipeGuides();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E6DFD5] pb-6">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Recipe &amp; Preparation Guide
          </h1>
          <p className="text-[#7A7570] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Edit the step-by-step preparation guide shown on the homepage and recipe modal
          </p>
        </div>
        <div className="w-10 h-10 bg-[#6E1D25]/10 rounded-xl flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-[#6E1D25]" />
        </div>
      </div>

      {guides.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
          No recipe guide found in the database. Run the migration at{" "}
          <code className="font-mono bg-amber-100 px-1 rounded">
            supabase/migrations/20250728_recipe_guide_steps.sql
          </code>{" "}
          to seed the initial data.
        </div>
      ) : (
        <RecipeGuideEditor guide={guides[0]} />
      )}
    </div>
  );
}
