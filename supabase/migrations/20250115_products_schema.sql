-- ============================================================================
-- PRODUCTS SCHEMA ENHANCEMENT
-- Adds new fields to existing products table for dynamic catalog
-- Run AFTER the main migration
-- ============================================================================

-- ─── Add New Columns to Existing Products Table ────────────────────────────

-- Add bulk_price if it doesn't exist (for wholesale pricing)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'bulk_price'
  ) THEN
    ALTER TABLE public.products ADD COLUMN bulk_price NUMERIC(10,2);
  END IF;
END $$;

-- Add minimum_quantity if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'minimum_quantity'
  ) THEN
    ALTER TABLE public.products ADD COLUMN minimum_quantity INT NOT NULL DEFAULT 1;
  END IF;
END $$;

-- Add category as TEXT field (simpler than category_id for this use case)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'category'
  ) THEN
    ALTER TABLE public.products ADD COLUMN category TEXT NOT NULL DEFAULT 'general';
  END IF;
END $$;

-- Rename columns to match new schema
DO $$ 
BEGIN
  -- is_active -> active
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'is_active'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'active'
  ) THEN
    ALTER TABLE public.products RENAME COLUMN is_active TO active;
  END IF;

  -- is_featured -> featured
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'is_featured'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'featured'
  ) THEN
    ALTER TABLE public.products RENAME COLUMN is_featured TO featured;
  END IF;

  -- stock_quantity -> inventory
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'stock_quantity'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'inventory'
  ) THEN
    ALTER TABLE public.products RENAME COLUMN stock_quantity TO inventory;
  END IF;
END $$;

-- Change ingredients from TEXT to TEXT[] if needed
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'ingredients'
    AND data_type = 'text'
  ) THEN
    ALTER TABLE public.products 
    ALTER COLUMN ingredients TYPE TEXT[] 
    USING CASE 
      WHEN ingredients IS NULL THEN NULL 
      ELSE ARRAY[ingredients]::TEXT[] 
    END;
  END IF;
END $$;

-- Add preparation column if it doesn't exist (for recipe instructions)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'preparation'
  ) THEN
    ALTER TABLE public.products ADD COLUMN preparation TEXT;
  END IF;
END $$;

-- Add recipe_available flag
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'recipe_available'
  ) THEN
    ALTER TABLE public.products ADD COLUMN recipe_available BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- ─── Create Indexes for New Columns ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category_text ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured_new ON public.products(featured);

-- ─── Related Products Junction Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  related_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, related_product_id)
);

CREATE INDEX IF NOT EXISTS idx_product_relations_product ON public.product_relations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_relations_related ON public.product_relations(related_product_id);

-- Enable RLS on product_relations
ALTER TABLE public.product_relations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for product relations" ON public.product_relations;
DROP POLICY IF EXISTS "product_relations_public_read" ON public.product_relations;
DROP POLICY IF EXISTS "product_relations_admin_write" ON public.product_relations;

-- Public can read all product relations
CREATE POLICY "product_relations_public_read" 
  ON public.product_relations 
  FOR SELECT 
  USING (true);

-- Only admins can modify
CREATE POLICY "product_relations_admin_write" 
  ON public.product_relations 
  FOR ALL 
  USING (public.is_admin());
