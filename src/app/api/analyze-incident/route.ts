import { NextResponse } from "next/server";
import {
  generateMockAnalysis,
  mockAnalysisDelayMs,
} from "@/lib/mock-incident-analysis";
import type { AnalyzeIncidentRequest, Incident } from "@/types/incident";

function isValidIncident(incident: unknown): incident is Incident {
  if (!incident || typeof incident !== "object") return false;
  const inc = incident as Record<string, unknown>;
  return (
    typeof inc.id === "string" &&
    typeof inc.title === "string" &&
    typeof inc.severity === "string" &&
    typeof inc.time === "string" &&
    typeof inc.status === "string" &&
    typeof inc.assignee === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeIncidentRequest;

    if (!body?.incident || !isValidIncident(body.incident)) {
      return NextResponse.json(
        {
          error:
            "Invalid incident payload. Required fields: id, title, severity, time, status, assignee.",
        },
        { status: 400 }
      );
    }

    const { incident } = body;

    await new Promise((resolve) =>
      setTimeout(resolve, mockAnalysisDelayMs(incident))
    );

    const analysis = generateMockAnalysis(incident);

    return NextResponse.json({
      analysis,
      incidentId: incident.id,
      analyzedAt: new Date().toISOString(),
      source: "opsmind-mock-ai",
    });
  } catch (err) {
    console.error("[analyze-incident]", err);
    const message =
      err instanceof Error ? err.message : "Failed to analyze incident.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
