import { requireAdmin } from "@/lib/admin/auth";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
