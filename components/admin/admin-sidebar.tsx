"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Star,
  BookOpen,
  Home,
  User,
  Users,
  Settings,
  BarChart3,
  HelpCircle,
  X,
} from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard",     href: "/admin",               icon: LayoutDashboard },
  { label: "Orders",        href: "/admin/orders",        icon: ShoppingBag },
  { label: "Products",      href: "/admin/products",      icon: Package },
  { label: "Categories",    href: "/admin/categories",    icon: FolderTree },
  { label: "Reviews",       href: "/admin/reviews",       icon: Star },
  { label: "Recipe Guides", href: "/admin/recipe-guides", icon: BookOpen },
  { label: "FAQ",           href: "/admin/faq",           icon: HelpCircle },
  { label: "Homepage",      href: "/admin/homepage",      icon: Home },
  { label: "Founder",       href: "/admin/founder",       icon: User },
  { label: "Users",         href: "/admin/users",         icon: Users },
  { label: "Settings",      href: "/admin/settings",      icon: Settings },
  { label: "Analytics",     href: "/admin/analytics",     icon: BarChart3 },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Mobile close button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 md:hidden">
        <span
          className="text-xs font-bold uppercase tracking-widest text-white/50"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Navigation
        </span>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-3">
        {/* Section label */}
        <div
          className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-white/30"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Main
        </div>
        <nav className="space-y-0.5 px-2">
          {MENU_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-[#6E1D25] text-white font-semibold"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-white/40"}`} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1 h-4 rounded-full bg-[#D4A843]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center justify-center gap-2 text-white/40 hover:text-white/80 transition-colors text-xs font-semibold uppercase tracking-wider py-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Home className="h-3.5 w-3.5" />
          View Store
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex flex-col w-60 bg-[#1E1E2E] fixed h-screen top-0 pt-16 border-r border-white/8 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile drawer — slides in when open */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#1E1E2E] z-40 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-16 h-full">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
