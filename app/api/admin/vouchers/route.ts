/**
 * Admin Voucher CRUD API
 *
 * GET    /api/admin/vouchers         — list all vouchers
 * POST   /api/admin/vouchers         — create voucher
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { voucherService } from "@/lib/services/vouchers/voucher-service";
import { VoucherFormSchema } from "@/lib/services/vouchers/voucher-schemas";

async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return null;
  return user;
}

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const status = (searchParams.get("status") as "active" | "inactive" | "expired") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const result = await voucherService.getAdminVouchers({ search, status, limit, offset });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[admin/vouchers GET]", err);
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parse = VoucherFormSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  const { voucher, error } = await voucherService.createVoucher({
    ...parse.data,
    max_discount: parse.data.max_discount ?? null,
    min_order_value: parse.data.min_order_value ?? null,
    max_order_value: parse.data.max_order_value ?? null,
    start_date: parse.data.start_date ?? null,
    expiry_date: parse.data.expiry_date ?? null,
    max_global_uses: parse.data.max_global_uses ?? null,
    description: parse.data.description ?? "",
  }, admin.id);
  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ voucher }, { status: 201 });
}
