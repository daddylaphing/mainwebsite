"use client";

import Image, { ImageProps } from "next/image";
import { getProxiedImageUrl } from "@/lib/image-proxy";

/**
 * Get the original Supabase URL or return as-is for proxied URLs
 */
function getOriginalUrl(url: string): string {
  // If it's already a full Supabase URL, return it
  if (url.startsWith("https://") && url.includes("supabase.co")) {
    return url;
  }
  
  // If it's a proxied URL, extract the original
  if (url.startsWith("/api/image-proxy?url=")) {
    try {
      const urlObj = new URL(url, "http://dummy.com");
      return decodeURIComponent(urlObj.searchParams.get("url") || url);
    } catch {
      return url;
    }
  }
  
  return url;
}

/**
 * ProxiedImage Component
 * Serves Supabase images directly through our proxy as base64 or blob URLs
 * This bypasses Next.js image optimization which fails on Supabase URLs in India
 */
export function ProxiedImage({ src, alt, ...props }: ImageProps) {
  // For Supabase URLs, use unoptimized rendering with our proxy
  const originalSrc = typeof src === "string" ? src : "";
  const isSupabaseUrl = originalSrc.includes("supabase.co/storage/");
  
  if (isSupabaseUrl) {
    const proxiedSrc = getProxiedImageUrl(originalSrc);
    return (
      <Image
        src={proxiedSrc}
        alt={alt}
        {...props}
        unoptimized={true}
      />
    );
  }

  // For non-Supabase URLs, use normal Next.js Image
  return <Image src={src} alt={alt} {...props} />;
}
