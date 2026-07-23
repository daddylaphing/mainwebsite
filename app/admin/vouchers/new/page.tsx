import { requireAdmin } from "@/lib/admin/auth";
import { VoucherForm } from "@/components/admin/vouchers/voucher-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewVoucherPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
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
          Create Voucher
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure a new discount voucher or coupon code
        </p>
      </div>

      <VoucherForm />
    </div>
  );
}
