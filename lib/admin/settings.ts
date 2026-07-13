import { createBrowserClient } from "@/lib/supabase/client";

/**
 * CLIENT-SIDE: Get a specific setting by key
 */
export async function getSettingClient(key: string): Promise<any | null> {
  const supabase = createBrowserClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }

  return data?.value || null;
}

/**
 * CLIENT-SIDE: Update a setting
 */
export async function updateSetting(key: string, value: any): Promise<boolean> {
  const supabase = createBrowserClient();

  const { error } = await supabase
    .from("site_settings")
    .update({ 
      value,
      updated_at: new Date().toISOString()
    })
    .eq("key", key);

  if (error) {
    console.error(`Error updating setting ${key}:`, error);
    return false;
  }

  return true;
}
