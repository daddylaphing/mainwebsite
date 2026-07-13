import { requireAdmin } from "@/lib/admin/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 pt-24 pb-6 px-6 md:pt-28 md:pb-8 md:px-8 ml-0 md:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
