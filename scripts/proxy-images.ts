/**
 * Script to update all Supabase storage URLs in the database to use proxy
 * Run this once to convert all existing URLs
 * 
 * Usage: npx tsx scripts/proxy-images.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function getProxiedUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.includes("supabase.co/storage/")) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

async function updateProducts() {
  console.log("📦 Updating products...");
  
  const { data: products, error } = await supabase
    .from("products")
    .select("id, images");

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  let updated = 0;
  for (const product of products || []) {
    if (!product.images || !Array.isArray(product.images)) continue;

    const proxiedImages = product.images.map(getProxiedUrl).filter(Boolean);
    
    const { error: updateError } = await supabase
      .from("products")
      .update({ images: proxiedImages })
      .eq("id", product.id);

    if (updateError) {
      console.error(`Error updating product ${product.id}:`, updateError);
    } else {
      updated++;
    }
  }

  console.log(`✅ Updated ${updated} products`);
}

async function updateReviews() {
  console.log("⭐ Updating reviews...");
  
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, thumbnail_url");

  if (error) {
    console.error("Error fetching reviews:", error);
    return;
  }

  let updated = 0;
  for (const review of reviews || []) {
    if (!review.thumbnail_url) continue;

    const proxiedUrl = getProxiedUrl(review.thumbnail_url);
    
    const { error: updateError } = await supabase
      .from("reviews")
      .update({ thumbnail_url: proxiedUrl })
      .eq("id", review.id);

    if (updateError) {
      console.error(`Error updating review ${review.id}:`, updateError);
    } else {
      updated++;
    }
  }

  console.log(`✅ Updated ${updated} reviews`);
}

async function updateSiteSettings() {
  console.log("⚙️  Updating site settings...");
  
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error) {
    console.error("Error fetching settings:", error);
    return;
  }

  let updated = 0;
  for (const setting of settings || []) {
    let needsUpdate = false;
    let newValue = setting.value;

    // Check hero_section background_image
    if (setting.key === "hero_section" && setting.value?.background_image) {
      const proxiedUrl = getProxiedUrl(setting.value.background_image);
      if (proxiedUrl !== setting.value.background_image) {
        newValue = { ...setting.value, background_image: proxiedUrl };
        needsUpdate = true;
      }
    }

    // Check founder_section image
    if (setting.key === "founder_section" && setting.value?.image) {
      const proxiedUrl = getProxiedUrl(setting.value.image);
      if (proxiedUrl !== setting.value.image) {
        newValue = { ...setting.value, image: proxiedUrl };
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from("site_settings")
        .update({ value: newValue })
        .eq("key", setting.key);

      if (updateError) {
        console.error(`Error updating setting ${setting.key}:`, updateError);
      } else {
        updated++;
      }
    }
  }

  console.log(`✅ Updated ${updated} settings`);
}

async function main() {
  console.log("🚀 Starting image URL proxy conversion...\n");
  
  await updateProducts();
  await updateReviews();
  await updateSiteSettings();
  
  console.log("\n✨ Done! All Supabase storage URLs have been converted to proxied URLs.");
  console.log("📝 Note: This script only updates database records.");
  console.log("   Make sure to use the ProxiedImage component or getProxiedImageUrl() for new images.");
}

main().catch(console.error);
