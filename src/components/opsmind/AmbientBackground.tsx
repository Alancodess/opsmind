"use client";

import { useEffect, useState } from "react";
import { useSmoothMouse } from "./hooks/useSmoothMouse";
import { useReducedMotion } from "./hooks/useReducedMotion";

export function AmbientBackground() {
  const [scrollY, setScrollY] = useState(0);
  const { x, y } = useSmoothMouse(0.04);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mouseX = reduced ? 50 : x * 100;
  const mouseY = reduced ? 30 : y * 100;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.35] animate-glow-drift"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 156, 246, 0.14), transparent 60%)`,
          transform: `translateY(${scrollY * 0.12}px)`,
        }}
      />
      <div
        className="absolute left-1/2 top-[18%] h-[min(500px,70vw)] w-[min(500px,70vw)] -translate-x-1/2 rounded-full opacity-[0.18] blur-[100px] sm:blur-[120px] animate-glow-drift"
        style={{
          background: "rgba(139, 156, 246, 0.22)",
          transform: `translate(-50%, ${scrollY * 0.06}px)`,
        }}
      />
      <div
        className="absolute right-[5%] top-[38%] h-[min(280px,50vw)] w-[min(280px,50vw)] rounded-full opacity-[0.1] blur-[80px] sm:blur-[100px] animate-glow-drift-alt hidden sm:block"
        style={{
          background: "rgba(196, 181, 253, 0.14)",
          transform: `translateY(${scrollY * -0.04}px)`,
        }}
      />
      <div
        className="absolute opacity-[0.06] sm:opacity-[0.04] inset-0 grid-fade"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "clamp(32px, 8vw, 64px) clamp(32px, 8vw, 64px)",
          transform: `translateY(${scrollY * 0.02}px)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(600px circle at ${mouseX}% ${mouseY}%, rgba(139,156,246,0.06), transparent 50%)`,
        }}
      />
      <div className="noise-overlay absolute inset-0" />

      <div
        className="absolute left-[8%] top-[30%] hidden h-20 w-20 rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-float-slow md:block lg:h-24 lg:w-24"
        style={{
          transform: `perspective(800px) rotateX(12deg) rotateY(-20deg) translateY(${scrollY * -0.03}px)`,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      />
      <div
        className="absolute right-[12%] top-[55%] hidden h-14 w-14 rounded-xl border border-white/[0.05] bg-white/[0.02] animate-float-medium md:block lg:h-16 lg:w-16"
        style={{
          transform: `perspective(800px) rotateX(-8deg) rotateY(15deg) translateY(${scrollY * -0.05}px)`,
          boxShadow: "0 20px 40px -12px rgba(0,0,0,0.4)",
        }}
      />
      <div
        className="absolute left-[20%] bottom-[25%] hidden h-10 w-10 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent-soft)] animate-pulse-glow sm:block lg:h-12 lg:w-12"
        style={{ transform: `translateY(${scrollY * -0.04}px)` }}
      />
    </div>
  );
}
