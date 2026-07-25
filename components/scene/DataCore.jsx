"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Transformation network node definitions
const TF_NODES = [
  { id: "CC-9082", label: "Card ****9082", type: "Fraud origin", pos: [-3.5, 0, 0], color: new THREE.Color("#ef4444") },
  { id: "WL-44", label: "Wallet WL-44", type: "Mule account", pos: [-1.5, 1.2, 0.3], color: new THREE.Color("#d97706") },
  { id: "MC-77", label: "Merchant MC-77", type: "Mule account", pos: [0.5, -0.8, -0.2], color: new THREE.Color("#d97706") },
  { id: "LN-22", label: "Terminal LN-22", type: "Mule account", pos: [1.5, 1.0, 0.4], color: new THREE.Color("#d97706") },
  { id: "CC-1158", label: "Card ****1158", type: "Cashout point", pos: [3.5, 0, 0], color: new THREE.Color("#c2410c") },
];

const TF_EDGES = [
  { from: 0, to: 1, txCount: 3 },
  { from: 1, to: 2, txCount: 2 },
  { from: 0, to: 3, txCount: 1 },
  { from: 3, to: 4, txCount: 4 },
  { from: 2, to: 4, txCount: 2 },
];

const NODE_TYPE_COLORS = {
  source: "#ef4444",
  "pass-through": "#d97706",
  destination: "#c2410c",
};

export default function DataCore() {
  const pointsRef = useRef();
  const pointsMatRef = useRef();
  const linesRef = useRef();
  const tfLinesRef = useRef();
  const scanBeamRef = useRef();
  const groupRef = useRef();
  const pulseRingRef = useRef();

  const count = 1600;

  // Per-particle stagger delay for mitigation dispersal
  const dispersalStagger = useMemo(() => {
    const stagger = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      stagger[i] = seededRandom(i * 2.7) * 0.4;
    }
    return stagger;
  }, [count]);

  // Pre-calculate positions for all 7 stages (0–6)
  const [stagePositions, particleColors] = useMemo(() => {
    const stage0 = new Float32Array(count * 3); // Hero: chaotic cloud
    const stage1 = new Float32Array(count * 3); // Ingest: flow lanes
    const stage2 = new Float32Array(count * 3); // Analyze: clustered hubs
    const stage3 = new Float32Array(count * 3); // Insight: loop highlight
    const stage4 = new Float32Array(count * 3); // Signature: network graph
    const stage5 = new Float32Array(count * 3); // Transformation: 5-node fraud network
    const stage6 = new Float32Array(count * 3); // Dashboard: recede

    const cols = new Float32Array(count * 3);

    const cRust = new THREE.Color("#c2410c");
    const cAmber = new THREE.Color("#d97706");
    const cCharcoal = new THREE.Color("#6b645c");
    const cPaper = new THREE.Color("#e4dacb");

    const hubs = [
      new THREE.Vector3(-2.2, 1.2, 0.2),
      new THREE.Vector3(2.2, 1.5, -0.5),
      new THREE.Vector3(-0.8, -1.8, 0.5),
      new THREE.Vector3(1.2, -0.8, 0.4),
    ];

    for (let i = 0; i < count; i++) {
      const idx3 = i * 3;

      // Stage 0: Chaotic spherical cloud
      const u = seededRandom(i * 0.1);
      const v = seededRandom(i * 0.2);
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 4.5 * Math.cbrt(seededRandom(i * 0.3));
      stage0[idx3] = r * Math.sin(phi) * Math.cos(theta);
      stage0[idx3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      stage0[idx3 + 2] = r * Math.cos(phi);

      // Stage 1: Pipeline lanes
      const lane = i % 4;
      const laneY = (lane - 1.5) * 1.4;
      const laneZ = (Math.floor(i / 4) % 3 - 1) * 0.8;
      const laneX = seededRandom(i * 0.4) * 12 - 6;
      stage1[idx3] = laneX;
      stage1[idx3 + 1] = laneY;
      stage1[idx3 + 2] = laneZ;

      // Stage 2: Clustered Hubs
      const hubIdx = i % 4;
      const targetHub = hubs[hubIdx];
      const clusterR = 0.8 * Math.cbrt(seededRandom(i * 0.5));
      const cu = seededRandom(i * 0.6);
      const cv = seededRandom(i * 0.7);
      const ctheta = 2 * Math.PI * cu;
      const cphi = Math.acos(2 * cv - 1);
      stage2[idx3] = targetHub.x + clusterR * Math.sin(cphi) * Math.cos(ctheta);
      stage2[idx3 + 1] = targetHub.y + clusterR * Math.sin(cphi) * Math.sin(ctheta);
      stage2[idx3 + 2] = targetHub.z + clusterR * Math.cos(cphi);

      // Stage 3: Insight — fraud ring into tight loop
      if (hubIdx === 3) {
        const angle = ((i / 4) / (count / 4)) * Math.PI * 2;
        stage3[idx3] = targetHub.x + Math.cos(angle) * 0.7;
        stage3[idx3 + 1] = targetHub.y + Math.sin(angle) * 0.7;
        stage3[idx3 + 2] = targetHub.z + seededRandom(i * 0.8) * 0.2 - 0.1;
      } else {
        stage3[idx3] = stage2[idx3];
        stage3[idx3 + 1] = stage2[idx3 + 1];
        stage3[idx3 + 2] = stage2[idx3 + 2];
      }

      // Stage 4: Signature Network Graph
      const sigHubIdx = i % 4;
      const sigHub = hubs[sigHubIdx].clone().multiplyScalar(1.2);
      sigHub.x *= 0.8;
      sigHub.y *= 0.8;
      sigHub.z *= 1.6;
      const sigR = 0.85 * Math.cbrt(seededRandom(i * 0.9));
      const su = seededRandom(i * 1.0);
      const sv = seededRandom(i * 1.1);
      const stheta = 2 * Math.PI * su;
      const sphi = Math.acos(2 * sv - 1);
      stage4[idx3] = sigHub.x + sigR * Math.sin(sphi) * Math.cos(stheta);
      stage4[idx3 + 1] = sigHub.y + sigR * Math.sin(sphi) * Math.sin(stheta);
      stage4[idx3 + 2] = sigHub.z + sigR * Math.cos(sphi);

      // Stage 5: Transformation — 5-node fraud network (left-to-right flow)
      const tfNodeIdx = i % 5;
      const tfNode = TF_NODES[tfNodeIdx];
      const tfClusterR = 0.6 * Math.cbrt(seededRandom(i * 1.3));
      const tu = seededRandom(i * 1.4);
      const tv = seededRandom(i * 1.5);
      const ttheta = 2 * Math.PI * tu;
      const tphi = Math.acos(2 * tv - 1);
      stage5[idx3] = tfNode.pos[0] + tfClusterR * Math.sin(tphi) * Math.cos(ttheta);
      stage5[idx3 + 1] = tfNode.pos[1] + tfClusterR * Math.sin(tphi) * Math.sin(ttheta);
      stage5[idx3 + 2] = tfNode.pos[2] + tfClusterR * Math.cos(tphi);

      // Stage 6: Dashboard — recede (miniaturized)
      stage6[idx3] = stage5[idx3] * 0.8 + 2.0;
      stage6[idx3 + 1] = stage5[idx3 + 1] * 0.8;
      stage6[idx3 + 2] = stage5[idx3 + 2] * 0.8;

      // Particle coloring (base — overridden per-stage in useFrame)
      const colRand = seededRandom(i * 1.2);
      let c = cCharcoal;
      if (hubIdx === 3) {
        c = cRust;
      } else if (colRand > 0.8) {
        c = cAmber;
      } else if (colRand > 0.65) {
        c = cPaper;
      }
      cols[idx3] = c.r;
      cols[idx3 + 1] = c.g;
      cols[idx3 + 2] = c.b;
    }

    return [[stage0, stage1, stage2, stage3, stage4, stage5, stage6], cols];
  }, [count]);

  const initialPos = useMemo(() => new Float32Array(count * 3), []);

  // --- Signature network lines (stages 2–4) ---
  const lineVertices = useMemo(() => {
    const hubs = [
      [-2.2 * 1.2 * 0.8, 1.2 * 1.2 * 0.8, 0.2 * 1.2 * 1.6],
      [2.2 * 1.2 * 0.8, 1.5 * 1.2 * 0.8, -0.5 * 1.2 * 1.6],
      [-0.8 * 1.2 * 0.8, -1.8 * 1.2 * 0.8, 0.5 * 1.2 * 1.6],
      [1.2 * 1.2 * 0.8, -0.8 * 1.2 * 0.8, 0.4 * 1.2 * 1.6],
    ];
    const lines = [];
    const addLine = (h1, h2) => { lines.push(...hubs[h1], ...hubs[h2]); };
    addLine(0, 2); addLine(2, 1); addLine(0, 1); addLine(2, 3); addLine(3, 1);
    const fraudCenter = hubs[3];
    const fraudRadius = 0.7;
    const fraudZ = fraudCenter[2];
    for (let s = 0; s < 16; s++) {
      const a1 = (s / 16) * Math.PI * 2;
      const a2 = ((s + 1) / 16) * Math.PI * 2;
      lines.push(fraudCenter[0] + Math.cos(a1) * fraudRadius, fraudCenter[1] + Math.sin(a1) * fraudRadius, fraudZ);
      lines.push(fraudCenter[0] + Math.cos(a2) * fraudRadius, fraudCenter[1] + Math.sin(a2) * fraudRadius, fraudZ);
    }
    return new Float32Array(lines);
  }, []);

  const lineColors = useMemo(() => {
    const cols = [];
    const colorGray = new THREE.Color("#e4dacb");
    const colorRust = new THREE.Color("#c2410c");
    for (let i = 0; i < 5 * 2; i++) cols.push(colorGray.r, colorGray.g, colorGray.b);
    for (let i = 0; i < 16 * 2; i++) cols.push(colorRust.r, colorRust.g, colorRust.b);
    return new Float32Array(cols);
  }, []);

  // --- Transformation network lines (stage 5) ---
  const tfLineVertices = useMemo(() => {
    const lines = [];
    for (const edge of TF_EDGES) {
      lines.push(...TF_NODES[edge.from].pos, ...TF_NODES[edge.to].pos);
    }
    return new Float32Array(lines);
  }, []);

  const tfLineColors = useMemo(() => {
    const cols = [];
    const c = new THREE.Color("#e4dacb");
    for (let i = 0; i < TF_EDGES.length * 2; i++) {
      cols.push(c.r, c.g, c.b);
    }
    return new Float32Array(cols);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const m = scrollState.morph;
    const t = state.clock.elapsedTime;

    // Morph interpolation — now 7 stages (0–6)
    const stageIdx = Math.max(0, Math.min(5, Math.floor(m)));
    const nextStageIdx = Math.min(6, stageIdx + 1);
    const morphProgress = m - stageIdx;

    const currentPositions = stagePositions[stageIdx];
    const targetPositions = stagePositions[nextStageIdx];

    const posArr = pointsRef.current.geometry.attributes.position.array;
    const colorArr = pointsRef.current.geometry.attributes.color.array;

    const isTransformStage = scrollState.activeStage === 4;
    const scanP = scrollState.transformScanProgress;

    for (let i = 0; i < count; i++) {
      const idx3 = i * 3;

      let x = THREE.MathUtils.lerp(currentPositions[idx3], targetPositions[idx3], morphProgress);
      let y = THREE.MathUtils.lerp(currentPositions[idx3 + 1], targetPositions[idx3 + 1], morphProgress);
      let z = THREE.MathUtils.lerp(currentPositions[idx3 + 2], targetPositions[idx3 + 2], morphProgress);

      // Pipeline flow (Ingest stage)
      if (m > 0.5 && m < 1.8) {
        const speed = 1.8 + seededRandom(i) * 1.5;
        const width = 12;
        let flowX = stagePositions[1][idx3] + t * speed;
        flowX = ((flowX + 6) % width) - 6;
        if (scrollState.activeStage === 0) {
          x = THREE.MathUtils.lerp(x, flowX, 0.8);
        }
      }

      // Signature mitigation effect
      if (scrollState.activeStage === 3 && scrollState.mitigationProgress > 0) {
        const hubIdx = i % 4;
        const mit = scrollState.mitigationProgress;
        if (hubIdx === 3) {
          const particleDelay = dispersalStagger[i];
          const localMit = Math.max(0, Math.min(1, (mit - particleDelay) / (1 - particleDelay)));
          const angle = ((i / 4) / (count / 4)) * Math.PI * 2;
          const fraudHubX = 1.2 * 1.2 * 0.8;
          const fraudHubY = -0.8 * 1.2 * 0.8;
          const fraudHubZ = 0.4 * 1.2 * 1.6;
          const targetRad = 0.7 + localMit * 2.8;
          x = THREE.MathUtils.lerp(x, fraudHubX + Math.cos(angle) * targetRad, localMit);
          y = THREE.MathUtils.lerp(y, fraudHubY + Math.sin(angle) * targetRad, localMit);
          z = THREE.MathUtils.lerp(z, fraudHubZ + Math.sin(t * 3.0 + i) * (localMit * 0.8), localMit);
          const flashIntensity = mit < 0.08 ? Math.sin((mit / 0.08) * Math.PI) * 0.6 : 0;
          const cTarget = new THREE.Color("#475569");
          colorArr[idx3] = THREE.MathUtils.lerp(particleColors[idx3], cTarget.r, localMit) + flashIntensity * (1 - particleColors[idx3]);
          colorArr[idx3 + 1] = THREE.MathUtils.lerp(particleColors[idx3 + 1], cTarget.g, localMit) + flashIntensity * (1 - particleColors[idx3 + 1]);
          colorArr[idx3 + 2] = THREE.MathUtils.lerp(particleColors[idx3 + 2], cTarget.b, localMit) + flashIntensity * (1 - particleColors[idx3 + 2]);
        }
      } else if (isTransformStage) {
        // Transformation stage: color particles by their node group
        const tfNodeIdx = i % 5;
        const nodeColor = TF_NODES[tfNodeIdx].color;
        const nodeX = TF_NODES[tfNodeIdx].pos[0];
        // Scan reveal: particles left of scan line get node color, right stay neutral
        const scanX = THREE.MathUtils.lerp(-4.5, 4.5, scanP);
        const revealFactor = Math.max(0, Math.min(1, (scanX - nodeX + 1.5) / 1.5));
        colorArr[idx3] = THREE.MathUtils.lerp(particleColors[idx3], nodeColor.r, revealFactor);
        colorArr[idx3 + 1] = THREE.MathUtils.lerp(particleColors[idx3 + 1], nodeColor.g, revealFactor);
        colorArr[idx3 + 2] = THREE.MathUtils.lerp(particleColors[idx3 + 2], nodeColor.b, revealFactor);
      } else {
        // Reset colors
        colorArr[idx3] = particleColors[idx3];
        colorArr[idx3 + 1] = particleColors[idx3 + 1];
        colorArr[idx3 + 2] = particleColors[idx3 + 2];
      }

      // Brownian jitter
      const jitterFactor = m < 0.5 ? 0.04 : 0.015;
      x += Math.sin(t * 2.0 + i * 0.3) * jitterFactor;
      y += Math.cos(t * 1.8 + i * 0.5) * jitterFactor;
      z += Math.sin(t * 2.2 + i * 0.7) * jitterFactor;

      posArr[idx3] = x;
      posArr[idx3 + 1] = y;
      posArr[idx3 + 2] = z;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;

    // --- Signature network lines opacity ---
    if (linesRef.current) {
      let lineOpacity = 0;
      if (m >= 1.5 && m < 2.5) {
        lineOpacity = (m - 1.5) * 0.6;
      } else if (m >= 2.5 && m < 3.5) {
        lineOpacity = 0.6;
      } else if (m >= 3.5 && m < 4.5) {
        lineOpacity = 0.7;
      } else if (m >= 4.5 && m < 5.0) {
        lineOpacity = THREE.MathUtils.lerp(0.7, 0, (m - 4.5) * 2);
      }

      if (scrollState.activeStage === 3 && scrollState.mitigationProgress > 0) {
        const mit = scrollState.mitigationProgress;
        const snapSpike = mit < 0.06 ? 1.0 : 0;
        const fadeOut = Math.max(0, 1 - mit);
        lineOpacity = Math.max(snapSpike, lineOpacity * fadeOut);
      }

      linesRef.current.material.opacity = lineOpacity;
    }

    // --- Transformation network lines ---
    if (tfLinesRef.current) {
      if (isTransformStage) {
        // Progressive reveal: edges fade in based on scan position vs edge x-range
        let maxEdgeOpacity = 0;
        for (const edge of TF_EDGES) {
          const a = TF_NODES[edge.from];
          const b = TF_NODES[edge.to];
          const minX = Math.min(a.pos[0], b.pos[0]);
          const maxX = Math.max(a.pos[0], b.pos[0]);
          const scanX = THREE.MathUtils.lerp(-4.5, 4.5, scanP);
          const edgeProgress = Math.max(0, Math.min(1, (scanX - minX + 0.5) / (maxX - minX + 1.0)));
          maxEdgeOpacity = Math.max(maxEdgeOpacity, edgeProgress);
        }
        // Breathing pulse during hold sub-phase
        const holdPulse = scrollState.transformHold ? 0.1 * Math.sin(t * 1.2) : 0;
        tfLinesRef.current.material.opacity = maxEdgeOpacity * 0.6 + holdPulse;
      } else {
        tfLinesRef.current.material.opacity = 0;
      }
    }

    // --- Scan beam (glowing vertical line) ---
    if (scanBeamRef.current) {
      if (isTransformStage && scanP > 0.01 && scanP < 0.95 && !scrollState.transformHold) {
        const scanX = THREE.MathUtils.lerp(-4.5, 4.5, scanP);
        scanBeamRef.current.position.x = scanX;
        scanBeamRef.current.material.opacity = 0.5;
      } else {
        // Fade out during hold
        const beamOpacity = scanBeamRef.current.material.opacity;
        if (beamOpacity > 0.01) {
          scanBeamRef.current.material.opacity = beamOpacity * 0.92;
        } else {
          scanBeamRef.current.material.opacity = 0;
        }
      }
    }

    // --- Breathing animation during hold sub-phase ---
    if (isTransformStage && scrollState.transformHold) {
      // Particle size pulse
      if (pointsMatRef.current) {
        pointsMatRef.current.size = 0.14 + 0.025 * Math.sin(t * 1.5);
      }

      // Color brightness modulation per-particle
      for (let i = 0; i < count; i++) {
        const idx3 = i * 3;
        const tfNodeIdx = i % 5;
        const nodeColor = TF_NODES[tfNodeIdx].color;
        const wave = 0.06 * Math.sin(t * 1.8 + i * 0.08);
        colorArr[idx3] = Math.min(1, nodeColor.r + wave);
        colorArr[idx3 + 1] = Math.min(1, nodeColor.g + wave);
        colorArr[idx3 + 2] = Math.min(1, nodeColor.b + wave);
      }
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    } else if (isTransformStage && !scrollState.transformHold) {
      // During scan: normal node color reveal, reset particle size
      if (pointsMatRef.current) {
        pointsMatRef.current.size = 0.14;
      }
    } else {
      // Not in transformation stage: reset particle size
      if (pointsMatRef.current) {
        pointsMatRef.current.size = 0.14;
      }
    }

    // --- Pulse ring on mitigation ---
    if (pulseRingRef.current) {
      const mit = scrollState.mitigationProgress;
      if (scrollState.activeStage === 3 && mit > 0) {
        const ringScale = 0.5 + mit * 5.0;
        pulseRingRef.current.scale.set(ringScale, ringScale, ringScale);
        pulseRingRef.current.material.opacity = Math.max(0, 0.5 * (1 - mit));
        const ringColor = new THREE.Color().lerpColors(
          new THREE.Color("#c2410c"), new THREE.Color("#10b981"), mit
        );
        pulseRingRef.current.material.color.copy(ringColor);
        pulseRingRef.current.visible = true;
      } else {
        pulseRingRef.current.visible = false;
      }
    }

    // --- Base rotation ---
    const rotSpeed = 0.04 * (1 - Math.min(m, 5.5) * 0.15);
    if (groupRef.current) {
      groupRef.current.rotation.y = t * rotSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particle points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initialPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[particleColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMatRef}
          size={0.14}
          sizeAttenuation={true}
          transparent={true}
          vertexColors={true}
          depthWrite={false}
          opacity={0.9}
        />
      </points>

      {/* Signature network lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineVertices, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors={true} transparent={true} opacity={0} linewidth={1} depthWrite={false} />
      </lineSegments>

      {/* Transformation network lines */}
      <lineSegments ref={tfLinesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[tfLineVertices, 3]} />
          <bufferAttribute attach="attributes-color" args={[tfLineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors={true} transparent={true} opacity={0} linewidth={1} depthWrite={false} />
      </lineSegments>

      {/* Scan beam — glowing vertical line that sweeps across during Transformation */}
      <mesh ref={scanBeamRef} position={[0, 0, 0]}>
        <planeGeometry args={[0.04, 8]} />
        <meshBasicMaterial
          color="#c2410c"
          transparent={true}
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ambient glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 32]} />
        <meshBasicMaterial
          color="#c2410c"
          transparent={true}
          opacity={0.015}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={pulseRingRef} position={[1.2 * 1.2 * 0.8, -0.8 * 1.2 * 0.8, 0.4 * 1.2 * 1.6]} visible={false}>
        <ringGeometry args={[0.8, 1.0, 64]} />
        <meshBasicMaterial
          color="#c2410c"
          transparent={true}
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Transformation node labels (visible during stage 5) */}
      {scrollState.activeStage === 4 && TF_NODES.map((node) => (
        <Html
          key={node.id}
          position={node.pos}
          center
          distanceFactor={8}
          zIndexRange={[100, 100]}
          style={{ pointerEvents: "none" }}
        >
          <div className="flex flex-col items-center gap-0.5 whitespace-nowrap">
            <span className="text-[10px] font-mono font-medium text-foreground/80 bg-background/70 backdrop-blur-sm px-1.5 py-0.5 rounded border border-surface-border/50">
              {node.id}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: NODE_TYPE_COLORS[node.type === "Fraud origin" ? "source" : node.type === "Cashout point" ? "destination" : "pass-through"] }}>
              {node.type}
            </span>
          </div>
        </Html>
      ))}
    </group>
  );
}
