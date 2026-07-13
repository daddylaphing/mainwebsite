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
  BarChart3 
} from "lucide-react";

const MENU_ITEMS = [
  { 
    label: "Dashboard", 
    href: "/admin", 
    icon: LayoutDashboard 
  },
  { 
    label: "Orders", 
    href: "/admin/orders", 
    icon: ShoppingBag 
  },
  { 
    label: "Products", 
    href: "/admin/products", 
    icon: Package 
  },
  { 
    label: "Categories", 
    href: "/admin/categories", 
    icon: FolderTree 
  },
  { 
    label: "Reviews", 
    href: "/admin/reviews", 
    icon: Star 
  },
  { 
    label: "Recipe Guides", 
    href: "/admin/recipe-guides", 
    icon: BookOpen 
  },
  { 
    label: "Homepage", 
    href: "/admin/homepage", 
    icon: Home 
  },
  { 
    label: "Founder", 
    href: "/admin/founder", 
    icon: User 
  },
  { 
    label: "Users", 
    href: "/admin/users", 
    icon: Users 
  },
  { 
    label: "Settings", 
    href: "/admin/settings", 
    icon: Settings 
  },
  { 
    label: "Analytics", 
    href: "/admin/analytics", 
    icon: BarChart3 
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#FAFAF8] border-r border-[#E6DFD5] fixed h-screen pt-16">
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#6E1D25] text-white font-semibold shadow-[0_4px_12px_rgba(110,29,37,0.15)]"
                    : "text-[#7A7570] hover:bg-[#F7F3EC] hover:text-[#1A1A1A]"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E6DFD5]">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-[#7A7570] hover:text-[#6E1D25] transition-colors text-sm font-semibold"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Home className="h-4 w-4" />
          View Store
        </Link>
      </div>
    </aside>
  );
}
