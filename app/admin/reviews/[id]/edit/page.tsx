import { requireAdmin } from "@/lib/admin/auth";
import { ReviewForm } from "@/components/admin/review-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Review } from "@/lib/reviews";

interface EditReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  await requireAdmin();
  const { id } = await params;

  const supabase = await createClient();
  const { data: review } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", id)
    .single();

  if (!review) {
    notFound();
  }

  return (
    <div className="py-6">
      <ReviewForm initialReview={review as Review} />
    </div>
  );
}
