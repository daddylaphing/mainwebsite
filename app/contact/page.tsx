import { Metadata } from "next";
import { ContactSection } from "@/components/home/contact-section";

export const metadata: Metadata = {
  title: "Contact Us - Laphing Daddy",
  description: "Get in touch with Laphing Daddy for bulk orders, wholesale inquiries, catering, or support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#090909] pt-24 md:pt-32 px-4 md:px-20 pb-20">
      <div className="max-w-4xl mx-auto">
        <ContactSection />
      </div>
    </div>
  );
}
