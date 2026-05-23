"use client";

import type { CSSProperties } from "react";
import { useSmoothMouse } from "./hooks/useSmoothMouse";
import { useReducedMotion } from "./hooks/useReducedMotion";

export function MouseLight() {
  const { x, y } = useSmoothMouse(0.06);
  const reduced = useReducedMotion();

  if (reduced) return null;

  const style: CSSProperties = {
    "--mouse-x": `${x * 100}%`,
    "--mouse-y": `${y * 100}%`,
  } as CSSProperties;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
      aria-hidden
      style={style}
    >
      <div className="mouse-light-spot" />
    </div>
  );
}
