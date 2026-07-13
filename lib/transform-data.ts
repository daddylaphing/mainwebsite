/**
 * Data transformation utilities
 * Automatically convert Supabase storage URLs to proxied URLs when fetching from database
 */

import { getProxiedImageUrl } from "./image-proxy";

export type Product = {
  id: string;
  name: string;
  images: string[];
  // ... other fields
  [key: string]: any;
};

export type Review = {
  id: string;
  thumbnail_url: string | null;
  // ... other fields
  [key: string]: any;
};

export type SiteSetting = {
  key: string;
  value: any;
};

/**
 * Transform product images to use proxy
 */
export function transformProduct<T extends { images?: (string | null)[] }>(
  product: T
): T {
  if (!product.images || !Array.isArray(product.images)) {
    return product;
  }

  return {
    ...product,
    images: product.images.map((img) => getProxiedImageUrl(img)),
  };
}

/**
 * Transform review thumbnail to use proxy
 */
export function transformReview<T extends { thumbnail_url?: string | null }>(
  review: T
): T {
  if (!review.thumbnail_url) {
    return review;
  }

  return {
    ...review,
    thumbnail_url: getProxiedImageUrl(review.thumbnail_url),
  };
}

/**
 * Transform site settings images to use proxy
 */
export function transformSiteSettings(settings: SiteSetting[]): SiteSetting[] {
  return settings.map((setting) => {
    if (setting.key === "hero_section" && setting.value?.background_image) {
      return {
        ...setting,
        value: {
          ...setting.value,
          background_image: getProxiedImageUrl(
            setting.value.background_image
          ),
        },
      };
    }

    if (setting.key === "founder_section" && setting.value?.image) {
      return {
        ...setting,
        value: {
          ...setting.value,
          image: getProxiedImageUrl(setting.value.image),
        },
      };
    }

    return setting;
  });
}

/**
 * Transform any object with image URLs
 */
export function transformImageUrls<T extends Record<string, any>>(
  obj: T,
  imageFields: (keyof T)[]
): T {
  const transformed = { ...obj };

  for (const field of imageFields) {
    const value = transformed[field];

    if (typeof value === "string") {
      transformed[field] = getProxiedImageUrl(value) as T[keyof T];
    } else if (Array.isArray(value)) {
      transformed[field] = value.map((item: any) =>
        typeof item === "string" ? getProxiedImageUrl(item) : item
      ) as T[keyof T];
    }
  }

  return transformed;
}

/**
 * Batch transform products
 */
export function transformProducts<T extends { images?: (string | null)[] }>(
  products: T[]
): T[] {
  return products.map(transformProduct);
}

/**
 * Batch transform reviews
 */
export function transformReviews<T extends { thumbnail_url?: string | null }>(
  reviews: T[]
): T[] {
  return reviews.map(transformReview);
}
