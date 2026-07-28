-- Upsert the main laphing guide with correct steps
INSERT INTO public.preparation_guides (title, slug, steps, difficulty, time_minutes, is_published)
VALUES (
  'How to Make Laphing at Home',
  'how-to-make-laphing',
  '[
    {"step": 1, "title": "Prepare the Sheet", "description": "Remove the fresh laphing sheet from its vacuum-sealed packaging and lay it flat on a clean plate or cutting board.", "time": "30s"},
    {"step": 2, "title": "Prepare Soya Granules", "description": "Soak the soya granules in water for 2-3 minutes, then squeeze out excess water thoroughly. This softens them for the perfect texture.", "time": "3min"},
    {"step": 3, "title": "Apply Garlic Water", "description": "Drizzle our aromatic garlic water evenly over the entire surface of the sheet to build the base flavor profile.", "time": "30s"},
    {"step": 4, "title": "Add Signature Chilli Oil", "description": "Spread our slow-cooked, handcrafted chilli oil across the sheet. Adjust the amount to suit your personal spice threshold.", "time": "30s"},
    {"step": 5, "title": "Roll, Cut & Serve", "description": "Roll the sheet tightly into a cylinder, slice it into bite-sized pieces, and serve immediately for peak texture and taste.", "time": "60s"}
  ]'::jsonb,
  'easy',
  3,
  true
)
ON CONFLICT (slug) DO UPDATE
  SET steps = EXCLUDED.steps,
      title = EXCLUDED.title,
      is_published = EXCLUDED.is_published;

-- Add admin write policy if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'preparation_guides' AND policyname = 'guides_admin'
  ) THEN
    EXECUTE 'CREATE POLICY "guides_admin" ON public.preparation_guides FOR ALL USING (public.is_admin())';
  END IF;
END
$$;
