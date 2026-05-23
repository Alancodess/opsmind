"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jitter } from "@/lib/live-ops";
import { StaggerReveal } from "./StaggerReveal";
import { useLiveInterval } from "./hooks/useLiveInterval";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useSmoothValue } from "./hooks/useSmoothValue";

type MetricDef = {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals: number;
  min: number;
  max: number;
  delta: number;
};

const INITIAL_METRICS: MetricDef[] = [
  {
    label: "Incidents auto-resolved",
    value: 2847,
    suffix: "",
    decimals: 0,
    min: 2800,
    max: 2920,
    delta: 3,
  },
  {
    label: "Mean time to detect",
    value: 12,
    suffix: "s",
    decimals: 0,
    min: 9,
    max: 18,
    delta: 1,
  },
  {
    label: "Infrastructure monitored",
    value: 99.9,
    suffix: "%",
    decimals: 1,
    min: 99.5,
    max: 99.99,
    delta: 0.08,
  },
  {
    label: "Cost savings",
    value: 2.4,
    suffix: "M",
    prefix: "$",
    decimals: 1,
    min: 2.2,
    max: 2.6,
    delta: 0.05,
  },
];

function formatMetricValue(n: number, decimals: number) {
  return decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString();
}

function AnimatedNumber({
  value,
  decimals,
  prefix = "",
  suffix = "",
  active,
  live,
}: {
  value: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
  live: boolean;
}) {
  const reduced = useReducedMotion();
  const useLiveMode = live && active && !reduced;

  const smooth = useSmoothValue(value, 550);
  const [entrance, setEntrance] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setEntrance(value);
      return;
    }
    if (useLiveMode || !active) return;

    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setEntrance(value * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value, reduced, useLiveMode]);

  const display = useLiveMode ? smooth : reduced ? value : entrance;
  const formatted = formatMetricValue(display, decimals);

  return (
    <span className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function MetricsStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tick = useCallback(() => {
    if (!active) return;
    setMetrics((prev) =>
      prev.map((m) => {
        let next = jitter(m.value, m.delta, m.min, m.max);
        if (m.label === "Incidents auto-resolved" && Math.random() > 0.35) {
          next = m.value + 1;
        }
        return { ...m, value: next };
      })
    );
  }, [active]);

  useLiveInterval(tick, 3200, active);

  return (
    <section
      ref={sectionRef}
      className="border-y border-white/[0.06] bg-[var(--bg-elevated)]/50 py-12 px-4 sm:py-16 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <StaggerReveal
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          stagger={90}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="card-hover live-metric-card rounded-xl border border-white/[0.06] bg-[var(--bg-card)] p-5 sm:p-6"
            >
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                <AnimatedNumber
                  value={m.value}
                  decimals={m.decimals}
                  prefix={m.prefix}
                  suffix={m.suffix}
                  active={active}
                  live={active}
                />
              </p>
              <p className="mt-2 text-xs text-[var(--text-secondary)] sm:text-sm">
                {m.label}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
