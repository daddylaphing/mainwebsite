/**
 * Product Data Access Layer
 * All product-related database queries
 */

import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

// ============================================================================
// SERVER-SIDE QUERIES (for Server Components, API Routes)
// ============================================================================

/**
 * Get all active products
 */
export async function getProducts(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<Product[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true);

  if (options?.featured) {
    query = query.eq("featured", true);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  query = query.order("created_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a single product by slug with related products
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  // Get the main product
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !product) {
    console.error("Error fetching product:", error);
    return null;
  }

  // Get related products
  const { data: relations } = await supabase
    .from("product_relations")
    .select(`
      related_product_id,
      sort_order,
      related:related_product_id (*)
    `)
    .eq("product_id", product.id)
    .order("sort_order");

  if (relations && relations.length > 0) {
    product.related_products = (relations as Array<{ related: unknown }>)
      .map((r) => r.related)
      .filter(Boolean) as Product[];
  }

  return product as Product;
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .single();

  if (error || !data) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data as Product;
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  category: string,
  options?: { limit?: number }
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }

  return data || [];
}

/**
 * Get addon products
 */
export async function getAddonProducts(): Promise<Product[]> {
  return getProductsByCategory("addon");
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return getProducts({ featured: true, limit });
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
    .order("featured", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

  return data || [];
}

/**
 * Get wholesale products
 */
export async function getWholesaleProducts(): Promise<Product[]> {
  return getProductsByCategory("wholesale");
}

/**
 * Get products with bulk pricing
 */
export async function getBulkPricedProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .not("bulk_price", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bulk products:", error);
    return [];
  }

  return data || [];
}

// ============================================================================
// CLIENT-SIDE QUERIES (for Client Components)
// ============================================================================

/**
 * Get products (client-side)
 */
export async function getProductsClient(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<Product[]> {
  const supabase = createBrowserClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true);

  if (options?.featured) {
    query = query.eq("featured", true);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  query = query.order("created_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

/**
 * Get product by slug (client-side)
 */
export async function getProductBySlugClient(slug: string): Promise<Product | null> {
  const supabase = createBrowserClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !product) {
    console.error("Error fetching product:", error);
    return null;
  }

  // Get related products
  const { data: relations } = await supabase
    .from("product_relations")
    .select(`
      related_product_id,
      sort_order,
      related:related_product_id (*)
    `)
    .eq("product_id", product.id)
    .order("sort_order");

  if (relations && relations.length > 0) {
    product.related_products = (relations as Array<{ related: unknown }>)
      .map((r) => r.related)
      .filter(Boolean) as Product[];
  }

  return product as Product;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate effective price (considers bulk_price if quantity meets minimum)
 */
export function getEffectivePrice(product: Product, quantity: number): number {
  if (
    product.bulk_price &&
    product.minimum_quantity &&
    quantity >= product.minimum_quantity
  ) {
    return product.bulk_price;
  }
  return product.price;
}

/**
 * Check if quantity meets minimum order requirement
 */
export function meetsMinimumQuantity(product: Product, quantity: number): boolean {
  return quantity >= (product.minimum_quantity || 1);
}

/**
 * Get primary product image
 */
export function getProductImage(product: Product): string {
  return product.images?.[0] || "/placeholder-product.png";
}

/**
 * Format product price with bulk discount indicator
 */
export function formatProductPrice(product: Product): string {
  if (product.bulk_price && product.minimum_quantity) {
    return `₹${product.price} (₹${product.bulk_price} for ${product.minimum_quantity}+)`;
  }
  return `₹${product.price}`;
}

/**
 * Check if product has recipe/preparation instructions
 */
export function hasRecipe(product: Product): boolean {
  return product.recipe_available && !!product.preparation;
}

/**
 * Get product category display name
 */
export function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    kit: "Laphing Kits",
    addon: "Add-ons",
    wholesale: "Wholesale",
    corndog: "Corn Dogs",
    general: "Products",
  };
  return categoryMap[category] || category;
}

/**
 * Check if product is in stock
 */
export function isInStock(product: Product): boolean {
  return product.inventory > 0;
}

/**
 * Check if product is low stock
 */
export function isLowStock(product: Product): boolean {
  // Low stock if inventory is less than 10 (or custom threshold)
  return product.inventory > 0 && product.inventory < 10;
}
