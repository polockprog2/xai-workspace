"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimationFrame,
  useInView,
  animate,
} from "framer-motion";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

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

const REVEAL_START = 0.1;
const REVEAL_END = 0.65;
const REVEAL_RANGE = REVEAL_END - REVEAL_START;
const xToThreshold = (x) => REVEAL_START + (x / 100) * REVEAL_RANGE;

// ---------------------------------------------------------------------------
// Chaos panel — the unfiltered feed
// ---------------------------------------------------------------------------

function ChaosPanel() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1a1412]">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--accent) 0px, transparent 1px, transparent 3px)",
        }}
        aria-hidden="true"
      />

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
        <span className="text-[10px] uppercase tracking-[0.25em] text-red-400/60 font-semibold">
          9,412 transactions/min · no visible pattern
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clarity panel — nodes and edges resolve as the scan passes them
// ---------------------------------------------------------------------------

function ClarityEdge({ scrollYProgress, reducedMotion, from, to }) {
  const a = CLARITY_NODES[from];
  const b = CLARITY_NODES[to];
  const start = xToThreshold(Math.min(a.x, b.x));
  const end = Math.max(xToThreshold(Math.max(a.x, b.x)), start + 0.03);
  const pathLength = useTransform(scrollYProgress, [start, end], [0, 1]);
  return (
    <motion.path
      d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
      stroke="var(--accent)"
      strokeWidth="1.5"
      opacity="0.45"
      fill="none"
      style={reducedMotion ? undefined : { pathLength }}
      vectorEffect="non-scaling-stroke"
    />
  );
}

function ClarityNode({ scrollYProgress, reducedMotion, node }) {
  const t = xToThreshold(node.x);
  const opacity = useTransform(scrollYProgress, [t - 0.02, t + 0.035], [0, 1]);
  const scale = useTransform(scrollYProgress, [t - 0.02, t + 0.05], [0.3, 1]);
  const isRisk = node.status === "active";

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1.5"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
        opacity: reducedMotion ? 1 : opacity,
        scale: reducedMotion ? 1 : scale,
      }}
    >
      <div
        className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          isRisk ? "border-amber-500" : "border-emerald-600"
        }`}
      >
        {isRisk && (
          <span className="absolute inset-0 rounded-full border border-amber-500/60 node-pulse" />
        )}
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isRisk ? "bg-amber-500" : "bg-emerald-600"
          }`}
        />
      </div>
      <span className="text-[9px] font-mono text-text-muted whitespace-nowrap">
        {node.label}
      </span>
      {node.status === "mitigated" && (
        <span className="text-[8px] font-mono text-emerald-600 uppercase tracking-wider">
          Held
        </span>
      )}
      {isRisk && (
        <span className="text-[8px] font-mono text-amber-500 uppercase tracking-wider">
          Tracing
        </span>
      )}
    </motion.div>
  );
}

function ClarityPanel({ scrollYProgress, reducedMotion }) {
  const flowGate = useTransform(
    scrollYProgress,
    [xToThreshold(70) - 0.02, xToThreshold(70) + 0.02],
    [0, 1],
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {CONNECTIONS.map(([from, to], i) => (
          <ClarityEdge
            key={i}
            from={from}
            to={to}
            scrollYProgress={scrollYProgress}
            reducedMotion={reducedMotion}
          />
        ))}

        {/* traced flow: mule account funnels into cashout */}
        <motion.g style={{ opacity: reducedMotion ? 1 : flowGate }}>
          <motion.circle
            r="3.5"
            fill="var(--accent)"
            style={{ filter: "drop-shadow(0 0 4px var(--accent-glow))" }}
            animate={
              reducedMotion
                ? undefined
                : {
                    cx: [`${CLARITY_NODES[3].x}%`, `${CLARITY_NODES[4].x}%`],
                    cy: [`${CLARITY_NODES[3].y}%`, `${CLARITY_NODES[4].y}%`],
                    opacity: [0, 1, 1, 0],
                  }
            }
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          />
        </motion.g>
      </svg>

      {CLARITY_NODES.map((node) => (
        <ClarityNode
          key={node.id}
          node={node}
          scrollYProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />
      ))}

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
          One laundering path · 5 accounts · fully traced
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scan HUD — rides the divider, ticks up like a live process
// ---------------------------------------------------------------------------

function ScanHUD({ scrollYProgress, dividerX, reducedMotion }) {
  const countEl = useRef(null);
  const value = useRef(0);
  const hudOpacity = useTransform(
    scrollYProgress,
    [REVEAL_START, REVEAL_START + 0.05, REVEAL_END - 0.05, REVEAL_END],
    [0, 1, 1, 0],
  );

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    value.current += delta * (6 + Math.random() * 5);
    if (countEl.current) {
      countEl.current.textContent = Math.floor(value.current).toLocaleString();
    }
  });

  return (
    <motion.div
      className="absolute top-3 z-20 pointer-events-none flex items-center gap-1.5 px-2 py-1 rounded bg-[#0c0a08]/90 border border-accent/40 -translate-x-1/2"
      style={{ left: dividerX, opacity: reducedMotion ? 1 : hudOpacity }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      <span className="text-[9px] font-mono text-accent/80 tracking-wide">
        scanned <span ref={countEl}>0</span>
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Animated stat — counts up once it enters view
// ---------------------------------------------------------------------------

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
        {display}
        {suffix}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-text-muted leading-snug">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export default function TransformationSection() {
  const ref = useRef(null);
  const reducedMotion = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const revealProgress = useTransform(scrollYProgress, [REVEAL_START, REVEAL_END], [0, 100]);
  const headerOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.15, 0.3], [32, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.55, 0.7], [24, 0]);
  const dividerX = useTransform(scrollYProgress, [REVEAL_START, REVEAL_END], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[140vh] flex flex-col items-center justify-center px-8 pointer-events-none"
      aria-label="Transformation: from raw transaction noise to a traced laundering network"
    >
      <style jsx>{`
        .node-pulse {
          animation: node-pulse-ring 1.8s ease-out infinite;
        }
        @keyframes node-pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .node-pulse {
            animation: none;
          }
        }
      `}</style>

      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="relative z-10 text-center mb-12 max-w-2xl pointer-events-auto"
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-accent mb-5 border-l-2 border-accent pl-3">
          Network Intelligence
        </span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-foreground mb-4">
          Every transaction
          <br />
          <span className="text-accent">looks fine alone.</span>
        </h2>
        <p className="text-text-muted text-lg leading-relaxed max-w-lg mx-auto">
          A new account, a routine transfer, a device swap — none of it trips a rule.
          The laundering path only appears once you connect them.
        </p>
      </motion.div>

      <div className="relative z-10 w-full max-w-5xl h-[420px] rounded-2xl overflow-hidden border border-surface-border shadow-[0_24px_80px_rgba(28,25,23,0.1)] pointer-events-auto">
        <ChaosPanel />

        <motion.div
          className="absolute inset-0"
          style={{
            clipPath: useTransform(
              revealProgress,
              [0, 100],
              ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
            ),
          }}
        >
          <ClarityPanel scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
        </motion.div>

        <motion.div
          className="absolute top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_16px_var(--accent-glow),0_0_32px_var(--accent-glow)] z-20 pointer-events-none"
          style={{ left: dividerX }}
        />
        <ScanHUD scrollYProgress={scrollYProgress} dividerX={dividerX} reducedMotion={reducedMotion} />
      </div>

      <motion.div
        style={{ opacity: statsOpacity, y: statsY }}
        className="relative z-10 grid grid-cols-3 gap-6 w-full max-w-lg mt-12 pointer-events-auto"
      >
        {STATS.map((s) => (
          <AnimatedStat key={s.label} value={s.value} label={s.label} />
        ))}
      </motion.div>
    </section>
  );
}
