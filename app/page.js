"use client";

import dynamic from "next/dynamic";
import useScrollProgress from "@/components/scene/useScrollProgress";
import CursorProbe from "@/components/ui/CursorProbe";
import SceneHUD from "@/components/ui/SceneHUD";
import Navbar from "@/components/ui/Navbar";

import Hero from "@/components/hero/Hero";
import InsightFlow from "@/components/insight-flow/InsightFlow";
import DashboardPreview from "@/components/dashboard/DashboardPreview";
import SignatureInteraction from "@/components/signature/SignatureInteraction";
import TransformationSection from "@/components/wow/TransformationSection";

const PersistentScene = dynamic(() => import("@/components/scene/PersistentScene"), { ssr: false });



// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Home() {
  useScrollProgress();

  return (
    <>
      <CursorProbe />
      <Navbar />

      {/* Fixed fullscreen 3D canvas */}
      <div className="fixed inset-0 z-0">
        <PersistentScene />
      </div>

      {/* Scene HUD Overlays */}
      <SceneHUD />

      {/* DOM Content Sections */}
      <main id="main-content" className="relative z-10 w-full flex flex-col">
        <Hero />
        <InsightFlow />
        {/* Scroll buffer â€” keeps next section below the fold until InsightFlow finishes */}
        <div id="insight-flow-buffer" className="h-[45vh] pointer-events-none" aria-hidden />
        <SignatureInteraction />
        {/* Scroll buffer â€” keeps Dashboard below the fold until Signature finishes */}
        <div id="signature-buffer" className="h-[100vh] pointer-events-none" aria-hidden />
        <DashboardPreview />
        {/* Scroll buffer — keeps Transformation below the fold until Dashboard finishes */}
        <div id="dashboard-buffer" className="h-[45vh] pointer-events-none" aria-hidden />
        <TransformationSection />
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-background/95 backdrop-blur-xl border-t border-surface-border py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold tracking-tight">
              Xai<span className="text-accent">.</span>
            </span>
            <p className="text-text-muted text-sm mt-2 max-w-xs leading-relaxed">
              Raw data â†’ structured intelligence â†’ actionable insight â†’ AI Automations.
            </p>
            <p className="text-text-muted/40 text-xs font-mono mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              System operational Â· Zero incidents
            </p>
          </div>

          {/* Tech stack */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted/50 font-medium mb-1">Built With</p>
            {[
              "React Three Fiber",
              "Framer Motion",
              "GSAP + ScrollTrigger",
              "Next.js 16",
            ].map((tech) => (
              <span key={tech} className="text-sm text-text-muted/70 font-mono hover:text-accent transition-colors duration-200">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="section-divider mt-8 mb-6" />
        <p className="text-center text-xs text-text-muted/30 font-mono select-none">
          Â© 2026 Xai Intelligence Workspace Â· Prototype
        </p>
      </footer>
    </>
  );
}

