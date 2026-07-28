import { createClient } from "@/lib/supabase/client";
import type { RecipeStep } from "./recipe-guides-server";

export type { RecipeStep } from "./recipe-guides-server";

/** CLIENT: update steps for a guide by id */
export async function updateRecipeSteps(
  id: string,
  steps: RecipeStep[]
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("preparation_guides")
    .update({ steps })
    .eq("id", id);
  return { error: error?.message ?? null };
}
