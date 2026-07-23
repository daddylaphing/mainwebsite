import { requireAdmin } from "@/lib/admin/auth";
import { voucherService } from "@/lib/services/vouchers/voucher-service";
import { VoucherForm } from "@/components/admin/vouchers/voucher-form";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditVoucherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const { vouchers } = await voucherService.getAdminVouchers({ limit: 1 });
  // Fetch the specific voucher using the service client directly
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();
  const { data: voucher } = await supabase
    .from("vouchers")
    .select("*")
    .eq("id", id)
    .single();

  void vouchers; // suppress unused warning

  if (!voucher) notFound();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <Link
          href="/admin/vouchers"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-800 font-semibold uppercase tracking-wide transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Vouchers
        </Link>
        <h1
          className="text-2xl md:text-3xl font-bold text-gray-900"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Edit Voucher
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-mono font-bold text-[#6E1D25]">
          {voucher.code}
        </p>
      </div>

      <VoucherForm voucher={voucher} isEditing />
    </div>
  );
}
