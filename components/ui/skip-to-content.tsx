"use client";

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#E7B52C] focus:text-black focus:font-bold focus:px-6 focus:py-3 focus:rounded-[14px] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Skip to main content
    </a>
  );
}
