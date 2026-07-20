import { createClient } from "@/lib/supabase/server";

export interface SiteSetting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

/**
 * SERVER-SIDE: Get a specific setting by key
 */
export async function getSetting(key: string): Promise<unknown> {
  const supabase = await createClient();

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
 * SERVER-SIDE: Get all settings
 */
export async function getAllSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error) {
    console.error("Error fetching settings:", error);
    return {};
  }

  return data.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, unknown>);
}

/**
 * Check if store is accepting online orders
 */
export async function isOnlineOrdersEnabled(): Promise<boolean> {
  const setting = await getSetting("online_orders") as { enabled?: boolean } | null;
  return setting?.enabled ?? true;
}

/**
 * Check if store is open
 */
export async function isStoreOpen(): Promise<boolean> {
  const setting = await getSetting("store_status") as { is_open?: boolean } | null;
  return setting?.is_open ?? true;
}

/**
 * Check if delivery is enabled
 */
export async function isDeliveryEnabled(): Promise<boolean> {
  const setting = await getSetting("delivery") as { enabled?: boolean } | null;
  return setting?.enabled ?? true;
}
