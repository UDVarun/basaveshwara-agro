"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface GardenerCanvasProps {
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function GardenerCanvas({ className }: GardenerCanvasProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      setPointer({
        x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
      });
    };

    const handleLeave = () => {
      setPointer({ x: 0.5, y: 0.5 });
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);

    return () => {
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  const motion = useMemo(() => {
    const x = (pointer.x - 0.5) * 2;
    const y = (pointer.y - 0.5) * 2;

    return {
      translateX: clamp(x * 4, -4, 4),
      translateY: clamp(y * 2, -2, 2),
      scale: 1.01,
    };
  }, [pointer]);

  return (
    <div
      ref={hostRef}
      className={["absolute inset-0 overflow-hidden bg-[#efefed]", className].filter(Boolean).join(" ")}
    >
      <div className="absolute inset-0 bg-[#f4efe8]" />

      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/auth/gardener-reference.png')",
          backgroundPosition: "center bottom",
          backgroundSize: "80% auto",
          transform: `translate(${motion.translateX}px, ${motion.translateY}px) scale(${motion.scale})`,
          transformOrigin: "center bottom",
          transition: "transform 120ms ease-out",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_40%)]" />
    </div>
  );
}
