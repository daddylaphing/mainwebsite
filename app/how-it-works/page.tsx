import { Metadata } from "next";
import Link from "next/link";
import { ChefHat, Clock, Flame, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Prepare Laphing | Laphing Daddy",
  description:
    "Learn how to prepare authentic Tibetan Laphing at home with our easy-to-follow guide. Simple steps for restaurant-quality results.",
  alternates: {
    canonical: "/how-it-works",
  },
};

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Unpack Your Kit",
    description: "Remove the laphing sheet, sauces, and seasonings from your kit. Keep everything at room temperature.",
    time: "1 min",
  },
  {
    icon: ChefHat,
    title: "Slice the Sheet",
    description: "Cut the laphing sheet into thin strips or bite-sized pieces using a sharp knife or kitchen scissors.",
    time: "2-3 mins",
  },
  {
    icon: Flame,
    title: "Add Sauces & Seasonings",
    description: "Mix in the provided soy sauce, vinegar, chili oil, and seasonings. Adjust to your spice preference.",
    time: "2 mins",
  },
  {
    icon: Clock,
    title: "Serve & Enjoy",
    description: "Garnish with fresh coriander if desired. Your authentic Tibetan Laphing is ready to eat!",
    time: "30 sec",
  },
];

const TIPS = [
  "For best results, let the laphing sit for 2-3 minutes after mixing to allow flavors to meld.",
  "Add extra chili oil for more heat, or reduce for a milder taste.",
  "Store unused sheets in the refrigerator and consume within 2 days of delivery.",
  "Serve chilled for a refreshing summer snack.",
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-28 md:pt-36 pb-20">
      <main className="w-full max-w-[1200px] mx-auto px-5 md:px-16">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
            <span className="text-label-caps text-[#D4A843]" style={{ fontFamily: "'Inter', sans-serif" }}>Guide</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
          </div>
          <h1
            className="font-bold text-[#1A1A1A] mb-6 leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-0.02em",
            }}
          >
            How to Prepare <span className="text-[#D4A843] italic">Laphing</span>
          </h1>
          <p
            className="text-[#7A7570] text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Follow these simple steps to enjoy authentic Tibetan Laphing at home. Ready in under 10 minutes!
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="bg-[#FFFFFF] border border-[rgba(26,26,26,0.08)] p-8 transition-all duration-300 hover:border-[rgba(26,26,26,0.2)]"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-[#F7F3EC] flex items-center justify-center shrink-0 border border-[rgba(26,26,26,0.05)]">
                  <step.icon className="h-5 w-5 text-[#D4A843]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3
                      className="text-[#1A1A1A] font-bold text-lg"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      0{index + 1} · {step.title}
                    </h3>
                    <span
                      className="text-[#A09890] text-[11px] font-mono uppercase tracking-wider"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {step.time}
                    </span>
                  </div>
                  <p
                    className="text-[#7A7570] text-sm leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips */}
        <div className="bg-[#F7F3EC] border border-[rgba(26,26,26,0.06)] p-8 md:p-10 mb-16">
          <h2
            className="text-[#1A1A1A] font-bold text-2xl mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pro Tips
          </h2>
          <ul className="space-y-4">
            {TIPS.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-[#7A7570] text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="text-[#D4A843] font-bold mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/#products"
            className="btn-ink inline-flex items-center gap-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <ShoppingBag className="h-4 w-4" />
            Order Your Kit Now
          </Link>
        </div>
      </main>
    </div>
  );
}
