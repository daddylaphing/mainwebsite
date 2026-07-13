"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

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
    <section className="pt-20 md:pt-32 pb-10 md:pb-20" id="reviews">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-3xl md:text-[48px] text-[#F8F5EE] leading-[1.2]"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.02em" }}
        >
          CUSTOMER REVIEWS
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[3px] w-16 bg-[#E7B52C] rounded-full mt-3 origin-center"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[#C7BFB3] text-base md:text-lg mt-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <span className="text-[#E7B52C] font-bold">4.9 / 5</span> from 500+ happy customers
        </motion.p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-[#161616] border border-white/[0.08] rounded-2xl p-6 md:p-8 flex flex-col gap-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1 hover:border-[#E7B52C]/20 transition-all duration-300"
          >
            {/* Quote Icon */}
            <div className="w-10 h-10 bg-[#E7B52C]/10 rounded-xl flex items-center justify-center text-[#E7B52C] group-hover:bg-[#E7B52C]/20 group-hover:scale-110 transition-all duration-300">
              <Quote className="h-5 w-5" />
            </div>

            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-[#E7B52C] text-[#E7B52C]" />
              ))}
            </div>

            {/* Review Text */}
            <p 
              className="text-[#C7BFB3] text-base leading-relaxed flex-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              "{review.review}"
            </p>

            {/* Author Info */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <p 
                  className="text-[#F8F5EE] font-bold text-sm"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {review.name}
                </p>
                <p 
                  className="text-[#8F857B] text-xs mt-0.5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {review.city}
                </p>
              </div>
              <span 
                className="text-[#8F857B] text-xs font-mono"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {review.date}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
