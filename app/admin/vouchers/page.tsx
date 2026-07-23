import { requireAdmin } from "@/lib/admin/auth";
import { voucherService } from "@/lib/services/vouchers/voucher-service";
import { VouchersTable } from "@/components/admin/vouchers/vouchers-table";
import { VoucherAnalytics } from "@/components/admin/vouchers/voucher-analytics";
import { Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VouchersPage() {
  await requireAdmin();

  const [{ vouchers, total }, analytics] = await Promise.all([
    voucherService.getAdminVouchers({ limit: 100 }),
    voucherService.getAnalytics(),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6 text-[#6E1D25]" />
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Vouchers
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Manage discount codes, coupons, and promotional vouchers
            </p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <VoucherAnalytics data={analytics} />

      {/* Table */}
      <VouchersTable initialVouchers={vouchers} initialTotal={total} />
    </div>
  );
}
