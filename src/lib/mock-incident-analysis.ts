import type { Incident, IncidentAnalysis } from "@/types/incident";

export type IncidentCategory =
  | "latency"
  | "database"
  | "traffic"
  | "certificate"
  | "cache"
  | "api"
  | "generic";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length]!;
}

export function classifyIncident(incident: Incident): IncidentCategory {
  const text = `${incident.title} ${incident.id}`.toLowerCase();

  if (
    text.includes("certificate") ||
    text.includes("cert ") ||
    text.includes("tls") ||
    text.includes("renewal") ||
    text.includes("mtls")
  ) {
    return "certificate";
  }
  if (
    text.includes("cache") ||
    text.includes("eviction") ||
    text.includes("memcached") ||
    text.includes("hit ratio")
  ) {
    return "cache";
  }
  if (
    text.includes("database") ||
    text.includes("connection pool") ||
    text.includes("postgres") ||
    text.includes("pgbouncer") ||
    text.includes("replica lag")
  ) {
    return "database";
  }
  if (
    text.includes("traffic") ||
    text.includes("spike") ||
    text.includes("apac") ||
    text.includes("cdn") ||
    text.includes("edge pop") ||
    text.includes("geodns")
  ) {
    return "traffic";
  }
  if (
    text.includes("api-gateway") ||
    text.includes("api gateway") ||
    text.includes("5xx") ||
    text.includes("502") ||
    text.includes("503") ||
    text.includes("rate limit") ||
    text.includes("/v1/") ||
    text.includes("/v2/")
  ) {
    return "api";
  }
  if (
    text.includes("latency") ||
    text.includes("inference") ||
    text.includes("slow") ||
    text.includes("timeout") ||
    text.includes("p99") ||
    text.includes("tail latency")
  ) {
    return "latency";
  }
  return "generic";
}

function severityLevel(
  incident: Incident,
  category: IncidentCategory,
  seed: number
): string {
  const escalations: Record<Incident["severity"], string[]> = {
    critical: ["P1 — Critical", "P1 — Critical", "P2 — High"],
    warning: ["P2 — High", "P3 — Medium", "P2 — High"],
    info: ["P4 — Low", "P3 — Medium", "P4 — Low"],
  };

  if (
    (category === "database" || category === "api") &&
    incident.status !== "resolved"
  ) {
    return pick(["P1 — Critical", "P2 — High"], seed);
  }

  if (category === "certificate" && incident.severity === "info") {
    return pick(["P4 — Low", "P3 — Medium"], seed);
  }

  return pick(escalations[incident.severity], seed);
}

type AnalysisTemplate = {
  rootCauses: string[];
  actions: string[];
  infrastructure: string[][];
  resolutionTimes: string[];
};

const ANALYSIS_TEMPLATES: Record<IncidentCategory, AnalysisTemplate> = {
  latency: {
    rootCauses: [
      "p99 latency on ml-inference breached the 120ms SLO after GPU batch queue depth exceeded sustainable throughput. Autoscaling lagged ~4 minutes behind a 3.2× request surge correlated with model revision v4.8.3 canary promotion.",
      "Cold-start penalty on two inference pods post node-drain elevated tail latency. Feature-store cache miss rate hit 18%, amplifying synchronous calls through api-gateway and auth-service validation paths.",
      "Upstream dependency slowdown propagated to inference tier: auth-service token introspection p95 rose to 84ms, compounding end-to-end request time despite healthy GPU utilization metrics.",
    ],
    actions: [
      "1. Scale ml-inference HPA min replicas to 12; cap batch size at 64.\n2. Roll back canary to artifact build 4.8.2 (last known-good).\n3. Enable request coalescing and warm standby pools.\n4. Page ML platform if p99 >100ms for 10 consecutive minutes.",
      "1. Drain affected GPU nodes; reschedule with priority class inference-critical.\n2. Pre-warm feature cache from snapshot (us-east-1).\n3. Route 15% traffic to secondary inference cluster.\n4. Post ETA update to #incidents-war-room within 15 minutes.",
      "1. Inspect auth-service latency dashboards; enable short-lived token cache if safe.\n2. Trace sample 500 requests/min across gateway → inference path.\n3. Execute runbook RB-ML-014 (inference saturation).\n4. Schedule review if customer SLO burn exceeds 5 minutes.",
    ],
    infrastructure: [
      ["ml-inference", "gpu-node-pool", "api-gateway", "feature-store"],
      ["ml-inference", "auth-service", "load-balancer", "prometheus"],
      ["ml-inference", "canary-pool", "artifact-registry", "tracing-collector"],
    ],
    resolutionTimes: [
      "25–40 minutes",
      "35–55 minutes",
      "45–70 minutes",
    ],
  },
  database: {
    rootCauses: [
      "Connection pool exhaustion on postgres-primary: active sessions peaked at 98% of max_connections after a long-running analytics query held row locks. auth-service and data-pipeline writes failed with FATAL: too many connections.",
      "Read replica lag exceeded 45s on replica-2, delaying cache-cluster invalidation events. Missing composite index on orders(status, updated_at) increased lock wait time during peak traffic.",
      "PgBouncer wait queue sustained above critical threshold for 12 minutes. Idle-in-transaction sessions from job nightly-reconcile-v3 blocked healthy connection recycling.",
    ],
    actions: [
      "1. Terminate offending sessions per RB-DB-007 (session IDs in runbook).\n2. Fail over read traffic to replica-2; raise pool limit temporarily.\n3. Apply 30s query guardrail on analytics role.\n4. Confirm replication lag <5s before resolving.",
      "1. Deploy emergency index via approved change CHG-DB-991.\n2. Scale PgBouncer 2× in affected AZ.\n3. Pause non-critical ETL on data-pipeline for 20 minutes.\n4. Monitor checkout SLO error budget dashboard.",
      "1. Kill idle-in-transaction sessions >60s.\n2. Disable scheduler job nightly-reconcile-v3.\n3. Run connection health check on all dependents.\n4. Notify stakeholders with blast-radius summary.",
    ],
    infrastructure: [
      ["postgres-primary", "pgbouncer", "auth-service", "data-pipeline"],
      ["postgres-replica-2", "cache-cluster", "checkout-api", "migration-runner"],
      ["postgres-primary", "analytics-connector", "secrets-manager"],
    ],
    resolutionTimes: [
      "40–75 minutes",
      "55–90 minutes",
      "60–120 minutes",
    ],
  },
  traffic: {
    rootCauses: [
      "Organic APAC traffic surge (+240% vs baseline) aligned with regional campaign launch. CDN hit ratio fell to 62%, increasing origin load on api-gateway and data-pipeline ingestion by 3.1×.",
      "GeoDNS imbalance routed excess requests to ap-southeast-1 during us-west-2 maintenance. Transient 503 responses on non-idempotent checkout endpoints lasted ~3 minutes before steering normalized.",
      "Legitimate burst classified by anomaly detection (no WAF block). Edge autoscaler added 8 nodes; origin p95 stabilized within 6 minutes but error budget consumed 12% of weekly allocation.",
    ],
    actions: [
      "1. Enable campaign traffic-shaping on CDN (origin cap 85%).\n2. Pre-warm top 50 cache paths.\n3. Scale api-gateway + data-pipeline in ap-southeast-1.\n4. Downgrade when p95 <200ms for 30 minutes.",
      "1. Execute RB-NET-003 GeoDNS rebalance.\n2. Replay failed checkout requests from DLQ.\n3. Confirm us-west-2 maintenance complete.\n4. Customer comms only if SLA touch confirmed.",
      "1. Maintain elevated edge replica count through campaign window.\n2. Share forecast with capacity planning.\n3. Keep partner IP allowlist in monitor-only.\n4. Close when anomaly score <0.4 for 20 minutes.",
    ],
    infrastructure: [
      ["apac-edge-pop", "cdn-tier-1", "api-gateway", "data-pipeline"],
      ["geo-dns", "ap-southeast-1", "checkout-api", "load-balancer"],
      ["waf", "autoscaler-edge", "api-gateway", "metrics-aggregator"],
    ],
    resolutionTimes: [
      "30–50 minutes",
      "15–25 minutes",
      "45–90 minutes",
    ],
  },
  certificate: {
    rootCauses: [
      "Automated TLS certificate renewal completed across edge POPs. Brief handshake latency during propagation window; auth-service audit logs show zero authentication failures.",
      "Internal mTLS rotation on api-gateway triggered controlled rolling restarts. Control plane validated full chain; external synthetics report 100% TLS 1.3 success post-rotation.",
      "Certificate Transparency log submission delayed 4 minutes due to upstream CA rate limiting. Informational alert only — no customer-facing authentication or availability impact detected.",
    ],
    actions: [
      "1. Verify VALID status on all edge nodes in cert-manager.\n2. Archive renewal audit trail to compliance bucket.\n3. 30-minute soak, then resolve.\n4. Schedule next proactive review in 60 days.",
      "1. Confirm api-gateway readiness in all zones.\n2. Run external TLS smoke tests (EU + US).\n3. Update change calendar with rotation timestamp.\n4. No escalation required if synthetics green.",
      "1. Monitor CT log ingestion until green.\n2. Security ops awareness notification only.\n3. Add note to weekly compliance digest.\n4. No customer communication needed.",
    ],
    infrastructure: [
      ["edge-pop-global", "cert-manager", "trust-store"],
      ["api-gateway", "internal-ca", "mesh-control-plane"],
      ["compliance-monitor", "certificate-authority", "audit-log-stream"],
    ],
    resolutionTimes: [
      "Complete — 20 min verification",
      "Complete — 15 min verification",
      "Complete — no action required",
    ],
  },
  cache: {
    rootCauses: [
      "Redis cache-cluster memory usage exceeded 92%, triggering aggressive eviction. Hit ratio dropped from 94% to 71%, pushing read load to postgres-replica-2 and elevating api-gateway latency on cache-aside paths.",
      "Hot-key concentration on session:{user_id} shards caused single-node CPU saturation. Cross-slot pipeline failures returned MISS storms to origin services for 8 minutes.",
      "TTL misconfiguration on feature-flag keys expired 40k entries simultaneously. Thundering herd on auth-service and ml-inference increased origin QPS by 2.8× before gradual recovery.",
    ],
    actions: [
      "1. Scale cache-cluster shard count +2 in affected region.\n2. Enable volatile-lru policy tuning per RB-CACHE-002.\n3. Temporarily raise api-gateway timeout budget 150ms → 220ms.\n4. Resolve when hit ratio >88% for 15 minutes.",
      "1. Rebalance hot keys via hash-tag migration script.\n2. Add read replicas to saturated shard nodes.\n3. Enable client-side local cache for session tokens (5s TTL).\n4. Post-mortem if p99 gateway latency exceeded 300ms.",
      "1. Roll back feature-flag TTL change CHG-CFG-441.\n2. Stagger key refresh with jittered backoff.\n3. Pre-warm critical keys from warm-up job.\n4. Monitor eviction rate <500/sec before closing.",
    ],
    infrastructure: [
      ["cache-cluster", "redis-shard-3", "api-gateway", "postgres-replica-2"],
      ["cache-cluster", "auth-service", "session-store", "hot-key-shard"],
      ["cache-cluster", "ml-inference", "feature-flags", "config-service"],
    ],
    resolutionTimes: [
      "20–35 minutes",
      "30–45 minutes",
      "25–40 minutes",
    ],
  },
  api: {
    rootCauses: [
      "api-gateway 5xx rate spiked to 4.2% on /v2/orders after upstream data-pipeline consumer lag exceeded 120s. Circuit breaker half-open flapping caused retry amplification across mobile clients.",
      "Rate-limit misconfiguration on partner integration key PROD-PARTNER-12 returned 429 bursts misclassified as 503 by edge aggregator. Legitimate traffic throttled for ~7 minutes.",
      "JWT validation middleware regression in api-gateway v2.14.1 increased per-request CPU 3×. Autoscaler added pods but readiness probes failed under load, prolonging elevated error rates.",
    ],
    actions: [
      "1. Roll back api-gateway to v2.14.0 immediately.\n2. Drain data-pipeline lag — scale consumers +4.\n3. Set circuit breaker to closed after error rate <0.5% for 5 min.\n4. Replay idempotent failures from DLQ.",
      "1. Restore prior rate-limit tier for PROD-PARTNER-12.\n2. Purge edge error cache.\n3. Notify partner success with incident window.\n4. Add integration test for limit boundaries.",
      "1. Roll back gateway deployment via standard pipeline.\n2. Validate CPU/request on canary before full promotion.\n3. Run synthetic suite on /v2/orders and /v2/auth.\n4. Document in weekly reliability review.",
    ],
    infrastructure: [
      ["api-gateway", "data-pipeline", "checkout-api", "circuit-breaker"],
      ["api-gateway", "waf", "partner-integrations", "rate-limiter"],
      ["api-gateway", "auth-service", "k8s-ingress", "mobile-clients"],
    ],
    resolutionTimes: [
      "15–30 minutes",
      "10–20 minutes",
      "20–35 minutes",
    ],
  },
  generic: {
    rootCauses: [
      "Correlated alerts across observability stack indicate upstream dependency degradation. Failure domain not yet isolated — moderate signal scatter across multiple service boundaries.",
      "Intermittent RPC errors between platform services after mesh virtual route update. Retry storm pattern visible in distributed traces with 2.1× baseline attempt rate.",
      "Non-critical worker pool health check flapping. Customer-facing SLOs remain green; impact limited to background job latency and internal dashboards.",
    ],
    actions: [
      "1. Expand OpsMind dependency graph blast-radius analysis.\n2. Align deploy timeline with error inflection.\n3. Engage owner of top suspect service.\n4. Escalate to P2 if error rate >0.5% for 15 minutes.",
      "1. Roll back mesh config CHG-4821.\n2. Enable circuit breaker on affected virtual service.\n3. Validate golden signals on api-gateway.\n4. Timeline update every 20 minutes.",
      "1. Stagger-restart worker pool.\n2. Scale queue processors manually.\n3. Monitor internal SLA 1 hour.\n4. Resolve if no external impact.",
    ],
    infrastructure: [
      ["observability-stack", "api-gateway", "service-mesh"],
      ["internal-mesh", "auth-service", "worker-pool"],
      ["background-workers", "queue-processor", "metrics-aggregator"],
    ],
    resolutionTimes: [
      "45–90 minutes",
      "30–60 minutes",
      "20–40 minutes",
    ],
  },
};

function computeConfidence(
  incident: Incident,
  category: IncidentCategory,
  seed: number
): number {
  const baseByCategory: Record<IncidentCategory, number> = {
    latency: 87,
    database: 92,
    traffic: 85,
    certificate: 95,
    cache: 89,
    api: 90,
    generic: 72,
  };

  const statusModifier: Record<Incident["status"], number> = {
    resolved: 5,
    monitoring: -2,
    investigating: -5,
  };

  const severityModifier: Record<Incident["severity"], number> = {
    critical: 2,
    warning: 0,
    info: -6,
  };

  const jitter = (seed % 7) - 3;
  const raw =
    baseByCategory[category] +
    statusModifier[incident.status] +
    severityModifier[incident.severity] +
    jitter;

  return Math.min(97, Math.max(65, raw));
}

function estimatedResolutionTime(
  incident: Incident,
  category: IncidentCategory,
  seed: number
): string {
  const template = ANALYSIS_TEMPLATES[category];

  if (incident.status === "resolved") {
    return pick(
      [
        "Resolved — post-verify soak 15 min",
        "Resolved — no further action",
        "Closed — monitoring complete",
      ],
      seed
    );
  }

  if (incident.status === "monitoring") {
    const base = pick(template.resolutionTimes, seed);
    return `Monitoring — est. ${base} if stable`;
  }

  return pick(template.resolutionTimes, seed);
}

export function generateMockAnalysis(incident: Incident): IncidentAnalysis {
  const category = classifyIncident(incident);
  const seed = hashString(`${incident.id}:${incident.title}:${incident.status}`);
  const template = ANALYSIS_TEMPLATES[category];

  return {
    severityLevel: severityLevel(incident, category, seed),
    probableRootCause: pick(template.rootCauses, seed),
    recommendedAction: pick(template.actions, seed + 1),
    affectedInfrastructure: pick(template.infrastructure, seed + 2),
    confidenceScore: computeConfidence(incident, category, seed),
    estimatedResolutionTime: estimatedResolutionTime(incident, category, seed + 3),
    incidentCategory: category,
  };
}

/** Simulates network + model latency for a realistic UX */
export function mockAnalysisDelayMs(incident: Incident): number {
  const seed = hashString(incident.id);
  return 1100 + (seed % 900);
}

export const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  latency: "Latency",
  database: "Database",
  traffic: "Traffic",
  certificate: "Certificate",
  cache: "Cache",
  api: "API",
  generic: "Platform",
};
