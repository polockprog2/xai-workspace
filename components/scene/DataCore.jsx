"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

// Seeded random helper for deterministic layout
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function DataCore() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const groupRef = useRef();
  const pulseRingRef = useRef();

  const count = 1600;
  const { size } = useThree();

  // Per-particle stagger delay for mitigation dispersal (deterministic)
  const dispersalStagger = useMemo(() => {
    const stagger = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      stagger[i] = seededRandom(i * 2.7) * 0.4; // 0–0.4s offset
    }
    return stagger;
  }, [count]);

  // Highlighted fraud nodes in Signature stage
  const fraudNodes = useMemo(() => {
    return [
      { id: "node-f0", pos: [1.2, -0.8, 0.4], label: "Dest Card Node CC-9082", flag: "auto-hold" },
      { id: "node-f1", pos: [2.0, -0.2, -0.2], label: "Intermediate Wallet Node WL-44", flag: "auto-escalate" },
      { id: "node-f2", pos: [0.8, -1.8, 0.1], label: "Orphaned Merchant Node MC-77", flag: "auto-hold" },
      { id: "node-f3", pos: [1.5, -1.2, 0.6], label: "Velocity Terminal LN-22", flag: "mitigated" },
    ];
  }, []);

  // Pre-calculate positions and colors for all 5 stages of the Data Core
  const [stagePositions, particleColors] = useMemo(() => {
    const stage0 = new Float32Array(count * 3); // Hero: chaotic cloud
    const stage1 = new Float32Array(count * 3); // Ingest: horizontal flow lanes
    const stage2 = new Float32Array(count * 3); // Analyze: clustered hubs
    const stage3 = new Float32Array(count * 3); // Insight: loop highlight
    const stage4 = new Float32Array(count * 3); // Signature: structured node network
    const stage5 = new Float32Array(count * 3); // Dashboard: recede (miniaturized offset)

    const cols = new Float32Array(count * 3);

    // Color palettes
    const cRust = new THREE.Color("#c2410c");   // Accent Rust
    const cAmber = new THREE.Color("#d97706");   // Secondary Amber
    const cCharcoal = new THREE.Color("#6b645c"); // Neutral Muted
    const cPaper = new THREE.Color("#e4dacb");    // Bright neutral

    // Stage 2 Hub Centers (Transaction Endpoints)
    const hubs = [
      new THREE.Vector3(-2.2, 1.2, 0.2),  // Inbound clearing (Adyen)
      new THREE.Vector3(2.2, 1.5, -0.5),  // Output channels (Wise)
      new THREE.Vector3(-0.8, -1.8, 0.5), // Intermediate Ledger
      new THREE.Vector3(1.2, -0.8, 0.4),  // Highlighted Fraud Loop
    ];

    for (let i = 0; i < count; i++) {
      const idx3 = i * 3;

      // Stage 0: Chaotic spherical cloud (raw data)
      const u = seededRandom(i * 0.1);
      const v = seededRandom(i * 0.2);
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 4.5 * Math.cbrt(seededRandom(i * 0.3));
      stage0[idx3] = r * Math.sin(phi) * Math.cos(theta);
      stage0[idx3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      stage0[idx3 + 2] = r * Math.cos(phi);

      // Stage 1: Pipeline lanes (flow streams along X axis)
      const lane = i % 4; // 4 parallel pipelines
      const laneY = (lane - 1.5) * 1.4;
      const laneZ = (Math.floor(i / 4) % 3 - 1) * 0.8;
      const laneX = seededRandom(i * 0.4) * 12 - 6; // Spread from x=-6 to x=6
      stage1[idx3] = laneX;
      stage1[idx3 + 1] = laneY;
      stage1[idx3 + 2] = laneZ;

      // Stage 2: Clustered Hubs
      // Particles group around one of the 4 transaction hubs
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

      // Stage 3: Insight (circular loops highlighted, linkages drawn)
      // Similar to Stage 2, but we pull the fraud ring (hub 3) into a tighter, cleaner circular loop
      if (hubIdx === 3) {
        // Anomaly ring layout
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
      // A fully expanded, structured web with real 3D depth
      const sigHubIdx = i % 4;
      const sigHub = hubs[sigHubIdx].clone().multiplyScalar(1.2);
      // Bring center closer to 0 — scale all axes uniformly
      sigHub.x *= 0.8;
      sigHub.y *= 0.8;
      sigHub.z *= 1.6; // Amplify Z to break the flat-plane look

      const sigR = 0.85 * Math.cbrt(seededRandom(i * 0.9)); // Larger spread for depth
      const su = seededRandom(i * 1.0);
      const sv = seededRandom(i * 1.1);
      const stheta = 2 * Math.PI * su;
      const sphi = Math.acos(2 * sv - 1);

      stage4[idx3] = sigHub.x + sigR * Math.sin(sphi) * Math.cos(stheta);
      stage4[idx3 + 1] = sigHub.y + sigR * Math.sin(sphi) * Math.sin(stheta);
      stage4[idx3 + 2] = sigHub.z + sigR * Math.cos(sphi);

      // Stage 5: Recede (shifted and scaled-down for the Dashboard preview)
      // Camera will move left, but we also apply offset coordinates to compress it
      // making it fit perfectly in the dashboard space
      stage5[idx3] = stage4[idx3] * 0.8 + 2.0; // scale down + push to right side
      stage5[idx3 + 1] = stage4[idx3 + 1] * 0.8;
      stage5[idx3 + 2] = stage4[idx3 + 2] * 0.8;

      // --- PARTICLES COLORING ---
      // Distribute colors to signify status
      const colRand = seededRandom(i * 1.2);
      let c = cCharcoal;
      if (hubIdx === 3) {
        c = cRust; // Fraud ring is pure Rust!
      } else if (colRand > 0.8) {
        c = cAmber; // Important clearing nodes are Amber
      } else if (colRand > 0.65) {
        c = cPaper; // White/bright accent sparks
      }

      cols[idx3] = c.r;
      cols[idx3 + 1] = c.g;
      cols[idx3 + 2] = c.b;
    }

    return [[stage0, stage1, stage2, stage3, stage4, stage5], cols];
  }, [count]);

  // Create initial geometry arrays
  const initialPos = useMemo(() => new Float32Array(count * 3), []);

  // Pre-calculate line vertices for Stage 2 & 3 (linked transactions network)
  const lineVertices = useMemo(() => {
    // We draw transaction flows between hubs
    // Match the Signature-stage hub positions (1.2 scale, 0.8 XY, 1.6 Z)
    const hubs = [
      [-2.2 * 1.2 * 0.8, 1.2 * 1.2 * 0.8, 0.2 * 1.2 * 1.6],
      [2.2 * 1.2 * 0.8, 1.5 * 1.2 * 0.8, -0.5 * 1.2 * 1.6],
      [-0.8 * 1.2 * 0.8, -1.8 * 1.2 * 0.8, 0.5 * 1.2 * 1.6],
      [1.2 * 1.2 * 0.8, -0.8 * 1.2 * 0.8, 0.4 * 1.2 * 1.6],
    ];

    const lines = [];

    // Draw links between hubs
    const addLine = (h1, h2) => {
      lines.push(...hubs[h1]);
      lines.push(...hubs[h2]);
    };

    addLine(0, 2);
    addLine(2, 1);
    addLine(0, 1);
    addLine(2, 3);
    addLine(3, 1);

    // Add extra fraud ring circular links in Rust/Amber
    const fraudCenter = hubs[3];
    const fraudRadius = 0.7;
    const fraudZ = fraudCenter[2];
    const steps = 16;
    for (let s = 0; s < steps; s++) {
      const a1 = (s / steps) * Math.PI * 2;
      const a2 = ((s + 1) / steps) * Math.PI * 2;
      lines.push(fraudCenter[0] + Math.cos(a1) * fraudRadius, fraudCenter[1] + Math.sin(a1) * fraudRadius, fraudZ);
      lines.push(fraudCenter[0] + Math.cos(a2) * fraudRadius, fraudCenter[1] + Math.sin(a2) * fraudRadius, fraudZ);
    }

    return new Float32Array(lines);
  }, []);

  const lineColors = useMemo(() => {
    const cols = [];
    const colorGray = new THREE.Color("#e4dacb");
    const colorRust = new THREE.Color("#c2410c");

    // Hub-to-hub connections
    for (let i = 0; i < 5 * 2; i++) {
      cols.push(colorGray.r, colorGray.g, colorGray.b);
    }
    // Anomaly circle connections (Rust)
    for (let i = 0; i < 16 * 2; i++) {
      cols.push(colorRust.r, colorRust.g, colorRust.b);
    }
    return new Float32Array(cols);
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const m = scrollState.morph; // Continuous value from 0 to 5
    const t = state.clock.elapsedTime;

    // Determine current interpolation index
    const stageIdx = Math.max(0, Math.min(4, Math.floor(m)));
    const nextStageIdx = Math.min(5, stageIdx + 1);
    const morphProgress = m - stageIdx; // Interpolation factor (0 to 1)

    const currentPositions = stagePositions[stageIdx];
    const targetPositions = stagePositions[nextStageIdx];

    const posArr = pointsRef.current.geometry.attributes.position.array;
    const colorArr = pointsRef.current.geometry.attributes.color.array;

    // Animate particles
    for (let i = 0; i < count; i++) {
      const idx3 = i * 3;

      // Base morph position
      let x = THREE.MathUtils.lerp(currentPositions[idx3], targetPositions[idx3], morphProgress);
      let y = THREE.MathUtils.lerp(currentPositions[idx3 + 1], targetPositions[idx3 + 1], morphProgress);
      let z = THREE.MathUtils.lerp(currentPositions[idx3 + 2], targetPositions[idx3 + 2], morphProgress);

      // --- PIPELINE FLOW ANIMATION (Stage 1) ---
      if (m > 0.5 && m < 1.8) {
        // If in Ingest Stage, animate particles flowing along X
        // We shift the particle's X based on elapsed time and its index
        const speed = 1.8 + seededRandom(i) * 1.5;
        const width = 12;
        let flowX = stagePositions[1][idx3] + t * speed;
        // Wrap coordinates
        flowX = ((flowX + 6) % width) - 6;

        // Blend the flowing X coordinate into the current morph
        // only during stage 1 (activeStage === 0)
        if (scrollState.activeStage === 0) {
          x = THREE.MathUtils.lerp(x, flowX, 0.8);
        }
      }

      // --- SIGNATURE INTERACTION MITIGATION EFFECT (Stage 4) ---
      if (scrollState.activeStage === 3 && scrollState.mitigationProgress > 0) {
        const hubIdx = i % 4;
        const mit = scrollState.mitigationProgress;

        if (hubIdx === 3) {
          // Staggered dispersal — each particle has a unique delay offset
          const particleDelay = dispersalStagger[i];
          const localMit = Math.max(0, Math.min(1, (mit - particleDelay) / (1 - particleDelay)));

          const angle = ((i / 4) / (count / 4)) * Math.PI * 2;
          const fraudHubX = 1.2 * 1.2 * 0.8;
          const fraudHubY = -0.8 * 1.2 * 0.8;
          const fraudHubZ = 0.4 * 1.2 * 1.6;
          const targetRad = 0.7 + localMit * 2.8;
          const targetX = fraudHubX + Math.cos(angle) * targetRad;
          const targetY = fraudHubY + Math.sin(angle) * targetRad;
          const targetZ = fraudHubZ + Math.sin(t * 3.0 + i) * (localMit * 0.8);

          x = THREE.MathUtils.lerp(x, targetX, localMit);
          y = THREE.MathUtils.lerp(y, targetY, localMit);
          z = THREE.MathUtils.lerp(z, targetZ, localMit);

          // Flash effect — brief white brightness spike at start of mitigation
          const flashIntensity = mit < 0.08 ? Math.sin((mit / 0.08) * Math.PI) * 0.6 : 0;
          const cFlash = new THREE.Color("#ffffff");
          const cTarget = new THREE.Color("#475569");
          colorArr[idx3] = THREE.MathUtils.lerp(
            particleColors[idx3],
            cTarget.r,
            localMit
          ) + flashIntensity * (cFlash.r - particleColors[idx3]);
          colorArr[idx3 + 1] = THREE.MathUtils.lerp(
            particleColors[idx3 + 1],
            cTarget.g,
            localMit
          ) + flashIntensity * (cFlash.g - particleColors[idx3 + 1]);
          colorArr[idx3 + 2] = THREE.MathUtils.lerp(
            particleColors[idx3 + 2],
            cTarget.b,
            localMit
          ) + flashIntensity * (cFlash.b - particleColors[idx3 + 2]);
        }
      } else {
        // Reset colors back to original
        colorArr[idx3] = particleColors[idx3];
        colorArr[idx3 + 1] = particleColors[idx3 + 1];
        colorArr[idx3 + 2] = particleColors[idx3 + 2];
      }

      // Apply subtle Brownian micro-movement (alive jitter)
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

    // --- ANIMA LINE CONNECTIONS OPACITY ---
    // Lines should only fade in and appear from Stage 2 (Analyze) to Stage 5
    if (linesRef.current) {
      let lineOpacity = 0;
      if (m >= 1.5 && m < 2.5) {
        // Fade in from Ingest to Analyze
        lineOpacity = (m - 1.5) * 0.6;
      } else if (m >= 2.5 && m < 3.5) {
        // Fully visible in Analyze & Insight
        lineOpacity = 0.6;
      } else if (m >= 3.5 && m < 4.5) {
        // High visibility in Signature
        lineOpacity = 0.7;
      } else if (m >= 4.5) {
        // Fades out slightly during Dashboard recede
        lineOpacity = THREE.MathUtils.lerp(0.7, 0.15, m - 4.5);
      }

      // Line snap + fade — brief brightness spike at start, then break
      if (scrollState.activeStage === 3 && scrollState.mitigationProgress > 0) {
        const mit = scrollState.mitigationProgress;
        // Snap spike: lines briefly hit full brightness at mit 0–0.06
        const snapSpike = mit < 0.06 ? 1.0 : 0;
        // Then fade out proportionally
        const fadeOut = Math.max(0, 1 - mit);
        lineOpacity = Math.max(snapSpike, lineOpacity * fadeOut);
      }

      linesRef.current.material.opacity = lineOpacity;
    }

    // --- PULSE RING on mitigation trigger ---
    if (pulseRingRef.current) {
      const mit = scrollState.mitigationProgress;
      if (scrollState.activeStage === 3 && mit > 0) {
        // Ring expands from fraud hub center, opacity fades out
        const ringScale = 0.5 + mit * 5.0;
        pulseRingRef.current.scale.set(ringScale, ringScale, ringScale);
        pulseRingRef.current.material.opacity = Math.max(0, 0.5 * (1 - mit));
        // Color lerps from rust to emerald
        const ringColor = new THREE.Color().lerpColors(
          new THREE.Color("#c2410c"),
          new THREE.Color("#10b981"),
          mit
        );
        pulseRingRef.current.material.color.copy(ringColor);
        pulseRingRef.current.visible = true;
      } else {
        pulseRingRef.current.visible = false;
      }
    }

    // --- BASE ROTATION SPIN ---
    // Slow, stately rotation that stabilizes when structured
    const rotSpeed = 0.04 * (1 - Math.min(m, 4.5) * 0.18);
    if (groupRef.current) {
      groupRef.current.rotation.y = t * rotSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic Evolving Particle Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialPos, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          sizeAttenuation={true}
          transparent={true}
          vertexColors={true}
          depthWrite={false}
          opacity={0.9}
        />
      </points>

      {/* Network Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lineVertices, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors={true}
          transparent={true}
          opacity={0}
          linewidth={1}
          depthWrite={false}
        />
      </lineSegments>

      {/* Subtle outer ambient glow for the Core */}
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

      {/* Pulse ring — expands from fraud hub on mitigation */}
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
    </group>
  );
}
