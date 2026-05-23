"use client";

import { Button } from "./Button";
import { ScrollReveal } from "./ScrollReveal";
import { StaggerReveal } from "./StaggerReveal";

const projects = [
  {
    title: "Predictive Incident Engine",
    category: "ML / SRE",
    description:
      "Transformer-based anomaly detection reducing false positives by 73% across 12 microservices.",
    tags: ["Python", "Kubernetes", "Prometheus"],
    metric: "73% fewer alerts",
  },
  {
    title: "Unified Observability Mesh",
    category: "Platform",
    description:
      "OpenTelemetry pipeline aggregating 2M+ spans/sec with sub-100ms query latency.",
    tags: ["Go", "ClickHouse", "gRPC"],
    metric: "2M spans/sec",
  },
  {
    title: "Autonomous Runbook Orchestrator",
    category: "Automation",
    description:
      "LLM-guided remediation executing safe runbooks with human-in-the-loop approval gates.",
    tags: ["TypeScript", "Temporal", "OpenAI"],
    metric: "847 auto-resolved",
  },
];

export function ProjectShowcase() {
  return (
    <section id="work" className="section-padding border-t border-white/[0.06] px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="max-w-xl">
              <p className="section-label">Selected work</p>
              <h2 className="heading-section mt-3 sm:mt-4">
                Projects that define excellence
              </h2>
            </div>
            <Button href="mailto:hello@opsmind.dev" variant="ghost" icon className="self-start sm:self-auto">
              Get in touch
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Button>
          </div>
        </ScrollReveal>

        <StaggerReveal className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={100}>
          {projects.map((project) => (
            <article
              key={project.title}
              className="card-hover group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--bg-card)] sm:rounded-2xl"
            >
              <div className="relative h-32 overflow-hidden bg-[var(--bg-surface)] sm:h-40">
                <div
                  className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-80"
                  style={{
                    background: `
                      radial-gradient(ellipse at 30% 20%, rgba(139,156,246,0.2), transparent 50%),
                      linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-card) 100%)
                    `,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-1.5 p-4 opacity-40 transition-opacity duration-500 group-hover:opacity-60 sm:gap-2 sm:p-6">
                    {[...Array(9)].map((_, j) => (
                      <div
                        key={j}
                        className="h-6 w-6 rounded border border-white/[0.06] bg-white/[0.02] sm:h-8 sm:w-8"
                      />
                    ))}
                  </div>
                </div>
                <span className="absolute left-3 top-3 rounded-full border border-white/[0.08] bg-black/40 px-2.5 py-0.5 text-[10px] text-[var(--text-secondary)] backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:text-[11px]">
                  {project.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <p className="font-mono text-[10px] text-[var(--accent)] sm:text-[11px]">
                  {project.metric}
                </p>
                <h3 className="mt-2 text-base font-semibold tracking-tight transition-colors duration-300 group-hover:text-[var(--accent)] sm:text-lg">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)] sm:mt-3">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-[var(--text-muted)] sm:py-1 sm:text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
