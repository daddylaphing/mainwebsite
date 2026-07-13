"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Review } from "@/lib/reviews";

interface ReviewsManagementTableProps {
  reviews: Review[];
}

export function ReviewsManagementTable({ reviews: initialReviews }: ReviewsManagementTableProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleToggleActive = async (reviewId: string, currentActive: boolean) => {
    const supabase = createBrowserClient();
    
    const { error } = await supabase
      .from("reviews")
      .update({ active: !currentActive })
      .eq("id", reviewId);

    if (!error) {
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, active: !currentActive } : r
      ));
    }
  };

  const handleToggleFeatured = async (reviewId: string, currentFeatured: boolean) => {
    const supabase = createBrowserClient();
    
    const { error } = await supabase
      .from("reviews")
      .update({ featured: !currentFeatured })
      .eq("id", reviewId);

    if (!error) {
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, featured: !currentFeatured } : r
      ));
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setIsDeleting(reviewId);
    const supabase = createBrowserClient();
    
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (!error) {
      setReviews(reviews.filter(r => r.id !== reviewId));
    }
    setIsDeleting(null);
  };

  return (
    <div className="bg-white border border-[#E6DFD5] rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F7F3EC]/50 border-b border-[#E6DFD5]">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Reviewer
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Quote
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Rating
              </th>
              <th className="text-left p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Status
              </th>
              <th className="text-right p-4 text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-[#E6DFD5]/40 hover:bg-[#F7F3EC]/30 transition-colors">
                <td className="p-4">
                  <div>
                    <div className="font-semibold text-[#1A1A1A] text-sm flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {review.reviewer_name}
                      {review.featured && (
                        <Star className="h-3 w-3 text-[#6E1D25] fill-[#6E1D25]" />
                      )}
                    </div>
                    {review.reviewer_instagram && (
                      <div className="text-xs text-[#6E1D25] font-semibold mt-0.5">{review.reviewer_instagram}</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-[#7A7570] line-clamp-2 max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
                    "{review.quote}"
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-[#6E1D25] fill-[#6E1D25]" />
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleActive(review.id, review.active)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      review.active 
                        ? 'bg-green-500/10 text-green-700' 
                        : 'bg-red-500/10 text-red-700'
                    }`}
                  >
                    {review.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {review.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleFeatured(review.id, review.featured)}
                      className={`p-2 rounded-lg border transition-all ${
                        review.featured
                          ? 'bg-[#6E1D25]/10 border-[#6E1D25]/20 text-[#6E1D25]'
                          : 'bg-white border-[#E6DFD5] text-[#7A7570] hover:text-[#6E1D25]'
                      }`}
                      title={review.featured ? "Remove from featured" : "Add to featured"}
                    >
                      <Star className={`h-4 w-4 ${review.featured ? 'fill-[#6E1D25]' : ''}`} />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/reviews/${review.id}/edit`)}
                      className="p-2 bg-white border border-[#E6DFD5] hover:bg-[#F7F3EC] text-[#7A7570] hover:text-[#1A1A1A] rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={isDeleting === review.id}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-750 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {reviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-[#7A7570] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            No reviews found. Add your first review to get started.
          </div>
        </div>
      )}
    </div>
  );
}
