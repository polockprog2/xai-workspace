"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CHAOS_NUMBERS = [
  "TX-8A3F", "0x9c2d...f41a", "$12,409", "CC-9082",
  "TX-1B7E", "0x3f8a...c210", "$83,217", "LN-22",
  "TX-4D0C", "0xe1b3...9a7f", "$5,891", "IP-7742",
];

const CLARITY_NODES = [
  { id: "A", label: "Gateway", x: 20, y: 30, status: "active" },
  { id: "B", label: "Shell Co.", x: 50, y: 18, status: "mitigated" },
  { id: "C", label: "Terminal", x: 80, y: 35, status: "active" },
  { id: "D", label: "Mule Acct", x: 35, y: 65, status: "mitigated" },
  { id: "E", label: "Cashout", x: 70, y: 70, status: "active" },
];

const CONNECTIONS = [
  [0, 1], [1, 2], [0, 3], [3, 4], [1, 4],
];

const STATS = [
  { value: "14ms", label: "Detection latency" },
  { value: "94.8%", label: "Mitigation rate" },
  { value: "6-hop", label: "Path analysis depth" },
];

function ChaosPanel() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1a1412]">
      <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
        <line x1="10%" y1="20%" x2="85%" y2="75%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="70%" y1="15%" x2="25%" y2="80%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="40%" y1="10%" x2="60%" y2="90%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="80%" y1="45%" x2="15%" y2="55%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="55%" y1="5%" x2="45%" y2="95%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="25%" y1="60%" x2="75%" y2="30%" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {CHAOS_NUMBERS.map((num, i) => (
        <span
          key={i}
          className="wow-float-element absolute font-mono text-[10px] text-accent/40 pointer-events-none select-none"
          style={{
            left: `${8 + ((i * 19) % 82)}%`,
            top: `${10 + ((i * 23) % 75)}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3.5 + ((i % 3) * 0.8)}s`,
          }}
          aria-hidden="true"
        >
          {num}
        </span>
      ))}

      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="wow-float-element absolute w-1.5 h-1.5 rounded-full bg-red-500/40 pointer-events-none"
          style={{
            left: `${5 + ((i * 23) % 90)}%`,
            top: `${8 + ((i * 17) % 84)}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${4 + ((i % 3) * 0.6)}s`,
          }}
          aria-hidden="true"
        />
      ))}

      <div className="absolute top-[22%] left-[15%] px-2.5 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-mono uppercase tracking-wider wow-float-element" style={{ animationDelay: "0.6s", animationDuration: "4.2s" }} aria-hidden="true">
        Anomaly
      </div>
      <div className="absolute top-[58%] right-[12%] px-2.5 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-mono uppercase tracking-wider wow-float-element" style={{ animationDelay: "1.2s", animationDuration: "3.8s" }} aria-hidden="true">
        Flagged
      </div>
      <div className="absolute bottom-[20%] left-[30%] px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-mono uppercase tracking-wider wow-float-element" style={{ animationDelay: "2s", animationDuration: "4.5s" }} aria-hidden="true">
        Unresolved
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-400/60 font-semibold">Raw Data</span>
      </div>
    </div>
  );
}

function ClarityPanel() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {CONNECTIONS.map(([from, to], i) => (
          <line
            key={i}
            x1={`${CLARITY_NODES[from].x}%`}
            y1={`${CLARITY_NODES[from].y}%`}
            x2={`${CLARITY_NODES[to].x}%`}
            y2={`${CLARITY_NODES[to].y}%`}
            stroke="var(--accent)"
            strokeWidth="1.5"
            opacity="0.4"
          />
        ))}
      </svg>

      {CLARITY_NODES.map((node) => (
        <div
          key={node.id}
          className="absolute flex flex-col items-center gap-1.5"
          style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div
            className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full" />
          </div>
          <span className="text-[9px] font-mono text-text-muted whitespace-nowrap">{node.label}</span>
          {node.status === "mitigated" && (
            <span className="text-[8px] font-mono text-emerald-600 uppercase tracking-wider">Held</span>
          )}
        </div>
      ))}

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">Structured Intelligence</span>
      </div>
    </div>
  );
}

export default function TransformationSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const revealProgress = useTransform(scrollYProgress, [0.1, 0.65], [0, 100]);
  const headerOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.15, 0.3], [32, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.55, 0.7], [24, 0]);
  const dividerX = useTransform(scrollYProgress, [0.1, 0.65], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[140vh] flex flex-col items-center justify-center px-8 pointer-events-none"
      aria-label="Transformation: from raw chaotic data to structured intelligence"
    >
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="relative z-10 text-center mb-12 max-w-2xl pointer-events-auto"
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-accent mb-5 border-l-2 border-accent pl-3">
          The Transformation
        </span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-foreground mb-4">
          From Chaos
          <br />
          <span className="text-accent">to Clarity.</span>
        </h2>
        <p className="text-text-muted text-lg leading-relaxed max-w-lg mx-auto">
          What was noise becomes signal. What was hidden becomes obvious.
        </p>
      </motion.div>

      <div className="relative z-10 w-full max-w-5xl h-[420px] rounded-2xl overflow-hidden border border-surface-border shadow-[0_24px_80px_rgba(28,25,23,0.1)] pointer-events-auto">
        <ChaosPanel />

        <motion.div
          className="absolute inset-0"
          style={{ clipPath: useTransform(revealProgress, [0, 100], ["inset(0 0 0 100%)", "inset(0 0 0 0)"]) }}
        >
          <ClarityPanel />
        </motion.div>

        <motion.div
          className="absolute top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_16px_var(--accent-glow),0_0_32px_var(--accent-glow)] z-20 pointer-events-none"
          style={{ left: dividerX }}
        />
      </div>

      <motion.div
        style={{ opacity: statsOpacity, y: statsY }}
        className="relative z-10 grid grid-cols-3 gap-6 w-full max-w-lg mt-12 pointer-events-auto"
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="text-center p-4 rounded-xl bg-surface/50 border border-surface-border"
          >
            <p className="text-2xl font-bold font-mono text-accent mb-1">{s.value}</p>
            <p className="text-[10px] uppercase tracking-widest text-text-muted leading-snug">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}