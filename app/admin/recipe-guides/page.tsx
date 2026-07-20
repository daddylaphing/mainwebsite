import { requireAdmin } from "@/lib/admin/auth";
import { BookOpen, AlertCircle } from "lucide-react";

export default async function AdminRecipeGuidesPage() {
  await requireAdmin();

  const recipeSteps = [
    { step: 1, title: "Lay Sheet Flat", description: "Place the fresh starch sheet on a clean, dry plate or cutting board." },
    { step: 2, title: "Spread Seasonings", description: "Brush our signature chilli oil, garlic water, and MSG seasoning evenly across the sheet." },
    { step: 3, title: "Add Fillings", description: "Place textured soy chunks, chopped yellow gluten strips, and fresh coriander in the center." },
    { step: 4, title: "Roll and Cut", description: "Roll the sheet tightly into a cylinder shape and slice into 1-inch pieces. Serve cold!" }
  ];

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Recipe & Preparation Guide
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Manage storefront step-by-step instructions for customer self-preparation guides
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {/* Steps List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
            Active Storefront Recipe Steps
          </h2>
          <div className="space-y-4">
            {recipeSteps.map((step) => (
              <div key={step.step} className="bg-white border border-[#E6DFD5] rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6E1D25] text-white font-bold flex items-center justify-center shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A]">{step.title}</h3>
                  <p className="text-xs text-[#7A7570] mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Status Info */}
        <div className="bg-[#F7F3EC]/40 border border-[#E6DFD5] rounded-2xl p-6 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#6E1D25]" />
            Preparation Guide Info
          </h3>
          <p className="text-xs text-[#7A7570] leading-relaxed">
            This guide is presented to clients on the home page and in dynamic modal dialogs when customizing their Laphing DIY kits.
          </p>
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-normal">
              <span className="font-bold">Notice:</span> Currently edit operations are synced dynamically from local localization. To update instructions, please configure translations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
