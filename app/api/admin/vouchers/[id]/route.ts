/**
 * Admin Voucher single-resource API
 *
 * GET    /api/admin/vouchers/[id]    — get voucher with redemptions
 * PATCH  /api/admin/vouchers/[id]    — update voucher
 * DELETE /api/admin/vouchers/[id]    — delete voucher
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Fetch voucher + redemption history
  const [redemptions, auditLogs] = await Promise.all([
    voucherService.getVoucherRedemptions(id),
    voucherService.getAuditLogs(id),
  ]);

  return NextResponse.json({ redemptions, audit_logs: auditLogs });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Allow partial updates
  const parse = VoucherFormSchema.partial().safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: parse.error.issues[0]?.message ?? "Validation failed" },
      { status: 400 }
    );
  }

  // Normalise undefined → null for nullable fields so the service layer accepts them
  const updateData = {
    ...parse.data,
    ...(parse.data.max_discount !== undefined   && { max_discount:   parse.data.max_discount   ?? null }),
    ...(parse.data.min_order_value !== undefined && { min_order_value: parse.data.min_order_value ?? null }),
    ...(parse.data.max_order_value !== undefined && { max_order_value: parse.data.max_order_value ?? null }),
    ...(parse.data.start_date !== undefined      && { start_date:      parse.data.start_date      ?? null }),
    ...(parse.data.expiry_date !== undefined     && { expiry_date:     parse.data.expiry_date     ?? null }),
    ...(parse.data.max_global_uses !== undefined && { max_global_uses: parse.data.max_global_uses ?? null }),
  };

  const { voucher, error } = await voucherService.updateVoucher(id, updateData, admin.id);
  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ voucher });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await voucherService.deleteVoucher(id, admin.id);
  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}
