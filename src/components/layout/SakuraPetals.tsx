"use client";

import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

export default function SakuraPetals({ count = 18 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Client-only randomization: petal positions must differ from SSR markup,
    // so they're generated after mount rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPetals(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 14,
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 14,
        drift: Math.random() * 160 - 80,
        opacity: 0.5 + Math.random() * 0.4,
      }))
    );
  }, [count]);

  return (
    <div className="sakura-layer" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <path
              d="M16 2c2 4 6 5 8 9-2 3-6 3-8 7-2-4-6-4-8-7 2-4 6-5 8-9z"
              fill="#ffc2d1"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
