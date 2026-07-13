"use client";

import Image, { ImageProps } from "next/image";
import { getProxiedImageUrl } from "@/lib/image-proxy";

/**
 * ProxiedImage Component
 * Automatically proxies Supabase storage images to bypass India's block
 * Use this instead of Next.js Image for Supabase images
 */
export function ProxiedImage({ src, alt, ...props }: ImageProps) {
  const proxiedSrc = typeof src === "string" ? getProxiedImageUrl(src) : src;

  return <Image src={proxiedSrc} alt={alt} {...props} />;
}
