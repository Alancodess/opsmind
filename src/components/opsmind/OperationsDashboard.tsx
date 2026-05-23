"use client";

import { useCallback, useState } from "react";
import {
  formatLatency,
  jitter,
  operationalCount,
  shiftSeries,
  type LiveService,
} from "@/lib/live-ops";
import type { CSSProperties, ReactNode } from "react";
import { LiveNumber } from "./LiveNumber";
import { LiveSparkline } from "./LiveSparkline";
import { ParallaxCard } from "./ParallaxCard";
import { ScrollReveal } from "./ScrollReveal";
import { useLiveInterval } from "./hooks/useLiveInterval";
import { useLiveServices } from "./hooks/useLiveServices";

const statusColor = {
  healthy: "var(--success)",
  degraded: "var(--warning)",
  critical: "var(--danger)",
};

export function OperationsDashboard() {
  const services = useLiveServices(2500);

  const [throughputSeries, setThroughputSeries] = useState([
    20, 35, 30, 50, 45, 65, 55, 80, 70, 90,
  ]);
  const [budgetSeries, setBudgetSeries] = useState([
    60, 55, 58, 52, 54, 50, 53, 48, 51, 49,
  ]);
  const [predictionsSeries, setPredictionsSeries] = useState([
    20, 35, 30, 50, 45, 65, 55, 80, 70, 90,
  ]);
  const [throughputK, setThroughputK] = useState(12.4);
  const [errorBudget, setErrorBudget] = useState(94.2);
  const [predictions, setPredictions] = useState(23);

  const tickCharts = useCallback(() => {
    setThroughputSeries((s) => shiftSeries(s, jitter(s[s.length - 1]!, 10, 25, 98)));
    setBudgetSeries((s) => shiftSeries(s, jitter(s[s.length - 1]!, 4, 42, 68)));
    setPredictionsSeries((s) => shiftSeries(s, jitter(s[s.length - 1]!, 12, 20, 95)));
    setThroughputK((v) => jitter(v, 0.35, 11.2, 14.8));
    setErrorBudget((v) => jitter(v, 0.4, 91.5, 96.5));
    setPredictions((v) => jitter(v, 2, 18, 31));
  }, []);

  useLiveInterval(tickCharts, 2800);

  return (
    <section id="dashboard" className="section-padding px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="section-label">Command center</p>
            <h2 className="heading-section mt-3 sm:mt-4">AI operational dashboard</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-4 sm:text-base">
              Real-time visibility across your entire stack. AI surfaces anomalies
              before they become outages.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-10 sm:mt-14">
          <ParallaxCard intensity="low">
            <div className="live-panel glow-accent overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-card)] sm:rounded-2xl">
              <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-sm font-medium">Service health</span>
                  <span className="live-badge rounded-full bg-[var(--success)]/10 px-2.5 py-0.5 text-[10px] font-medium text-[var(--success)] sm:text-[11px]">
                    {operationalCount(services)}
                  </span>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                  {["1h", "24h", "7d"].map((range, i) => (
                    <button
                      key={range}
                      type="button"
                      className={`rounded-lg px-2.5 py-1 text-[11px] transition-all sm:px-3 sm:py-1.5 sm:text-[12px] ${
                        i === 1
                          ? "bg-white/[0.08] text-[var(--text-primary)]"
                          : "text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-white/[0.04] md:hidden">
                {services.map((svc) => (
                  <ServiceMobileCard key={svc.name} svc={svc} />
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.04] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                      <th className="px-6 py-3 font-medium">Service</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Latency</th>
                      <th className="px-6 py-3 font-medium">Load</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((svc) => (
                      <ServiceRow key={svc.name} svc={svc} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-px border-t border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
                <DashboardChartCard
                  id="throughput"
                  title="Request throughput"
                  subtitle={
                    <>
                      <LiveNumber value={throughputK} decimals={1} />
                      k req/s
                    </>
                  }
                  points={throughputSeries}
                />
                <DashboardChartCard
                  id="budget"
                  title="Error budget"
                  subtitle={
                    <>
                      <LiveNumber value={errorBudget} decimals={1} suffix="%" /> remaining
                    </>
                  }
                  points={budgetSeries}
                />
                <DashboardChartCard
                  id="predictions"
                  title="AI predictions"
                  subtitle={
                    <>
                      <LiveNumber value={predictions} decimals={0} /> active
                    </>
                  }
                  points={predictionsSeries}
                  highlight
                  className="sm:col-span-2 lg:col-span-1"
                />
              </div>
            </div>
          </ParallaxCard>
        </ScrollReveal>
      </div>
    </section>
  );
}

function ServiceRow({ svc }: { svc: LiveService }) {
  const active = svc.status !== "healthy";
  return (
    <tr
      className={`group border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${
        active ? "live-row-active" : ""
      }`}
    >
      <td className="px-6 py-4 font-mono text-[13px]">{svc.name}</td>
      <td className="px-6 py-4">
        <StatusDot status={svc.status} />
      </td>
      <td className="px-6 py-4 text-[var(--text-secondary)] tabular-nums">
        {formatLatency(svc.latencyMs)}
      </td>
      <td className="px-6 py-4">
        <LoadBar load={svc.load} active={active} />
      </td>
    </tr>
  );
}

function ServiceMobileCard({ svc }: { svc: LiveService }) {
  const active = svc.status !== "healthy";
  return (
    <div
      className={`group px-4 py-3.5 transition-colors hover:bg-white/[0.02] sm:px-5 sm:py-4 ${
        active ? "live-row-active" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[12px] sm:text-[13px]">{svc.name}</p>
        <StatusDot status={svc.status} compact />
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-[12px] text-[var(--text-muted)] tabular-nums">
          {formatLatency(svc.latencyMs)}
        </span>
        <div className="flex max-w-[140px] flex-1 items-center gap-2">
          <LoadBar load={svc.load} active={active} />
        </div>
      </div>
    </div>
  );
}

function StatusDot({
  status,
  compact,
}: {
  status: LiveService["status"];
  compact?: boolean;
}) {
  const color = statusColor[status];
  const pulse = status === "healthy" || status === "degraded";

  return (
    <span className={`inline-flex items-center gap-2 ${compact ? "shrink-0" : ""}`}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${pulse ? "status-dot-live" : ""}`}
        style={
          {
            background: color,
            "--status-glow": color,
          } as CSSProperties
        }
      />
      <span className={`capitalize text-[var(--text-secondary)] ${compact ? "text-[11px]" : ""}`}>
        {status}
      </span>
    </span>
  );
}

function LoadBar({ load, active }: { load: number; active?: boolean }) {
  return (
    <>
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`load-bar h-full rounded-full transition-all duration-700 ease-out ${
            active ? "bg-[var(--warning)]/80" : "bg-[var(--accent)]/70"
          } group-hover:bg-[var(--accent)]`}
          style={{ width: `${load}%` }}
        />
      </div>
      <span className="shrink-0 text-[11px] tabular-nums text-[var(--text-muted)] sm:text-xs">
        {load}%
      </span>
    </>
  );
}

function DashboardChartCard({
  id,
  title,
  subtitle,
  points,
  highlight,
  className = "",
}: {
  id: string;
  title: string;
  subtitle: ReactNode;
  points: number[];
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={`card-hover bg-[var(--bg-card)] p-4 sm:p-6 ${className}`}>
      <p className="text-[12px] text-[var(--text-secondary)] sm:text-[13px]">{title}</p>
      <p className="mt-1 text-base font-semibold tracking-tight sm:text-lg">{subtitle}</p>
      <LiveSparkline points={points} id={id} highlight={highlight} />
    </div>
  );
}
