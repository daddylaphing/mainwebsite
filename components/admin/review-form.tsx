"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Star, Upload, X, CheckCircle, Film } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Review } from "@/lib/reviews";

interface ReviewFormProps {
  initialReview?: Review;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/reviews/videos/`;

export function ReviewForm({ initialReview }: ReviewFormProps) {
  const router = useRouter();
  const isEdit = !!initialReview;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reviewerName, setReviewerName] = useState(initialReview?.reviewer_name || "");
  const [reviewerInstagram, setReviewerInstagram] = useState(initialReview?.reviewer_instagram || "");
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [quote, setQuote] = useState(initialReview?.quote || "");
  const [active, setActive] = useState(initialReview?.active !== false);
  const [featured, setFeatured] = useState(!!initialReview?.featured);

  // Video state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>(
    initialReview?.instagram_reel_url || ""
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(!!initialReview?.instagram_reel_url);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file (MP4, MOV, etc.)");
      return;
    }
    // Warn if > 100MB
    if (file.size > 100 * 1024 * 1024) {
      setError("Video file must be under 100MB.");
      return;
    }

    setError(null);
    setVideoFile(file);
    setUploadDone(false);
    setUploadedVideoUrl("");
    // Local preview
    const localUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(localUrl);
  };

  const handleUpload = async () => {
    if (!videoFile) return;
    setUploading(true);
    setUploadProgress(10);
    setError(null);

    const supabase = createBrowserClient();

    // Build a unique filename: timestamp + original name slug
    const ext = videoFile.name.split(".").pop() || "mp4";
    const slug = videoFile.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()
      .slice(0, 40);
    const filename = `${Date.now()}_${slug}.${ext}`;

    setUploadProgress(30);

    const { error: uploadError } = await supabase.storage
      .from("reviews")
      .upload(`videos/${filename}`, videoFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: videoFile.type,
      });

    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setUploading(false);
      setUploadProgress(0);
      return;
    }

    setUploadProgress(100);
    const publicUrl = `${STORAGE_BASE}${filename}`;
    setUploadedVideoUrl(publicUrl);
    setUploadDone(true);
    setUploading(false);
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setUploadedVideoUrl("");
    setUploadDone(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedVideoUrl) {
      setError("Please upload a video before saving.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createBrowserClient();

    const payload = {
      reviewer_name: reviewerName,
      reviewer_instagram: reviewerInstagram || null,
      thumbnail_url: null,
      instagram_reel_url: uploadedVideoUrl,
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
      const { error } = await supabase.from("reviews").insert([payload]);
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
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
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
              Instagram Handle
            </label>
            <input
              type="text"
              value={reviewerInstagram}
              onChange={(e) => setReviewerInstagram(e.target.value)}
              placeholder="e.g. @sonam_dorjee"
              className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
            />
          </div>

          {/* Video Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
              Review Video *
            </label>

            {/* Uploaded / existing video preview */}
            {(uploadedVideoUrl || videoPreviewUrl) ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#E6DFD5] bg-black aspect-[9/16] max-h-[320px]">
                <video
                  src={uploadedVideoUrl || videoPreviewUrl || ""}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Uploaded badge */}
                {uploadDone && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    Uploaded
                  </div>
                )}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              /* Drop zone */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-[#E6DFD5] hover:border-[#6E1D25] rounded-2xl py-10 px-6 transition-colors bg-[#FAFAF8] hover:bg-[#F7F3EC] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#6E1D25]/10 flex items-center justify-center">
                  <Film className="h-6 w-6 text-[#6E1D25]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#1A1A1A]">Click to select video</p>
                  <p className="text-xs text-[#A09890] mt-1">MP4, MOV — max 100MB</p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Upload button — shown after file selected but before upload */}
            {videoFile && !uploadDone && !uploading && (
              <button
                type="button"
                onClick={handleUpload}
                className="flex items-center justify-center gap-2 w-full bg-[#6E1D25] hover:bg-[#5a1620] text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload Video to Supabase
              </button>
            )}

            {/* Progress bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-[#E6DFD5] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#6E1D25] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-[#7A7570] flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Uploading to Supabase Storage…
                </p>
              </div>
            )}

            {/* Uploaded URL display */}
            {uploadDone && uploadedVideoUrl && (
              <p className="text-[10px] text-[#A09890] font-mono break-all bg-[#F7F3EC] rounded-lg px-3 py-2 border border-[#E6DFD5]">
                {uploadedVideoUrl}
              </p>
            )}
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
                      star <= rating ? "fill-[#6E1D25] text-[#6E1D25]" : "text-[#E6DFD5]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quote */}
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6DFD5]/40">
            <Link
              href="/admin/reviews"
              className="px-6 py-3 border border-[#E6DFD5] bg-white text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || uploading || !uploadDone}
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-colors disabled:opacity-40 shadow-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Update Review"
              ) : (
                "Add Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
