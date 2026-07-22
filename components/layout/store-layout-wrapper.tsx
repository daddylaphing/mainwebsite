"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { CookieConsent } from "@/components/cookie-consent";
import { LiveOrderWidget } from "@/components/layout/live-order-widget";

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <main id="main-content" className="min-h-screen bg-[#FAFAF8]">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <CartSheet />
      <CookieConsent />
      <LiveOrderWidget />
    </>
  );
}
