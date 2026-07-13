"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Review } from "@/lib/reviews";

interface ReviewFormProps {
  initialReview?: Review;
}

export function ReviewForm({ initialReview }: ReviewFormProps) {
  const router = useRouter();
  const isEdit = !!initialReview;

  const [reviewerName, setReviewerName] = useState(initialReview?.reviewer_name || "");
  const [reviewerInstagram, setReviewerInstagram] = useState(initialReview?.reviewer_instagram || "");
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [quote, setQuote] = useState(initialReview?.quote || "");
  const [active, setActive] = useState(initialReview?.active !== false);
  const [featured, setFeatured] = useState(!!initialReview?.featured);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient();

    const payload = {
      reviewer_name: reviewerName,
      reviewer_instagram: reviewerInstagram || null,
      rating: Number(rating),
      quote,
      active,
      featured,
      updated_at: new Date().toISOString(),
    };

    let responseError;

    if (isEdit && initialReview) {
      const { error } = await supabase
        .from("reviews")
        .update(payload)
        .eq("id", initialReview.id);
      responseError = error;
    } else {
      const { error } = await supabase
        .from("reviews")
        .insert([payload]);
      responseError = error;
    }

    if (responseError) {
      setError(responseError.message);
      setLoading(false);
    } else {
      router.push("/admin/reviews");
      router.refresh();
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back Link */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/reviews"
          className="flex items-center gap-2 text-sm text-[#7A7570] hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Link>
      </div>

      <div className="bg-white border border-[#E6DFD5] rounded-2xl p-6 shadow-sm">
        <h2
          className="text-2xl font-bold text-[#1A1A1A] mb-6 border-b border-[#E6DFD5]/40 pb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-850 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          {/* Reviewer Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
              Reviewer Name *
            </label>
            <input
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="e.g. Sonam Dorjee"
              className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
            />
          </div>

          {/* Reviewer Instagram */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
              Instagram Tag / Handle
            </label>
            <input
              type="text"
              value={reviewerInstagram}
              onChange={(e) => setReviewerInstagram(e.target.value)}
              placeholder="e.g. @sonam_dorjee"
              className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider block">
              Rating Stars *
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-[#7A7570] hover:text-[#6E1D25] transition-colors"
                >
                  <Star 
                    className={`h-6 w-6 ${
                      star <= rating 
                        ? "fill-[#6E1D25] text-[#6E1D25]" 
                        : "text-[#E6DFD5]"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quote Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
              Quote Testimonial *
            </label>
            <textarea
              rows={4}
              required
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Laphing was so fresh and authentic! Loved it."
              className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] resize-none"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded border-[#E6DFD5] text-[#6E1D25] focus:ring-[#6E1D25]"
              />
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Active</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-[#E6DFD5] text-[#6E1D25] focus:ring-[#6E1D25]"
              />
              <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Featured</span>
            </label>
          </div>

          {/* Save/Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DFD5]/40">
            <Link
              href="/admin/reviews"
              className="px-6 py-3 border border-[#E6DFD5] bg-white text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-colors disabled:opacity-60 shadow-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                isEdit ? "Update Review" : "Add Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
