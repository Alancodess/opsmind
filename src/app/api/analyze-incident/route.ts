import { NextResponse } from "next/server";
import {
  generateMockAnalysis,
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

    const groqApiKey = process.env.GROQ_API_KEY;

    // fallback if key missing
    if (!groqApiKey) {
      const fallback = generateMockAnalysis(incident);

      return NextResponse.json({
        analysis: fallback,
        incidentId: incident.id,
        analyzedAt: new Date().toISOString(),
        source: "Simulated Analysis",
      });
    }

    const prompt = `
You are an enterprise AI incident response system.

Analyze this operational incident:

Title: ${incident.title}
Severity: ${incident.severity}
Status: ${incident.status}
Assignee: ${incident.assignee}

Return ONLY valid JSON in this exact format:

{
  "severityLevel": "P1 — Critical",
  "confidenceScore": 92,
  "estimatedResolutionTime": "25 minutes",
  "probableRootCause": "string",
  "recommendedAction": "string",
  "affectedInfrastructure": ["service-a", "database-cluster"]
}
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are an elite enterprise incident analysis AI.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.4,
        }),
      }
    );

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content;
    console.log(content);

    let parsed;
    let source = "Live AI Analysis";

    try {
      const cleaned = content
        ?.replace(/```json/g, "")
        ?.replace(/```/g, "")
        ?.trim();

      parsed = JSON.parse(cleaned);
    } catch {
      parsed = generateMockAnalysis(incident);
      source = "Simulated Analysis";
    }

    return NextResponse.json({
      analysis: parsed,
      incidentId: incident.id,
      analyzedAt: new Date().toISOString(),
      source,
    });
  } catch (err) {
    console.error("[analyze-incident]", err);

    return NextResponse.json(
      {
        analysis: {
          severity: "Medium",
          probableRootCause:
            "Temporary AI processing disruption detected.",
          recommendedAction:
            "Retry analysis and inspect infrastructure telemetry.",
          affectedInfrastructure: "Core Services",
        },
      },
      { status: 200 }
    );
  }
}