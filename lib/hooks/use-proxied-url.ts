"use client";

import { useMemo } from "react";
import { getProxiedImageUrl } from "../image-proxy";

/**
 * Hook to automatically proxy Supabase image URLs
 * Use this for raw img tags or when you can't use ProxiedImage component
 */
export function useProxiedUrl(url: string | null | undefined): string {
  return useMemo(() => getProxiedImageUrl(url), [url]);
}

/**
 * Hook to proxy multiple URLs at once
 */
export function useProxiedUrls(
  urls: (string | null | undefined)[]
): string[] {
  return useMemo(
    () => urls.map((url) => getProxiedImageUrl(url)),
    [urls]
  );
}
