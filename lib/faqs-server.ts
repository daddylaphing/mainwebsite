import { createClient } from "@/lib/supabase/server";
import type { FAQ } from "@/lib/faqs";

/** SERVER: all published FAQs ordered by sort_order */
export async function getFAQs(): Promise<FAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
  return data ?? [];
}

/** SERVER: ALL faqs including unpublished — for admin */
export async function getAllFAQs(): Promise<FAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching all FAQs:", error);
    return [];
  }
  return data ?? [];
}
