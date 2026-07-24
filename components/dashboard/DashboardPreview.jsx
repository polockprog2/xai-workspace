"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockData } from "@/lib/mockData";

function Sparkline({ data, color = "var(--accent)" }) {
  const id = useId();
  const gradId = `sg-${id.replace(/:/g, "")}`;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 36;

  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4);
      return `${x},${y}`;
    })
    .join(" ");

  const area = `M0,${h} L${pts.split(" ").join(" L")} L${w},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last data point dot */}
      {(() => {
        const last = data[data.length - 1];
        const lx = w;
        const ly = h - ((last - min) / range) * (h - 4);
        return <circle cx={lx} cy={ly} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}

function StatCard({ label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="probe-target p-5 rounded-xl border border-surface-border bg-surface/60 hover:bg-surface hover:shadow-md hover:border-accent/20 transition-all duration-300 group"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted mb-2.5">
        {label.replace(/([A-Z])/g, " $1").trim()}
      </p>
      <p className="text-3xl font-bold font-mono text-foreground group-hover:text-accent transition-colors duration-300 leading-none">
        {value}
      </p>
      {index === 0 && (
        <div className="mt-4">
          <Sparkline data={mockData.dashboard.sparkline} />
        </div>
      )}
    </motion.div>
  );
}

const STATUS_STYLES = {
  mitigated: { dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20" },
  escalated: { dot: "bg-red-500", badge: "bg-red-500/10 text-red-700 border border-red-500/20" },
  processing: { dot: "bg-amber-500 animate-pulse", badge: "bg-amber-500/10 text-amber-700 border border-amber-500/20" },
  cleared: { dot: "bg-text-muted", badge: "bg-surface-border/60 text-text-muted" },
};

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "System Overview" },
    { id: "activity", label: "Mitigation Log" },
    { id: "models", label: "Model Health" },
  ];

  return (
      <section id="dashboard" className="relative py-28 px-8 border-b border-surface-border pointer-events-none min-h-[120vh]">
      <div className="max-w-6xl mx-auto relative z-10 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase text-accent mb-5 border-l-2 border-accent pl-3">
            Intelligence Dashboard
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-[1.05] text-foreground">
            Everything you need to
            <br />
            <span className="text-accent">act, not just observe.</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl mb-16 leading-relaxed">
            Real-time multi-hop detection, model accuracy telemetry, and autonomous
            hold actions — inside a unified review surface.
          </p>

          {/* Mock window */}
          <div className="rounded-2xl border border-surface-border bg-background/95 shadow-[0_24px_80px_rgba(28,25,23,0.08)] overflow-hidden backdrop-blur-xl">
            {/* Title bar */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-surface-border bg-surface/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-background border border-surface-border text-xs text-text-muted font-mono select-none">
                  xai.app / security-ops
                </div>
              </div>
              <div className="w-16 flex items-center justify-end gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-text-muted/50">Live</span>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 px-5 py-2.5 border-b border-surface-border bg-surface/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`probe-target relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${activeTab === tab.id ? "text-foreground" : "text-text-muted hover:text-foreground/80"
                    }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 bg-background border border-surface-border rounded-lg shadow-sm"
                      transition={{ type: "spring", bounce: 0.12, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                  {activeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(mockData.dashboard.overview).map(([key, value], i) => (
                        <StatCard key={key} label={key} value={value} index={i} />
                      ))}
                    </div>
                  )}

                  {activeTab === "activity" && (
                    <div className="space-y-2.5">
                      {mockData.dashboard.activityData.map((item, i) => {
                        const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.cleared;
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.055, duration: 0.3 }}
                            className="probe-target flex flex-col md:flex-row md:items-center justify-between px-5 py-4 rounded-xl border border-surface-border bg-surface/40 hover:bg-surface hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex flex-col gap-1 mb-2 md:mb-0">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                                <span className="text-sm font-semibold text-foreground">{item.name}</span>
                              </div>
                              <span className="text-xs text-text-muted pl-[18px]">{item.action}</span>
                            </div>
                            <div className="flex items-center gap-5 text-xs pl-[18px] md:pl-0">
                              {item.confidence && (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1 rounded-full bg-surface-border overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.confidence}%` }}
                                      transition={{ duration: 0.9, delay: i * 0.08 }}
                                      className="h-full rounded-full bg-accent"
                                    />
                                  </div>
                                  <span className="text-text-muted font-mono tabular-nums">{item.confidence}%</span>
                                </div>
                              )}
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${s.badge}`}>
                                {item.status}
                              </span>
                              <span className="text-text-muted w-14 text-right font-mono tabular-nums">{item.time}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {activeTab === "models" && (
                    <div className="space-y-2.5">
                      {mockData.dashboard.models.map((model, i) => (
                        <motion.div
                          key={model.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.3 }}
                          className="probe-target flex items-center justify-between px-5 py-5 rounded-xl border border-surface-border bg-surface/40 hover:bg-surface hover:shadow-sm transition-all duration-200"
                        >
                          <div>
                            <p className="font-semibold text-foreground mb-0.5">{model.name}</p>
                            <p className="text-xs text-text-muted font-mono">Latency: {model.latency}</p>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">Accuracy</p>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 rounded-full bg-surface-border overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${model.accuracy}%` }}
                                    transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
                                    className="h-full rounded-full bg-accent"
                                  />
                                </div>
                                <span className="text-sm font-mono font-bold text-accent tabular-nums">{model.accuracy}%</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${model.status === "active"
                                    ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                                    : "bg-surface-border"
                                  }`}
                              />
                              <span className="text-[9px] uppercase font-mono text-text-muted/50 tracking-wider">
                                {model.status}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
