/**
 * GET /api/admin/vouchers/analytics
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { voucherService } from "@/lib/services/vouchers/voucher-service";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const analytics = await voucherService.getAnalytics();
    return NextResponse.json(analytics);
  } catch (err) {
    console.error("[admin/vouchers/analytics]", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
