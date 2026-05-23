import type { Incident } from "@/types/incident";

export const INCIDENTS: Incident[] = [
  {
    id: "INC-2847",
    title: "Elevated latency on ml-inference",
    severity: "warning",
    time: "2m ago",
    status: "investigating",
    assignee: "AI Agent",
  },
  {
    id: "INC-2846",
    title: "Certificate renewal completed",
    severity: "info",
    time: "18m ago",
    status: "resolved",
    assignee: "System",
  },
  {
    id: "INC-2845",
    title: "Database connection pool saturation",
    severity: "critical",
    time: "1h ago",
    status: "resolved",
    assignee: "Sarah K.",
  },
  {
    id: "INC-2844",
    title: "Anomaly detected: traffic spike APAC",
    severity: "warning",
    time: "2h ago",
    status: "monitoring",
    assignee: "AI Agent",
  },
  {
    id: "INC-2843",
    title: "Cache cluster memory pressure — elevated evictions",
    severity: "warning",
    time: "3h ago",
    status: "investigating",
    assignee: "AI Agent",
  },
  {
    id: "INC-2842",
    title: "api-gateway elevated 5xx on /v2/orders",
    severity: "critical",
    time: "25m ago",
    status: "investigating",
    assignee: "Sarah K.",
  },
];
