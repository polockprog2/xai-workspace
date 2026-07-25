// Shared state for high-performance scroll and interaction tracking.
// Using a plain object allows R3F's useFrame loop to read values directly
// at 60fps without causing React state re-render lags.

export const scrollState = {
  progress: 0,
  
  // Camera Rig target values
  camX: 0,
  camY: 0,
  camZ: 18,
  lookX: 0,
  lookY: 0,
  lookZ: 0,
  
  // Data Core morphing and stages
  // 0: chaotic, 1: ingest, 2: analyze, 3: insight, 4: dashboard-recede, 5: signature-full
  morph: 0,
  activeStage: -1, // -1: Hero, 0: Ingest, 1: Analyze, 2: Insight, 3: Dashboard, 4: Signature

  // InsightFlow pinned timeline — true once all stage transitions finish
  insightFlowComplete: false,

  // Transformation scan — true once before/after reveal finishes
  transformationComplete: false,
  
  // Interactive elements (WOW moment in Signature)
  mitigationProgress: 0, // 0 to 1
  mitigationPhase: "idle", // "idle" | "scanning" | "ready" | "triggering" | "mitigated"
  heldNodesCount: 0,
  hoveredNode: null,
  activeFilter: "all",  // "all" | "anomalies" | "mitigated"
  scanLineY: 0, // 0–1, vertical position of scan line (driven by scroll/animation)

  // Transformation section — 3D scan reveal
  transformScanProgress: 0, // 0–1, left-to-right scan position (written by DOM overlay)
  transformHold: false, // true during hold sub-phase after scan completes
  
  // Crosshair coordinates for the CursorProbe
  mouse: { x: 0, y: 0, realX: 0, realY: 0 },

  // Mouse parallax offsets: normalized −0.5 to +0.5, written by CursorProbe
  mouseParallaxX: 0,
  mouseParallaxY: 0,
};
