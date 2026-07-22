-- Standalone fix for Supabase: update stock management trigger to use inventory column

DO $$
BEGIN
  -- If the old stock_quantity column still exists but inventory does not, rename it.
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
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.manage_stock_on_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE public.products p
    SET inventory = inventory - oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
  END IF;

  IF NEW.status = 'cancelled' AND OLD.status IN ('confirmed', 'preparing', 'packed') THEN
    UPDATE public.products p
    SET inventory = inventory + oi.quantity
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
