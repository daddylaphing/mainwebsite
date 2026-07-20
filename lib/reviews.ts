import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export interface Review {
  id: string;
  reviewer_name: string;
  reviewer_instagram: string | null;
  thumbnail_url: string | null;
  instagram_reel_url: string | null;
  quote: string;
  rating: number;
  featured: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * SERVER-SIDE: Get all active reviews
 */
export async function getReviews(): Promise<Review[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

/**
 * SERVER-SIDE: Get featured reviews only
 */
export async function getFeaturedReviews(limit = 6): Promise<Review[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured reviews:", error);
    return [];
  }

  return data || [];
}

/**
 * CLIENT-SIDE: Get all active reviews
 */
export async function getReviewsClient(): Promise<Review[]> {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

/**
 * CLIENT-SIDE: Get featured reviews only
 */
export async function getFeaturedReviewsClient(limit = 6): Promise<Review[]> {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured reviews:", error);
    return [];
  }

  return data || [];
}

/**
 * Get placeholder thumbnail for reviews without images
 */
export function getReviewThumbnail(review: Review): string {
  if (review.thumbnail_url) {
    return review.thumbnail_url;
  }
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=E7B52C&color=000&size=200&bold=true`;
}
