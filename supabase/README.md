# Supabase Database Setup for Laphing Daddy

This directory contains the database migrations and seed data for the Laphing Daddy e-commerce application.

## Files

- `migrations/20250115_products_schema.sql` - Schema enhancements for dynamic product catalog
- `seed.sql` - Product data and initial content

## Setup Instructions

### Step 1: Run Main Migration (If Not Already Done)

If you haven't run the main migration yet (`supabase_migration.sql` in project root):

```sql
-- Run this first in Supabase SQL Editor
-- File: supabase_migration.sql (in project root)
```

This creates all the base tables (profiles, orders, cart_items, etc.)

### Step 2: Run Schema Enhancement

Run the schema enhancement migration to add new fields needed for the dynamic product catalog:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/migrations/20250115_products_schema.sql
```

This migration:
- Adds `bulk_price` column for wholesale pricing
- Adds `minimum_quantity` column for min order requirements
- Adds `category` as TEXT field ('kit', 'addon', 'wholesale', 'corndog')
- Renames `is_active` → `active`, `is_featured` → `featured`, `stock_quantity` → `inventory`
- Converts `ingredients` from TEXT to TEXT[] array
- Adds `preparation` column for recipe instructions (markdown)
- Adds `recipe_available` boolean flag
- Creates `product_relations` table for related products
- Sets up proper indexes and RLS policies

### Step 3: Seed Products

Run the seed file to populate the database with initial products:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/seed.sql
```

This seeds:
- ✅ Laphing Kit (₹49, min qty: 2) - **Best Seller**
- ✅ Fresh Laphing Sheet (₹20, bulk: ₹15, min qty: 5)
- ✅ Cheese Corn Dog (₹60)
- ✅ Potato Corn Dog (₹60)
- ✅ Wai Wai Corn Dog (₹60)
- ✅ Wholesale Momos (Coming Soon - inactive)
- ✅ 5 Add-ons: Extra Sheet, Chilli Oil, Garlic Water, Sauce, Seasoning
- ✅ Product Relations (related products for each item)

## Products Seeded

### Main Products

1. **Laphing Kit** (`laphing-kit`)
   - Price: ₹49
   - Minimum Quantity: 2
   - Category: `kit`
   - Featured: ✅
   - Includes: Fresh sheet, chilli oil, garlic water, soya, wai wai, cutlery, packaging, recipe guide
   - Recipe: Full preparation instructions

2. **Fresh Laphing Sheet** (`laphing-sheet`)
   - Price: ₹20
   - Bulk Price: ₹15 (for 5+ sheets)
   - Minimum Quantity: 5
   - Category: `wholesale`
   - Featured: ✅

3. **Cheese Corn Dog** (`cheese-corn-dog`)
   - Price: ₹60
   - Category: `corndog`
   - Featured: ✅

4. **Potato Corn Dog** (`potato-corn-dog`)
   - Price: ₹60
   - Category: `corndog`
   - Featured: ✅

5. **Wai Wai Corn Dog** (`wai-wai-corn-dog`)
   - Price: ₹60
   - Category: `corndog`
   - Featured: ✅

6. **Wholesale Momos** (`wholesale-momos`)
   - Price: ₹299 (bulk: ₹249)
   - Category: `wholesale`
   - Status: Inactive (Coming Soon)

### Add-ons (Category: `addon`)

1. Extra Laphing Sheet - ₹20
2. Extra Chilli Oil - ₹15
3. Extra Garlic Water - ₹10
4. Extra Laphing Sauce - ₹15
5. Extra Seasoning Mix - ₹10

## Product Schema

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  bulk_price: number | null;
  minimum_quantity: number;
  category: 'kit' | 'addon' | 'wholesale' | 'corndog' | 'general';
  featured: boolean;
  active: boolean;
  images: string[];
  ingredients: string[] | null;
  preparation: string | null;  // Markdown
  recipe_available: boolean;
  inventory: number;
  created_at: string;
  updated_at: string;
  related_products?: Product[];
}
```

## Category Types

- `kit` - Complete Laphing Kits
- `addon` - Extra items (oils, sauces, sheets)
- `wholesale` - Bulk/wholesale products
- `corndog` - Corn dog varieties
- `general` - Other products

## Querying Products

### Get all active featured products

```sql
SELECT * FROM public.products 
WHERE active = true AND featured = true
ORDER BY created_at DESC;
```

### Get product with related products

```sql
SELECT 
  p.*,
  json_agg(
    json_build_object(
      'id', rp.id,
      'name', rp.name,
      'slug', rp.slug,
      'price', rp.price,
      'images', rp.images
    ) ORDER BY pr.sort_order
  ) as related_products
FROM public.products p
LEFT JOIN public.product_relations pr ON pr.product_id = p.id
LEFT JOIN public.products rp ON rp.id = pr.related_product_id
WHERE p.slug = 'laphing-kit'
GROUP BY p.id;
```

### Get products by category

```sql
SELECT * FROM public.products
WHERE category = 'kit' AND active = true;
```

### Get wholesale products with bulk pricing

```sql
SELECT * FROM public.products
WHERE bulk_price IS NOT NULL AND active = true;
```

## RLS Policies

- **Public**: Can read all `active = true` products
- **Admins**: Full access to all products
- **Product Relations**: Public read access for all relations

## Setting Up Admin User

After creating your account, set yourself as admin:

```sql
-- Replace with your actual user UUID from auth.users
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'your-user-uuid-here';
```

## Next Steps

1. ✅ Run migrations
2. ✅ Seed products
3. Set admin user
4. Update product images in Supabase Storage (optional)
5. Add more products as needed through admin panel or SQL

## Troubleshooting

### Issue: Column already exists

If you get "column already exists" errors, the schema may already be partially updated. Check existing columns:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public';
```

### Issue: Products not showing

Check RLS policies:

```sql
-- Test as public (unauthenticated)
SELECT * FROM public.products WHERE active = true;

-- Test as authenticated user
SELECT * FROM public.products;
```

### Issue: Seed data errors

If seeding fails due to existing data, either:
1. Uncomment the TRUNCATE line in seed.sql to clear all products
2. Or manually update existing products instead

## Support

For issues or questions:
- Check Supabase logs in Dashboard
- Review RLS policies
- Verify user roles
