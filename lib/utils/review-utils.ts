import type { Review } from "@/lib/reviews";

/**
 * Get placeholder thumbnail for reviews without images
 * This is a pure utility function that can be used in both client and server components
 */
export function getReviewThumbnail(review: Review): string {
  if (review.thumbnail_url) {
    return review.thumbnail_url;
  }
  
  // Generate placeholder with initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=E7B52C&color=000&size=200&bold=true`;
}
