"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { clamp, shiftSeries } from "@/lib/live-ops";
import { Button } from "./Button";
import { LiveNumber } from "./LiveNumber";
import { ParallaxCard } from "./ParallaxCard";
import { ScrollReveal } from "./ScrollReveal";
import { useLiveInterval } from "./hooks/useLiveInterval";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section
      id="platform"
      className="relative flex min-h-[100svh] flex-col justify-center section-padding px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div
          className={`hero-enter mb-5 sm:mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 sm:px-4 ${
            mounted ? "hero-enter-visible" : ""
          }`}
          style={{ transitionDelay: "0ms" }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)] status-dot-live" />
          </span>
          <span className="truncate text-[11px] font-medium tracking-wide text-[var(--text-secondary)] sm:text-[12px]">
            AI operations platform · v2.4 live
          </span>
        </div>

        <h1
          className={`heading-hero max-w-4xl hero-enter ${mounted ? "hero-enter-visible" : ""}`}
          style={{ transitionDelay: "80ms" }}
        >
          <span className="text-gradient">Intelligence</span>
          <br />
          for modern operations
        </h1>

        <p
          className={`hero-enter mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:mt-6 sm:text-lg ${
            mounted ? "hero-enter-visible" : ""
          }`}
          style={{ transitionDelay: "160ms" }}
        >
          OpsMind unifies incident response, observability, and AI-driven
          automation into one cinematic command center — built for teams who
          demand precision at scale.
        </p>

        <div
          className={`hero-enter mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 ${
            mounted ? "hero-enter-visible" : ""
          }`}
          style={{ transitionDelay: "240ms" }}
        >
          <Button href="/sign-in" variant="primary" icon className="w-full justify-center sm:w-auto">
            Explore platform
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Button href="#work" variant="secondary" className="w-full justify-center sm:w-auto">
            View case studies
          </Button>
        </div>

        <ScrollReveal delay={320} className="mt-12 sm:mt-16 lg:mt-20">
          <ParallaxCard intensity="medium">
            <HeroDashboardPreview />
          </ParallaxCard>
        </ScrollReveal>
      </div>
    </section>
  );
}

function HeroDashboardPreview() {
  const [uptime, setUptime] = useState(99.97);
  const [mttr, setMttr] = useState(4.2);
  const [resolved, setResolved] = useState(847);
  const [bars, setBars] = useState([40, 55, 45, 70, 60, 85, 75, 90, 82, 95, 88, 92]);

  const tick = useCallback(() => {
    setUptime((v) => clamp(v + (Math.random() - 0.5) * 0.015, 99.92, 99.99));
    setMttr((v) => clamp(v + (Math.random() - 0.5) * 0.25, 3.6, 5.2));
    if (Math.random() > 0.4) setResolved((v) => v + 1);
    setBars((s) => shiftSeries(s));
  }, []);

  useLiveInterval(tick, 2400);

  return (
    <div className="relative">
      <div className="absolute -inset-2 rounded-3xl bg-[var(--accent)]/5 blur-2xl sm:-inset-4 sm:blur-3xl live-panel-glow" />
      <div className="live-panel relative overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-card)] shadow-2xl shadow-black/50 sm:rounded-2xl">
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[var(--bg-elevated)] px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-zinc-600 sm:h-2.5 sm:w-2.5" />
            <span className="h-2 w-2 rounded-full bg-zinc-600 sm:h-2.5 sm:w-2.5" />
            <span className="h-2 w-2 rounded-full bg-zinc-600 sm:h-2.5 sm:w-2.5" />
          </div>
          <span className="mx-auto truncate text-[10px] text-[var(--text-muted)] sm:text-[11px]">
            opsmind.app / command · live
          </span>
        </div>
        <div className="grid grid-cols-1 gap-px bg-white/[0.04] p-3 sm:grid-cols-3 sm:p-4">
          <MiniStat
            label="Uptime"
            value={<><LiveNumber value={uptime} decimals={2} suffix="%" /></>}
            trend="+0.02%"
            positive
          />
          <MiniStat
            label="MTTR"
            value={
              <>
                <LiveNumber value={mttr} decimals={1} />
                m
              </>
            }
            trend="-18%"
            positive
          />
          <MiniStat
            label="AI resolved"
            value={<LiveNumber value={resolved} decimals={0} />}
            trend="today"
          />
        </div>
        <div className="border-t border-white/[0.06] p-3 sm:p-4">
          <div className="flex h-16 items-end justify-between gap-1 sm:h-24 sm:gap-2">
            {bars.map((h, i) => (
              <div
                key={i}
                className="chart-bar-live flex-1 rounded-sm bg-gradient-to-t from-[var(--accent)]/30 to-[var(--accent)]/80"
                style={{
                  height: `${h}%`,
                  transition: "height 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  trend,
  positive,
}: {
  label: string;
  value: ReactNode;
  trend: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-lg bg-[var(--bg-surface)] p-3 transition-colors hover:bg-white/[0.03] sm:p-4">
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] sm:text-[11px]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">{value}</p>
      <p
        className={`mt-1 text-[10px] sm:text-[11px] ${positive ? "text-[var(--success)]" : "text-[var(--text-muted)]"}`}
      >
        {trend}
      </p>
    </div>
  );
}
