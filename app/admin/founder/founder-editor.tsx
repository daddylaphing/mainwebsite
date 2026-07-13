"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";

interface FounderEditorProps {
  initialFounder: any;
  settingId?: string;
}

export function FounderEditor({ initialFounder, settingId }: FounderEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(initialFounder.name || "");
  const [role, setRole] = useState(initialFounder.role || "");
  const [image, setImage] = useState(initialFounder.image || "");
  const [story, setStory] = useState(initialFounder.story || "");
  const [phone, setPhone] = useState(initialFounder.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialFounder.whatsapp || "");
  const [instagram, setInstagram] = useState(initialFounder.instagram || "");

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
      name,
      role,
      image,
      story,
      phone,
      whatsapp,
      instagram,
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
        .insert([{ key: "founder_section", value }]);
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
        Founder Profile Settings
      </h2>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-bold">
          Founder section profile settings updated successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-bold">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Founder Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Role / Title
          </label>
          <input
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>

        {/* Story */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Story Narrative Biography
          </label>
          <textarea
            rows={6}
            required
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25] resize-y"
          />
        </div>

        {/* Profile Image URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Profile Image URL
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/paras.png"
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>

        {/* Contact Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Contact Call Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            WhatsApp Contact Number (including Country Code, e.g. 919354...)
          </label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E6DFD5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#6E1D25]"
          />
        </div>

        {/* Instagram */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#7A7570] uppercase tracking-wider">
            Instagram Username / Handle (without @)
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
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
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
