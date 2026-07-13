"use client";

export function MarqueeSection() {
  const items = [
    "HANDCRAFTED",
    "AUTHENTIC",
    "TIBETAN",
    "FRESH DAILY",
    "DELHI NCR",
    "PREMIUM KITS",
    "MADE TO ORDER",
  ];

  return (
    <section className="bg-[#6E1D25] overflow-hidden py-4 border-y border-[#8E2D36]">
      <div className="marquee-track select-none">
        {/* First copy */}
        <div className="animate-marquee flex items-center shrink-0">
          {items.map((item, i) => (
            <span key={`a-${i}`} className="inline-flex items-center gap-6 px-6">
              <span
                className="text-[#F7F3EC] text-[11px] font-semibold tracking-[0.18em] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
            </span>
          ))}
        </div>
        {/* Mirror copy for seamless loop */}
        <div className="animate-marquee flex items-center shrink-0" aria-hidden>
          {items.map((item, i) => (
            <span key={`b-${i}`} className="inline-flex items-center gap-6 px-6">
              <span
                className="text-[#F7F3EC] text-[11px] font-semibold tracking-[0.18em] uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
