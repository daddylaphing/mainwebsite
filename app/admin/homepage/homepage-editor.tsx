"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";

interface HeroInfo {
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  background_image?: string;
}

interface HomepageEditorProps {
  initialHero: HeroInfo;
  settingId?: string;
}

export function HomepageEditor({ initialHero, settingId }: HomepageEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialHero.title || "");
  const [subtitle, setSubtitle] = useState(initialHero.subtitle || "");
  const [ctaText, setCtaText] = useState(initialHero.cta_text || "");
  const [ctaLink, setCtaLink] = useState(initialHero.cta_link || "");
  const [bgImage, setBgImage] = useState(initialHero.background_image || "");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const supabase = createBrowserClient();

    const value = {
      title,
      subtitle,
      cta_text: ctaText,
      cta_link: ctaLink,
      background_image: bgImage,
    };

    let responseError;

    if (settingId) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("id", settingId);
      responseError = error;
    } else {
      const { error } = await supabase
        .from("site_settings")
        .insert([{ key: "hero_section", value }]);
      responseError = error;
    }

    if (responseError) {
      setError(responseError.message);
    } else {
      setSuccess(true);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-[#E6DFD5] rounded-2xl p-6 md:p-8 max-w-2xl shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-[#1A1A1A] border-b border-[#E6DFD5]/40 pb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
        Hero Fold Configuration
      </h2>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-bold">
          Homepage hero settings updated successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Hero Heading Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Hero Subtitle Description
          </label>
          <textarea
            rows={4}
            required
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] resize-none"
          />
        </div>

        {/* CTA Text */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            CTA Button Text
          </label>
          <input
            type="text"
            required
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>

        {/* CTA Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            CTA Destination URL Link
          </label>
          <input
            type="text"
            required
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>

        {/* Background Image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Hero Background Image URL
          </label>
          <input
            type="url"
            value={bgImage}
            onChange={(e) => setBgImage(e.target.value)}
            placeholder="https://example.com/hero-bg.png"
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#E6DFD5]/40">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all disabled:opacity-60 shadow-sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save Configuration
            </>
          )}
        </button>
      </div>
    </form>
  );
}
