export type ServiceStatus = "healthy" | "degraded" | "critical";

export type LiveService = {
  name: string;
  status: ServiceStatus;
  latencyMs: number;
  load: number;
};

export const INITIAL_SERVICES: LiveService[] = [
  { name: "api-gateway", status: "healthy", latencyMs: 12, load: 34 },
  { name: "auth-service", status: "healthy", latencyMs: 8, load: 22 },
  { name: "ml-inference", status: "degraded", latencyMs: 142, load: 78 },
  { name: "data-pipeline", status: "healthy", latencyMs: 45, load: 56 },
  { name: "cache-cluster", status: "healthy", latencyMs: 2, load: 41 },
];

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function jitter(value: number, delta: number, min: number, max: number) {
  const change = (Math.random() - 0.5) * 2 * delta;
  return clamp(Math.round(value + change), min, max);
}

export function shiftSeries(series: number[], nextValue?: number): number[] {
  const last = series[series.length - 1] ?? 50;
  const next = nextValue ?? jitter(last, 8, 15, 98);
  return [...series.slice(1), next];
}

export function tickServices(services: LiveService[]): LiveService[] {
  return services.map((svc) => {
    const isMl = svc.name === "ml-inference";
    const latencyMs = isMl
      ? jitter(svc.latencyMs, 12, 95, 180)
      : jitter(svc.latencyMs, svc.latencyMs < 20 ? 2 : 6, 1, svc.latencyMs < 20 ? 25 : 120);

    const load = jitter(svc.load, 5, 8, 95);

    let status = svc.status;
    if (isMl) {
      status = latencyMs > 155 ? "degraded" : latencyMs > 120 ? "degraded" : "healthy";
      if (Math.random() < 0.08) status = "degraded";
    } else if (Math.random() < 0.04) {
      status = load > 75 ? "degraded" : "healthy";
    } else if (Math.random() < 0.01) {
      status = "critical";
    } else if (status === "critical" && Math.random() < 0.35) {
      status = "degraded";
    } else if (status === "degraded" && load < 60 && Math.random() < 0.25) {
      status = "healthy";
    }

    return { ...svc, latencyMs, load, status };
  });
}

export function formatLatency(ms: number) {
  return `${ms}ms`;
}

export function operationalCount(services: LiveService[]) {
  const ok = services.filter((s) => s.status !== "critical").length;
  return `${ok} / ${services.length} operational`;
}
