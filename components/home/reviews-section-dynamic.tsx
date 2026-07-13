"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, Volume2, VolumeX, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Review } from "@/lib/reviews";

interface ReviewsSectionDynamicProps {
  reviews: Review[];
}

// ─── Use local video files from public folder ────────────────────────────────
function getVideoUrl(filename: string): string {
  return `/videos/${filename}`;
}

interface VideoItem {
  id: string;
  filename: string;
  name: string;
  handle: string;
  instagramUrl: string;
  quote: string;
}

// Main featured video (separate section)
const MAIN_VIDEO: VideoItem = {
  id: "main",
  filename: "main.mp4",
  name: "Featured Story",
  handle: "@laphingdaddy",
  instagramUrl: "https://www.instagram.com/reel/DN_JDLSk2pA",
  quote: "Watch how our customers make authentic Tibetan Laphing at home!",
};

// Horizontal scroller videos (no main.mp4)
const VIDEOS: VideoItem[] = [
  {
    id: "1",
    filename: "1.mp4",
    name: "Priya Sharma",
    handle: "@priyasharma",
    instagramUrl: "https://www.instagram.com/reel/DalEYEIyOkI",
    quote: "Absolutely authentic! The chilli oil is incredible.",
  },
  {
    id: "2",
    filename: "2.mp4",
    name: "Rahul Mehta",
    handle: "@rahulmehta",
    instagramUrl: "https://www.instagram.com/reel/DakzCqfJi-b",
    quote: "Restaurant quality at home! My whole family loved it.",
  },
  {
    id: "3",
    filename: "3.mp4",
    name: "Sonam Dolma",
    handle: "@sonamdolma_",
    instagramUrl: "https://www.instagram.com/reel/Dakfp6LBQIF",
    quote: "Grew up eating laphing in Darjeeling — this is the closest!",
  },
  {
    id: "4",
    filename: "4.mp4",
    name: "Amit Kumar",
    handle: "@amitkumar",
    instagramUrl: "https://www.instagram.com/reel/DagFaFfR83-",
    quote: "The preparation guide made it so easy. Perfect texture!",
  },
  {
    id: "5",
    filename: "5.mp4",
    name: "Neha Singh",
    handle: "@nehasingh",
    instagramUrl: "https://www.instagram.com/reel/DahuEe-vsBo",
    quote: "Best laphing I've had outside of Majnu Ka Tilla!",
  },
];

// ─── Instagram Icon ───────────────────────────────────────────────────────────
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({
  video,
  onExpand,
}: {
  video: VideoItem;
  onExpand: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = getVideoUrl(video.filename);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onExpand}
      className="shrink-0 w-[200px] md:w-[240px] aspect-[9/16] rounded-[20px] overflow-hidden relative cursor-pointer shadow-[0_8px_24px_rgba(26,26,26,0.12)] hover:shadow-[0_16px_40px_rgba(26,26,26,0.18)] transition-shadow duration-500 border border-[rgba(26,26,26,0.07)] bg-[#E8E0D5]"
      style={{ willChange: "transform" }}
    >
      {/* Autoplay muted video — no JS control needed, browser handles it */}
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,8,5,0.88)] via-[rgba(10,8,5,0.06)] to-[rgba(10,8,5,0.22)] z-10 pointer-events-none" />

      {/* Hover play icon */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
          <Play className="h-4 w-4 text-[#1A1A1A] fill-[#1A1A1A] ml-0.5" />
        </div>
      </div>

      {/* Instagram badge */}
      <div className="absolute top-3.5 right-3.5 z-30">
        <a
          href={video.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-7 h-7 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <InstagramIcon className="h-3 w-3 text-white" />
        </a>
      </div>

      {/* Creator info */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex flex-col gap-1.5">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="h-2.5 w-2.5 text-[#D4A843]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-white/85 text-[11px] leading-relaxed italic line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          &ldquo;{video.quote}&rdquo;
        </p>
        <div className="border-t border-white/15 pt-1.5">
          <p className="text-white font-bold text-xs" style={{ fontFamily: "'Playfair Display', serif" }}>
            {video.name}
          </p>
          <p className="text-[#D4A843] text-[10px] font-semibold mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            {video.handle}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Full-Screen Modal ────────────────────────────────────────────────────────
function VideoModal({ video, onClose }: { video: VideoItem; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoUrl = getVideoUrl(video.filename);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    videoRef.current?.play().catch(() => {});
    return () => { document.body.style.overflow = ""; };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 24 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] as any }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full max-w-[380px] aspect-[9/16] rounded-[24px] overflow-hidden bg-black shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
        >
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted={muted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none z-10" />

          <button onClick={onClose} className="absolute top-4 right-4 z-30 w-9 h-9 bg-black/50 hover:bg-black/80 border border-white/10 rounded-full flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-white" />
          </button>

          <button onClick={(e) => { e.stopPropagation(); setMuted(!muted); }} className="absolute top-4 left-4 z-30 w-9 h-9 bg-black/50 hover:bg-black/80 border border-white/10 rounded-full flex items-center justify-center transition-colors">
            {muted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
          </button>

          {/* Pause/Play — hover only */}
          <div
            onClick={togglePlay}
            className={`absolute inset-0 z-20 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
              {isPlaying
                ? <Pause className="h-6 w-6 text-[#1A1A1A] fill-[#1A1A1A]" />
                : <Play className="h-6 w-6 text-[#1A1A1A] fill-[#1A1A1A] ml-0.5" />
              }
            </div>
          </div>

          {/* Creator info */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-3">
            <div>
              <p className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{video.name}</p>
              <a href={`https://instagram.com/${video.handle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-[#D4A843] text-xs font-semibold hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
                {video.handle}
              </a>
            </div>
            <p className="text-white/85 text-sm leading-relaxed italic" style={{ fontFamily: "'Inter', sans-serif" }}>
              &ldquo;{video.quote}&rdquo;
            </p>
            <a href={video.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-semibold transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
              <ExternalLink className="h-3 w-3" />
              View on Instagram
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function ReviewsSectionDynamic({ reviews: _reviews }: ReviewsSectionDynamicProps) {
  const [modalVideo, setModalVideo] = useState<VideoItem | null>(null);

  // Double array for seamless CSS infinite loop
  const loopVideos = [...VIDEOS, ...VIDEOS];
  const duration = VIDEOS.length * 6; // ~6s per card

  return (
    <>
      <section id="reviews" className="relative py-20 md:py-28 bg-[#F7F3EC] overflow-hidden">

        {/* Section Header */}
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-16 lg:px-24 mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-[#D4A843]" />
                <span className="text-[#D4A843] text-[10px] font-bold uppercase tracking-[0.22em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Real People. Real Love
                </span>
              </div>
              <h2
                className="text-[#1A1A1A] leading-[1.04]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(30px, 5vw, 60px)",
                  letterSpacing: "-0.03em",
                }}
              >
                Why Delhi Can&apos;t Stop<br />Talking About Us
              </h2>
            </div>

            {/* Stats */}
            <div className="flex items-end gap-6 shrink-0">
              <div className="text-right">
                <p className="text-[#1A1A1A] font-bold leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,48px)" }}>4.9</p>
                <p className="text-[#A09890] text-[9px] uppercase tracking-[0.12em] mt-1 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>Avg Rating</p>
              </div>
              <div className="w-px h-10 bg-[rgba(26,26,26,0.12)]" />
              <div className="text-right">
                <p className="text-[#1A1A1A] font-bold leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,48px)" }}>500+</p>
                <p className="text-[#A09890] text-[9px] uppercase tracking-[0.12em] mt-1 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>Customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Infinite Marquee ── */}
        <div className="relative w-full overflow-hidden">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-28 md:w-52 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to right, #F7F3EC 0%, rgba(247,243,236,0.85) 50%, transparent 100%)" }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-28 md:w-52 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to left, #F7F3EC 0%, rgba(247,243,236,0.85) 50%, transparent 100%)" }} />

          <div
            className="flex gap-5 py-4"
            style={{
              width: "max-content",
              animation: `reviews-marquee ${duration}s linear infinite`,
            }}
          >
            {loopVideos.map((video, i) => (
              <VideoCard
                key={`${video.id}-${i}`}
                video={video}
                onExpand={() => setModalVideo(video)}
              />
            ))}
          </div>
        </div>

        {/* ── Featured Video Section ── */}
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-16 lg:px-24 mt-16 md:mt-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Video — Left */}
            <div className="relative">
              <div 
                onClick={() => setModalVideo(MAIN_VIDEO)}
                className="relative aspect-[9/16] max-w-[380px] rounded-[24px] overflow-hidden cursor-pointer shadow-[0_20px_60px_rgba(26,26,26,0.15)] hover:shadow-[0_30px_80px_rgba(26,26,26,0.25)] transition-all duration-500 border border-[rgba(26,26,26,0.08)] bg-[#E8E0D5] group"
              >
                <video
                  src={getVideoUrl(MAIN_VIDEO.filename)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,8,5,0.9)] via-[rgba(10,8,5,0.1)] to-[rgba(10,8,5,0.3)] pointer-events-none" />
                
                {/* Hover play icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                    <Play className="h-7 w-7 text-[#1A1A1A] fill-[#1A1A1A] ml-0.5" />
                  </div>
                </div>

                {/* Instagram badge */}
                <div className="absolute top-4 right-4 z-20">
                  <a
                    href={MAIN_VIDEO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <InstagramIcon className="h-4 w-4 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Text — Right */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-px bg-[#D4A843]" />
                  <span className="text-[#D4A843] text-[10px] font-bold uppercase tracking-[0.22em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Featured Story
                  </span>
                </div>
                <h3
                  className="text-[#1A1A1A] leading-[1.12] mb-5"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "clamp(26px, 4vw, 44px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Authentic Tibetan Laphing,<br />Made at Home
                </h3>
                <p 
                  className="text-[#5A5550] leading-[1.7] mb-6"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(14px, 2vw, 16px)",
                  }}
                >
                  See how our customers across India are bringing the authentic taste of Tibetan street food into their kitchens. With our premium laphing kit, you get restaurant-quality results every single time.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 py-5 border-y border-[rgba(26,26,26,0.12)]">
                <div>
                  <p className="text-[#1A1A1A] font-bold leading-none mb-1.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3vw, 32px)" }}>500+</p>
                  <p className="text-[#A09890] text-[10px] uppercase tracking-wider font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Happy Customers</p>
                </div>
                <div>
                  <p className="text-[#1A1A1A] font-bold leading-none mb-1.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3vw, 32px)" }}>4.9★</p>
                  <p className="text-[#A09890] text-[10px] uppercase tracking-wider font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Avg Rating</p>
                </div>
                <div>
                  <p className="text-[#1A1A1A] font-bold leading-none mb-1.5" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3vw, 32px)" }}>15m</p>
                  <p className="text-[#A09890] text-[10px] uppercase tracking-wider font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Prep Time</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={MAIN_VIDEO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white text-[11px] font-bold uppercase tracking-wider px-7 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <InstagramIcon className="h-4 w-4" />
                  Watch on Instagram
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/laphingdaddy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 border border-[rgba(26,26,26,0.18)] hover:border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[11px] font-bold uppercase tracking-wider px-7 py-3.5 rounded-full transition-all duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  View All Reviews
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CSS keyframe — pure infinite marquee independent of scroll */}
        <style>{`
          @keyframes reviews-marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {modalVideo && (
        <VideoModal video={modalVideo} onClose={() => setModalVideo(null)} />
      )}
    </>
  );
}
