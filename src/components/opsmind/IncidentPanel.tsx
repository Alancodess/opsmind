"use client";

import { useState } from "react";
import type { Incident } from "@/types/incident";
import { IncidentAnalysisPanel } from "./IncidentAnalysisPanel";
import { ScrollReveal } from "./ScrollReveal";
import { useLiveIncidents } from "./hooks/useLiveIncidents";

const severityStyles = {
  critical: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20",
  warning: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  info: "bg-white/[0.04] text-[var(--text-secondary)] border-white/[0.08]",
};

export function IncidentPanel() {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const incidents = useLiveIncidents(14000);

  const filtered = incidents.filter((inc) => {
    if (filter === "active") return inc.status !== "resolved";
    if (filter === "resolved") return inc.status === "resolved";
    return true;
  });

  const openAnalysis = (incident: Incident) => {
    setSelectedIncident(incident);
    setPanelOpen(true);
  };

  const closeAnalysis = () => {
    setPanelOpen(false);
    setTimeout(() => setSelectedIncident(null), 320);
  };

  return (
    <>
      <section id="incidents" className="section-padding bg-[var(--bg-elevated)]/30 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
            <ScrollReveal>
              <p className="section-label">Incident response</p>
              <h2 className="heading-section mt-3 sm:mt-4">Monitor. Respond. Resolve.</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-4 sm:text-base">
                AI triages incidents in real time, suggests root causes, and
                orchestrates runbooks — so your team focuses on what matters.
              </p>

              <div className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
                {[
                  { label: "Auto-triage accuracy", value: "96.4%" },
                  { label: "Escalation time saved", value: "47 min avg" },
                  { label: "Runbooks executed", value: "1,204 this week" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="interactive-row flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3 sm:pb-4"
                  >
                    <span className="text-sm text-[var(--text-secondary)]">{stat.label}</span>
                    <span className="font-mono text-sm font-medium shrink-0">{stat.value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120} direction="left">
              <div className="card-hover overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-card)] sm:rounded-2xl">
                <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
                  <span className="text-sm font-medium">Live incidents</span>
                  <div className="flex gap-1 rounded-lg bg-white/[0.04] p-1 self-start sm:self-auto">
                    {(["all", "active", "resolved"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`filter-pill rounded-md px-2.5 py-1 text-[10px] capitalize sm:px-3 sm:text-[11px] ${
                          filter === f
                            ? "bg-white/[0.1] text-[var(--text-primary)]"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <ul className="max-h-[min(480px,60vh)] divide-y divide-white/[0.04] overflow-y-auto scrollbar-hide">
                  {filtered.map((inc) => (
                    <IncidentCard
                      key={inc.id}
                      incident={inc}
                      onAnalyze={() => openAnalysis(inc)}
                      isAnalyzing={
                        analysisLoading && selectedIncident?.id === inc.id
                      }
                    />
                  ))}
                </ul>

                <div className="border-t border-white/[0.06] px-4 py-2.5 shimmer-line sm:px-5 sm:py-3">
                  <p className="text-center text-[10px] text-[var(--text-muted)] sm:text-[11px]">
                    AI agent monitoring 847 signals
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <IncidentAnalysisPanel
        incident={selectedIncident}
        open={panelOpen}
        onClose={closeAnalysis}
        onLoadingChange={setAnalysisLoading}
      />
    </>
  );
}

function IncidentCard({
  incident,
  onAnalyze,
  isAnalyzing,
}: {
  incident: Incident;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}) {
  return (
    <li
      className={`incident-row px-4 py-3.5 sm:px-5 sm:py-4 ${
        incident.status === "investigating" ? "incident-live" : ""
      } ${incident.status === "monitoring" ? "incident-monitoring" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-[var(--text-muted)] sm:text-[11px]">
              {incident.id}
            </span>
            <span
              className={`rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-wide sm:text-[10px] ${
                severityStyles[incident.severity]
              }`}
            >
              {incident.severity}
            </span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-[var(--text-primary)] line-clamp-2 sm:line-clamp-none">
            {incident.title}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-muted)] sm:text-[12px]">
            {incident.assignee} · {incident.time}
          </p>
        </div>
        <StatusBadge status={incident.status} />
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={isAnalyzing}
        aria-busy={isAnalyzing}
        aria-label={
          isAnalyzing
            ? `Analyzing incident ${incident.id}`
            : `Analyze incident ${incident.id}`
        }
        className="analyze-incident-btn mt-3 w-full sm:mt-3.5"
      >
        {isAnalyzing ? (
          <>
            <span className="analysis-spinner inline-block h-3 w-3 rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
            Analyzing…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M8 1.5a4 4 0 0 1 3.87 5.02M8 14.5V8M5 11l3-3 3 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Analyze Incident
          </>
        )}
      </button>
    </li>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    investigating: "text-[var(--warning)]",
    resolved: "text-[var(--success)]",
    monitoring: "text-[var(--accent)]",
  };
  return (
    <span className={`shrink-0 text-[10px] capitalize sm:text-[11px] ${styles[status] ?? ""}`}>
      {status}
    </span>
  );
}
