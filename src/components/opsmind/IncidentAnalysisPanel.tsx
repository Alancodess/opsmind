"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CATEGORY_LABELS } from "@/lib/mock-incident-analysis";
import type {
  Incident,
  IncidentAnalysis,
  AnalyzeIncidentResponse,
  AnalyzeIncidentError,
} from "@/types/incident";

type IncidentAnalysisPanelProps = {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
  onLoadingChange?: (loading: boolean) => void;
};

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panel = {
  hidden: { x: "100%", opacity: 0.6 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, damping: 32, stiffness: 340 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const content = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function IncidentAnalysisPanel({
  incident,
  open,
  onClose,
  onLoadingChange,
}: IncidentAnalysisPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<IncidentAnalysis | null>(null);
  const [analysisSource, setAnalysisSource] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const runAnalysis = useCallback(async (signal: AbortSignal) => {
    if (!incident) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze-incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incident }),
        signal,
      });

      const data = (await res.json()) as
        | AnalyzeIncidentResponse
        | AnalyzeIncidentError;

      if (!res.ok) {
        throw new Error(
          "error" in data ? data.error : "Unable to complete incident analysis."
        );
      }

      if ("analysis" in data) {
        setAnalysis(data.analysis);
        setAnalysisSource(data.source || "");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(
        err instanceof Error
          ? err.message
          : "Analysis request failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [incident]);

  useEffect(() => {
    if (!open || !incident) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    runAnalysis(controller.signal);

    return () => controller.abort();
  }, [open, incident, runAnalysis]);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    if (!open) onLoadingChange?.(false);
  }, [open, onLoadingChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handleRetry = () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    runAnalysis(controller.signal);
  };

  return (
    <AnimatePresence>
      {open && incident && (
        <>
          <motion.button
            type="button"
            aria-label="Close analysis panel"
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="analysis-title"
            className="analysis-panel fixed inset-y-0 right-0 z-[70] flex w-full max-w-full flex-col border-l border-white/[0.08] bg-[var(--bg-elevated)] shadow-2xl sm:max-w-md lg:max-w-lg"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <header className="shrink-0 border-b border-white/[0.06] px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-[var(--accent)]">
                    AI Incident Analysis
                  </p>
                  <h2
                    id="analysis-title"
                    className="mt-1 text-base font-semibold tracking-tight sm:text-lg"
                  >
                    {incident.id}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {incident.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[var(--text-muted)] transition-colors hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-[var(--text-primary)]"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M3 3l8 8M11 3L3 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <MetaPill label="Status" value={incident.status} />
                <MetaPill label="Signal" value={incident.severity} />
                <MetaPill label="Owner" value={incident.assignee} />
                {analysis?.incidentCategory && (
                  <span className="inline-flex items-center rounded-md border border-[var(--accent)]/25 bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-medium text-[var(--accent)] sm:text-[11px]">
                    {CATEGORY_LABELS[
                      analysis.incidentCategory as keyof typeof CATEGORY_LABELS
                    ] ?? analysis.incidentCategory}
                  </span>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
              {loading && <AnalysisLoading />}

              {error && !loading && (
                <AnalysisError message={error} onRetry={handleRetry} />
              )}

              {analysis && !loading && !error && (
                <AnalysisResults analysis={analysis} />
              )}
            </div>

            <footer className="shrink-0 border-t border-white/[0.06] px-5 py-3 sm:px-6">
              <p className="mb-1 text-center text-[10px] text-[var(--text-muted)] sm:text-[11px]">
                {analysisSource}
              </p>

              <p className="text-center text-[10px] text-[var(--text-muted)] sm:text-[11px]">
                OpsMind AI analysis · Operational guidance only
              </p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[10px] sm:text-[11px]">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="capitalize font-medium text-[var(--text-secondary)]">
        {value}
      </span>
    </span>
  );
}

function AnalysisLoading() {
  return (
    <div className="space-y-5" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3">
        <motion.span
          className="analysis-spinner h-4 w-4 rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-sm text-[var(--text-secondary)]">
          Correlating signals and generating assessment…
        </p>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
        >
          <div className="h-2.5 w-24 rounded bg-white/[0.06]" />
          <div className="mt-3 h-3 w-full rounded bg-white/[0.04]" />
          <div className="mt-2 h-3 w-[85%] rounded bg-white/[0.04]" />
        </motion.div>
      ))}
    </div>
  );
}

function AnalysisError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/5 p-5"
    >
      <p className="text-sm font-medium text-[var(--danger)]">Analysis unavailable</p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{message}</p>
      <button type="button" onClick={onRetry} className="btn-secondary mt-4 !text-sm">
        Retry analysis
      </button>
    </motion.div>
  );
}

function AnalysisResults({ analysis }: { analysis: IncidentAnalysis }) {
  const severityTone = getSeverityTone(analysis.severityLevel);

  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div custom={0} variants={content}>
        <AnalysisBlock title="Confidence score">
          <ConfidenceMeter score={analysis.confidenceScore} />
        </AnalysisBlock>
      </motion.div>

      <motion.div custom={1} variants={content}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AnalysisBlock
            title="Severity assessment"
            accent={{ border: severityTone.border, glow: severityTone.glow }}
          >
            <p className={`text-lg font-semibold tracking-tight ${severityTone.text}`}>
              {analysis.severityLevel}
            </p>
          </AnalysisBlock>
          <AnalysisBlock title="Est. resolution time">
            <ResolutionEstimate time={analysis.estimatedResolutionTime} />
          </AnalysisBlock>
        </div>
      </motion.div>

      <motion.div custom={2} variants={content}>
        <AnalysisBlock title="Probable root cause">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {analysis.probableRootCause}
          </p>
        </AnalysisBlock>
      </motion.div>

      <motion.div custom={3} variants={content}>
        <AnalysisBlock title="Recommended action">
          <p className="text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">
            {analysis.recommendedAction}
          </p>
        </AnalysisBlock>
      </motion.div>

      <motion.div custom={4} variants={content}>
        <AnalysisBlock title="Affected infrastructure">
          <ul className="flex flex-wrap gap-2">
            {(
              Array.isArray(analysis.affectedInfrastructure)
                ? analysis.affectedInfrastructure
                : [analysis.affectedInfrastructure]
            ).map((item) => (
              <li
                key={item}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </AnalysisBlock>
      </motion.div>
    </motion.div>
  );
}

function ResolutionEstimate({ time }: { time?: string }) {
  const safeTime = time || "Pending";

  const isComplete =
    safeTime.toLowerCase().includes("complete") ||
    safeTime.toLowerCase().includes("resolved") ||
    safeTime.toLowerCase().includes("closed");

  return (
    <div>
      <p
        className={`text-lg font-semibold tracking-tight tabular-nums ${isComplete ? "text-[var(--success)]" : "text-[var(--text-primary)]"
          }`}
      >
        {safeTime}
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-[var(--text-muted)]">
        {isComplete
          ? "Incident lifecycle complete; verification window active."
          : "Forecast based on runbook complexity and current blast radius."}
      </p>
    </div>
  );
}

function ConfidenceMeter({ score }: { score: number }) {
  const tone =
    score >= 90
      ? "text-[var(--success)]"
      : score >= 80
        ? "text-[var(--accent)]"
        : "text-[var(--warning)]";

  const barColor =
    score >= 90
      ? "bg-[var(--success)]"
      : score >= 80
        ? "bg-[var(--accent)]"
        : "bg-[var(--warning)]";

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className={`text-2xl font-semibold tabular-nums tracking-tight ${tone}`}>
          {score}%
        </p>
        <p className="text-[11px] text-[var(--text-muted)]">OpsMind signal correlation</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="mt-2 text-[11px] text-[var(--text-muted)]">
        {score >= 90
          ? "High confidence — strong telemetry alignment across dependencies."
          : score >= 80
            ? "Moderate-high confidence — review recommended actions before execution."
            : "Moderate confidence — additional triage may be required."}
      </p>
    </div>
  );
}

function AnalysisBlock({
  title,
  children,
  accent,
}: {
  title: string;
  children: ReactNode;
  accent?: { border: string; glow: string };
}) {
  return (
    <div
      className={`rounded-xl border bg-[var(--bg-card)] p-4 sm:p-5 h-full ${accent ? accent.border : "border-white/[0.08]"
        }`}
      style={accent ? { boxShadow: accent.glow } : undefined}
    >
      <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--text-muted)]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function getSeverityTone(level?: string) {
  const lower = level?.toLowerCase?.() || "medium";

  if (lower.includes("p1") || lower.includes("critical")) {
    return {
      text: "text-[var(--danger)]",
      border: "border-[var(--danger)]/25",
      glow: "0 0 40px -16px rgba(248, 113, 113, 0.2)",
    };
  }

  if (
    lower.includes("p2") ||
    lower.includes("high") ||
    lower.includes("warning") ||
    lower.includes("medium")
  ) {
    return {
      text: "text-[var(--warning)]",
      border: "border-[var(--warning)]/25",
      glow: "0 0 40px -16px rgba(251, 191, 36, 0.15)",
    };
  }

  return {
    text: "text-[var(--accent)]",
    border: "border-[var(--accent)]/20",
    glow: "0 0 40px -16px rgba(139, 156, 246, 0.15)",
  };
}
