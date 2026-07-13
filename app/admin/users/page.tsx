import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/admin/users-table";

export default async function UsersPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Users
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Manage user accounts and permissions
        </p>
      </div>

      <UsersTable users={users || []} />
    </div>
  );
}
