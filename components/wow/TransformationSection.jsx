"use client";

import { useRef, useState, useEffect, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { scrollState } from "@/lib/scrollState";


function AnimatedStat({ value, label }) {
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const [display, setDisplay] = useState(decimals ? "0.0" : "0");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.3,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref} className="text-center p-4 rounded-xl bg-surface/50 border border-surface-border">
      <p className="text-2xl font-bold font-mono text-accent mb-1 tabular-nums">
        {display}{suffix}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-text-muted leading-snug">{label}</p>
    </div>
  );
}

export default function TransformationSection() {
  const ref = useRef(null);
  const headerRef = useRef(null);

  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  // Scroll progress → scrollState.transformScanProgress
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Map the section's scroll range to 0–1 scan progress
  // Scan starts when section center enters viewport, completes at 60% through
  const scanProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  useEffect(() => {
    if (reducedMotion) {
      scrollState.transformScanProgress = 1;
      return;
    }
    const unsub = scanProgress.on("change", (v) => {
      scrollState.transformScanProgress = Math.max(0, Math.min(1, v));
    });
    return unsub;
  }, [scanProgress, reducedMotion]);

  return (
    <section
      ref={ref}
      className="relative min-h-[160vh] flex flex-col items-center justify-center px-8 pointer-events-none"
      aria-label="Before and after: raw transaction feed resolves into a traced fraud network"
    >
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 32 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center mb-12 max-w-2xl pointer-events-auto"
      >
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-text-muted mb-5 border-l-2 border-surface-border pl-3">
          Before / After
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-foreground mb-4">
          Individually normal.
          <br />
          <span className="text-accent">Connected, fraudulent.</span>
        </h2>
        <p className="text-text-muted text-base leading-relaxed max-w-md mx-auto">
          Each transaction passes basic checks. The fraud ring only becomes visible
          when you map the flow between accounts.
        </p>
      </motion.div>

      {/* Placeholder spacer — the 3D scene IS the visualization */}
      <div className="relative z-10 w-full max-w-5xl h-[320px] sm:h-[420px] pointer-events-auto" />
    </section>
  );
}
