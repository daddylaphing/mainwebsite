"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Review } from "@/lib/reviews";

interface ReviewReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  videoUrl: string;
}

export function ReviewReelModal({ isOpen, onClose, review, videoUrl }: ReviewReelModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

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

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(err => console.log("Video play failed:", err));
    }
  }, [isOpen, videoUrl]);

  if (!review) return null;

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
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[420px] aspect-[9/16] bg-[#FAFAF8] border border-[#E6DFD5] rounded-[24px] shadow-[0_24px_50px_rgba(26,26,26,0.15)] overflow-hidden pointer-events-auto flex flex-col justify-end"
            >
              {/* Video Player */}
              <video
                ref={videoRef}
                src={videoUrl}
                loop
                playsInline
                muted={muted}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 z-10 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full transition-colors duration-200 border border-white/10"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              {/* Mute/Unmute Toggle */}
              <button
                onClick={() => setMuted(!muted)}
                className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 rounded-full transition-colors duration-200 border border-white/10"
              >
                {muted ? (
                  <VolumeX className="h-4.5 w-4.5 text-white" />
                ) : (
                  <Volume2 className="h-4.5 w-4.5 text-white" />
                )}
              </button>

              {/* Creator & Review Information Overlay at the bottom */}
              <div className="relative z-20 bg-[#FAFAF8] border-t border-[#E6DFD5] p-5 flex flex-col gap-3.5 text-left w-full">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 
                      className="text-[#1A1A1A] font-bold text-base leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {review.reviewer_name}
                    </h3>
                    {review.reviewer_instagram && (
                      <p 
                        className="text-[#6E1D25] text-xs font-semibold mt-0.5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {review.reviewer_instagram}
                      </p>
                    )}
                  </div>

                  {review.instagram_reel_url && (
                    <a
                      href={review.instagram_reel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#6E1D25] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-full transition-all"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Instagram
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <p 
                  className="text-[#7A7570] text-xs leading-relaxed italic bg-[#F7F3EC] p-3.5 rounded-xl border border-[#E6DFD5]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
