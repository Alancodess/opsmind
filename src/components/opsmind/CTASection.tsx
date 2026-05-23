"use client";

import { Button } from "./Button";
import { ScrollReveal } from "./ScrollReveal";

export function CTASection() {
  return (
    <section className="section-padding px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--bg-card)] px-5 py-12 text-center sm:rounded-3xl sm:px-10 sm:py-16 lg:px-16">
            <div
              className="pointer-events-none absolute inset-0 animate-glow-drift opacity-80"
              style={{
                background:
                  "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(139,156,246,0.1), transparent 60%)",
              }}
            />
            <h2 className="relative heading-section text-gradient">
              Ready to elevate your operations?
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm text-[var(--text-secondary)] sm:mt-4 sm:text-base">
              Join teams shipping with confidence. OpsMind brings enterprise-grade
              AI operations to your stack.
            </p>
            <div className="relative mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
              <Button href="/sign-in" variant="primary" className="w-full justify-center sm:w-auto">
                Start exploring
              </Button>
              <Button
                href="mailto:hello@opsmind.dev"
                variant="secondary"
                className="w-full justify-center sm:w-auto"
              >
                Schedule a demo
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
