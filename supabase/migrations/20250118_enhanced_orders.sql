-- Enhanced order status enum
DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM (
    'pending',
    'accepted',
    'preparing',
    'ready',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enhanced payment status enum
DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM (
    'pending',
    'processing',
    'paid',
    'failed',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update orders table if exists, otherwise create
DO $$
BEGIN
  -- Check if orders table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
    -- Add new columns if they don't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'accepted_at') THEN
      ALTER TABLE orders ADD COLUMN accepted_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'preparing_at') THEN
      ALTER TABLE orders ADD COLUMN preparing_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'ready_at') THEN
      ALTER TABLE orders ADD COLUMN ready_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'completed_at') THEN
      ALTER TABLE orders ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'cancelled_at') THEN
      ALTER TABLE orders ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'cancellation_reason') THEN
      ALTER TABLE orders ADD COLUMN cancellation_reason TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'admin_notes') THEN
      ALTER TABLE orders ADD COLUMN admin_notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'razorpay_order_id') THEN
      ALTER TABLE orders ADD COLUMN razorpay_order_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'razorpay_payment_id') THEN
      ALTER TABLE orders ADD COLUMN razorpay_payment_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'razorpay_signature') THEN
      ALTER TABLE orders ADD COLUMN razorpay_signature TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_provider') THEN
      ALTER TABLE orders ADD COLUMN delivery_provider TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_tracking_id') THEN
      ALTER TABLE orders ADD COLUMN delivery_tracking_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_status') THEN
      ALTER TABLE orders ADD COLUMN delivery_status TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'whatsapp_sent') THEN
      ALTER TABLE orders ADD COLUMN whatsapp_sent BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'whatsapp_log') THEN
      ALTER TABLE orders ADD COLUMN whatsapp_log JSONB DEFAULT '[]'::jsonb;
    END IF;
  ELSE
    -- Create orders table with all fields
    CREATE TABLE orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number TEXT UNIQUE NOT NULL,
      user_id UUID REFERENCES auth.users(id),
      
      -- Status tracking
      status order_status_enum DEFAULT 'pending',
      payment_status payment_status_enum DEFAULT 'pending',
      
      -- Timestamps for each status
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      accepted_at TIMESTAMP WITH TIME ZONE,
      preparing_at TIMESTAMP WITH TIME ZONE,
      ready_at TIMESTAMP WITH TIME ZONE,
      completed_at TIMESTAMP WITH TIME ZONE,
      cancelled_at TIMESTAMP WITH TIME ZONE,
      delivered_at TIMESTAMP WITH TIME ZONE,
      
      -- Pricing
      subtotal DECIMAL(10, 2) NOT NULL,
      tax DECIMAL(10, 2) DEFAULT 0,
      shipping_charge DECIMAL(10, 2) DEFAULT 0,
      packaging_charge DECIMAL(10, 2) DEFAULT 0,
      discount DECIMAL(10, 2) DEFAULT 0,
      total DECIMAL(10, 2) NOT NULL,
      
      -- Coupon
      coupon_code TEXT,
      
      -- Payment details
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      payment_id TEXT,
      
      -- Address
      shipping_address JSONB NOT NULL,
      
      -- Notes
      delivery_notes TEXT,
      admin_notes TEXT,
      cancellation_reason TEXT,
      
      -- Invoice
      invoice_number TEXT,
      
      -- Delivery integration
      delivery_provider TEXT,
      delivery_tracking_id TEXT,
      delivery_status TEXT,
      
      -- WhatsApp integration
      whatsapp_sent BOOLEAN DEFAULT false,
      whatsapp_log JSONB DEFAULT '[]'::jsonb
    );
    
    CREATE INDEX idx_orders_user_id ON orders(user_id);
    CREATE INDEX idx_orders_status ON orders(status);
    CREATE INDEX idx_orders_payment_status ON orders(payment_status);
    CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
    CREATE INDEX idx_orders_order_number ON orders(order_number);
  END IF;
END $$;

-- Create order_items table if not exists
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  image_url TEXT,
  kit_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Create order_status_history table for audit trail
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status order_status_enum NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- Function to automatically update order timestamps based on status
CREATE OR REPLACE FUNCTION update_order_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Set timestamp based on new status
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    NEW.accepted_at = NOW();
  ELSIF NEW.status = 'preparing' AND OLD.status != 'preparing' THEN
    NEW.preparing_at = NOW();
  ELSIF NEW.status = 'ready' AND OLD.status != 'ready' THEN
    NEW.ready_at = NOW();
  ELSIF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    NEW.cancelled_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS order_status_timestamp_trigger ON orders;
CREATE TRIGGER order_status_timestamp_trigger
  BEFORE UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_status_timestamp();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO order_status_history (order_id, status, created_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status logging
DROP TRIGGER IF EXISTS order_status_log_trigger ON orders;
CREATE TRIGGER order_status_log_trigger
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can create orders" ON orders;
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only admins can update orders" ON orders;
CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- RLS Policies for order_items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (orders.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ))
  ));

DROP POLICY IF EXISTS "Users can create order items" ON order_items;
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  ));

-- RLS Policies for order_status_history
DROP POLICY IF EXISTS "Users can view order history" ON order_status_history;
CREATE POLICY "Users can view order history"
  ON order_status_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id
    AND (orders.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ))
  ));

-- Comments
COMMENT ON TABLE orders IS 'Customer orders with enhanced status tracking and integrations';
COMMENT ON TABLE order_items IS 'Line items for each order';
COMMENT ON TABLE order_status_history IS 'Audit trail for order status changes';
