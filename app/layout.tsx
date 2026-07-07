import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { CookieConsent } from "@/components/cookie-consent";
import { SplashProvider } from "@/components/providers/splash-provider";
import { ScrollProgress } from "@/components/layout/scroll-progress";




export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://laphing.in"),
  title: {
    default: "Laphing Daddy | Authentic Tibetan Laphing Kits",
    template: "%s | Laphing Daddy",
  },
  description:
    "Fresh Tibetan Laphing Kits delivered across Delhi, Noida and Gurgaon.",
  keywords: ["laphing", "tibetan food", "street food", "laphing kit", "authentic laphing", "laphing delivery", "laphing daddy", "delhi laphing", "noida laphing", "gurgaon laphing"],
  authors: [{ name: "Laphing Daddy" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://laphing.in",
    siteName: "Laphing Daddy",
    title: "Laphing Daddy | Authentic Tibetan Laphing Kits",
    description: "Fresh Tibetan Laphing Kits delivered across Delhi, Noida and Gurgaon.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Laphing Daddy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laphing Daddy | Authentic Tibetan Laphing Kits",
    description: "Fresh Tibetan Laphing Kits delivered across Delhi, Noida and Gurgaon.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            <AuthProvider>
              <CartProvider>
                <SplashProvider>
                  <ScrollProgress />
                  <Navbar />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                  <CartSheet />
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
                  <CookieConsent />
                </SplashProvider>
              </CartProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
