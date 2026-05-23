import { MetricsStrip } from "@/components/opsmind/MetricsStrip";
import { OperationsDashboard } from "@/components/opsmind/OperationsDashboard";
import { IncidentPanel } from "@/components/opsmind/IncidentPanel";
import { AnalyticsSection } from "@/components/opsmind/AnalyticsSection";

export function DashboardView() {
  return (
    <div>
      <div className="border-b border-white/[0.06] bg-[var(--bg-elevated)]/40 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          Command center
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Live operational metrics across your workspace.
        </p>
      </div>
      <MetricsStrip />
      <OperationsDashboard />
      <IncidentPanel />
      <AnalyticsSection />
    </div>
  );
}
