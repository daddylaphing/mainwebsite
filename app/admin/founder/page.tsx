import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { FounderEditor } from "./founder-editor";

export default async function AdminFounderSettingsPage() {
  await requireAdmin();

  const supabase = await createClient();

  // Fetch current founder settings
  const { data: setting } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", "founder_section")
    .single();

  const founderData = setting?.value || {
    name: "Paras Chopra",
    role: "Founder",
    image: "",
    story: "",
    phone: "",
    whatsapp: "",
    instagram: "",
  };

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Founder Section Manager
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Manage stories, profile image, phone numbers, and WhatsApp/Instagram social links for the founder profile
        </p>
      </div>

      <FounderEditor initialFounder={founderData} settingId={setting?.id} />
    </div>
  );
}
