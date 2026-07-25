"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { scrollState } from "@/lib/scrollState";

const THREAT_NODES = [
  { id: "CC-9082", label: "Destination Card", severity: "critical", color: "bg-accent" },
  { id: "WL-44", label: "Intermediate Wallet", severity: "high", color: "bg-amber-500" },
  { id: "MC-77", label: "Orphaned Merchant", severity: "critical", color: "bg-accent" },
  { id: "LN-22", label: "Velocity Terminal", severity: "high", color: "bg-amber-500" },
];

const STATS_PRE = [
  { value: "14ms", label: "Path analysis latency" },
  { value: "4", label: "Nodes identified" },
  { value: "98.4%", label: "Fraud confidence" },
];

const STATS_POST = [
  { value: "0", label: "Active threats" },
  { value: "4", label: "Nodes isolated" },
  { value: "100%", label: "Contained" },
];

export default function SignatureInteraction() {
  const ref = useRef(null);
  const [mitigated, setMitigated] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [ripple, setRipple] = useState(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Phase-based transforms driven by scroll position within the section
  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.12], [40, 0]);

  const scanLineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.3, 0.35], [0, 1, 1, 0]);

  const threatCardOpacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
  const threatCardY = useTransform(scrollYProgress, [0.12, 0.22], [24, 0]);

  const statsOpacity = useTransform(scrollYProgress, [0.28, 0.38], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.28, 0.38], [20, 0]);

  const buttonOpacity = useTransform(scrollYProgress, [0.42, 0.52], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.42, 0.52], [30, 0]);

  // Overall section scale/opacity for entrance and exit
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.88, 1], [0.94, 1, 1, 0.94]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.88, 1], [0, 1, 1, 0]);

  // Update scrollState.scanLineY for 3D scene
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      scrollState.scanLineY = v;
    });
    return unsub;
  }, [scrollYProgress]);

  const handleMitigate = () => {
    if (mitigated || processing) return;
    setProcessing(true);
    scrollState.mitigationPhase = "triggering";

    // Ripple from center of button
    setRipple({ x: 0, y: 0, key: Date.now() });

    gsap.to(scrollState, {
      mitigationProgress: 1,
      duration: 1.8,
      ease: "power3.out",
      onStart: () => {
        scrollState.mitigationPhase = "mitigated";
      },
      onComplete: () => {
        setProcessing(false);
        setMitigated(true);
      },
    });
  };

  const currentStats = mitigated ? STATS_POST : STATS_PRE;

  return (
    <section
      ref={ref}
      className="relative min-h-[200vh] flex flex-col items-center justify-start px-8 pointer-events-none"
    >
      {/* Background glow — rust pre-mitigation, emerald post */}
      <motion.div
        animate={
          mitigated
            ? { background: "radial-gradient(ellipse 70% 70% at 50% 45%, rgba(16,185,129,0.10), transparent)" }
            : { background: "radial-gradient(ellipse 60% 60% at 50% 45%, rgba(194,65,12,0.14), transparent)" }
        }
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Success flash overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.18 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 bg-emerald-400 pointer-events-none z-20"
          />
        )}
      </AnimatePresence>

      {/* Top/bottom fade gradients */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Scan line — sweeps vertically during analysis phase */}
      <motion.div
        style={{ opacity: scanLineOpacity }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none z-10 animate-scan-sweep"
      />

      {/* Main content container */}
      <motion.div
        style={{ scale, opacity: sectionOpacity }}
        className="relative z-10 flex flex-col items-center gap-10 w-full max-w-4xl pointer-events-auto mt-[14vh]"
      >
        {/* ─── Header ─── */}
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={mitigated ? "secured" : "detected"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
            >
              <span
                className={`text-[11px] font-semibold tracking-[0.3em] uppercase mb-5 block ${
                  mitigated ? "text-emerald-600" : "text-accent"
                }`}
              >
                {mitigated ? "Network Secured" : "Anomaly Detected"}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.05] text-foreground">
                {mitigated ? (
                  <>
                    Threat neutralized.
                    <br />
                    <span className="text-text-muted text-2xl md:text-3xl font-normal">
                      4 nodes isolated and held for review.
                    </span>
                  </>
                ) : (
                  <>
                    Multi-hop fraud ring identified.
                    <br />
                    <span className="text-text-muted text-2xl md:text-3xl font-normal">
                      Waiting for automated or manual action.
                    </span>
                  </>
                )}
              </h2>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ─── Threat Breakdown Card ─── */}
        {!mitigated && (
          <motion.div
            style={{ opacity: threatCardOpacity, y: threatCardY }}
            className="w-full max-w-md"
          >
            <div className="glass-surface rounded-2xl p-5 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted/60 font-medium mb-3">
                Threat Chain Breakdown
              </p>
              {THREAT_NODES.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}
                  className="flex items-center gap-3 py-1.5"
                >
                  <span className={`w-2 h-2 rounded-full ${node.color} flex-shrink-0`} />
                  <span className="font-mono text-sm text-foreground/80">{node.id}</span>
                  <span className="text-xs text-text-muted/50 flex-1">{node.label}</span>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-semibold ${
                      node.severity === "critical" ? "text-accent" : "text-amber-600"
                    }`}
                  >
                    {node.severity}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── Stats Row ─── */}
        <motion.div style={{ opacity: statsOpacity, y: statsY }} className="grid grid-cols-3 gap-5 w-full max-w-lg">
          {currentStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={mitigated ? { scale: 0.9, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className="text-center p-4 rounded-xl bg-surface/50 border border-surface-border"
            >
              <p
                className={`text-3xl font-bold font-mono mb-1 transition-colors duration-700 ${
                  mitigated ? "text-emerald-600" : "text-accent"
                }`}
              >
                {s.value}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-text-muted leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── CTA Button / Success Badge ─── */}
        <motion.div style={{ opacity: buttonOpacity, y: buttonY }} className="flex justify-center min-h-[68px]">
          <AnimatePresence mode="wait">
            {!mitigated ? (
              <motion.button
                key="mitigate-btn"
                onClick={handleMitigate}
                disabled={processing}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
                aria-label="Trigger Hold on Node CC-9082 — initiate autonomous mitigation protocol"
                className="probe-target relative overflow-hidden group px-9 py-4 rounded-full bg-gradient-to-r from-accent to-amber-600 text-white font-semibold text-base animate-breathe-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {/* Pulsing ring behind button */}
                <span className="absolute inset-0 rounded-full border-2 border-accent/40 animate-pulse-ring pointer-events-none" />

                {/* Hover sweep */}
                <div className="absolute inset-0 bg-white/15 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                {/* Click ripple */}
                <AnimatePresence>
                  {ripple && (
                    <motion.span
                      key={ripple.key}
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 4, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/30 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <span className="relative z-10 flex items-center gap-3">
                  {processing ? (
                    <>
                      <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                      Trigger Hold — Node CC-9082
                      <span className="text-white/60">→</span>
                    </>
                  )}
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="mitigated-state"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-semibold text-base shadow-[0_0_36px_rgba(16,185,129,0.15)]"
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <motion.path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
                Mitigation Protocol Active
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}
