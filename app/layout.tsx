import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { SplashProvider } from "@/components/providers/splash-provider";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { StoreLayoutWrapper } from "@/components/layout/store-layout-wrapper";
import { AuthErrorHandler } from "@/components/auth/auth-error-handler";




export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://laphing.in"),
  title: {
    default: "Laphing Daddy | Authentic Tibetan Laphing Kits Delivered Fresh",
    template: "%s | Laphing Daddy",
  },
  description:
    "Order authentic Tibetan Laphing kits delivered fresh to your doorstep in Delhi NCR. Premium ingredients, easy 3-minute preparation, traditional flavors. Free delivery above ₹500.",
  keywords: [
    "laphing",
    "tibetan food",
    "tibetan laphing",
    "street food",
    "laphing kit",
    "authentic laphing",
    "laphing delivery",
    "laphing daddy",
    "delhi laphing",
    "noida laphing",
    "gurgaon laphing",
    "ghaziabad laphing",
    "fresh laphing",
    "laphing online",
    "buy laphing",
    "tibetan cuisine",
    "spicy laphing",
    "mung bean noodles",
  ],
  authors: [{ name: "Laphing Daddy", url: "https://laphing.in" }],
  creator: "Laphing Daddy",
  publisher: "Laphing Daddy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://laphing.in",
    siteName: "Laphing Daddy",
    title: "Laphing Daddy | Authentic Tibetan Laphing Kits Delivered Fresh",
    description:
      "Order authentic Tibetan Laphing kits delivered fresh to your doorstep in Delhi NCR. Premium ingredients, easy 3-minute preparation, traditional flavors.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Laphing Daddy - Authentic Tibetan Laphing Kits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@laphingdaddy",
    creator: "@laphingdaddy",
    title: "Laphing Daddy | Authentic Tibetan Laphing Kits",
    description:
      "Order authentic Tibetan Laphing kits delivered fresh to your doorstep in Delhi NCR.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://laphing.in",
  },
  category: "food",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A09" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://gyrvdaucaznmastgspvc.supabase.co" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          forcedTheme="light"
        >
          <QueryProvider>
            <AuthProvider>
              <CartProvider>
                <SplashProvider>
                  <LenisProvider>
                    <SkipToContent />
                    <ScrollProgress />
                    <AuthErrorHandler />
                    <StoreLayoutWrapper>
                      {children}
                    </StoreLayoutWrapper>
                  </LenisProvider>
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                      },
                    }}
                  />
                </SplashProvider>
              </CartProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
