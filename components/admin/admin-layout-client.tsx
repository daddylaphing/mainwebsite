"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <AdminHeader onMenuClick={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 pt-16 pb-8 px-4 md:px-8 ml-0 md:ml-60 min-h-screen">
          <div className="max-w-7xl mx-auto py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
