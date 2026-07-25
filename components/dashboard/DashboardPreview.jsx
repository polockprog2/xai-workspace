"use client";

import { useState, useId, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockData } from "@/lib/mockData";

// ---------------------------------------------------------------------------
// Icons — small inline set, no external dependency
// ---------------------------------------------------------------------------

const iconProps = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

const IconGrid = () => (
  <svg {...iconProps}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
);
const IconList = () => (
  <svg {...iconProps}><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="4" cy="6" r="0.5" fill="currentColor" /></svg>
);
const IconCpu = () => (
  <svg {...iconProps}><rect x="6" y="6" width="12" height="12" rx="2" /><line x1="9" y1="2" x2="9" y2="6" /><line x1="15" y1="2" x2="15" y2="6" /><line x1="9" y1="18" x2="9" y2="22" /><line x1="15" y1="18" x2="15" y2="22" /><line x1="2" y1="9" x2="6" y2="9" /><line x1="18" y1="9" x2="22" y2="9" /><line x1="2" y1="15" x2="6" y2="15" /><line x1="18" y1="15" x2="22" y2="15" /></svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const IconBell = () => (
  <svg {...iconProps} width="15" height="15"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
);

// ---------------------------------------------------------------------------
// People — the humans behind the automation
// ---------------------------------------------------------------------------

const ANALYSTS = [
  { name: "Dana R.", color: "#6366f1" },
  { name: "Marcus T.", color: "#f59e0b" },
  { name: "Priya S.", color: "#10b981" },
  { name: "Sam O.", color: "#ec4899" },
];
const YOU = { name: "You", color: "var(--accent)" };

function hashString(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function Avatar({ name, color, pulsing = false, size = 22 }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-full font-mono font-bold text-white flex-shrink-0 select-none"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initials}
      {pulsing && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: color, opacity: 0.5 }} aria-hidden="true" />}
    </span>
  );
}

function Handler({ item, index, override }) {
  if (override) {
    return (
      <div className="flex items-center gap-1.5" title={`Assigned to ${override.name}`}>
        <Avatar name={override.name} color={override.color} size={20} />
        <span className="text-[10px] text-text-muted font-medium hidden lg:inline">{override.name}</span>
      </div>
    );
  }
  const isAuto = item.status === "mitigated" || item.status === "cleared";
  if (isAuto) {
    return (
      <div className="flex items-center gap-1.5" title="Handled automatically, no review needed">
        <span className="w-5 h-5 rounded-full bg-surface-border/60 flex items-center justify-center text-text-muted">
          <IconBolt />
        </span>
        <span className="text-[10px] text-text-muted font-medium hidden lg:inline">Auto-cleared</span>
      </div>
    );
  }
  const analyst = ANALYSTS[hashString(item.name ?? item.id ?? String(index)) % ANALYSTS.length];
  return (
    <div className="flex items-center gap-1.5" title={`Assigned to ${analyst.name}`}>
      <Avatar name={analyst.name} color={analyst.color} pulsing={item.status === "processing"} size={20} />
      <span className="text-[10px] text-text-muted font-medium hidden lg:inline">{analyst.name}</span>
    </div>
  );
}

function PresencePill() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    const cycle = () => {
      setVisible(true);
      timer = setTimeout(() => {
        setVisible(false);
        timer = setTimeout(() => {
          setIdx((i) => (i + 1) % ANALYSTS.length);
          cycle();
        }, 3500 + Math.random() * 2500);
      }, 4500 + Math.random() * 2000);
    };
    timer = setTimeout(cycle, 1500);
    return () => clearTimeout(timer);
  }, []);

  const analyst = ANALYSTS[idx];
  return (
    <div className="hidden md:flex items-center h-4">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={analyst.name}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1.5 text-[10px] text-text-muted font-mono whitespace-nowrap"
          >
            <Avatar name={analyst.name} color={analyst.color} size={14} />
            <span>{analyst.name.split(" ")[0]} is reviewing a case</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sparkline — compact, for KPI cards
// ---------------------------------------------------------------------------

function Sparkline({ data, color = "var(--accent)" }) {
  const id = useId();
  const gradId = `sg-${id.replace(/:/g, "")}`;
  const [hoverIdx, setHoverIdx] = useState(null);

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 36;

  const coords = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: h - ((v - min) / range) * (h - 4), v }));
  const pts = coords.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M0,${h} L${pts.split(" ").join(" L")} L${w},${h} Z`;

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHoverIdx(Math.round(ratio * (data.length - 1)));
  };

  const active = hoverIdx !== null ? coords[hoverIdx] : coords[coords.length - 1];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9 overflow-visible cursor-crosshair" preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHoverIdx(null)}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        {hoverIdx !== null && <line x1={active.x} y1="0" x2={active.x} y2={h} stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />}
        <circle cx={active.x} cy={active.y} r="2.5" fill={color} />
      </svg>
      <AnimatePresence>
        {hoverIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute -top-6 px-1.5 py-0.5 rounded bg-foreground text-background text-[9px] font-mono font-bold pointer-events-none"
            style={{ left: `${active.x}%`, transform: "translateX(-50%)" }}
          >
            {active.v}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrendBadge({ data }) {
  if (!data || data.length < 2) return null;
  const first = data[0];
  const last = data[data.length - 1];
  const pct = first === 0 ? 0 : ((last - first) / Math.abs(first)) * 100;
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${up ? "text-emerald-700 bg-emerald-500/10" : "text-red-700 bg-red-500/10"}`}>
      {up ? "▲" : "▼"} {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

const LABEL_OVERRIDES = { anomaliesEscalated: "Escalated this week" };

function StatCard({ label, value, index, pulsing = false, sparklineData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`probe-target p-4 rounded-xl border bg-surface/60 hover:bg-surface hover:shadow-md transition-all duration-300 group ${pulsing ? "border-accent/50 shadow-[0_0_16px_var(--accent-glow)]" : "border-surface-border hover:border-accent/20"
        }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-text-muted">
          {LABEL_OVERRIDES[label] ?? label.replace(/([A-Z])/g, " $1").trim()}
        </p>
        {index === 0 && <TrendBadge data={sparklineData} />}
      </div>
      <p className="text-2xl font-bold font-mono text-foreground group-hover:text-accent transition-colors duration-300 leading-none">
        {value}
      </p>
      {index === 0 && (
        <div className="mt-3">
          <Sparkline data={sparklineData} />
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Area chart — the centerpiece
// ---------------------------------------------------------------------------

const RANGE_POINTS = { "24h": 6, "7d": 14, "30d": undefined };

function AreaChart({ seriesA, seriesB }) {
  const id = useId();
  const gradId = `ac-${id.replace(/:/g, "")}`;
  const [hoverIdx, setHoverIdx] = useState(null);

  const W = 560, H = 190, padL = 30, padR = 6, padT = 10, padB = 6;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = seriesA.length;
  const max = Math.max(...seriesA, ...seriesB, 1);

  const xAt = (i) => padL + (n > 1 ? (i / (n - 1)) * plotW : plotW / 2);
  const yAt = (v) => padT + plotH - (v / max) * plotH;

  const lineA = seriesA.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
  const lineB = seriesB.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
  const areaA = `M${padL},${padT + plotH} L${lineA.split(" ").join(" L")} L${padL + plotW},${padT + plotH} Z`;

  const gridLines = [0, 0.5, 1].map((f) => ({ y: padT + plotH * (1 - f), label: Math.round(max * f) }));

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setHoverIdx(Math.round(ratio * (n - 1)));
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full cursor-crosshair" onMouseMove={handleMove} onMouseLeave={() => setHoverIdx(null)}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridLines.map((g) => (
          <g key={g.y}>
            <line x1={padL} x2={padL + plotW} y1={g.y} y2={g.y} stroke="var(--surface-border)" strokeWidth="1" />
            <text x={padL - 6} y={g.y + 3} textAnchor="end" fontSize="9" fill="var(--text-muted)" fontFamily="monospace">{g.label}</text>
          </g>
        ))}

        <path d={areaA} fill={`url(#${gradId})`} />
        <polyline points={lineA} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={lineB} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />

        {hoverIdx !== null && (
          <>
            <line x1={xAt(hoverIdx)} x2={xAt(hoverIdx)} y1={padT} y2={padT + plotH} stroke="var(--accent)" strokeDasharray="2 2" opacity="0.4" />
            <circle cx={xAt(hoverIdx)} cy={yAt(seriesA[hoverIdx])} r="3" fill="var(--accent)" />
            <circle cx={xAt(hoverIdx)} cy={yAt(seriesB[hoverIdx])} r="3" fill="#f59e0b" />
          </>
        )}
      </svg>

      <AnimatePresence>
        {hoverIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute top-1 px-2 py-1 rounded-md bg-foreground text-background text-[10px] font-mono pointer-events-none"
            style={{ left: `${(xAt(hoverIdx) / W) * 100}%`, transform: "translateX(-50%)" }}
          >
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />{seriesA[hoverIdx]}</div>
            <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />{seriesB[hoverIdx]}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Radial gauge — model accuracy
// ---------------------------------------------------------------------------

function RadialGauge({ value, size = 46, stroke = 4, color = "var(--accent)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${value}% accuracy`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-border)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-accent tabular-nums">{value}%</span>
    </div>
  );
}

const STATUS_STYLES = {
  mitigated: { dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20" },
  escalated: { dot: "bg-red-500", badge: "bg-red-500/10 text-red-700 border border-red-500/20" },
  processing: { dot: "bg-amber-500 animate-pulse", badge: "bg-amber-500/10 text-amber-700 border border-amber-500/20" },
  cleared: { dot: "bg-text-muted", badge: "bg-surface-border/60 text-text-muted" },
};

// ---------------------------------------------------------------------------
// Review queue — act on cases without leaving overview
// ---------------------------------------------------------------------------

function ReviewQueue({ items, resolvedIds, assignedOverride, onTake, onClear }) {
  const list = items.filter((it) => (it.status === "escalated" || it.status === "processing") && !resolvedIds.has(it.id)).slice(0, 5);

  return (
    <div className="rounded-xl border border-surface-border bg-surface/40 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Needs your review</h4>
        <span className="text-[10px] font-mono text-text-muted">{list.length} open</span>
      </div>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {list.length === 0 && (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-text-muted py-8 text-center">
              Queue is clear. Nice work.
            </motion.p>
          )}
          {list.map((item) => {
            const override = assignedOverride[item.id];
            const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.cleared;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25 }}
                className="p-3 rounded-lg border border-surface-border bg-background/60"
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-text-muted line-clamp-2">{item.action}</p>
                  </div>
                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wider ${s.badge}`}>{item.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  {override ? (
                    <div className="flex items-center gap-1.5">
                      <Avatar name={override.name} color={override.color} size={16} />
                      <span className="text-[10px] text-text-muted">Assigned to you</span>
                    </div>
                  ) : (
                    <button onClick={() => onTake(item.id)} className="text-[10px] font-semibold text-accent hover:underline probe-target">
                      Take case
                    </button>
                  )}
                  <button onClick={() => onClear(item.id)} className="text-[10px] font-semibold text-emerald-700 hover:underline probe-target">
                    Clear
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cases table — sortable, searchable, selectable
// ---------------------------------------------------------------------------

function SortableTh({ label, onClick, active, dir }) {
  return (
    <th className="px-3 py-2 text-left cursor-pointer select-none whitespace-nowrap" onClick={onClick}>
      <span className="inline-flex items-center gap-1">
        {label}
        {active && <span className="text-accent">{dir === "asc" ? "▲" : "▼"}</span>}
      </span>
    </th>
  );
}

function CasesTable({ items, resolvedIds, assignedOverride, onClear, query, setQuery, searchRef }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());

  const filtered = useMemo(() => {
    let list = items.filter((it) => !resolvedIds.has(it.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((it) => it.name?.toLowerCase().includes(q) || it.action?.toLowerCase().includes(q));
    }
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        const an = parseFloat(av), bn = parseFloat(bv);
        const cmp = !isNaN(an) && !isNaN(bn) ? an - bn : String(av ?? "").localeCompare(String(bv ?? ""));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return list;
  }, [items, resolvedIds, query, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };
  const toggleRow = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allChecked = filtered.length > 0 && filtered.every((it) => selected.has(it.id));
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(filtered.map((it) => it.id)));
  const bulkClear = () => { selected.forEach((id) => onClear(id)); setSelected(new Set()); };

  return (
    <div>
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50"><IconSearch /></span>
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or action…"
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-surface-border bg-background/60 text-foreground placeholder:text-text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="flex items-center justify-between mb-3 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 overflow-hidden"
          >
            <span className="text-xs font-medium text-accent">{selected.size} selected</span>
            <button onClick={bulkClear} className="text-xs font-semibold text-accent hover:underline probe-target">Clear selected</button>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-sm text-text-muted">
          {query ? `No matches for "${query}". Try a name or account ID.` : "All cases handled. Nothing left to review."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface/40 text-[10px] uppercase tracking-wider text-text-muted">
                <th className="w-9 px-3 py-2">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="Select all cases" />
                </th>
                <SortableTh label="Case" onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir} />
                <th className="px-3 py-2 text-left">Action</th>
                <SortableTh label="Confidence" onClick={() => toggleSort("confidence")} active={sortKey === "confidence"} dir={sortDir} />
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Handler</th>
                <SortableTh label="Time" onClick={() => toggleSort("time")} active={sortKey === "time"} dir={sortDir} />
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.cleared;
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                    className="border-b border-surface-border/60 last:border-0 hover:bg-surface/40 transition-colors"
                  >
                    <td className="px-3 py-2.5">
                      <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleRow(item.id)} aria-label={`Select ${item.name}`} />
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap">{item.name}</td>
                    <td className="px-3 py-2.5 text-text-muted max-w-[220px] truncate">{item.action}</td>
                    <td className="px-3 py-2.5">
                      {item.confidence ? (
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1 rounded-full bg-surface-border overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${item.confidence}%` }} />
                          </div>
                          <span className="font-mono text-text-muted">{item.confidence}%</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${s.badge}`}>{item.status}</span>
                    </td>
                    <td className="px-3 py-2.5"><Handler item={item} index={i} override={assignedOverride[item.id]} /></td>
                    <td className="px-3 py-2.5 font-mono text-text-muted whitespace-nowrap">{item.time}</td>
                    <td className="px-3 py-2.5 text-right">
                      <button onClick={() => onClear(item.id)} className="text-[10px] font-semibold text-text-muted hover:text-accent probe-target">Clear</button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function DashboardPreview() {
  const [activeSection, setActiveSection] = useState("overview");
  const [range, setRange] = useState("7d");
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  const [resolvedIds, setResolvedIds] = useState(() => new Set());
  const [assignedOverride, setAssignedOverride] = useState({});
  const [clearedToday, setClearedToday] = useState(0);

  const [liveCount, setLiveCount] = useState(mockData.dashboard.overview.anomaliesEscalated);
  const [tickPulse, setTickPulse] = useState(false);

  useEffect(() => {
    let timer;
    const schedule = () => {
      const delay = 3000 + Math.random() * 2000;
      timer = setTimeout(() => {
        setLiveCount((c) => c + 1);
        setTickPulse(true);
        setTimeout(() => setTickPulse(false), 800);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const takeCase = useCallback((id) => {
    setAssignedOverride((prev) => ({ ...prev, [id]: YOU }));
  }, []);

  const clearCase = useCallback((id) => {
    setResolvedIds((prev) => new Set(prev).add(id));
    setLiveCount((c) => Math.max(0, c - 1));
    setClearedToday((c) => c + 1);
  }, []);

  const sections = useMemo(() => [
    { id: "overview", label: "Overview", icon: IconGrid },
    { id: "cases", label: "Cases", icon: IconList },
    { id: "models", label: "Models", icon: IconCpu },
  ], []);

  const handleSectionKeyDown = useCallback((e, currentIdx) => {
    const ids = sections.map((s) => s.id);
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveSection(ids[(currentIdx + 1) % ids.length]); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveSection(ids[(currentIdx - 1 + ids.length) % ids.length]); }
    else if (e.key === "Home") { e.preventDefault(); setActiveSection(ids[0]); }
    else if (e.key === "End") { e.preventDefault(); setActiveSection(ids[ids.length - 1]); }
  }, [sections]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveSection("cases");
        requestAnimationFrame(() => searchRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const detectedSeries = useMemo(() => {
    const full = mockData.dashboard.sparkline;
    const n = RANGE_POINTS[range] ?? full.length;
    return full.slice(-n);
  }, [range]);
  const escalatedSeries = useMemo(() => detectedSeries.map((v) => Math.round(v * 0.35)), [detectedSeries]);

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
            Real-time multi-hop detection handles the routine cases automatically —
            and hands the judgment calls straight to the analyst who should make them.
          </p>

          {/* Window chrome */}
          <div className="rounded-2xl border border-surface-border bg-background/95 shadow-[0_24px_80px_rgba(28,25,23,0.08)] overflow-hidden backdrop-blur-xl">
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
              <div className="flex items-center justify-end gap-3">
                <PresencePill />
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-text-muted/50">Live</span>
                </div>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <aside className="w-[60px] md:w-[184px] flex-shrink-0 border-r border-surface-border bg-surface/20 flex flex-col justify-between py-4" role="tablist" aria-label="Dashboard sections" aria-orientation="vertical">
                <nav className="flex flex-col gap-1 px-2">
                  {sections.map((s, i) => {
                    const Icon = s.icon;
                    const active = activeSection === s.id;
                    return (
                      <button
                        key={s.id}
                        role="tab"
                        id={`dash-tab-${s.id}`}
                        aria-selected={active}
                        aria-controls={`dash-panel-${s.id}`}
                        tabIndex={active ? 0 : -1}
                        onClick={() => setActiveSection(s.id)}
                        onKeyDown={(e) => handleSectionKeyDown(e, i)}
                        className={`probe-target relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${active ? "text-foreground" : "text-text-muted hover:text-foreground/80"
                          }`}
                      >
                        {active && (
                          <motion.div layoutId="section-bg" className="absolute inset-0 bg-background border border-surface-border rounded-lg shadow-sm" transition={{ type: "spring", bounce: 0.12, duration: 0.4 }} />
                        )}
                        <span className="relative z-10 flex-shrink-0"><Icon /></span>
                        <span className="relative z-10 hidden md:inline">{s.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="px-2">
                  <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
                    <Avatar name="You" color="var(--accent)" size={22} />
                    <div className="hidden md:block min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">You</p>
                      <p className="text-[9px] text-text-muted font-mono">{clearedToday} cleared today</p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-surface-border">
                  <div className="flex items-baseline gap-2 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">Security Operations</h3>
                    <span className="text-text-muted/40">/</span>
                    <span className="text-sm text-text-muted">{sections.find((s) => s.id === activeSection)?.label}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <kbd className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono text-text-muted/60 px-1.5 py-0.5 rounded border border-surface-border">⌘K</kbd>
                    <button className="relative text-text-muted hover:text-foreground transition-colors probe-target" aria-label="Notifications">
                      <IconBell />
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                    </button>
                  </div>
                </div>

                <div
                  className="p-6 min-h-[400px]"
                  role="tabpanel"
                  id={`dash-panel-${activeSection}`}
                  aria-labelledby={`dash-tab-${activeSection}`}
                  aria-live="polite"
                  tabIndex={0}
                >
                  <AnimatePresence mode="wait">
                    <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                      {activeSection === "overview" && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="System overview statistics">
                            {Object.entries(mockData.dashboard.overview).map(([key, value], i) => (
                              <StatCard
                                key={key}
                                label={key}
                                value={key === "anomaliesEscalated" ? liveCount : value}
                                index={i}
                                pulsing={key === "anomaliesEscalated" && tickPulse}
                                sparklineData={mockData.dashboard.sparkline}
                              />
                            ))}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface/40 p-5">
                              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                <div>
                                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1.5">Anomaly volume</h4>
                                  <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted">
                                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent inline-block" />Detected</span>
                                    <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Escalated</span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  {["24h", "7d", "30d"].map((r) => (
                                    <button
                                      key={r}
                                      onClick={() => setRange(r)}
                                      className={`probe-target px-2 py-1 text-[10px] font-mono rounded-md border transition-colors ${range === r ? "bg-accent/10 border-accent/30 text-accent" : "border-surface-border text-text-muted hover:text-foreground"
                                        }`}
                                    >
                                      {r}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <AreaChart seriesA={detectedSeries} seriesB={escalatedSeries} />
                            </div>

                            <ReviewQueue
                              items={mockData.dashboard.activityData}
                              resolvedIds={resolvedIds}
                              assignedOverride={assignedOverride}
                              onTake={takeCase}
                              onClear={clearCase}
                            />
                          </div>
                        </div>
                      )}

                      {activeSection === "cases" && (
                        <CasesTable
                          items={mockData.dashboard.activityData}
                          resolvedIds={resolvedIds}
                          assignedOverride={assignedOverride}
                          onClear={clearCase}
                          query={query}
                          setQuery={setQuery}
                          searchRef={searchRef}
                        />
                      )}

                      {activeSection === "models" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mockData.dashboard.models.map((model, i) => (
                            <motion.div
                              key={model.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08, duration: 0.3 }}
                              className="probe-target flex items-center justify-between px-5 py-5 rounded-xl border border-surface-border bg-surface/40 hover:bg-surface hover:shadow-sm transition-all duration-200"
                            >
                              <div>
                                <p className="font-semibold text-foreground mb-0.5">{model.name}</p>
                                <p className="text-xs text-text-muted font-mono mb-2">Latency: {model.latency}</p>
                                <span className="inline-flex items-center gap-1.5 text-[9px] uppercase font-mono text-text-muted/70 tracking-wider">
                                  <span className={`w-1.5 h-1.5 rounded-full ${model.status === "active" ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-surface-border"}`} />
                                  {model.status}
                                </span>
                              </div>
                              <RadialGauge value={model.accuracy} />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}