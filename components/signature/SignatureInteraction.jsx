"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { scrollState } from "@/lib/scrollState";

const STATS = [
  { value: "14ms", label: "Path analysis latency" },
  { value: "4", label: "Nodes identified" },
  { value: "98.4%", label: "Fraud confidence" },
];

export default function SignatureInteraction() {
  const ref = useRef(null);
  const [mitigated, setMitigated] = useState(false);
  // Entrance starts only once section top reaches viewport top (after InsightFlow pin + buffer)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const scale = useTransform(scrollYProgress, [0, 0.2, 0.88, 1], [0.92, 1, 1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.88, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [72, 0]);
  const statsReveal = useTransform(scrollYProgress, [0.16, 0.34], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.16, 0.34], [28, 0]);
  const sectionBg = useTransform(
    scrollYProgress,
    [0, 0.3],
    ["rgba(250,248,245,0)", "rgba(250,248,245,0)"]
  );

  const handleMitigate = () => {
    if (mitigated) return;
    setMitigated(true);

    gsap.to(scrollState, {
      mitigationProgress: 1,
      duration: 1.5,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[200vh] flex flex-col items-center justify-center px-8 pointer-events-none"
    >
      {/* Background glow — enhanced on mitigation */}
      <motion.div
        animate={
          mitigated
            ? {
              background:
                "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16,185,129,0.08), transparent)",
            }
            : {
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(194,65,12,0.12), transparent)",
            }
        }
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
      />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <motion.div
        style={{ scale, opacity, y }}
        className="relative z-10 flex flex-col items-center gap-12 w-full max-w-4xl pointer-events-auto"
      >
        {/* Header text */}
        <div className="text-center mt-[18vh]" aria-live="assertive" aria-atomic="true">
          <AnimatePresence mode="wait">
            <motion.div
              key={mitigated ? "secured" : "detected"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <span
                className={`text-xs font-semibold tracking-[0.25em] uppercase mb-4 block ${mitigated ? "text-emerald-600" : "text-accent"
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
                      Nodes isolated and held for review.
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
        </div>

        {/* Interaction Button */}
        <div className="flex justify-center min-h-[60px]">
          <AnimatePresence mode="wait">
            {!mitigated ? (
              <motion.button
                key="mitigate-btn"
                onClick={handleMitigate}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
                aria-pressed={mitigated}
                aria-label="Trigger Hold on Node CC-9082 — initiate autonomous mitigation protocol"
                className="probe-target relative overflow-hidden group px-7 py-3.5 rounded-full bg-accent text-white font-semibold text-base shadow-[0_0_36px_var(--accent-glow)] hover:shadow-[0_0_56px_var(--accent-glow-strong)] transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <div className="absolute inset-0 bg-white/15 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-3">
                  <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse" />
                  Trigger Hold — Node CC-9082
                  <span className="text-white/60">→</span>
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="mitigated-state"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 px-7 py-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-semibold text-base shadow-[0_0_30px_rgba(16,185,129,0.12)]"
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
        </div>

        {/* Stats row — reveals after main section pop-in */}
        <motion.div style={{ opacity: statsReveal, y: statsY }} className="grid grid-cols-3 gap-6 w-full max-w-lg">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="text-center p-4 rounded-xl bg-surface/50 border border-surface-border"
            >
              <p className="text-3xl font-bold font-mono text-accent mb-1">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-text-muted leading-snug">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
