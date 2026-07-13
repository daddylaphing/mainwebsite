/**
 * Site Configuration
 * All business rules and pricing configurable via Supabase site_settings table
 */

export interface SiteConfig {
  // Product Pricing
  laphing_kit_price: number;
  laphing_sheet_price: number;
  
  // Minimum Order Quantities
  min_wholesale_qty: number;
  min_kit_qty: number;
  
  // Charges
  packaging_charge: number;
  
  // Extra Items Pricing
  extra_sheet_price: number;
  extra_chilli_oil_price: number;
  extra_garlic_water_price: number;
  extra_sauce_price: number;
  extra_seasoning_price: number;
  
  // Kit Configuration
  kit_includes: {
    laphing_sheet: number;
    chilli_oil: number;
    garlic_water: number;
    laphing_sauce: number;
    seasoning_mix: number;
    preparation_guide: number;
  };
  
  // Recommendation Popup Rules
  recommendation_threshold: {
    extra_sheets_count: number; // Show popup when customer buys this many extra sheets
    kit_qty_to_suggest: number; // Suggest adding this many kits
  };
  
  // Product Images
  product_images: {
    laphing_kit: string;
    laphing_sheet_wholesale: string;
    chilli_oil: string;
    garlic_water: string;
  };
  
  // Homepage Content
  homepage: {
    hero_title: string;
    hero_subtitle: string;
  };
}

// Default configuration (fallback)
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  laphing_kit_price: 50,
  laphing_sheet_price: 20,
  min_wholesale_qty: 5,
  min_kit_qty: 3,
  packaging_charge: 30,
  extra_sheet_price: 20,
  extra_chilli_oil_price: 15,
  extra_garlic_water_price: 10,
  extra_sauce_price: 15,
  extra_seasoning_price: 10,
  kit_includes: {
    laphing_sheet: 1,
    chilli_oil: 1,
    garlic_water: 1,
    laphing_sauce: 1,
    seasoning_mix: 1,
    preparation_guide: 1,
  },
  recommendation_threshold: {
    extra_sheets_count: 2,
    kit_qty_to_suggest: 1,
  },
  product_images: {
    laphing_kit:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1JGG81_524hxV0kNfaazrMPTpV9T2LCb8DMBD7RXkoT12eSdAiH3WT9kRfi2IIYBa5tFtylEF_H7OpCprYigKjQdqtKp2JHn-DU1-LYJJjDUad8fwedlomgOamhpomdeeykCKi93VIW6ckelGItqwaFWEYkBuEKxbI7_Sq5sx6zbTYJzOZSrAj_LS155ifDIIGhd-MhLAZHTRGojp-mISbrp6Zri7Gg8yEvT78X6RZ7wZdIKb3BkdAsTbULlu4fWqVq17AL5MG7k",
    laphing_sheet_wholesale:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA53gmwSqJA9-DntgWO_VAkC5GqFJngxL85uovEldyTWFp1Yr6CCYv2h7jPI58cvovaRgHG4FN1jBT3roYqNLzgXFIOyMPaffoVxBW4WgcJeqydb8BRotmbr4YeYGq5RmKaZ2fb_ivP3df5Snb5cppybjbBFgsnTRy5wUy7m7E4hLz2l1Nn0_ix5CnCWBpcLA9pGr-Ch1x3IZjUmWcTZ6EdnqDW3ARkBKGoMVdkiiiJWGWQdIOo3g2lv73Z_CloqiBwZA47WOTdGSU",
    chilli_oil:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClgDGSj2MvrRKnCyQvRf5hR26ClEsZHv5_9oVXPExfJnIt11PXwcrv6IuyCP3nU0cg2eFpMRWHL9HQr1yT8rxllIzYLBqnyMvybWY-_sbDGkIbc7wMNe6IFgpd5Kx9k-45692xE1Z6ndVz8efCdxIQSFaT7PnDFGcVqiCWWyW_EUjnC3JQ947AeCIjhFIPhIvm9ptKIoaifhdrojiD2slT_EoTQt_2vwDzsquRCdfZmMhCAx-Ngv5kU24Wf5Gel97KthQZiDjFisA",
    garlic_water:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBE1escMZ2XpAKgYpGryURihqjikyEj7e4gb2AWeyQTrIOWQsM78JnhV5d--6kRwVt4MiQadAk25tK-ywHoIP_hrpddZzdN7UH-EfH8NGteiscTKSUgtZJg_4GdjYCF21rG8wgxoOyPD5mxcQTw5vyv7ngw8CTV65bgsJ1RtXTe27m2KbIBmeoja16XH0D_FyJngCEKwYlZYlbf2X92cfOOSPkkpRppCC98wO87eVRDVyqt7pa8oW2PMcglJR0mUm22A90rDgUXQ50",
  },
  homepage: {
    hero_title: "LAPHING MADE EASY",
    hero_subtitle:
      "Authentic street-style flavors delivered in premium artisan kits. Experience the perfect balance of heat and texture, crafted for true connoisseurs.",
  },
};

// Supabase site_settings keys
export const SITE_SETTING_KEYS = {
  PRODUCT_CONFIG: "product_config",
  PRICING_CONFIG: "pricing_config",
  RECOMMENDATION_CONFIG: "recommendation_config",
  HOMEPAGE_CONTENT: "homepage_content",
} as const;
