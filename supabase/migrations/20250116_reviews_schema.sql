-- Drop existing table if it exists to start fresh
DROP TABLE IF EXISTS public.reviews CASCADE;

-- Create reviews table for customer testimonials
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name TEXT NOT NULL,
  reviewer_instagram TEXT,
  thumbnail_url TEXT,
  instagram_reel_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_reviews_active ON public.reviews(active);
CREATE INDEX idx_reviews_featured ON public.reviews(featured);
CREATE INDEX idx_reviews_display_order ON public.reviews(display_order);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews
  FOR SELECT
  USING (active = true);

-- Create policy for authenticated users to manage reviews
CREATE POLICY "Authenticated users can manage reviews"
  ON public.reviews
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Add comment
COMMENT ON TABLE public.reviews IS 'Customer reviews and testimonials with Instagram integration';
