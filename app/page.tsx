import { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { ProductsSection } from "@/components/home/products-section";
import { KitIncludesSection } from "@/components/home/kit-includes-section";
import { PreparationGuide } from "@/components/home/preparation-guide";
import { ContactSection } from "@/components/home/contact-section";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Laphing Daddy | Authentic Tibetan Laphing Kits",
  description:
    "Fresh Tibetan Laphing Kits delivered across Delhi, Noida, Gurugram and Ghaziabad. Authentic Tibetan laphing delivered to your doorstep.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  // Fetch products server-side for SEO
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": "Laphing Daddy",
    "description": "Authentic Tibetan Laphing delivered to your doorstep.",
    "image": "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/freshlaphingsheet.png",
    "@id": "https://laphing.in",
    "url": "https://laphing.in",
    "telephone": ["+919873052538", "+919354775439"],
    "priceRange": "₹50–₹200",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Delhi",
      "addressRegion": "Delhi",
      "addressCountry": "IN"
    },
    "areaServed": ["Delhi", "Noida", "Gurgaon", "Ghaziabad"],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "15:00",
      "closes": "18:00"
    }
  };

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": (products ?? []).map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "image": p.image_url,
        "description": p.description,
        "offers": {
          "@type": "Offer",
          "price": p.price,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": `https://laphing.in/#products`
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#090909]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
      />
      <HeroSection />
      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-20 py-10 md:py-20 space-y-12 md:space-y-20">
        <ProductsSection products={products ?? []} />
        <KitIncludesSection />
        <PreparationGuide />
        <ContactSection />
      </main>
    </div>
  );
}
