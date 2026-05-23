"use client";

import { useCallback, useState } from "react";
import { jitter } from "@/lib/live-ops";
import { LiveNumber } from "./LiveNumber";
import { ScrollReveal } from "./ScrollReveal";
import { StaggerReveal } from "./StaggerReveal";
import { useLiveInterval } from "./hooks/useLiveInterval";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export function AnalyticsSection() {
  const [reliability, setReliability] = useState(94.2);
  const [barValues, setBarValues] = useState([72, 78, 85, 82, 91, 94]);
  const [distribution, setDistribution] = useState([
    { label: "Compute", pct: 42, color: "rgba(139,156,246,0.8)" },
    { label: "Storage", pct: 28, color: "rgba(139,156,246,0.5)" },
    { label: "Network", pct: 18, color: "rgba(139,156,246,0.35)" },
    { label: "Other", pct: 12, color: "rgba(139,156,246,0.2)" },
  ]);
  const [kpis, setKpis] = useState([
    { title: "SLO compliance", value: 99.2, suffix: "%", delta: "+0.4%" },
    { title: "Deploy frequency", value: 47, suffix: "/day", delta: "+12%" },
    { title: "Change failure rate", value: 0.8, suffix: "%", delta: "-0.3%" },
  ]);
  const [costK, setCostK] = useState(847);

  const tick = useCallback(() => {
    setReliability((v) => jitter(v, 0.25, 92.5, 96.8));
    setBarValues((bars) => {
      const last = bars[bars.length - 1] ?? 90;
      const next = [...bars.slice(1), jitter(last, 3, 70, 98)];
      return next;
    });
    setDistribution((prev) => {
      const compute = jitter(prev[0]!.pct, 2, 38, 48);
      const storage = jitter(prev[1]!.pct, 2, 22, 32);
      const network = jitter(prev[2]!.pct, 1, 14, 22);
      const other = clampPct(100 - compute - storage - network);
      return [
        { ...prev[0]!, pct: compute },
        { ...prev[1]!, pct: storage },
        { ...prev[2]!, pct: network },
        { ...prev[3]!, pct: other },
      ];
    });
    setKpis((prev) =>
      prev.map((k) => ({
        ...k,
        value:
          k.title === "Deploy frequency"
            ? jitter(k.value, 2, 42, 54)
            : k.title === "Change failure rate"
              ? jitter(k.value, 0.15, 0.5, 1.2)
              : jitter(k.value, 0.2, 98.5, 99.6),
      }))
    );
    setCostK((v) => jitter(v, 8, 820, 870));
  }, []);

  useLiveInterval(tick, 3500);

  const max = Math.max(...barValues, 1);

  return (
    <section id="analytics" className="section-padding px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label">Analytics</p>
            <h2 className="heading-section mt-3 sm:mt-4">Operational intelligence</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)] sm:mt-4 sm:text-base">
              Deep insights across reliability, cost, and performance — presented
              with clarity, not clutter.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-6 lg:grid-cols-5">
          <ScrollReveal className="lg:col-span-3">
            <div className="card-hover live-panel h-full rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-4 sm:rounded-2xl sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Reliability score</p>
                  <p className="mt-1 text-xl font-semibold sm:text-2xl">
                    <LiveNumber value={reliability} decimals={1} suffix="%" />
                  </p>
                </div>
                <span className="text-[11px] text-[var(--success)] sm:text-[12px]">
                  +3.1% vs last quarter
                </span>
              </div>
              <div className="mt-6 flex h-36 items-end justify-between gap-1.5 sm:mt-8 sm:h-48 sm:gap-3">
                {barValues.map((val, i) => (
                  <div
                    key={MONTHS[i]}
                    className="group flex flex-1 flex-col items-center gap-1.5 sm:gap-2"
                  >
                    <div
                      className="chart-bar-live w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-[var(--accent)]/20 to-[var(--accent)]/70 sm:max-w-[48px]"
                      style={{
                        height: `${(val / max) * 100}%`,
                        transition: "height 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                    <span className="text-[9px] text-[var(--text-muted)] sm:text-[11px]">
                      {MONTHS[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} className="lg:col-span-2">
            <div className="card-hover live-panel h-full rounded-xl border border-white/[0.08] bg-[var(--bg-card)] p-4 sm:rounded-2xl sm:p-6">
              <p className="text-sm text-[var(--text-secondary)]">Cost distribution</p>
              <p className="mt-1 text-xl font-semibold sm:text-2xl">
                $<LiveNumber value={costK} decimals={0} />
                k/mo
              </p>
              <div className="mt-6 flex justify-center sm:mt-8">
                <DonutChart segments={distribution} />
              </div>
              <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                {distribution.map((d) => (
                  <li key={d.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      {d.label}
                    </span>
                    <span className="font-mono tabular-nums text-[var(--text-muted)]">
                      <LiveNumber value={d.pct} decimals={0} suffix="%" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <div className="lg:col-span-5">
            <StaggerReveal className="grid gap-3 sm:grid-cols-3 sm:gap-4" stagger={80}>
              {kpis.map((kpi) => (
                <div
                  key={kpi.title}
                  className="card-hover live-metric-card rounded-xl border border-white/[0.06] bg-[var(--bg-surface)] p-4 sm:p-5"
                >
                  <p className="text-[12px] text-[var(--text-secondary)] sm:text-[13px]">
                    {kpi.title}
                  </p>
                  <p className="mt-2 text-lg font-semibold sm:text-xl">
                    <LiveNumber value={kpi.value} decimals={1} suffix={kpi.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--success)] sm:text-[12px]">
                    {kpi.delta}
                  </p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function clampPct(n: number) {
  return Math.min(20, Math.max(8, Math.round(n)));
}

function DonutChart({
  segments,
}: {
  segments: { label: string; pct: number; color: string }[];
}) {
  let offset = 0;
  const r = 40;
  const c = 2 * Math.PI * r;

  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 100 100"
      className="-rotate-90 sm:h-[160px] sm:w-[160px]"
      aria-hidden
    >
      {segments.map((seg) => {
        const dash = (seg.pct / 100) * c;
        const el = (
          <circle
            key={seg.label}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="12"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            className="transition-all duration-700 ease-out"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}
