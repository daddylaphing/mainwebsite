"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_SITE_CONFIG, SiteConfig } from "@/lib/config/site-config";

export function useSiteConfig() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["site-config"],
    queryFn: async (): Promise<SiteConfig> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["product_config", "pricing_config", "recommendation_config", "homepage_content"]);

      if (error) {
        console.error("Failed to fetch site config:", error);
        return DEFAULT_SITE_CONFIG;
      }

      // Merge all settings into one config object
      const config: Partial<SiteConfig> = { ...DEFAULT_SITE_CONFIG };

      data?.forEach((setting) => {
        const value = setting.value as Record<string, unknown>;
        Object.assign(config, value);
      });

      return config as SiteConfig;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
