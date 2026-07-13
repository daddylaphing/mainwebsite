"use client";

import CurvedLoop from "@/components/ui/curved-loop";

interface CurvedLoopDividerProps {
  text: string;
  /** Background color of the band */
  bg?: string;
  /** SVG text fill color */
  fill?: string;
  /** Height in px */
  height?: number;
  speed?: number;
  fontSize?: string;
  curveAmount?: number;
  direction?: "left" | "right";
}

export function CurvedLoopDivider({
  text,
  bg = "#1A1A1A",
  fill = "#D4A843",
  height = 130,
  speed = 1.6,
  fontSize = "2rem",
  curveAmount = 200,
  direction = "left",
}: CurvedLoopDividerProps) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{ background: bg, height: `${height}px` }}
    >
      <CurvedLoop
        marqueeText={text}
        speed={speed}
        curveAmount={curveAmount}
        direction={direction}
        fill={fill}
        fontSize={fontSize}
        interactive
        containerClassName="w-full h-full flex items-center justify-center"
      />
    </div>
  );
}
