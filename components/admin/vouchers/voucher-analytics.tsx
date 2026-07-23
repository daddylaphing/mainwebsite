"use client";

import { Tag, TrendingUp, CheckCircle2, XCircle, Award } from "lucide-react";

interface VoucherAnalyticsData {
  total_redemptions: number;
  total_savings_given: number;
  active_count: number;
  expired_count: number;
  top_vouchers: Array<{
    code: string;
    used_count: number;
    max_global_uses: number | null;
  }>;
}

export function VoucherAnalytics({ data }: { data: VoucherAnalyticsData }) {
  const stats = [
    {
      label: "Total Redemptions",
      value: data.total_redemptions,
      icon: TrendingUp,
      color: "text-[#6E1D25]",
      bg: "bg-[#6E1D25]/8",
      border: "border-l-[#6E1D25]",
    },
    {
      label: "Total Savings Given",
      value: `₹${data.total_savings_given.toFixed(0)}`,
      icon: Tag,
      color: "text-[#D4A843]",
      bg: "bg-[#D4A843]/8",
      border: "border-l-[#D4A843]",
    },
    {
      label: "Active Vouchers",
      value: data.active_count,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-l-green-500",
    },
    {
      label: "Expired Vouchers",
      value: data.expired_count,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-l-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white border border-gray-200 border-l-4 ${stat.border} rounded p-4 shadow-sm`}
            >
              <div className={`w-9 h-9 rounded flex items-center justify-center ${stat.bg} mb-3`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Vouchers */}
      {data.top_vouchers.length > 0 && (
        <div className="bg-white border border-gray-200 rounded shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Top Performing Vouchers
            </h3>
            <Award className="h-4 w-4 text-[#D4A843]" />
          </div>
          <div className="divide-y divide-gray-50">
            {data.top_vouchers.map((v, idx) => {
              const usagePct = v.max_global_uses
                ? Math.round((v.used_count / v.max_global_uses) * 100)
                : null;
              return (
                <div key={v.code} className="flex items-center gap-4 px-5 py-3">
                  <span className="text-xs font-bold text-gray-300 w-5 shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="font-mono font-bold text-gray-900 text-sm flex-1">
                    {v.code}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#6E1D25]">
                      {v.used_count} uses
                    </p>
                    {usagePct !== null && (
                      <div className="mt-1 w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6E1D25] rounded-full"
                          style={{ width: `${Math.min(usagePct, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
