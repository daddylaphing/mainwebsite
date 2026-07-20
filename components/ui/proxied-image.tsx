"use client";

import Image, { ImageProps } from "next/image";
import { getProxiedImageUrl } from "@/lib/image-proxy";

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
