"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";

export function AdminHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#FAFAF8] border-b border-[#E6DFD5] z-50">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <button className="md:hidden text-[#7A7570] hover:text-[#1A1A1A]">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="font-bold text-xl text-[#1A1A1A]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Laphing <span className="text-[#6E1D25] italic">Daddy</span>
            </div>
            <span className="px-2.5 py-0.5 bg-[#6E1D25]/10 border border-[#6E1D25]/20 rounded-full text-[9px] font-bold text-[#6E1D25] uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-[#F7F3EC] border border-[#E6DFD5] hover:bg-[#E6DFD5]/40 text-[#7A7570] hover:text-[#6E1D25] rounded-xl transition-all text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
