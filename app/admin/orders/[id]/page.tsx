import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderDetailContent } from "./order-detail-content";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  await requireAdmin();
  const { id } = await params;

  const supabase = await createClient();

  // Fetch the order with its items
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        name,
        quantity,
        price,
        image_url
      )
    `)
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      {/* Back button */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="flex items-center gap-2 text-sm text-[#7A7570] hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>

      {/* Main Container */}
      <OrderDetailContent order={order} />
    </div>
  );
}
