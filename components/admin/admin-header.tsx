"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1E1E2E] border-b border-white/10 z-50 shadow-md">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden text-white/70 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div
              className="font-bold text-lg text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Laphing <span className="text-[#D4A843] italic">Daddy</span>
            </div>
            <span className="px-2 py-0.5 bg-[#6E1D25] text-[9px] font-bold text-white uppercase tracking-widest rounded">
              Admin
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 border border-white/10"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Logging out…" : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
