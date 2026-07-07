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
  "Store unused sheets in the refrigerator and consume within 2 days.",
  "Serve chilled for a refreshing summer snack.",
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#090909]">
      <main className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1
            className="font-black text-4xl md:text-5xl lg:text-6xl text-white mb-4"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
          >
            How to Prepare <span className="text-[#E7B52C]">Laphing</span>
          </h1>
          <p
            className="text-[#C7BFB3] text-base md:text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Follow these simple steps to enjoy authentic Tibetan Laphing at home. Ready in under 10 minutes!
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="bg-[#141414] border border-white/[0.08] rounded-2xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E7B52C]/10 flex items-center justify-center shrink-0">
                  <step.icon className="h-6 w-6 text-[#E7B52C]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className="text-white font-bold text-lg"
                      style={{ fontFamily: "'Manrope', sans-serif" }}
                    >
                      Step {index + 1}: {step.title}
                    </h3>
                    <span
                      className="text-[#8F857B] text-xs font-mono"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {step.time}
                    </span>
                  </div>
                  <p
                    className="text-[#C7BFB3] text-sm leading-relaxed"
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
        <div className="bg-[#1B1B1B] border border-white/[0.08] rounded-2xl p-6 md:p-8 mb-12">
          <h2
            className="text-white font-bold text-2xl mb-4"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Pro Tips
          </h2>
          <ul className="space-y-3">
            {TIPS.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-[#C7BFB3] text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="text-[#E7B52C] font-bold mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 bg-[#E7B52C] hover:bg-[#F4C542] text-black font-bold px-8 py-4 rounded-[14px] transition-colors text-base"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <ShoppingBag className="h-5 w-5" />
            Order Your Kit Now
          </Link>
        </div>
      </main>
    </div>
  );
}
