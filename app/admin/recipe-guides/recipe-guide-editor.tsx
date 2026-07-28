"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, GripVertical, Clock, Save, CheckCircle } from "lucide-react";
import { updateRecipeSteps, type RecipeStep } from "@/lib/recipe-guides";
import type { RecipeGuide } from "@/lib/recipe-guides-server";
import { Toast } from "@/components/ui/toast";

interface RecipeGuideEditorProps {
  guide: RecipeGuide;
}

export function RecipeGuideEditor({ guide }: RecipeGuideEditorProps) {
  const router = useRouter();
  const [steps, setSteps] = useState<RecipeStep[]>(guide.steps);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; variant: "success" | "error" }>({
    open: false, message: "", variant: "success",
  });

  const showToast = (message: string, variant: "success" | "error" = "success") =>
    setToast({ open: true, message, variant });

  const updateStep = (index: number, field: keyof RecipeStep, value: string | number) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const addStep = () => {
    const newStep: RecipeStep = {
      step: steps.length + 1,
      title: "",
      description: "",
      time: "30s",
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, step: i + 1 })) // renumber
    );
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newSteps.length) return;
    [newSteps[index], newSteps[target]] = [newSteps[target], newSteps[index]];
    // Renumber after swap
    setSteps(newSteps.map((s, i) => ({ ...s, step: i + 1 })));
  };

  const handleSave = async () => {
    // Validate no empty titles
    if (steps.some((s) => !s.title.trim())) {
      showToast("All steps must have a title.", "error");
      return;
    }
    setSaving(true);
    const { error } = await updateRecipeSteps(guide.id, steps);
    setSaving(false);
    if (error) {
      showToast(`Failed to save: ${error}`, "error");
    } else {
      showToast("Recipe guide saved successfully!");
      router.refresh();
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Steps editor */}
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white border border-[#E6DFD5] rounded-2xl p-5 shadow-sm space-y-4"
            >
              {/* Step header */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6E1D25] text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {step.step}
                </div>
                <span className="text-xs font-bold text-[#A09890] uppercase tracking-wider">
                  Step {step.step}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveStep(i, "up")}
                    disabled={i === 0}
                    className="p-1.5 rounded-lg text-[#7A7570] hover:bg-[#F7F3EC] disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <GripVertical className="h-4 w-4 rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(i, "down")}
                    disabled={i === steps.length - 1}
                    className="p-1.5 rounded-lg text-[#7A7570] hover:bg-[#F7F3EC] disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <GripVertical className="h-4 w-4 -rotate-90" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                    title="Remove step"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Title + Time row */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider">
                    Step Title *
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(i, "title", e.target.value)}
                    placeholder="e.g. Apply Garlic Water"
                    className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-2.5 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Time
                  </label>
                  <input
                    type="text"
                    value={step.time}
                    onChange={(e) => updateStep(i, "time", e.target.value)}
                    placeholder="e.g. 30s"
                    className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-2.5 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#7A7570] uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={step.description}
                  onChange={(e) => updateStep(i, "description", e.target.value)}
                  placeholder="Detailed instructions for this step..."
                  className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-2.5 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add step button */}
        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-2 w-full justify-center border-2 border-dashed border-[#E6DFD5] hover:border-[#6E1D25] rounded-2xl py-4 text-[#7A7570] hover:text-[#6E1D25] font-semibold text-sm transition-colors bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Add Step
        </button>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        {/* Info panel */}
        <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-2xl p-5 flex gap-3">
          <CheckCircle className="h-5 w-5 text-[#6E1D25] shrink-0 mt-0.5" />
          <div className="text-xs text-[#7A7570] leading-relaxed space-y-1">
            <p className="font-bold text-[#1A1A1A]">Live on the storefront</p>
            <p>Changes saved here will reflect on the homepage recipe section, the preparation scroll cards, and the "View Full Recipe Guide" modal. The page will revalidate on next visit.</p>
          </div>
        </div>
      </div>

      <Toast
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </>
  );
}
