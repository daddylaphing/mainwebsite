/**
 * PATCH /api/admin/vouchers/[id]/activate
 * Body: { active: boolean }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { voucherService } from "@/lib/services/vouchers/voucher-service";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { active } = await request.json();

  if (typeof active !== "boolean") {
    return NextResponse.json({ error: "`active` must be a boolean" }, { status: 400 });
  }

  const { error } = await voucherService.setVoucherActive(id, active, admin.id);
  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}
