-- ============================================================================
-- PRODUCTS SEED DATA
-- Initial product catalog for Laphing Daddy
-- Run AFTER the schema enhancement migration
-- ============================================================================

-- Note: This uses ON CONFLICT to update existing products or insert new ones
-- Safe to run multiple times

-- ─── 1. LAPHING KIT ─────────────────────────────────────────────────────────
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Laphing Kit',
  'laphing-kit',
  'Everything you need for authentic Tibetan Laphing at home',
  '# Laphing Kit

Experience authentic Tibetan street food in the comfort of your home. Our Laphing Kit contains everything you need to create the perfect spicy, cold noodle dish that has taken Delhi by storm.

## What Makes Our Kit Special?

- **Fresh Laphing Sheets**: Handmade daily using traditional methods
- **Signature Chilli Oil**: Our secret recipe with the perfect heat level
- **Authentic Garlic Water**: Balanced flavor that complements the spice
- **Premium Sauces**: Soya and Wai Wai for that authentic street taste
- **Complete Setup**: Fork, cutlery, and premium packaging included
- **Recipe Guide**: Step-by-step instructions with photos

Perfect for 1-2 servings. Best consumed fresh. Minimum order: 3 kits.',
  49,
  NULL,
  3,
  'kit',
  true,
  true,
  ARRAY[
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/laphingkit.png',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/freshlaphingsheet.png',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/signaturechillioil.png'
  ],
  ARRAY[
    'Fresh Laphing Sheet',
    'Signature Chilli Oil',
    'Garlic Water',
    'Soya Sauce',
    'Wai Wai Seasoning',
    'Fork & Cutlery',
    'Premium Packaging',
    'Recipe Guide'
  ],
  '# How to Prepare Your Laphing

## Step 1: Prepare the Base
1. Remove the fresh laphing sheet from packaging
2. Cut into thin strips (about 1cm wide)
3. Place in a large mixing bowl

## Step 2: Add the Sauces
1. Pour the signature chilli oil over the laphing
2. Add garlic water for that authentic flavor
3. Add soya sauce to taste
4. Sprinkle Wai Wai seasoning

## Step 3: Mix & Serve
1. Mix thoroughly using the provided fork
2. Ensure all strips are evenly coated
3. Serve immediately for best texture
4. Enjoy cold!

**Pro Tip**: Add cucumber strips or peanuts for extra crunch!',
  true,
  9999
)
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  bulk_price = EXCLUDED.bulk_price,
  minimum_quantity = EXCLUDED.minimum_quantity,
  category = EXCLUDED.category,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  preparation = EXCLUDED.preparation,
  recipe_available = EXCLUDED.recipe_available,
  inventory = EXCLUDED.inventory;

-- ─── 2. WHOLESALE LAPHING SHEET ────────────────────────────────────────────
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Fresh Laphing Sheet',
  'laphing-sheet',
  'Freshly prepared laphing sheets for wholesale orders',
  '# Wholesale Laphing Sheets

Our premium laphing sheets are handmade fresh daily using traditional Tibetan methods. Perfect for restaurants, cafes, or bulk orders.

## Pricing
- **Regular Price**: ₹20 per sheet (orders under 5 sheets)
- **Bulk Price**: ₹15 per sheet (orders of 5+ sheets)

## What You Get
- Fresh, handmade laphing sheets
- Made from high-quality wheat flour
- Perfect texture and elasticity
- No preservatives
- Best consumed within 2 days

**Minimum Order**: 5 sheets for delivery',
  20,
  15,
  5,
  'wholesale',
  true,
  true,
  ARRAY[
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/laphingsheet.png',
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/freshlaphingsheet.png'
  ],
  ARRAY[
    'Wheat Flour',
    'Water',
    'Salt',
    'Traditional Recipe'
  ],
  '# Basic Laphing Recipe

## Ingredients Needed (per sheet)
- 1 fresh laphing sheet
- 2 tbsp chilli oil
- 1 tbsp garlic water
- 1 tbsp soya sauce
- 1 tsp vinegar
- Salt to taste

## Instructions
1. Cut laphing sheet into thin strips
2. Mix all sauces in a bowl
3. Add laphing strips and toss well
4. Garnish with coriander and peanuts
5. Serve cold',
  true,
  9999
)
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  bulk_price = EXCLUDED.bulk_price,
  minimum_quantity = EXCLUDED.minimum_quantity,
  category = EXCLUDED.category,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  preparation = EXCLUDED.preparation,
  recipe_available = EXCLUDED.recipe_available,
  inventory = EXCLUDED.inventory;

-- ─── 3. CHEESE CORN DOG ─────────────────────────────────────────────────────
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  'Cheese Corn Dog',
  'cheese-corn-dog',
  'Golden crispy corn dog with a gooey cheese pull',
  '# Cheese Corn Dog

Experience the viral Korean street food sensation! Our cheese corn dogs feature premium mozzarella cheese wrapped in a golden, crispy cornmeal batter.

## What You''ll Love
- **Stretchy Cheese Pull**: Premium mozzarella that stretches for days
- **Crispy Golden Coating**: Perfectly fried cornmeal batter
- **Hot Dog Center**: Quality chicken frankfurter
- **Sugar Coating**: Sweet and savory flavor combination
- **Ready to Eat**: Served hot and fresh

Perfect as a snack or quick meal. Order now for delivery between 3 PM - 6 PM.',
  60,
  NULL,
  1,
  'corndog',
  true,
  true,
  ARRAY[
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/cheesecorndog.png'
  ],
  ARRAY[
    'Mozzarella Cheese',
    'Chicken Frankfurter',
    'Cornmeal Batter',
    'Wheat Flour',
    'Sugar Coating',
    'Vegetable Oil'
  ],
  NULL,
  false,
  50
)
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- ─── 4. POTATO CORN DOG ─────────────────────────────────────────────────────
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  'Potato Corn Dog',
  'potato-corn-dog',
  'Crispy corn dog coated with crunchy potato cubes',
  '# Potato Corn Dog

A unique twist on the classic corn dog! Coated with crispy potato cubes for an extra layer of crunch and flavor.

## Features
- **Crunchy Potato Coating**: Diced potato cubes for maximum crunch
- **Quality Frankfurter**: Premium chicken hot dog inside
- **Golden Fried**: Perfectly cooked to crispy perfection
- **Sweet & Savory**: Sugar coating balances the flavors
- **Instagram-Worthy**: Picture-perfect presentation

Served hot and fresh during our delivery window.',
  60,
  NULL,
  1,
  'corndog',
  true,
  true,
  ARRAY[
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/potatocorndog.png'
  ],
  ARRAY[
    'Fresh Potato Cubes',
    'Chicken Frankfurter',
    'Cornmeal Batter',
    'Wheat Flour',
    'Sugar Coating',
    'Vegetable Oil'
  ],
  NULL,
  false,
  50
)
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- ─── 5. WAI WAI CORN DOG ────────────────────────────────────────────────────
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  'Wai Wai Corn Dog',
  'wai-wai-corn-dog',
  'Corn dog with crunchy Wai Wai noodle coating',
  '# Wai Wai Corn Dog

The ultimate fusion of flavors! Our signature corn dog coated with crushed Wai Wai instant noodles for an unforgettable crunch.

## Why You''ll Love It
- **Wai Wai Coating**: Crushed instant noodles create a unique texture
- **Extra Crunchy**: Double the crunch, double the fun
- **Familiar Flavor**: That nostalgic Wai Wai taste you love
- **Perfect Fusion**: Korean street food meets Indian favorite
- **Social Media Star**: The most Instagrammable corn dog

Order now and experience the crunch!',
  60,
  NULL,
  1,
  'corndog',
  true,
  true,
  ARRAY[
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/waiwaicorndog.png'
  ],
  ARRAY[
    'Wai Wai Instant Noodles',
    'Chicken Frankfurter',
    'Cornmeal Batter',
    'Wheat Flour',
    'Sugar Coating',
    'Vegetable Oil'
  ],
  NULL,
  false,
  50
)
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- ─── 6. WHOLESALE MOMOS ─────────────────────────────────────────────────────
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
  'Wholesale Momos',
  'wholesale-momos',
  'Bulk orders of authentic Tibetan momos',
  '# Wholesale Momos

Coming soon! Premium Tibetan momos for bulk orders.

Perfect for:
- Restaurants and cafes
- Catering services
- Events and parties
- Wholesale distribution

**Contact us** for pricing and minimum order quantities.',
  299,
  249,
  50,
  'wholesale',
  false,
  false,
  ARRAY[
    'https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/momos.png'
  ],
  ARRAY[
    'Wheat Flour',
    'Vegetables/Chicken',
    'Spices',
    'Traditional Recipe'
  ],
  NULL,
  false,
  0
)
ON CONFLICT (slug) 
DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  bulk_price = EXCLUDED.bulk_price,
  minimum_quantity = EXCLUDED.minimum_quantity,
  category = EXCLUDED.category,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- ─── ADDONS (Extra Items) ───────────────────────────────────────────────────

-- Extra Laphing Sheet
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '7ba7b814-9dad-11d1-80b4-00c04fd430c8',
  'Extra Laphing Sheet',
  'extra-laphing-sheet',
  'Additional fresh laphing sheet',
  'Add extra laphing sheets to your order. Perfect when you need more servings or want to experiment with different sauce combinations.',
  20,
  NULL,
  1,
  'addon',
  false,
  true,
  ARRAY['https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/freshlaphingsheet.png'],
  ARRAY['Wheat Flour', 'Water', 'Salt'],
  NULL,
  false,
  9999
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- Extra Chilli Oil
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '7ba7b815-9dad-11d1-80b4-00c04fd430c8',
  'Extra Chilli Oil',
  'extra-chilli-oil',
  'Our signature spicy chilli oil',
  'Can''t get enough heat? Add extra portions of our signature chilli oil. Made with premium dried chilies and aromatic spices.',
  15,
  NULL,
  1,
  'addon',
  false,
  true,
  ARRAY['https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/signaturechillioil.png'],
  ARRAY['Red Chilli', 'Oil', 'Spices', 'Garlic'],
  NULL,
  false,
  9999
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- Extra Garlic Water
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '7ba7b816-9dad-11d1-80b4-00c04fd430c8',
  'Extra Garlic Water',
  'extra-garlic-water',
  'Authentic garlic-infused water',
  'Our specially prepared garlic water balances the heat and adds depth to your laphing. Made fresh daily.',
  10,
  NULL,
  1,
  'addon',
  false,
  true,
  ARRAY['https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/garlicwater.png'],
  ARRAY['Garlic', 'Water', 'Salt'],
  NULL,
  false,
  9999
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- Extra Sauce
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '7ba7b817-9dad-11d1-80b4-00c04fd430c8',
  'Extra Laphing Sauce',
  'extra-laphing-sauce',
  'Premium soya-based sauce',
  'Our custom-blended laphing sauce adds umami and depth. Perfect for those who love extra flavor.',
  15,
  NULL,
  1,
  'addon',
  false,
  true,
  ARRAY['https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/laphingsauce.png'],
  ARRAY['Soya Sauce', 'Vinegar', 'Spices'],
  NULL,
  false,
  9999
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- Extra Seasoning
INSERT INTO public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price,
  bulk_price,
  minimum_quantity,
  category,
  featured,
  active,
  images,
  ingredients,
  preparation,
  recipe_available,
  inventory
) VALUES (
  '7ba7b818-9dad-11d1-80b4-00c04fd430c8',
  'Extra Seasoning Mix',
  'extra-seasoning',
  'Wai Wai style seasoning blend',
  'Our secret seasoning mix adds that authentic street food flavor. Made with premium spices.',
  10,
  NULL,
  1,
  'addon',
  false,
  true,
  ARRAY['https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/products/seasoning.png'],
  ARRAY['Spices', 'Salt', 'MSG'],
  NULL,
  false,
  9999
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  active = EXCLUDED.active,
  images = EXCLUDED.images,
  ingredients = EXCLUDED.ingredients,
  inventory = EXCLUDED.inventory;

-- ─── PRODUCT RELATIONS (Related Products) ──────────────────────────────────

-- Clear existing relations first
DELETE FROM public.product_relations WHERE product_id IN (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '550e8400-e29b-41d4-a716-446655440000',
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  '6ba7b812-9dad-11d1-80b4-00c04fd430c8'
);

-- Only insert relations if BOTH products exist
DO $$
BEGIN
  -- Laphing Kit related products (only if ALL products exist)
  IF EXISTS (SELECT 1 FROM public.products WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
     AND EXISTS (SELECT 1 FROM public.products WHERE id = '550e8400-e29b-41d4-a716-446655440000')
     AND EXISTS (SELECT 1 FROM public.products WHERE id = '7ba7b815-9dad-11d1-80b4-00c04fd430c8')
     AND EXISTS (SELECT 1 FROM public.products WHERE id = '7ba7b816-9dad-11d1-80b4-00c04fd430c8') THEN
    INSERT INTO public.product_relations (product_id, related_product_id, sort_order) VALUES
      ('f47ac10b-58cc-4372-a567-0e02b2c3d479', '550e8400-e29b-41d4-a716-446655440000', 1), -- Kit -> Sheet
      ('f47ac10b-58cc-4372-a567-0e02b2c3d479', '7ba7b815-9dad-11d1-80b4-00c04fd430c8', 2), -- Kit -> Chilli Oil
      ('f47ac10b-58cc-4372-a567-0e02b2c3d479', '7ba7b816-9dad-11d1-80b4-00c04fd430c8', 3) -- Kit -> Garlic Water
    ON CONFLICT (product_id, related_product_id) DO NOTHING;
  END IF;

  -- Laphing Sheet related products (only if ALL products exist)
  IF EXISTS (SELECT 1 FROM public.products WHERE id = '550e8400-e29b-41d4-a716-446655440000')
     AND EXISTS (SELECT 1 FROM public.products WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
     AND EXISTS (SELECT 1 FROM public.products WHERE id = '7ba7b817-9dad-11d1-80b4-00c04fd430c8')
     AND EXISTS (SELECT 1 FROM public.products WHERE id = '7ba7b818-9dad-11d1-80b4-00c04fd430c8') THEN
    INSERT INTO public.product_relations (product_id, related_product_id, sort_order) VALUES
      ('550e8400-e29b-41d4-a716-446655440000', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 1), -- Sheet -> Kit
      ('550e8400-e29b-41d4-a716-446655440000', '7ba7b817-9dad-11d1-80b4-00c04fd430c8', 2), -- Sheet -> Sauce
      ('550e8400-e29b-41d4-a716-446655440000', '7ba7b818-9dad-11d1-80b4-00c04fd430c8', 3) -- Sheet -> Seasoning
    ON CONFLICT (product_id, related_product_id) DO NOTHING;
  END IF;

  -- Corn Dogs related products (only if ALL corn dog products exist)
  IF EXISTS (SELECT 1 FROM public.products WHERE id = '6ba7b810-9dad-11d1-80b4-00c04fd430c8')
     AND EXISTS (SELECT 1 FROM public.products WHERE id = '6ba7b811-9dad-11d1-80b4-00c04fd430c8')
     AND EXISTS (SELECT 1 FROM public.products WHERE id = '6ba7b812-9dad-11d1-80b4-00c04fd430c8') THEN
    INSERT INTO public.product_relations (product_id, related_product_id, sort_order) VALUES
      ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', 1), -- Cheese -> Potato
      ('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '6ba7b812-9dad-11d1-80b4-00c04fd430c8', 2), -- Cheese -> Wai Wai
      ('6ba7b811-9dad-11d1-80b4-00c04fd430c8', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 1), -- Potato -> Cheese
      ('6ba7b811-9dad-11d1-80b4-00c04fd430c8', '6ba7b812-9dad-11d1-80b4-00c04fd430c8', 2), -- Potato -> Wai Wai
      ('6ba7b812-9dad-11d1-80b4-00c04fd430c8', '6ba7b810-9dad-11d1-80b4-00c04fd430c8', 1), -- Wai Wai -> Cheese
      ('6ba7b812-9dad-11d1-80b4-00c04fd430c8', '6ba7b811-9dad-11d1-80b4-00c04fd430c8', 2) -- Wai Wai -> Potato
    ON CONFLICT (product_id, related_product_id) DO NOTHING;
  END IF;
END $$;
