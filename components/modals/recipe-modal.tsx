"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat, Clock, Users } from "lucide-react";
import { useEffect } from "react";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INGREDIENTS = [
  { name: "Fresh Laphing Sheet", amount: "1 sheet", included: true },
  { name: "Signature Chilli Oil", amount: "2-3 tbsp", included: true },
  { name: "Garlic Water", amount: "2 tbsp", included: true },
  { name: "Laphing Sauce (Soy-based)", amount: "2 tbsp", included: true },
  { name: "Secret Seasoning Mix", amount: "1 tsp", included: true },
  { name: "Fresh Coriander", amount: "For garnish", included: false },
  { name: "Crushed Peanuts", amount: "Optional", included: false },
];

const PREPARATION_STEPS = [
  {
    step: 1,
    title: "Prepare the Sheet",
    description: "Remove the fresh laphing sheet from its vacuum-sealed packaging. Lay it flat on a clean plate or cutting board. Make sure the surface is smooth.",
    time: "30 sec",
  },
  {
    step: 2,
    title: "Apply Garlic Water",
    description: "Drizzle the aromatic garlic water evenly over the entire surface of the sheet. This builds the base flavor profile and adds that signature tangy kick.",
    time: "30 sec",
  },
  {
    step: 3,
    title: "Add Signature Chilli Oil",
    description: "Spread our slow-cooked, handcrafted chilli oil across the sheet. Start with 2 tablespoons and adjust based on your spice preference. The oil should coat evenly.",
    time: "30 sec",
  },
  {
    step: 4,
    title: "Drizzle Laphing Sauce",
    description: "Pour the signature soy-umami sauce base over the sheet. This balances the heat with rich savory depth. Don't skip this step!",
    time: "30 sec",
  },
  {
    step: 5,
    title: "Sprinkle Seasoning Mix",
    description: "Dust our secret blend of spices and salt evenly over the layers. This ties all the flavors together and adds that authentic street-food punch.",
    time: "15 sec",
  },
  {
    step: 6,
    title: "Roll, Cut & Serve",
    description: "Roll the sheet tightly into a cylinder from one end to the other. Using a sharp knife, slice it into bite-sized pieces (about 1-inch thick). Arrange on a plate, garnish with fresh coriander if desired, and serve immediately.",
    time: "60 sec",
  },
];

const SERVING_TIPS = [
  "Serve immediately for the best texture - laphing tastes best fresh!",
  "Adjust spice level by adding more or less chilli oil to taste.",
  "Add crushed peanuts or sesame seeds for extra crunch.",
  "Garnish with fresh coriander and a wedge of lime for brightness.",
  "Pair with a cold beverage to balance the heat.",
  "Store unused sheets refrigerated and consume within 2 days.",
];

export function RecipeModal({ isOpen, onClose }: RecipeModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAFAF8] border border-[#E6DFD5] rounded-3xl shadow-[0_24px_60px_rgba(26,26,26,0.15)] overflow-hidden pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-[#F7F3EC] hover:bg-[#E6DFD5]/50 rounded-full transition-all duration-200 text-[#7A7570] hover:text-[#1A1A1A]"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
                {/* Header */}
                <div className="sticky top-0 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E6DFD5] px-6 md:px-10 py-6 z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#6E1D25]/10 rounded-xl flex items-center justify-center shrink-0">
                      <ChefHat className="h-5 w-5 text-[#6E1D25]" />
                    </div>
                    <h2 
                      className="font-bold text-2xl md:text-3xl text-[#1A1A1A]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Complete Recipe Guide
                    </h2>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#7A7570]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#6E1D25]" />
                      <span>3 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#6E1D25]" />
                      <span>1 serving</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 md:px-10 py-8 space-y-10">
                  {/* Ingredients */}
                  <div>
                    <h3 
                      className="font-bold text-xl text-[#1A1A1A] mb-4"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Ingredients
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {INGREDIENTS.map((ingredient, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-white border border-[#E6DFD5] rounded-xl px-4 py-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            {ingredient.included && (
                              <div className="w-6 h-6 bg-[#6E1D25]/10 rounded-md flex items-center justify-center">
                                <div className="w-2 h-2 bg-[#6E1D25] rounded-full" />
                              </div>
                            )}
                            <span className="text-[#1A1A1A] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {ingredient.name}
                            </span>
                          </div>
                          <span className="text-[#7A7570] text-xs font-semibold">
                            {ingredient.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#7A7570] mt-3 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className="w-2 h-2 bg-[#6E1D25] rounded-full" />
                      Included in Laphing Kit
                    </p>
                  </div>

                  {/* Preparation Steps */}
                  <div>
                    <h3 
                      className="font-bold text-xl text-[#1A1A1A] mb-4"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Preparation Steps
                    </h3>
                    <div className="space-y-4">
                      {PREPARATION_STEPS.map((step) => (
                        <div
                          key={step.step}
                          className="flex gap-4 bg-white border border-[#E6DFD5] rounded-xl p-5 shadow-sm"
                        >
                          <div className="w-10 h-10 bg-[#6E1D25] text-white rounded-xl flex items-center justify-center font-bold text-base shrink-0">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 
                                className="font-bold text-[#1A1A1A]"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                {step.title}
                              </h4>
                              <span className="text-xs text-[#7A7570] font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3 text-[#6E1D25]" />
                                {step.time}
                              </span>
                            </div>
                            <p 
                              className="text-sm text-[#7A7570] leading-relaxed"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Serving Tips */}
                  <div>
                    <h3 
                      className="font-bold text-xl text-[#1A1A1A] mb-4"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Serving Tips
                    </h3>
                    <div className="bg-[#F7F3EC] border border-[#E6DFD5] rounded-xl p-6">
                      <ul className="space-y-3">
                        {SERVING_TIPS.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#7A7570]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            <div className="w-1.5 h-1.5 bg-[#6E1D25] rounded-full mt-2 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(26, 26, 26, 0.02);
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(110, 29, 37, 0.15);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(110, 29, 37, 0.3);
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
