"use client";

import React, { useEffect, useRef } from "react";

interface Flake {
  x: number;
  y: number;
  z: number; // Depth factor (0.5 to 2.0)
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  spinSpeed: number;
  angleX: number;
  angleY: number;
  angleZ: number;
}

export function FloatingSpiceFlakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const FLAKE_COUNT = 45; // Plenty of spice details
    const flakes: Flake[] = [];

    const colors = [
      "rgba(110, 29, 37, 0.45)",  // Crimson Chilli Flake
      "rgba(212, 168, 67, 0.5)",  // Golden Seasoning Dust
      "rgba(181, 69, 27, 0.4)",   // Paprika Flake
      "rgba(74, 69, 64, 0.3)",    // Coarse Pepper
      "rgba(224, 215, 198, 0.35)" // Mung starch flakes
    ];

    for (let i = 0; i < FLAKE_COUNT; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.5 + Math.random() * 1.5, // 3D depth scale
        size: 3 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: 0.3 + Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.3,
        spinSpeed: 0.01 + Math.random() * 0.03,
        angleX: Math.random() * Math.PI * 2,
        angleY: Math.random() * Math.PI * 2,
        angleZ: Math.random() * Math.PI * 2
      });
    }

    let lastScrollY = window.scrollY;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      flakes.forEach((f) => {
        // Apply 3D parallax scroll displacement
        f.y -= scrollDiff * f.z * 0.25;

        // Gravity/drift updates
        f.y += f.speedY * f.z;
        f.x += f.speedX * f.z;

        // Angle rotations to simulate 3D tumbling
        f.angleX += f.spinSpeed;
        f.angleY += f.spinSpeed * 0.8;
        f.angleZ += f.spinSpeed * 0.5;

        // Screen wrapping
        if (f.y > height + 20) {
          f.y = -20;
          f.x = Math.random() * width;
        } else if (f.y < -20) {
          f.y = height + 20;
          f.x = Math.random() * width;
        }

        if (f.x > width + 20) f.x = -20;
        else if (f.x < -20) f.x = width + 20;

        ctx.save();
        ctx.translate(f.x, f.y);

        // Simulate 3D rotation using scaling & rotation matrix projections
        const cosX = Math.cos(f.angleX);
        const cosY = Math.cos(f.angleY);
        ctx.rotate(f.angleZ);
        ctx.scale(cosY, cosX);

        ctx.fillStyle = f.color;
        ctx.beginPath();

        // Varying shapes for authentic spice flakes
        if (f.size > 8) {
          // Leaf shape
          ctx.ellipse(0, 0, f.size, f.size * 0.4, 0, 0, Math.PI * 2);
        } else if (f.size > 5) {
          // Triangulated chilli flake
          ctx.moveTo(-f.size / 2, -f.size / 2);
          ctx.lineTo(f.size / 2, -f.size / 3);
          ctx.lineTo(0, f.size / 2);
          ctx.closePath();
        } else {
          // Round seasoning dust seed
          ctx.arc(0, 0, f.size / 2, 0, Math.PI * 2);
        }

        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[15] w-full h-full"
    />
  );
}
