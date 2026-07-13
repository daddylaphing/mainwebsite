import { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { MarqueeSection } from "@/components/home/marquee-section";
import { ProductsSection } from "@/components/home/products-section";
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section";
import { IngredientsSection } from "@/components/home/ingredients-section";
import { FounderSection } from "@/components/home/founder-section";
import { ReviewsSectionDynamic } from "@/components/home/reviews-section-dynamic";
import { FAQSection } from "@/components/home/faq-section";
import { ContactSection } from "@/components/home/contact-section";
import { CTASection } from "@/components/home/cta-section";
import { ProductsSectionLoading } from "@/components/home/products-section-loading";
import { ReviewCardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getFeaturedProducts } from "@/lib/products";
import { getFeaturedReviews } from "@/lib/reviews";
import { CurvedLoopDivider } from "@/components/home/curved-loop-divider";

export const metadata: Metadata = {
  title: "Laphing Daddy | Authentic Tibetan Laphing Kits",
  description:
    "Fresh Tibetan Laphing Kits delivered across Delhi, Noida, Gurugram and Ghaziabad. Authentic Tibetan laphing delivered to your doorstep.",
  alternates: {
    canonical: "/",
  },
};

async function ProductsData() {
  const products = await getFeaturedProducts(6);
  return <ProductsSection products={products ?? []} />;
}

async function ReviewsData() {
  const reviews = await getFeaturedReviews(6);
  return <ReviewsSectionDynamic reviews={reviews ?? []} />;
}

export default async function HomePage() {

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Laphing Daddy",
    description: "Authentic Tibetan Laphing delivered to your doorstep.",
    image: "https://gyrvdaucaznmastgspvc.supabase.co/storage/v1/object/public/inthekit/freshlaphingsheet.png",
    "@id": "https://laphing.in",
    url: "https://laphing.in",
    telephone: ["+919873052538", "+919354775439"],
    priceRange: "₹50–₹200",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Delhi",
      addressRegion: "Delhi",
      addressCountry: "IN",
    },
    areaServed: ["Delhi", "Noida", "Gurgaon", "Ghaziabad"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "15:00",
      closes: "18:00",
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/* Hero — full viewport cinematic */}
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>

      {/* Marquee strip */}
      <ErrorBoundary>
        <MarqueeSection />
      </ErrorBoundary>

      <main className="w-full">

        {/* Story — 01 */}
        <ErrorBoundary>
          <WhyChooseUsSection />
        </ErrorBoundary>

        {/* CurvedLoop — dark maroon band after Story */}
        <div className="hidden md:block">
          <CurvedLoopDivider
            text="Crafted with Love ✦ Ancient Tibetan Recipe ✦ Made Fresh Every Day ✦ Delivered to Your Door ✦ "
            bg="#FFFFFF"
            fill="#6E1D25"
            speed={1.6}
            curveAmount={160}
            direction="left"
            height={180}
            fontSize="2.2rem"
          />
        </div>
        <div className="block md:hidden">
          <CurvedLoopDivider
            text="Crafted with Love ✦ Ancient Tibetan Recipe ✦ Made Fresh Every Day ✦ Delivered to Your Door ✦ "
            bg="#FFFFFF"
            fill="#6E1D25"
            speed={1.2}
            curveAmount={280}
            direction="left"
            height={220}
            fontSize="1.8rem"
          />
        </div>

        {/* Products — 02 */}
        <ErrorBoundary>
          <Suspense fallback={<ProductsSectionLoading />}>
            <ProductsData />
          </Suspense>
        </ErrorBoundary>

        {/* CurvedLoop — dark ink band after Products / before Ingredients */}
        <CurvedLoopDivider
          text="Pure Authentic Spices ✦ Traditional Blend ✦ Freshest Ingredients ✦ Zero Compromise ✦ "
          bg="#FFFFFF"
          fill="#D4A843"
          speed={2}
          curveAmount={-160}
          direction="right"
          height={180}
          fontSize="2.2rem"
        />

        {/* Ingredients — 03 */}
        <ErrorBoundary>
          <IngredientsSection />
        </ErrorBoundary>

        {/* Founder — 04 */}
        <ErrorBoundary>
          <FounderSection />
        </ErrorBoundary>

        {/* Reviews — 05 */}
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex gap-5 px-5 md:px-16 py-24 overflow-hidden">
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </div>
          }>
            <ReviewsData />
          </Suspense>
        </ErrorBoundary>

        {/* FAQ — 06 */}
        <ErrorBoundary>
          <FAQSection />
        </ErrorBoundary>

        {/* Contact — 07 */}
        <ErrorBoundary>
          <ContactSection />
        </ErrorBoundary>

        {/* CTA — dark close */}
        <ErrorBoundary>
          <CTASection />
        </ErrorBoundary>
      </main>
    </div>
  );
}
