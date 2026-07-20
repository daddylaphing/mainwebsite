/**
 * Image Proxy Utility
 * Converts Supabase storage URLs to proxied URLs to bypass India's block
 */

/**
 * Convert a Supabase storage URL to a proxied URL
 * @param url - The original Supabase storage URL
 * @returns Proxied URL that goes through your domain
 */
export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // Map old assets to new assets if they occur in the URL
  let resolvedUrl = url;
  if (resolvedUrl.includes("freshlaphingsheet.png")) {
    resolvedUrl = resolvedUrl.replace("freshlaphingsheet.png", "freshsheet.png");
  }
  if (resolvedUrl.includes("laphingsheet.png")) {
    resolvedUrl = resolvedUrl.replace("laphingsheet.png", "sheet.png");
  }

  // If it's already a proxied URL, return as-is
  if (resolvedUrl.startsWith("/api/image-proxy")) {
    return resolvedUrl;
  }

  // If it's a Supabase storage URL, proxy it
  if (resolvedUrl.includes("supabase.co/storage/")) {
    return `/api/image-proxy?url=${encodeURIComponent(resolvedUrl)}`;
  }

  // For other URLs (like Googleusercontent), return as-is
  return resolvedUrl;
}

/**
 * Get the original Supabase URL from a proxied URL
 * @param proxiedUrl - The proxied URL
 * @returns Original Supabase URL or the input if not proxied
 */
export function getOriginalImageUrl(proxiedUrl: string): string {
  if (!proxiedUrl.startsWith("/api/image-proxy")) {
    return proxiedUrl;
  }

  try {
    const url = new URL(proxiedUrl, "http://dummy.com");
    return url.searchParams.get("url") || proxiedUrl;
  } catch {
    return proxiedUrl;
  }
}

/**
 * Check if a URL is a Supabase storage URL
 * @param url - The URL to check
 * @returns True if it's a Supabase storage URL
 */
export function isSupabaseStorageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("supabase.co/storage/");
}

/**
 * Batch convert multiple URLs
 * @param urls - Array of URLs to convert
 * @returns Array of proxied URLs
 */
export function batchProxyUrls(urls: (string | null | undefined)[]): string[] {
  return urls.map(getProxiedImageUrl);
}
