import { requireAdmin } from "@/lib/admin/auth";
import { getAllFAQs } from "@/lib/faqs-server";
import { FAQEditor } from "./faq-editor";

export default async function AdminFAQPage() {
  await requireAdmin();
  const faqs = await getAllFAQs();

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E6DFD5] pb-6">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          FAQ Manager
        </h1>
        <p
          className="text-[#7A7570] mt-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Add, edit, reorder and publish FAQ items shown on the home page.
        </p>
      </div>

      <FAQEditor initialFAQs={faqs} />
    </div>
  );
}
