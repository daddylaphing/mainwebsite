-- =============================================================================
-- LAPHING E-COMMERCE — COMPLETE SUPABASE SQL MIGRATION
-- Run this entire script in Supabase SQL Editor (one shot)
-- Project: gyrvdaucaznmastgspvc
-- =============================================================================

-- ─── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- SECTION 1: TABLES
-- =============================================================================

-- ─── Profiles (extends auth.users) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'wholesale')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Addresses ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  gstin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Categories ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Products ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL,
  sale_price NUMERIC(10,2),
  wholesale_price NUMERIC(10,2),
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 10,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  ingredients TEXT,
  nutrition_info JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  weight_grams INT,
  shelf_life_days INT,
  preparation_time_minutes INT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Product Variants ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price_modifier NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  attributes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Kit Configurations ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kit_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  components JSONB NOT NULL DEFAULT '{}',
  packaging_charge NUMERIC(10,2) NOT NULL DEFAULT 30,
  min_order_qty INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Cart Items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  kit_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cart_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- ─── Coupons ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2),
  max_discount NUMERIC(10,2),
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Orders ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL DEFAULT '',
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','preparing','packed','out_for_delivery','delivered','cancelled')),
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  packaging_charge NUMERIC(10,2) NOT NULL DEFAULT 30,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  coupon_code TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_id TEXT,
  payment_method TEXT DEFAULT 'razorpay',
  shipping_address JSONB NOT NULL,
  delivery_notes TEXT,
  invoice_number TEXT UNIQUE,
  gstin TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ
);

-- ─── Order Items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  image_url TEXT,
  kit_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Order Status History ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ─── Wholesale Orders ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wholesale_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  company_name TEXT NOT NULL,
  gstin TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','quoted','confirmed','cancelled')),
  pricing_tier TEXT,
  min_order_met BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  quote_requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Wishlist ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- ─── Reviews ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  helpful_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Coupon Usages ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupon_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (coupon_id, user_id)
);

-- ─── Notifications ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order', 'offer', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Newsletter Subscribers ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- ─── FAQs ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Preparation Guides ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.preparation_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  difficulty TEXT CHECK (difficulty IN ('easy','medium','hard')),
  time_minutes INT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Delivery Zones ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  pincodes TEXT[] NOT NULL DEFAULT '{}',
  shipping_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  free_shipping_above NUMERIC(10,2),
  estimated_days INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Packaging Charges ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.packaging_charges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  applies_to TEXT NOT NULL DEFAULT 'all' CHECK (applies_to IN ('all','kit','standard')),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ─── Tax Rules ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tax_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rate NUMERIC(5,4) NOT NULL,
  applies_to_category UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ─── Site Settings ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Media Library ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt_text TEXT,
  file_size INT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Inventory Log ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inventory_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  change INT NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- SECTION 2: INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON public.cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id);

-- =============================================================================
-- SECTION 3: FUNCTIONS & TRIGGERS
-- =============================================================================

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Order number generator
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
DECLARE
  seq INT;
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INT)), 1000) + 1
    INTO seq
    FROM public.orders
    WHERE order_number ~ '^LPH[0-9]+$';
    NEW.order_number := 'LPH' || LPAD(seq::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_order_number ON public.orders;
CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- Invoice number on payment
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  year_month TEXT;
  seq INT;
BEGIN
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' AND NEW.invoice_number IS NULL THEN
    year_month := TO_CHAR(now(), 'YYYY-MM');
    SELECT COUNT(*) + 1 INTO seq
    FROM public.orders
    WHERE invoice_number LIKE 'INV-' || year_month || '-%';
    NEW.invoice_number := 'INV-' || year_month || '-' || LPAD(seq::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_invoice_number ON public.orders;
CREATE TRIGGER trg_set_invoice_number
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

-- Order status history tracker
CREATE OR REPLACE FUNCTION public.track_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_status_history (order_id, status, note)
    VALUES (NEW.id, NEW.status, 'Status updated to ' || NEW.status);
    IF NEW.status = 'delivered' THEN
      NEW.delivered_at := now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_track_order_status ON public.orders;
CREATE TRIGGER trg_track_order_status
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.track_order_status();

-- Stock decrement on confirm, restore on cancel
CREATE OR REPLACE FUNCTION public.manage_stock_on_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE public.products p
    SET stock_quantity = stock_quantity - oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
  END IF;
  IF NEW.status = 'cancelled' AND OLD.status IN ('confirmed','preparing','packed') THEN
    UPDATE public.products p
    SET stock_quantity = stock_quantity + oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_manage_stock ON public.orders;
CREATE TRIGGER trg_manage_stock
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.manage_stock_on_order_status();

-- One default address per user
CREATE OR REPLACE FUNCTION public.handle_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_handle_default_address ON public.addresses;
CREATE TRIGGER trg_handle_default_address
  AFTER INSERT OR UPDATE ON public.addresses
  FOR EACH ROW WHEN (NEW.is_default = true)
  EXECUTE FUNCTION public.handle_default_address();

-- =============================================================================
-- SECTION 4: ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preparation_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rules ENABLE ROW LEVEL SECURITY;

-- Admin helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Addresses
CREATE POLICY "addresses_own" ON public.addresses USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "addresses_insert_own" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Products (public read active, admin all)
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "products_admin_write" ON public.products FOR ALL USING (public.is_admin());

-- Categories (public read)
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON public.categories FOR ALL USING (public.is_admin());

-- Variants (public read)
CREATE POLICY "variants_public_read" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "variants_admin_write" ON public.product_variants FOR ALL USING (public.is_admin());

-- Kit Configs (public read active)
CREATE POLICY "kits_public_read" ON public.kit_configurations FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "kits_admin_write" ON public.kit_configurations FOR ALL USING (public.is_admin());

-- Cart
CREATE POLICY "cart_own" ON public.cart_items USING (auth.uid() = user_id);
CREATE POLICY "cart_insert_own" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Orders
CREATE POLICY "orders_own" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE USING (public.is_admin());

-- Order Items
CREATE POLICY "order_items_own" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Order Status History
CREATE POLICY "order_status_own" ON public.order_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_status_history.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "order_status_admin_insert" ON public.order_status_history FOR INSERT WITH CHECK (public.is_admin());

-- Wishlist
CREATE POLICY "wishlist_own" ON public.wishlist_items USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own" ON public.wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (is_approved = true OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "reviews_insert_auth" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON public.reviews FOR UPDATE USING (public.is_admin() OR auth.uid() = user_id);

-- Notifications
CREATE POLICY "notifications_own" ON public.notifications USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_admin" ON public.notifications FOR INSERT WITH CHECK (public.is_admin());

-- Wholesale
CREATE POLICY "wholesale_own" ON public.wholesale_orders USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "wholesale_insert_auth" ON public.wholesale_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- FAQs, Preparation Guides, Delivery Zones (public read)
CREATE POLICY "faqs_public_read" ON public.faqs FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "faqs_admin" ON public.faqs FOR ALL USING (public.is_admin());
CREATE POLICY "guides_public_read" ON public.preparation_guides FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "zones_public_read" ON public.delivery_zones FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "packaging_public_read" ON public.packaging_charges FOR SELECT USING (true);
CREATE POLICY "tax_public_read" ON public.tax_rules FOR SELECT USING (is_active = true);

-- Settings
CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_write" ON public.site_settings FOR ALL USING (public.is_admin());

-- Newsletter
CREATE POLICY "newsletter_insert" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin_read" ON public.newsletter_subscribers FOR SELECT USING (public.is_admin());

-- Coupon usages
CREATE POLICY "coupon_usages_own" ON public.coupon_usages FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- =============================================================================
-- SECTION 5: STORAGE BUCKETS
-- =============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('products', 'products', true),
  ('avatars', 'avatars', true),
  ('reviews', 'reviews', true),
  ('media', 'media', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "products_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "products_admin_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND public.is_admin());
CREATE POLICY "products_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_own_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_own_update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "reviews_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'reviews');
CREATE POLICY "reviews_auth_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reviews' AND auth.role() = 'authenticated');

CREATE POLICY "media_admin_all" ON storage.objects USING (bucket_id = 'media' AND public.is_admin());

-- =============================================================================
-- SECTION 6: SEED DATA
-- =============================================================================

INSERT INTO public.packaging_charges (name, amount, description, applies_to) VALUES
  ('Standard Packaging', 30.00, 'Eco-friendly packaging per order', 'all')
ON CONFLICT DO NOTHING;

INSERT INTO public.tax_rules (name, rate) VALUES
  ('GST 5%', 0.05)
ON CONFLICT DO NOTHING;

INSERT INTO public.kit_configurations (name, base_price, components, packaging_charge, min_order_qty) VALUES (
  'Standard Laphing Kit', 250.00,
  '{"sheet_qty": 1, "chilli_oil_qty": 1, "garlic_water_qty": 1, "sauce_qty": 1, "seasoning_qty": 1}',
  30.00, 1
) ON CONFLICT DO NOTHING;

INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Laphing Kits', 'laphing-kits', 'Complete kits to make laphing at home', 1),
  ('Laphing Sheets', 'laphing-sheets', 'Fresh laphing sheets', 2),
  ('Sauces & Oils', 'sauces-oils', 'Signature chilli oils and sauces', 3),
  ('Accessories', 'accessories', 'Preparation accessories', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, short_description, price, stock_quantity, is_active, is_featured, is_bestseller, shelf_life_days, preparation_time_minutes)
SELECT 'Laphing Kit', 'laphing-kit',
  'Everything you need to make authentic laphing at home. Includes fresh laphing sheet, signature chilli oil, garlic water, laphing sauce, seasoning mix, and step-by-step preparation guide.',
  'Complete kit for authentic laphing at home',
  250.00, 100, true, true, true, 2, 15
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'laphing-kit');

INSERT INTO public.products (name, slug, description, short_description, price, wholesale_price, stock_quantity, is_active, is_featured, shelf_life_days)
SELECT 'Laphing Sheet (Wholesale)', 'laphing-sheet-wholesale',
  'Fresh, soft and handmade laphing sheets. Perfect for home cooks and businesses. Made fresh to order every morning.',
  'Handmade fresh laphing sheets',
  20.00, 18.00, 500, true, true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE slug = 'laphing-sheet-wholesale');

INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
  ('What is Laphing?', 'Laphing is a popular Tibetan/Nepalese street food made from starchy mung bean or potato starch sheets, served with spicy chilli oil, garlic water, and special sauce.', 'About Laphing', 1),
  ('How long does delivery take?', 'We deliver within 1-2 business days within our delivery zones. You will receive SMS and WhatsApp updates once your order is dispatched.', 'Delivery', 2),
  ('What is the minimum order?', 'The minimum order value is Rs.250. Packaging charges of Rs.30 apply per order. Free delivery on orders above Rs.500.', 'Ordering', 3),
  ('Are the sheets made fresh?', 'Yes! All laphing sheets are made fresh to order every morning without any preservatives. Consume within 2 days of delivery.', 'Product', 4),
  ('Can I customize my kit?', 'Absolutely! Use our Kit Builder to add extra sheets, sauces, chilli oil and more to your order.', 'Product', 5),
  ('Do you offer wholesale?', 'Yes! We offer wholesale pricing for bulk orders. Minimum 10 sheets at Rs.20/sheet. Visit our Wholesale page or contact us directly.', 'Wholesale', 6),
  ('What payment methods do you accept?', 'We accept UPI, Credit/Debit cards, Net Banking via Razorpay. Cash on Delivery may be available in select areas.', 'Payment', 7),
  ('Can I cancel my order?', 'Orders can be cancelled before they are confirmed. Once confirmed, please contact us immediately for assistance.', 'Orders', 8)
ON CONFLICT DO NOTHING;

INSERT INTO public.delivery_zones (name, pincodes, shipping_charge, free_shipping_above, estimated_days) VALUES
  ('Local (Bangalore)', '{}', 50.00, 500.00, 1)
ON CONFLICT DO NOTHING;

INSERT INTO public.preparation_guides (title, slug, steps, difficulty, time_minutes) VALUES (
  'How to Make Laphing at Home',
  'how-to-make-laphing',
  '[
    {"step": 1, "title": "Prepare the Sheet", "description": "Remove the laphing sheet from packaging and lay flat on a clean surface.", "time_seconds": 30},
    {"step": 2, "title": "Apply Garlic Water", "description": "Drizzle the garlic water evenly over the entire sheet.", "time_seconds": 30},
    {"step": 3, "title": "Add Chilli Oil", "description": "Pour the signature chilli oil over the sheet to your desired spice level.", "time_seconds": 30},
    {"step": 4, "title": "Add Laphing Sauce", "description": "Drizzle the laphing sauce for the authentic flavour.", "time_seconds": 30},
    {"step": 5, "title": "Season", "description": "Sprinkle the seasoning mix evenly.", "time_seconds": 15},
    {"step": 6, "title": "Roll and Serve", "description": "Roll the sheet tightly and cut into pieces. Serve immediately and enjoy!", "time_seconds": 60}
  ]',
  'easy', 3
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_settings (key, value) VALUES
  ('min_order_value', '250'),
  ('packaging_charge', '30'),
  ('free_shipping_above', '500'),
  ('gst_rate', '0.05'),
  ('whatsapp_number', '"916000000000"'),
  ('business_hours', '"Mon-Sat: 9AM - 7PM"'),
  ('site_name', '"Laphing"'),
  ('tagline', '"Authentic. Spicy. Addictive."')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- SECTION 7: REALTIME
-- =============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =============================================================================
-- DONE! Run complete.
--
-- NEXT STEPS:
-- 1. Supabase Dashboard > Auth > Providers > Google:
--    Add Google OAuth Client ID & Secret
--    Set redirect URL: https://gyrvdaucaznmastgspvc.supabase.co/auth/v1/callback
--
-- 2. Google Cloud Console > OAuth > Authorized redirect URIs:
--    https://gyrvdaucaznmastgspvc.supabase.co/auth/v1/callback
--
-- 3. Set your admin user:
--    UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
--
-- 4. Update NEXT_PUBLIC_SITE_URL in .env.local to your production domain
-- =============================================================================
