/**
 * Voucher Service
 *
 * ALL validation, calculation, and redemption logic lives here on the server.
 * Never trust client-side totals or voucher data.
 */

import { createServiceClient } from "@/lib/supabase/server";
import type {
  Voucher,
  VoucherValidationResult,
  VoucherFormData,
  VoucherAuditLog,
  VoucherRedemption,
} from "@/types";

export interface ValidateVoucherOptions {
  code: string;
  userId: string;
  userRole: string;
  /** Cart subtotal BEFORE discounts (server-recalculated) */
  subtotal: number;
  /** Product IDs in the cart */
  productIds: string[];
  /** Category IDs of products in the cart */
  categoryIds?: string[];
  /** IP address for logging */
  ipAddress?: string;
}

export interface CartItem {
  product_id: string;
  price: number;
  quantity: number;
}

export interface RedeemVoucherOptions {
  voucherId: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  ipAddress?: string;
}

// ─── Voucher Service ──────────────────────────────────────────────────────────

class VoucherService {
  /** Look up a voucher by code (case-insensitive). Returns null if not found. */
  async getVoucherByCode(code: string): Promise<Voucher | null> {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("vouchers")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .single();
    return data as Voucher | null;
  }

  /** Full server-side voucher validation. Returns result with discount amount. */
  async validateVoucher(opts: ValidateVoucherOptions): Promise<VoucherValidationResult> {
    const supabase = createServiceClient();
    const code = opts.code.toUpperCase().trim();

    // 1. Fetch voucher
    const { data: voucher, error } = await supabase
      .from("vouchers")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !voucher) {
      return { valid: false, error: "INVALID_CODE", message: "Invalid voucher code." };
    }

    const v = voucher as Voucher;

    // 2. Active check
    if (!v.is_active) {
      return { valid: false, error: "DISABLED", message: "This voucher has been disabled." };
    }

    // 3. Date range check
    const now = new Date();
    if (v.start_date && new Date(v.start_date) > now) {
      return { valid: false, error: "NOT_STARTED", message: "This voucher is not valid yet." };
    }
    if (v.expiry_date && new Date(v.expiry_date) < now) {
      return { valid: false, error: "EXPIRED", message: "This voucher has expired." };
    }

    // 4. Global usage limit
    if (v.max_global_uses !== null && v.used_count >= v.max_global_uses) {
      return { valid: false, error: "USAGE_LIMIT_REACHED", message: "This voucher has reached its usage limit." };
    }

    // 5. Per-user usage limit — count confirmed redemptions for this user
    const { count: userUsageCount } = await supabase
      .from("voucher_redemptions")
      .select("*", { count: "exact", head: true })
      .eq("voucher_id", v.id)
      .eq("user_id", opts.userId)
      .in("status", ["pending", "confirmed"]);

    if ((userUsageCount ?? 0) >= v.max_uses_per_user) {
      return { valid: false, error: "ALREADY_USED", message: "You have already used this voucher." };
    }

    // 6. Minimum order value
    if (v.min_order_value !== null && opts.subtotal < v.min_order_value) {
      return {
        valid: false,
        error: "MIN_ORDER_NOT_MET",
        message: `Minimum order of ₹${v.min_order_value} required for this voucher.`,
      };
    }

    // 7. Maximum order value
    if (v.max_order_value !== null && opts.subtotal > v.max_order_value) {
      return {
        valid: false,
        error: "MAX_ORDER_EXCEEDED",
        message: `This voucher is only valid for orders up to ₹${v.max_order_value}.`,
      };
    }

    // 8. Role restriction
    if (v.applicable_user_roles.length > 0 && !v.applicable_user_roles.includes(opts.userRole)) {
      return { valid: false, error: "ROLE_NOT_ELIGIBLE", message: "This voucher is not available for your account type." };
    }

    // 9. First order only
    if (v.first_order_only) {
      const { count: orderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", opts.userId)
        .eq("payment_status", "paid");
      if ((orderCount ?? 0) > 0) {
        return { valid: false, error: "FIRST_ORDER_ONLY", message: "This voucher is only valid on your first order." };
      }
    }

    // 10. New customers only (no paid orders)
    if (v.new_customers_only) {
      const { count: orderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", opts.userId)
        .eq("payment_status", "paid");
      if ((orderCount ?? 0) > 0) {
        return { valid: false, error: "NEW_CUSTOMERS_ONLY", message: "This voucher is only for new customers." };
      }
    }

    // 11. Existing customers only (at least one paid order)
    if (v.existing_customers_only) {
      const { count: orderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", opts.userId)
        .eq("payment_status", "paid");
      if ((orderCount ?? 0) === 0) {
        return { valid: false, error: "EXISTING_CUSTOMERS_ONLY", message: "This voucher is only for existing customers." };
      }
    }

    // 12. Product applicability
    if (v.applicable_product_ids.length > 0) {
      const hasApplicableProduct = opts.productIds.some((pid) =>
        v.applicable_product_ids.includes(pid)
      );
      if (!hasApplicableProduct) {
        return { valid: false, error: "NOT_APPLICABLE", message: "This voucher does not apply to items in your cart." };
      }
    }

    // 13. Excluded products
    if (v.excluded_product_ids.length > 0) {
      const hasExcludedOnly = opts.productIds.every((pid) =>
        v.excluded_product_ids.includes(pid)
      );
      if (hasExcludedOnly) {
        return { valid: false, error: "NOT_APPLICABLE", message: "This voucher does not apply to items in your cart." };
      }
    }

    // 14. Category applicability
    if (v.applicable_category_ids.length > 0 && opts.categoryIds) {
      const hasApplicableCategory = opts.categoryIds.some((cid) =>
        v.applicable_category_ids.includes(cid)
      );
      if (!hasApplicableCategory) {
        return { valid: false, error: "NOT_APPLICABLE", message: "This voucher does not apply to any product category in your cart." };
      }
    }

    // 15. Calculate discount
    const discountAmount = this.calculateDiscount(v, opts.subtotal);

    return {
      valid: true,
      voucher: v,
      discount_amount: discountAmount,
      free_delivery: v.free_delivery,
    };
  }

  /** Calculate the monetary discount for a valid voucher */
  calculateDiscount(voucher: Voucher, subtotal: number): number {
    switch (voucher.discount_type) {
      case "fixed_amount":
        return Math.min(voucher.discount_value, subtotal);

      case "percentage": {
        const raw = (subtotal * voucher.discount_value) / 100;
        const capped = voucher.max_discount !== null
          ? Math.min(raw, voucher.max_discount)
          : raw;
        return Math.round(Math.min(capped, subtotal) * 100) / 100;
      }

      case "free_delivery":
        // Discount is 0 on subtotal; shipping waived separately
        return 0;

      case "buy_x_get_y":
        // TODO: implement when buy_x_get_y_config is defined
        return 0;

      default:
        return 0;
    }
  }

  /**
   * Reserve a voucher redemption record (status = 'pending').
   * Called at order creation BEFORE payment. Does NOT increment used_count yet.
   */
  async reserveVoucher(opts: RedeemVoucherOptions): Promise<{ redemptionId: string } | null> {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("voucher_redemptions")
      .insert({
        voucher_id: opts.voucherId,
        user_id: opts.userId,
        order_id: opts.orderId,
        discount_amount: opts.discountAmount,
        status: "pending",
        ip_address: opts.ipAddress ?? null,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[VoucherService] reserveVoucher failed:", error);
      return null;
    }

    return { redemptionId: data.id };
  }

  /**
   * Confirm a redemption after successful payment.
   * Increments the global used_count atomically.
   */
  async confirmRedemption(orderId: string): Promise<boolean> {
    const supabase = createServiceClient();

    // Fetch the pending redemption for this order
    const { data: redemption, error: fetchError } = await supabase
      .from("voucher_redemptions")
      .select("id, voucher_id")
      .eq("order_id", orderId)
      .eq("status", "pending")
      .single();

    if (fetchError || !redemption) {
      // No pending redemption = no voucher was used — that's fine
      return true;
    }

    // Mark as confirmed
    const { error: updateError } = await supabase
      .from("voucher_redemptions")
      .update({ status: "confirmed" })
      .eq("id", redemption.id);

    if (updateError) {
      console.error("[VoucherService] confirmRedemption update failed:", updateError);
      return false;
    }

    // Increment global used_count atomically via RPC or raw SQL
    const { error: incError } = await supabase.rpc("increment_voucher_used_count", {
      p_voucher_id: redemption.voucher_id,
    });

    if (incError) {
      // Fallback: manual increment
      const { data: current } = await supabase
        .from("vouchers")
        .select("used_count")
        .eq("id", redemption.voucher_id)
        .single();

      await supabase
        .from("vouchers")
        .update({ used_count: (current?.used_count ?? 0) + 1 })
        .eq("id", redemption.voucher_id);
    }

    return true;
  }

  /**
   * Restore a voucher — used when an order is cancelled before preparation.
   * Sets redemption status to 'restored' and decrements used_count.
   */
  async restoreVoucher(orderId: string): Promise<boolean> {
    const supabase = createServiceClient();

    const { data: redemption, error: fetchError } = await supabase
      .from("voucher_redemptions")
      .select("id, voucher_id, status")
      .eq("order_id", orderId)
      .in("status", ["pending", "confirmed"])
      .single();

    if (fetchError || !redemption) return true; // nothing to restore

    await supabase
      .from("voucher_redemptions")
      .update({ status: "restored" })
      .eq("id", redemption.id);

    if (redemption.status === "confirmed") {
      // Only decrement if it was confirmed (used_count was already incremented)
      const { data: current } = await supabase
        .from("vouchers")
        .select("used_count")
        .eq("id", redemption.voucher_id)
        .single();

      if (current && current.used_count > 0) {
        await supabase
          .from("vouchers")
          .update({ used_count: current.used_count - 1 })
          .eq("id", redemption.voucher_id);
      }
    }

    return true;
  }

  // ─── Admin Operations ──────────────────────────────────────────────────────

  async createVoucher(
    data: VoucherFormData,
    adminId: string
  ): Promise<{ voucher: Voucher | null; error: string | null }> {
    const supabase = createServiceClient();

    const code = data.code.toUpperCase().trim();

    // Check for duplicate code
    const { data: existing } = await supabase
      .from("vouchers")
      .select("id")
      .eq("code", code)
      .single();

    if (existing) {
      return { voucher: null, error: "A voucher with this code already exists." };
    }

    const { data: voucher, error } = await supabase
      .from("vouchers")
      .insert({ ...data, code, created_by: adminId })
      .select()
      .single();

    if (error || !voucher) {
      return { voucher: null, error: error?.message ?? "Failed to create voucher." };
    }

    // Audit log
    await this.writeAuditLog({
      voucherId: voucher.id,
      adminId,
      action: "created",
      newValues: voucher as Record<string, unknown>,
    });

    return { voucher: voucher as Voucher, error: null };
  }

  async updateVoucher(
    voucherId: string,
    data: Partial<VoucherFormData>,
    adminId: string
  ): Promise<{ voucher: Voucher | null; error: string | null }> {
    const supabase = createServiceClient();

    const { data: old } = await supabase
      .from("vouchers")
      .select("*")
      .eq("id", voucherId)
      .single();

    const updateData = data.code
      ? { ...data, code: data.code.toUpperCase().trim() }
      : data;

    const { data: voucher, error } = await supabase
      .from("vouchers")
      .update(updateData)
      .eq("id", voucherId)
      .select()
      .single();

    if (error || !voucher) {
      return { voucher: null, error: error?.message ?? "Failed to update voucher." };
    }

    await this.writeAuditLog({
      voucherId,
      adminId,
      action: "updated",
      oldValues: old as Record<string, unknown>,
      newValues: voucher as Record<string, unknown>,
    });

    return { voucher: voucher as Voucher, error: null };
  }

  async deleteVoucher(voucherId: string, adminId: string): Promise<{ error: string | null }> {
    const supabase = createServiceClient();

    const { data: old } = await supabase
      .from("vouchers")
      .select("*")
      .eq("id", voucherId)
      .single();

    const { error } = await supabase
      .from("vouchers")
      .delete()
      .eq("id", voucherId);

    if (error) return { error: error.message };

    await this.writeAuditLog({
      voucherId,
      adminId,
      action: "deleted",
      oldValues: old as Record<string, unknown>,
    });

    return { error: null };
  }

  async setVoucherActive(
    voucherId: string,
    isActive: boolean,
    adminId: string
  ): Promise<{ error: string | null }> {
    const supabase = createServiceClient();

    const { error } = await supabase
      .from("vouchers")
      .update({ is_active: isActive })
      .eq("id", voucherId);

    if (error) return { error: error.message };

    await this.writeAuditLog({
      voucherId,
      adminId,
      action: isActive ? "activated" : "deactivated",
    });

    return { error: null };
  }

  async duplicateVoucher(
    voucherId: string,
    adminId: string
  ): Promise<{ voucher: Voucher | null; error: string | null }> {
    const supabase = createServiceClient();

    const { data: source } = await supabase
      .from("vouchers")
      .select("*")
      .eq("id", voucherId)
      .single();

    if (!source) return { voucher: null, error: "Voucher not found." };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, used_count, created_by, ...rest } = source as Record<string, unknown>;

    const newCode = `${String(rest.code)}_COPY_${Date.now().toString(36).toUpperCase()}`;

    const { data: newVoucher, error } = await supabase
      .from("vouchers")
      .insert({ ...rest, code: newCode, used_count: 0, is_active: false, created_by: adminId })
      .select()
      .single();

    if (error || !newVoucher) {
      return { voucher: null, error: error?.message ?? "Failed to duplicate voucher." };
    }

    await this.writeAuditLog({
      voucherId: newVoucher.id,
      adminId,
      action: "duplicated",
      newValues: { source_id: voucherId },
    });

    return { voucher: newVoucher as Voucher, error: null };
  }

  async getAdminVouchers(opts?: {
    search?: string;
    status?: "active" | "inactive" | "expired";
    limit?: number;
    offset?: number;
  }): Promise<{ vouchers: Voucher[]; total: number }> {
    const supabase = createServiceClient();

    let query = supabase
      .from("vouchers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (opts?.search) {
      query = query.ilike("code", `%${opts.search}%`);
    }

    if (opts?.status === "active") {
      query = query.eq("is_active", true);
    } else if (opts?.status === "inactive") {
      query = query.eq("is_active", false);
    } else if (opts?.status === "expired") {
      query = query.lt("expiry_date", new Date().toISOString());
    }

    if (opts?.limit) query = query.limit(opts.limit);
    if (opts?.offset && opts?.limit) {
      query = query.range(opts.offset, opts.offset + (opts.limit) - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return { vouchers: (data ?? []) as Voucher[], total: count ?? 0 };
  }

  async getVoucherRedemptions(voucherId: string): Promise<VoucherRedemption[]> {
    const supabase = createServiceClient();

    const { data } = await supabase
      .from("voucher_redemptions")
      .select("*")
      .eq("voucher_id", voucherId)
      .order("created_at", { ascending: false })
      .limit(100);

    return (data ?? []) as VoucherRedemption[];
  }

  async getAuditLogs(voucherId?: string): Promise<VoucherAuditLog[]> {
    const supabase = createServiceClient();

    let query = supabase
      .from("voucher_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (voucherId) {
      query = query.eq("voucher_id", voucherId);
    }

    const { data } = await query;
    return (data ?? []) as VoucherAuditLog[];
  }

  async getAnalytics() {
    const supabase = createServiceClient();
    const now = new Date().toISOString();

    const [
      { count: totalRedemptions },
      { data: savingsData },
      { count: activeCount },
      { count: expiredCount },
      { data: topVouchers },
    ] = await Promise.all([
      supabase
        .from("voucher_redemptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "confirmed"),

      supabase
        .from("voucher_redemptions")
        .select("discount_amount")
        .eq("status", "confirmed"),

      supabase
        .from("vouchers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),

      supabase
        .from("vouchers")
        .select("*", { count: "exact", head: true })
        .lt("expiry_date", now),

      supabase
        .from("vouchers")
        .select("code, used_count, max_global_uses")
        .order("used_count", { ascending: false })
        .limit(5),
    ]);

    const totalSavings = (savingsData ?? []).reduce(
      (sum: number, r: { discount_amount: number }) => sum + Number(r.discount_amount),
      0
    );

    return {
      total_redemptions: totalRedemptions ?? 0,
      total_savings_given: totalSavings,
      active_count: activeCount ?? 0,
      expired_count: expiredCount ?? 0,
      top_vouchers: (topVouchers ?? []) as Array<{ code: string; used_count: number; max_global_uses: number | null }>,
    };
  }

  // ─── Internal helpers ──────────────────────────────────────────────────────

  private async writeAuditLog(opts: {
    voucherId?: string;
    adminId: string;
    action: string;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    note?: string;
  }) {
    const supabase = createServiceClient();
    await supabase.from("voucher_audit_logs").insert({
      voucher_id: opts.voucherId ?? null,
      admin_id: opts.adminId,
      action: opts.action,
      old_values: opts.oldValues ?? null,
      new_values: opts.newValues ?? null,
      note: opts.note ?? null,
    });
  }
}

// Re-export type to keep imports clean
export const voucherService = new VoucherService();
