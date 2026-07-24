"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const METRICS = [
  {
    value: "$41.8M/hr",
    label: "Volume Monitored",
    tooltip: "Live transaction volume — continuously ingested from Stripe, Adyen, SWIFT & FedNow.",
  },
  {
    value: "94.8%",
    label: "Mitigation Rate",
    tooltip: "Percentage of detected anomalies autonomously mitigated without human intervention.",
  },
  {
    value: "14ms",
    label: "Detection Latency",
    tooltip: "End-to-end time from transaction ingestion to anomaly flag — 6-hop path analysis included.",
  },
];

function MetricChip({ metric, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      key={metric.label}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <motion.button
        className="probe-target flex items-center gap-2.5 bg-surface/80 backdrop-blur-sm border border-surface-border rounded-full px-4 py-2 shadow-sm hover:border-accent/30 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18 }}
        aria-label={`${metric.label}: ${metric.value}. ${metric.tooltip}`}
        aria-describedby={`metric-tooltip-${index}`}
        tabIndex={0}
      >
        <span className="text-sm font-bold font-mono text-accent">{metric.value}</span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted/70 font-medium">{metric.label}</span>
      </motion.button>

      {/* Floating tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            id={`metric-tooltip-${index}`}
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-52 text-center px-3 py-2 rounded-xl bg-foreground/95 text-background text-[11px] leading-snug shadow-xl pointer-events-none z-20"
          >
            {metric.tooltip}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-foreground/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const metricsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section ref={ref} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Radial vignette so text stays readable against particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_100%)] pointer-events-none z-[1]" />

      {/* Hero copy */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 text-center px-6 select-none max-w-4xl mx-auto"
      >
        {/* Animated eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="flex items-center gap-2 bg-accent/8 border border-accent/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Intelligence Workspace
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.02] mb-6">
            Raw Data.
            <br />
            <span className="relative inline-block">
              <span className="text-accent drop-shadow-[0_0_40px_var(--accent-glow)]">
                Structured&nbsp;Intelligence.
              </span>
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-text-muted max-w-lg mx-auto leading-relaxed"
        >
          From raw data to structured intelligence, surfacing actionable insights
          that drive AI automations — in milliseconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap gap-3 justify-center"
        >
          <a
            href="#insight-flow"
            aria-label="Explore the intelligence flow — scroll to How it Works section"
            className="probe-target group relative overflow-hidden px-6 py-3 rounded-full bg-accent text-white text-sm font-semibold shadow-[0_0_28px_var(--accent-glow)] hover:shadow-[0_0_44px_var(--accent-glow-strong)] transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore the Flow
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </a>
          <a
            href="#dashboard"
            aria-label="View the intelligence dashboard — scroll to Dashboard section"
            className="probe-target group px-6 py-3 rounded-full bg-transparent border border-surface-border text-foreground/70 text-sm font-medium hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-2">
              View Dashboard
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">↓</span>
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Metric chips row — now interactive */}
      <motion.div
        style={{ opacity: metricsOpacity }}
        role="region"
        aria-label="Key performance metrics"
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-wrap gap-3 justify-center px-8"
      >
        {METRICS.map((m, i) => (
          <MetricChip key={m.label} metric={m} index={i} />
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-text-muted/40 font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-accent/50 to-transparent"
        />
      </motion.div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-[2]" />
    </section>
  );
}

