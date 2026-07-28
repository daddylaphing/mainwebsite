import { createClient } from "@/lib/supabase/server";

export interface RecipeStep {
  step: number;
  title: string;
  description: string;
  time: string;
}

export interface RecipeGuide {
  id: string;
  title: string;
  slug: string;
  steps: RecipeStep[];
  difficulty: "easy" | "medium" | "hard" | null;
  time_minutes: number | null;
  is_published: boolean;
  created_at: string;
}

const SLUG = "how-to-make-laphing";

/** SERVER: get the main laphing preparation guide */
export async function getRecipeGuide(): Promise<RecipeGuide | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("preparation_guides")
    .select("*")
    .eq("slug", SLUG)
    .single();

  if (error) {
    console.error("Error fetching recipe guide:", error);
    return null;
  }
  return data as RecipeGuide;
}

/** SERVER: get all guides (for admin) */
export async function getAllRecipeGuides(): Promise<RecipeGuide[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("preparation_guides")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching recipe guides:", error);
    return [];
  }
  return (data ?? []) as RecipeGuide[];
}
