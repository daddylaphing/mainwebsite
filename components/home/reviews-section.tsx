"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Priya S.",
    city: "Bangalore",
    rating: 5,
    review: "Absolutely authentic! The chilli oil is incredible, exactly like the street stalls in Lhasa.",
    date: "2 days ago",
  },
  {
    name: "Rahul M.",
    city: "Delhi",
    rating: 5,
    review: "The kit is so well-packaged and the preparation guide is super easy to follow. Restaurant quality at home!",
    date: "1 week ago",
  },
  {
    name: "Sonam D.",
    city: "Siliguri",
    rating: 5,
    review: "Grew up eating laphing in Darjeeling and this is the closest I've found. Will order again!",
    date: "2 weeks ago",
  },
];

export function ReviewsSection() {
  return (
    <section className="bg-[#0A0A09] py-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl text-white">What People Say</h2>
          <p className="text-white/40 mt-2 font-mono text-sm">4.9 / 5 from 200+ reviews</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#141210] border border-white/10 rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{review.review}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{review.name}</p>
                  <p className="text-white/40 text-xs">{review.city}</p>
                </div>
                <span className="text-white/30 text-xs font-mono">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
