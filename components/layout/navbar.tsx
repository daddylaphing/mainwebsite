"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, User, LogOut, Settings, Package, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Shop" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, openCart } = useCart();
  const { user, profile, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  const [activeHash, setActiveHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );
  useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = ["products", "contact"];
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveHash(`#${e.target.id}`); }); },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    const handleScroll = () => { if (window.scrollY < 180) setActiveHash(""); };
    window.addEventListener("scroll", handleScroll);
    return () => { observer.disconnect(); window.removeEventListener("scroll", handleScroll); };
  }, [pathname]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isLoggedIn = mounted && !loading && !!user;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.split("#")[1];
      const el = document.getElementById(targetId);
      if (el) {
        const offset = 90;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        window.history.pushState(null, "", href);
        setActiveHash(`#${targetId}`);
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setActiveHash("");
    }
  };

  async function handleSignOut() {
    setDropdownOpen(false);
    setMobileOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl transition-all duration-500",
          scrolled ? "top-4" : "top-6"
        )}
      >
        <nav
          className="w-full transition-all duration-500 rounded-full px-6 py-2.5 md:py-3.5 flex items-center justify-between bg-[#FAFAF8]/45 backdrop-blur-xl border border-[rgba(26,26,26,0.08)] shadow-[0_12px_30px_rgba(26,26,26,0.04)]"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-[18px] md:text-[22px] font-700 tracking-tight leading-none flex items-center gap-1 text-[#1A1A1A] transition-colors duration-300"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            Laphing <span className="italic text-[#D4A843]">Daddy</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 rounded-full p-1 border bg-[#F0EBE0]/40 border-[rgba(26,26,26,0.05)]">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/"
                ? activeHash === "" && pathname === "/"
                : activeHash === link.href.split("/")[1];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollToSection(e, link.href)}
                  className={cn(
                    "relative px-5 py-2 text-[12px] font-medium tracking-[0.03em] rounded-full transition-all duration-300",
                    isActive 
                      ? "text-[#1A1A1A] bg-[#FAFAF8] shadow-[0_2px_8px_rgba(26,26,26,0.05)]" 
                      : "text-[#7A7570] hover:text-[#1A1A1A]"
                  )}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {!mounted || loading ? (
              <div className="w-16 h-8 rounded-full animate-pulse bg-[#F0EBE0]/50" />
            ) : isLoggedIn ? (
              <>
                {/* Cart */}
                <button
                  onClick={openCart}
                  className="relative p-2.5 transition-colors rounded-full text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F0EBE0]/40 transition-colors duration-300"
                  aria-label={`Cart with ${itemCount} items`}
                >
                  <ShoppingBag className="h-[17px] w-[17px]" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        key="badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-1.5 right-1.5 bg-[#D4A843] text-[#1A1A1A] text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Account Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="flex items-center gap-1.5 pl-2.5 pr-3 py-1 bg-[#F0EBE0]/30 hover:bg-[#F0EBE0]/60 border border-[rgba(26,26,26,0.08)] transition-all rounded-full"
                    aria-label="Account menu"
                  >
                    <div className="w-6 h-6 bg-[#F0EBE0] border border-[rgba(26,26,26,0.12)] flex items-center justify-center overflow-hidden rounded-full">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#1A1A1A] font-semibold text-[8px]" style={{ fontFamily: "'Inter', sans-serif" }}>{initials}</span>
                      )}
                    </div>
                    <span className="text-[#1A1A1A] text-[11px] font-medium hidden md:block max-w-[60px] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {displayName.split(" ")[0]}
                    </span>
                    <ChevronDown className={cn("h-3 w-3 text-[#A09890] transition-transform hidden md:block", dropdownOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white border border-[rgba(26,26,26,0.1)] shadow-[0_8px_24px_rgba(26,26,26,0.08)] rounded-2xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-[rgba(26,26,26,0.08)] bg-[#F7F3EC]/30">
                          <p className="text-[#1A1A1A] text-[12px] font-semibold truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{displayName}</p>
                          <p className="text-[#A09890] text-[10px] truncate mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{user?.email}</p>
                        </div>
                        {[
                          { icon: User, label: "My Account", href: "/account" },
                          { icon: Package, label: "My Orders", href: "/account#orders" },
                          { icon: Settings, label: "Settings", href: "/account/settings" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[12px] text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#FAFAF8] transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <item.icon className="h-3.5 w-3.5" />
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-[rgba(26,26,26,0.08)]">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[12px] text-[#A09890] hover:text-[#6E1D25] hover:bg-[#FAFAF8] transition-colors"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block text-[#7A7570] hover:text-[#1A1A1A] text-[12px] font-medium transition-colors px-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#1A1A1A] text-white hover:bg-transparent border border-[#1A1A1A] hover:text-[#1A1A1A] text-[10px] px-4 py-2 rounded-full font-semibold transition-colors uppercase tracking-wider"
                >
                  Order Now
                </Link>
              </>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-[#7A7570] hover:text-[#1A1A1A] transition-colors ml-1 rounded-full hover:bg-[#F0EBE0]/40 transition-colors duration-300"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 bg-[#FAFAF8] border border-[rgba(26,26,26,0.1)] rounded-3xl z-40 shadow-[0_16px_36px_rgba(26,26,26,0.08)] overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { setMobileOpen(false); handleScrollToSection(e, link.href); }}
                  className="flex items-center px-4 py-3 text-[14px] font-medium text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] transition-colors rounded-xl"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <div className="border-t border-[rgba(26,26,26,0.08)] mt-2 pt-2 flex flex-col gap-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 text-[14px] font-medium text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] transition-colors rounded-xl"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="mx-4 my-1 btn-ink text-center justify-center rounded-full py-2.5 text-[11px]"
                  >
                    Order Now
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <div className="border-t border-[rgba(26,26,26,0.08)] mt-2 pt-2 flex flex-col gap-1">
                  {[
                    { icon: User, label: "My Account", href: "/account" },
                    { icon: Package, label: "My Orders", href: "/account#orders" },
                    { icon: Settings, label: "Settings", href: "/account/settings" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#7A7570] hover:text-[#1A1A1A] hover:bg-[#F7F3EC] transition-colors rounded-xl"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-[13px] text-[#A09890] hover:text-[#6E1D25] hover:bg-[#F7F3EC] transition-colors rounded-xl"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
