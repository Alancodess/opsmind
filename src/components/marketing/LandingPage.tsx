import { AmbientBackground } from "@/components/opsmind/AmbientBackground";
import { AnalyticsSection } from "@/components/opsmind/AnalyticsSection";
import { CTASection } from "@/components/opsmind/CTASection";
import { Footer } from "@/components/opsmind/Footer";
import { Hero } from "@/components/opsmind/Hero";
import { IncidentPanel } from "@/components/opsmind/IncidentPanel";
import { MetricsStrip } from "@/components/opsmind/MetricsStrip";
import { MouseLight } from "@/components/opsmind/MouseLight";
import { Navigation } from "@/components/opsmind/Navigation";
import { OperationsDashboard } from "@/components/opsmind/OperationsDashboard";
import { PageTransition } from "@/components/opsmind/PageTransition";
import { ProjectShowcase } from "@/components/opsmind/ProjectShowcase";

export function LandingPage() {
  return (
    <PageTransition>
      <AmbientBackground />
      <MouseLight />
      <Navigation />
      <main className="relative z-[2] overflow-x-hidden">
        <Hero />
        <MetricsStrip />
        <OperationsDashboard />
        <IncidentPanel />
        <AnalyticsSection />
        <ProjectShowcase />
        <CTASection />
      </main>
      <Footer />
    </PageTransition>
  );
}
