import { createClient as createBrowserClient } from "@/lib/supabase/client";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

/** CLIENT: create a new FAQ */
export async function createFAQ(
  faq: Omit<FAQ, "id" | "created_at">
): Promise<{ error: string | null }> {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("faqs").insert([faq]);
  return { error: error?.message ?? null };
}

/** CLIENT: update a FAQ */
export async function updateFAQ(
  id: string,
  updates: Partial<Omit<FAQ, "id" | "created_at">>
): Promise<{ error: string | null }> {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("faqs").update(updates).eq("id", id);
  return { error: error?.message ?? null };
}

/** CLIENT: delete a FAQ */
export async function deleteFAQ(id: string): Promise<{ error: string | null }> {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  return { error: error?.message ?? null };
}
