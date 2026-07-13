import { Metadata } from "next";
import { ContactSection } from "@/components/home/contact-section";

export const metadata: Metadata = {
  title: "Contact Us - Laphing Daddy",
  description: "Get in touch with Laphing Daddy for bulk orders, wholesale inquiries, catering, or support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 pb-20">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <ContactSection />
      </div>
    </div>
  );
}
