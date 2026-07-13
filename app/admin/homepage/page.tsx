import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { HomepageEditor } from "./homepage-editor";

export default async function AdminHomepageSettingsPage() {
  await requireAdmin();

  const supabase = await createClient();

  // Fetch current hero settings
  const { data: setting } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", "hero_section")
    .single();

  const heroData = setting?.value || {
    title: "AUTHENTIC LAPHING",
    subtitle: "Authentic Tibetan Laphing delivered fresh to your doorstep.",
    cta_text: "Order Now",
    cta_link: "/products",
    background_image: "",
  };

  return (
    <div className="space-y-8 py-6">
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Homepage Content Manager
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Customize the main landing page hero title, subtitles, links, and background media assets
        </p>
      </div>

      <HomepageEditor initialHero={heroData} settingId={setting?.id} />
    </div>
  );
}
