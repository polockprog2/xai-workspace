"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollState } from "@/lib/scrollState";

// Camera mode metadata keyed by activeStage
const STAGE_META = [
  { stage: -1, camera: "OVERVIEW",      mode: "Particle Cloud",     color: "text-text-muted/60" },
  { stage:  0, camera: "INGEST VIEW",   mode: "Flow Lanes",         color: "text-accent" },
  { stage:  1, camera: "ANALYZE VIEW",  mode: "Hub Clusters",       color: "text-accent" },
  { stage:  2, camera: "INSIGHT VIEW",  mode: "Fraud Ring",         color: "text-accent" },
  { stage:  3, camera: "SIGNATURE",     mode: "Node Network",       color: "text-accent" },
  { stage:  4, camera: "DASHBOARD",     mode: "Receding Core",      color: "text-text-muted/60" },
];

function getMetaForStage(stage) {
  return STAGE_META.find((m) => m.stage === stage) ?? STAGE_META[0];
}

// ─── Camera Mode Badge (top-right) ────
function CameraModeBadge() {
  const [meta, setMeta] = useState(getMetaForStage(-1));
  const [pulse, setPulse] = useState(false);
  const prevStage = useRef(-1);

  useEffect(() => {
    let raf;
    const tick = () => {
      const stage = scrollState.activeStage;
      if (stage !== prevStage.current) {
        prevStage.current = stage;
        setMeta(getMetaForStage(stage));
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed top-20 right-6 z-30 flex flex-col items-end gap-1.5 pointer-events-none select-none"
      role="status"
      aria-label={`3D scene: ${meta.mode}`}
      aria-live="polite"
    >
      {/* Label row */}
      <AnimatePresence mode="wait">
        <motion.div
          key={meta.camera}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-text-muted/40">
            CAMERA
          </span>
          <span className={`text-[9px] font-mono uppercase tracking-[0.22em] font-semibold ${meta.color}`}>
            {meta.camera}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Mode chip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={meta.mode}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.88 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-1.5 bg-surface/70 backdrop-blur-sm border border-surface-border/60 rounded-full px-2.5 py-1"
        >
          <motion.span
            animate={pulse ? { scale: [1, 1.8, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
          />
          <span className="text-[9px] font-mono text-foreground/60 tracking-wider">
            {meta.mode}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Morph Progress Strip (bottom-left) ───
const PHASE_STRIPS = [
  { from: 0.00, to: 0.15, label: "Raw Data" },
  { from: 0.15, to: 0.35, label: "Ingest" },
  { from: 0.35, to: 0.55, label: "Analyze" },
  { from: 0.55, to: 0.72, label: "Insight" },
  { from: 0.72, to: 0.88, label: "Signature" },
  { from: 0.88, to: 1.00, label: "Dashboard" },
];

function MorphProgressStrip() {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState(PHASE_STRIPS[0].label);

  useEffect(() => {
    let raf;
    const tick = () => {
      const p = scrollState.progress;
      setProgress(p);
      const phase = PHASE_STRIPS.find((ph) => p >= ph.from && p < ph.to) ?? PHASE_STRIPS[PHASE_STRIPS.length - 1];
      setLabel(phase.label);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="fixed bottom-8 left-8 z-30 flex flex-col gap-2 pointer-events-none select-none"
      role="status"
      aria-label={`Scroll stage: ${label}`}
    >
      {/* Phase label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-text-muted/60 font-medium">
            {label}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Segmented progress bar */}
      <div className="flex gap-[3px]" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
        {PHASE_STRIPS.map((ph, i) => {
          const segProgress = Math.max(0, Math.min(1,
            (progress - ph.from) / (ph.to - ph.from)
          ));
          const isActive = progress >= ph.from && progress < ph.to;
          return (
            <div
              key={ph.label}
              className="relative w-6 h-[2px] rounded-full bg-surface-border overflow-hidden"
              title={ph.label}
            >
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${isActive ? "bg-accent" : segProgress >= 1 ? "bg-accent/50" : "bg-transparent"}`}
                style={{ width: `${segProgress * 100}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ────
export default function SceneHUD() {
  return (
    <>
      <CameraModeBadge />
      <MorphProgressStrip />
    </>
  );
}
