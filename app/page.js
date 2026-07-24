"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { scrollState } from "@/lib/scrollState";
import useScrollProgress from "@/components/scene/useScrollProgress";
import CursorProbe from "@/components/ui/CursorProbe";
import Navbar from "@/components/ui/Navbar";

import Hero from "@/components/hero/Hero";
import InsightFlow from "@/components/insight-flow/InsightFlow";
import DashboardPreview from "@/components/dashboard/DashboardPreview";
import SignatureInteraction from "@/components/signature/SignatureInteraction";

const PersistentScene = dynamic(() => import("@/components/scene/PersistentScene"), { ssr: false });

// ─── Phase labels that appear in the bottom-left corner ─────────────────
const PHASES = [
  { from: 0.00, to: 0.15, label: "Raw Data" },
  { from: 0.15, to: 0.40, label: "Structured Intelligence" },
  { from: 0.40, to: 0.72, label: "Actionable Insight" },
  { from: 0.72, to: 0.85, label: "AI Automations" },
  { from: 0.85, to: 1.00, label: "Dashboard" },
];

function PhaseLabel() {
  const [label, setLabel] = useState(PHASES[0].label);

  useEffect(() => {
    let raf;
    const tick = () => {
      const p = scrollState.progress;
      const phase = PHASES.find((ph) => p >= ph.from && p < ph.to) ?? PHASES[PHASES.length - 1];
      setLabel(phase.label);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.35 }}
        className="fixed bottom-8 left-8 z-30 flex items-center gap-2.5 pointer-events-none"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.22em] text-text-muted/60 font-medium select-none">
          {label}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Scroll percentage HUD ───────────────────────────────────────────────
function ScrollHUD() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      setPct(Math.round(scrollState.progress * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-30 font-mono text-[10px] text-text-muted/35 tabular-nums pointer-events-none select-none">
      {String(pct).padStart(3, "0")}%
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────
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

      {/* Global Overlays */}
      <PhaseLabel />
      <ScrollHUD />

      {/* DOM Content Sections */}
      <main className="relative z-10 w-full flex flex-col">
        <Hero />
        <InsightFlow />
        {/* Scroll buffer — keeps next section below the fold until InsightFlow finishes */}
        <div id="insight-flow-buffer" className="h-[45vh] pointer-events-none" aria-hidden />
        <SignatureInteraction />
        {/* Scroll buffer — keeps Dashboard below the fold until Signature finishes */}
        <div id="signature-buffer" className="h-[100vh] pointer-events-none" aria-hidden />
        <DashboardPreview />
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
              Raw data → structured intelligence → actionable insight → AI Automations.
            </p>
            <p className="text-text-muted/40 text-xs font-mono mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              System operational · Zero incidents
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
          © 2026 Xai Intelligence Workspace · Prototype
        </p>
      </footer>
    </>
  );
}
