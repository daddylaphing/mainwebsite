import { requireAdmin } from "@/lib/admin/auth";
import { SettingsForm } from "@/components/admin/settings-form";
import { getAllSettings } from "@/lib/admin/settings-server";

export default async function SettingsPage() {
  await requireAdmin();

  const settings = await getAllSettings();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Settings
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Manage store configuration and global settings
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
