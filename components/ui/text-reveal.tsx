"use client";

import { useEffect, useRef } from "react";

/**
 * WordReveal — reveals each word with a stagger slide-up effect.
 * Uses Intersection Observer so it triggers on scroll.
 */
export function WordReveal({
  text,
  className = "",
  delay = 0,
  duration = 0.7,
  stagger = 0.06,
  tag: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  tag?: "span" | "p" | "h1" | "h2" | "h3" | "div";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLSpanElement>(".wr-word");
    words.forEach((w) => {
      (w as HTMLElement).style.transform = "translateY(120%) rotate(3deg)";
      (w as HTMLElement).style.opacity = "0";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        words.forEach((word, i) => {
          const totalDelay = delay + i * stagger;
          (word as HTMLElement).style.transition = `transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${totalDelay}s, opacity ${duration * 0.6}s ease ${totalDelay}s`;
          (word as HTMLElement).style.transform = "translateY(0) rotate(0)";
          (word as HTMLElement).style.opacity = "1";
        });
        observer.disconnect();
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration, stagger]);

  const words = text.split(" ");

  return (
    <Tag ref={ref as React.RefObject<HTMLElement & HTMLHeadingElement>} className={className} style={{ display: "inline" }}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden leading-none"
          style={{ marginRight: "0.25em" }}
        >
          <span className="wr-word inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * MaskReveal — slides a block off text from left to right, then fades in.
 */
export function MaskReveal({
  children,
  className = "",
  delay = 0,
  color = "#D4A843",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  color?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const mask = maskRef.current;
    if (!wrap || !mask) return;

    mask.style.transform = "scaleX(0)";
    mask.style.transformOrigin = "left center";
    wrap.style.opacity = "0";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // 1: Grow mask left→right
        mask.style.transition = `transform 0.55s cubic-bezier(0.76,0,0.24,1) ${delay}s`;
        mask.style.transform = "scaleX(1)";

        // 2: Reveal text, shrink mask right→left
        setTimeout(
          () => {
            wrap.style.opacity = "1";
            mask.style.transformOrigin = "right center";
            mask.style.transition = "transform 0.5s cubic-bezier(0.76,0,0.24,1) 0s";
            mask.style.transform = "scaleX(0)";
          },
          (delay + 0.55) * 1000
        );

        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [delay, color]);

  return (
    <span className="relative inline-block">
      <span ref={wrapRef} className={className} style={{ display: "inline-block" }}>
        {children}
      </span>
      <span
        ref={maskRef}
        className="absolute inset-0 pointer-events-none"
        style={{ background: color, zIndex: 2 }}
        aria-hidden
      />
    </span>
  );
}

/**
 * CharReveal — each character flies in sequentially (great for CTAs).
 */
export function CharReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
  duration = 0.6,
  from = "bottom", // "bottom" | "top" | "left"
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  from?: "bottom" | "top" | "left";
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLSpanElement>(".cr-char");

    const startTransform =
      from === "bottom" ? "translateY(110%)" :
      from === "top"    ? "translateY(-110%)" :
                          "translateX(-40px)";

    chars.forEach((c) => {
      (c as HTMLElement).style.transform = startTransform;
      (c as HTMLElement).style.opacity = "0";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        chars.forEach((char, i) => {
          const d = delay + i * stagger;
          (char as HTMLElement).style.transition = `transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${d}s, opacity ${duration * 0.5}s ease ${d}s`;
          (char as HTMLElement).style.transform = "translate(0)";
          (char as HTMLElement).style.opacity = "1";
        });
        observer.disconnect();
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration, stagger, from]);

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="cr-char inline-block will-change-transform"
          aria-hidden
        >
          <span className="inline-block" style={{ display: char === " " ? "inline" : undefined }}>
            {char === " " ? "\u00a0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * FadeUp — simple fade + slide utility wrapper
 */
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.transition = `opacity 0.8s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        observer.disconnect();
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * CountUp — animates a number from 0 to target when in view
 */
export function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 1.5,
  className = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / (duration * 1000), 1);
          const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
          const val = Math.round(ease * target);
          el.textContent = `${prefix}${val}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, prefix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

/**
 * Typewriter — types out text character-by-character with a blinking cursor.
 * Triggers when the element enters the viewport.
 */
export function Typewriter({
  text,
  className = "",
  speed = 45,         // ms per character
  delay = 0,          // delay before typing starts (ms)
  cursor = true,      // show blinking cursor
  loop = false,       // restart after completion
  pauseOnDone = 1800, // ms to pause before looping (if loop=true)
  onComplete,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  loop?: boolean;
  pauseOnDone?: number;
  onComplete?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const displayRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const display = displayRef.current;
    if (!el || !display) return;

    display.textContent = "";

    let timeoutId: ReturnType<typeof setTimeout>;

    const typeText = () => {
      let i = 0;
      const type = () => {
        if (i <= text.length) {
          display.textContent = text.slice(0, i);
          i++;
          timeoutId = setTimeout(type, speed);
        } else {
          onComplete?.();
          if (loop) {
            timeoutId = setTimeout(() => {
              i = 0;
              display.textContent = "";
              type();
            }, pauseOnDone);
          }
        }
      };
      timeoutId = setTimeout(type, delay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted.current) return;
        hasStarted.current = true;
        typeText();
        observer.disconnect();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay, loop, pauseOnDone, onComplete]);

  return (
    <span ref={ref} className={`inline ${className}`} aria-label={text}>
      <span ref={displayRef} aria-hidden />
      {cursor && (
        <span
          ref={cursorRef}
          aria-hidden
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "currentColor",
            verticalAlign: "text-bottom",
            marginLeft: "2px",
            animation: "tw-blink 0.9s step-end infinite",
          }}
        />
      )}
      <style>{`
        @keyframes tw-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
