"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./hooks/useReducedMotion";

type ParallaxCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: "low" | "medium";
};

export function ParallaxCard({
  children,
  className = "",
  intensity = "medium",
}: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0, translateY: 0 });

  const tilt = intensity === "low" ? 2 : 4;
  const lift = intensity === "low" ? 6 : 10;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const updateScroll = () => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const scrollOffset = (centerY - window.innerHeight / 2) * 0.04;
      setStyle((prev) => ({
        ...prev,
        translateY: Math.max(-lift, Math.min(lift, scrollOffset)),
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setStyle((prev) => ({
          translateY: prev.translateY,
          rotateY: x * tilt,
          rotateX: -y * tilt,
        }));
      });
    };

    const onLeave = () => {
      setStyle((prev) => ({ ...prev, rotateX: 0, rotateY: 0 }));
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateScroll);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, tilt, lift]);

  const transform = reduced
    ? undefined
    : `perspective(1200px) rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) translateY(${style.translateY}px)`;

  const inlineStyle: CSSProperties = {
    transform,
    transition: reduced ? undefined : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div ref={ref} className={`parallax-card ${className}`} style={inlineStyle}>
      {children}
    </div>
  );
}
