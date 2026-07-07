"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, User, LogOut, Settings, Package, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/#products", label: "SHOP" },
  { href: "/#contact", label: "CONTACT" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { items, openCart } = useCart();
  const { user, profile, loading, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveHash(window.location.hash);
    }

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    // Only monitor intersection on homepage "/"
    if (pathname !== "/") return;

    const sections = ["products", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHash(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 180) {
        setActiveHash("");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
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
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Offset scroll for floating navbar height
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

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
      <nav className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] rounded-[16px] border border-white/[0.08] bg-[#090909]/85 backdrop-blur-xl shadow-[0px_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-4 md:px-8 py-2.5 md:py-3 z-50">
        {/* Logo */}
        <Link
          href="/"
          className="font-black text-xl md:text-[28px] text-white tracking-tighter leading-[1.3]"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Laphing <span className="text-[#E7B52C]">Daddy</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-8 items-center">
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
                  "relative text-[14px] font-semibold uppercase tracking-[0.05em] leading-[1] transition-colors duration-300 px-3 py-2.5 rounded cursor-pointer",
                  isActive ? "text-[#E7B52C]" : "text-[#C7BFB3] hover:text-white"
                )}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#E7B52C] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {!mounted || loading ? (
            <div className="w-20 h-8 bg-white/5 rounded-full animate-pulse" />
          ) : isLoggedIn ? (
            <>
              {/* Cart */}
              <button
                onClick={openCart}
                className="relative text-[#C7BFB3] hover:text-white transition-colors p-1"
                aria-label={`Cart with ${itemCount} items`}
              >
                <ShoppingBag className="h-5 w-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-[#E7B52C] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Account dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full pl-1 pr-2 md:pr-3 py-1 hover:bg-white/10 transition-colors"
                  aria-label="Account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E7B52C]/20 border border-[#E7B52C]/30 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#E7B52C] font-bold text-[10px]">{initials}</span>
                    )}
                  </div>
                  <span className="text-white text-xs font-semibold hidden md:block max-w-[80px] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {displayName}
                  </span>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-white/40 transition-transform hidden md:block", dropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{displayName}</p>
                        <p className="text-white/30 text-[11px] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{user?.email}</p>
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
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-white/5 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/40 hover:text-white hover:bg-[#6E1D25] transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <LogOut className="h-4 w-4" />
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
                className="hidden md:block text-[#C7BFB3] hover:text-white text-[14px] font-semibold uppercase tracking-[0.05em] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-[#E7B52C] text-black font-bold text-[13px] md:text-[15px] leading-[1] tracking-[0.02em] px-4 md:px-6 py-2.5 md:py-3 rounded-[14px] hover:bg-[#F4C542] hover:shadow-[0_0_15px_rgba(231,181,44,0.3)] transition-all duration-200"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Order Now
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors p-1 ml-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] bg-[#141414] border border-white/10 rounded-2xl z-40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            <div className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleScrollToSection(e, link.href);
                  }}
                  className="flex items-center px-4 py-3 rounded-xl text-[15px] font-semibold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoggedIn && (
                <div className="border-t border-white/5 mt-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-[15px] font-semibold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Login
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <div className="border-t border-white/5 mt-2 pt-2 flex flex-col gap-1">
                  {[
                    { icon: User, label: "My Account", href: "/account" },
                    { icon: Package, label: "My Orders", href: "/account#orders" },
                    { icon: Settings, label: "Settings", href: "/account/settings" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-white/40 hover:text-white hover:bg-[#6E1D25] transition-colors"
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
