import { requireAdmin } from "@/lib/admin/auth";
import { ReviewForm } from "@/components/admin/review-form";

export default async function NewReviewPage() {
  await requireAdmin();

  return (
    <div className="py-6">
      <ReviewForm />
    </div>
  );
}
