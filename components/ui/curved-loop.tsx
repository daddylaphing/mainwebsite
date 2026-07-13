"use client";

import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useId,
  FC,
  PointerEvent,
} from "react";

interface CurvedLoopProps {
  /** The repeating text content */
  marqueeText?: string;
  /** Animation speed (pixels per frame) */
  speed?: number;
  /** CSS class applied to the SVG text element */
  className?: string;
  /** SVG fill color for the text (overrides className fill) */
  fill?: string;
  /** FontSize of the marquee text */
  fontSize?: string;
  /** Height of the curve below the text baseline */
  curveAmount?: number;
  /** Initial scroll direction */
  direction?: "left" | "right";
  /** Allow user to drag and fling the marquee */
  interactive?: boolean;
  /** Override the outer container div className (controls height, bg, etc.) */
  containerClassName?: string;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = "",
  speed = 2,
  className = "",
  fill,
  fontSize = "3rem",
  curveAmount = 400,
  direction = "left",
  interactive = true,
  containerClassName,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);

  const uid = useId();
  const pathId = `curve-${uid}`;

  const startY = curveAmount < 0 ? Math.abs(curveAmount) + 40 : 40;
  const controlY = startY + curveAmount;
  const endY = startY;
  const pathD = `M-100,${startY} Q500,${controlY} 1540,${endY}`;

  const viewBoxHeight = Math.max(120, curveAmount < 0 ? startY + 40 : controlY + 40);

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<"left" | "right">(direction);
  const velRef = useRef(0);

  const totalText = spacing
    ? Array(Math.ceil(1800 / spacing) + 2).fill(text).join("")
    : text;
  const ready = spacing > 0;

  // Measure text length once rendered
  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  // Set initial offset
  useEffect(() => {
    if (!spacing || !textPathRef.current) return;
    const initial = -spacing;
    textPathRef.current.setAttribute("startOffset", initial + "px");
    setOffset(initial);
  }, [spacing]);

  // Animation loop
  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const cur = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let next = cur + delta;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        textPathRef.current.setAttribute("startOffset", next + "px");
        setOffset(next);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const cur = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
    let next = cur + dx;
    if (next <= -spacing) next += spacing;
    if (next > 0) next -= spacing;
    textPathRef.current.setAttribute("startOffset", next + "px");
    setOffset(next);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  return (
    <div
      className={
        containerClassName ??
        "flex items-center justify-center w-full"
      }
      style={{
        visibility: ready ? "visible" : "hidden",
        cursor: interactive ? (dragRef.current ? "grabbing" : "grab") : "auto",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg
        className="select-none w-full overflow-visible block"
        style={{
          aspectRatio: `1440 / ${viewBoxHeight}`,
          fontSize,
          fontWeight: 700,
          textTransform: "uppercase",
          lineHeight: 1,
          userSelect: "none",
        }}
        viewBox={`0 0 1440 ${viewBoxHeight}`}
      >
        {/* Hidden measurement text */}
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
          className={className}
        >
          {text}
        </text>
        <defs>
          <path
            ref={pathRef}
            id={pathId}
            d={pathD}
            fill="none"
            stroke="transparent"
          />
        </defs>
        {ready && (
          <text
            fontWeight="bold"
            xmlSpace="preserve"
            className={className}
            style={fill ? { fill } : undefined}
          >
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              startOffset={offset + "px"}
              xmlSpace="preserve"
            >
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
