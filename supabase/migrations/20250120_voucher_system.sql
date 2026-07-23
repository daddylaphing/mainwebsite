-- ============================================================================
-- VOUCHER / COUPON SYSTEM
-- Production-grade discount voucher system
-- Run this migration in your Supabase SQL editor or via CLI:
--   supabase db push
-- ============================================================================

-- ─── Discount Type Enum ──────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE voucher_discount_type AS ENUM (
    'percentage',
    'fixed_amount',
    'free_delivery',
    'buy_x_get_y'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ─── Vouchers Table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vouchers (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  code                    TEXT        NOT NULL,
  description             TEXT,
  discount_type           voucher_discount_type NOT NULL,
  discount_value          NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_discount            NUMERIC(10,2),            -- cap for percentage discounts
  min_order_value         NUMERIC(10,2),            -- minimum cart subtotal required
  max_order_value         NUMERIC(10,2),            -- optional upper cap
  start_date              TIMESTAMPTZ,
  expiry_date             TIMESTAMPTZ,
  max_global_uses         INTEGER,                  -- NULL = unlimited
  max_uses_per_user       INTEGER     NOT NULL DEFAULT 1,
  used_count              INTEGER     NOT NULL DEFAULT 0,
  -- Applicability filters
  applicable_product_ids  UUID[]      NOT NULL DEFAULT '{}',  -- empty = all products
  excluded_product_ids    UUID[]      NOT NULL DEFAULT '{}',
  applicable_category_ids UUID[]      NOT NULL DEFAULT '{}',  -- empty = all categories
  excluded_category_ids   UUID[]      NOT NULL DEFAULT '{}',
  applicable_user_roles   TEXT[]      NOT NULL DEFAULT '{}',  -- empty = all roles
  -- Conditions
  first_order_only        BOOLEAN     NOT NULL DEFAULT false,
  new_customers_only      BOOLEAN     NOT NULL DEFAULT false,
  existing_customers_only BOOLEAN     NOT NULL DEFAULT false,
  -- Features
  is_stackable            BOOLEAN     NOT NULL DEFAULT false,
  free_delivery           BOOLEAN     NOT NULL DEFAULT false,
  -- Buy X Get Y config (JSONB for future extensibility)
  buy_x_get_y_config      JSONB,
  -- State
  is_active               BOOLEAN     NOT NULL DEFAULT true,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by              UUID        REFERENCES auth.users(id),
  -- Enforce unique code (case-insensitive via index below)
  CONSTRAINT vouchers_code_unique UNIQUE (code)
);

-- ─── Voucher Redemptions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.voucher_redemptions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id      UUID        NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id),
  order_id        UUID        REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_amount NUMERIC(10,2) NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'restored')),
  ip_address      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Voucher Audit Logs ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.voucher_audit_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id  UUID        REFERENCES public.vouchers(id) ON DELETE SET NULL,
  admin_id    UUID        REFERENCES auth.users(id),
  action      TEXT        NOT NULL,
  -- action values: created | updated | activated | deactivated | deleted | duplicated
  old_values  JSONB,
  new_values  JSONB,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes for performance ──────────────────────────────────────────────────
-- Case-insensitive unique code lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_vouchers_code_upper
  ON public.vouchers (UPPER(code));

CREATE INDEX IF NOT EXISTS idx_vouchers_is_active
  ON public.vouchers (is_active);

CREATE INDEX IF NOT EXISTS idx_vouchers_expiry
  ON public.vouchers (expiry_date);

CREATE INDEX IF NOT EXISTS idx_vouchers_created_at
  ON public.vouchers (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_voucher
  ON public.voucher_redemptions (voucher_id);

CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_user
  ON public.voucher_redemptions (user_id);

CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_order
  ON public.voucher_redemptions (order_id);

CREATE INDEX IF NOT EXISTS idx_voucher_redemptions_status
  ON public.voucher_redemptions (status);

CREATE INDEX IF NOT EXISTS idx_voucher_audit_voucher
  ON public.voucher_audit_logs (voucher_id);

CREATE INDEX IF NOT EXISTS idx_voucher_audit_created_at
  ON public.voucher_audit_logs (created_at DESC);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vouchers_updated_at ON public.vouchers;
CREATE TRIGGER vouchers_updated_at
  BEFORE UPDATE ON public.vouchers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS voucher_redemptions_updated_at ON public.voucher_redemptions;
CREATE TRIGGER voucher_redemptions_updated_at
  BEFORE UPDATE ON public.voucher_redemptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── is_admin helper (idempotent) ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.vouchers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_audit_logs  ENABLE ROW LEVEL SECURITY;

-- Vouchers: public can SELECT active ones (needed for checkout validation UX)
-- All mutations restricted to admins
DROP POLICY IF EXISTS "vouchers_public_read"  ON public.vouchers;
DROP POLICY IF EXISTS "vouchers_admin_all"    ON public.vouchers;

CREATE POLICY "vouchers_public_read"
  ON public.vouchers FOR SELECT
  USING (is_active = true);

CREATE POLICY "vouchers_admin_all"
  ON public.vouchers FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Redemptions: users can read their own; admins can do everything
DROP POLICY IF EXISTS "redemptions_user_read" ON public.voucher_redemptions;
DROP POLICY IF EXISTS "redemptions_admin_all" ON public.voucher_redemptions;

CREATE POLICY "redemptions_user_read"
  ON public.voucher_redemptions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "redemptions_admin_all"
  ON public.voucher_redemptions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Audit logs: admin only
DROP POLICY IF EXISTS "audit_admin_all" ON public.voucher_audit_logs;

CREATE POLICY "audit_admin_all"
  ON public.voucher_audit_logs FOR ALL
  USING (public.is_admin());

-- ─── Comments ─────────────────────────────────────────────────────────────────
COMMENT ON TABLE public.vouchers            IS 'Discount vouchers and coupon codes';
COMMENT ON TABLE public.voucher_redemptions IS 'Per-order voucher redemption records with lifecycle status';
COMMENT ON TABLE public.voucher_audit_logs  IS 'Admin audit trail for all voucher create/edit/delete actions';

-- ─── RPC: atomic increment of used_count ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_voucher_used_count(p_voucher_id UUID)
RETURNS VOID AS $$
  UPDATE public.vouchers
  SET used_count = used_count + 1
  WHERE id = p_voucher_id;
$$ LANGUAGE sql SECURITY DEFINER;
