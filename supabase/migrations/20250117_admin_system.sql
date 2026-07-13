-- Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('store_status', '{"is_open": true, "message": ""}'::jsonb, 'Store open/closed status'),
  ('online_orders', '{"enabled": true, "message": ""}'::jsonb, 'Online ordering status'),
  ('delivery', '{"enabled": true, "message": ""}'::jsonb, 'Delivery status'),
  ('hero_section', '{"title": "LAPHING\nMADE EASY", "subtitle": "Authentic Tibetan Laphing delivered to your doorstep. Premium kits, fresh sheets and street-style flavors — ready in minutes.", "cta_text": "Order Now", "cta_link": "#products", "background_image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA0tL6CHSmGOjtE07asT61lZQgA86olm1v8ByllWNbWT-Icu8-D4vUO1fJjH2EpNqU9dG2kxtXLkRW8HoGuLD2Uh-F7lH3mywRiFA6WV6M59MnDJ7ryc1YOI5XVka5ON1fSzr01Bc6O7B50eDtAE5MQ0fpIR2iss1nnZXRCF4TpKeOHIqIWbuHXr37RVRTEXPHb8VQu5mE02whR8-tyY1PEp-xtBgaLwh_8AKyfjq2UsUlJuTE72GS7Gl6ZcPDV6qsST2AXF-KLblc"}'::jsonb, 'Hero section content'),
  ('founder_section', '{"name": "Paras Chopra", "role": "Founder", "image": "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/founder/paras-chopra.jpg", "story": "Growing up in Delhi, I fell in love with the bold, spicy flavors of Tibetan laphing from street-side stalls. The perfect chew of the starch noodles, the fiery chilli oil, the tangy garlic water—it was an experience I couldn''t find anywhere else.\n\nBut authentic laphing was hard to find, and even harder to make at home. That''s when I decided to change that.\n\nAfter months of experimenting with traditional gluten extraction methods and perfecting our spice blend, Laphing Daddy was born. Today, we handcraft every sheet fresh daily and deliver the complete authentic experience straight to your doorstep.\n\nOur mission? To bring the soul of Tibetan street food into homes across Delhi NCR.", "phone": "9873052538", "whatsapp": "919354775439", "instagram": "laphingdaddy"}'::jsonb, 'Founder section content')
ON CONFLICT (key) DO NOTHING;

-- Create homepage_sections table for dynamic sections
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default homepage sections
INSERT INTO public.homepage_sections (section_key, title, subtitle, content, display_order, is_active) VALUES
  ('hero', 'Hero Section', 'Main landing section', '{}'::jsonb, 1, true),
  ('products', 'Our Products', 'Featured products showcase', '{}'::jsonb, 2, true),
  ('why_choose_us', 'Why Choose Us', 'Key benefits and features', '{"items": [{"icon": "Flame", "title": "Fresh Daily", "description": "Our starch noodles are extracted and set every morning for the perfect bouncy texture."}, {"icon": "BookOpen", "title": "Authentic Recipe", "description": "Staying true to Tibetan roots with our proprietary spice blend and gluten extraction method."}, {"icon": "Truck", "title": "Quick Delivery", "description": "Vacuum-sealed freshness delivered straight to your door in custom insulated packaging."}]}'::jsonb, 3, true),
  ('recipe_guide', 'Recipe Guide', 'Step-by-step preparation', '{}'::jsonb, 4, true),
  ('founder', 'Meet The Founder', 'Our story and mission', '{}'::jsonb, 5, true),
  ('reviews', 'Customer Reviews', 'What our customers say', '{}'::jsonb, 6, true),
  ('faq', 'FAQs', 'Frequently asked questions', '{}'::jsonb, 7, true),
  ('cta', 'Call To Action', 'Final conversion section', '{}'::jsonb, 8, true)
ON CONFLICT (section_key) DO NOTHING;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_display_order ON public.homepage_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_active ON public.homepage_sections(is_active);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_settings
CREATE POLICY "Settings are viewable by everyone"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update settings"
  ON public.site_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for homepage_sections
CREATE POLICY "Homepage sections are viewable by everyone"
  ON public.homepage_sections
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage homepage sections"
  ON public.homepage_sections
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update products RLS for admin management
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;

CREATE POLICY "Products are viewable by everyone"
  ON public.products
  FOR SELECT
  USING (active = true OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

CREATE POLICY "Only admins can manage products"
  ON public.products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update reviews RLS for admin management
DROP POLICY IF EXISTS "Authenticated users can manage reviews" ON public.reviews;

CREATE POLICY "Only admins can manage reviews"
  ON public.reviews
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Add comments
COMMENT ON TABLE public.site_settings IS 'Global site configuration and settings';
COMMENT ON TABLE public.homepage_sections IS 'Dynamic homepage section management';
