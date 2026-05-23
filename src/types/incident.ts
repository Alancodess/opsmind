export type IncidentSeverity = "critical" | "warning" | "info";

export type IncidentStatus =
  | "investigating"
  | "resolved"
  | "monitoring";

export type Incident = {
  id: string;
  title: string;
  severity: IncidentSeverity;
  time: string;
  status: IncidentStatus;
  assignee: string;
};

export type IncidentAnalysis = {
  severityLevel: string;
  probableRootCause: string;
  recommendedAction: string;
  affectedInfrastructure: string[];
  confidenceScore: number;
  estimatedResolutionTime: string;
  incidentCategory?: string;
};

export type AnalyzeIncidentRequest = {
  incident: Incident;
};

export type AnalyzeIncidentResponse = {
  analysis: IncidentAnalysis;
  incidentId: string;
  analyzedAt: string;
  source?: string;
};

export type AnalyzeIncidentError = {
  error: string;
};
