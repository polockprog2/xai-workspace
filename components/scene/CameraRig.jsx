"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

// Parallax strength per active stage — small during pinned sections, larger in free stages
const PARALLAX_STRENGTH = {
  "-1": 0.6,   // Hero: expressive
   "0": 0.2,   // Ingest: subtle (pinned)
   "1": 0.2,   // Analyze: subtle (pinned)
   "2": 0.25,  // Insight: subtle
   "3": 0.45,  // Signature: visible — interactive moment
   "4": 0.15,  // Dashboard: minimal
};

export default function CameraRig() {
  const currentPos = useRef(new THREE.Vector3(0, 0, 14));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  // Smoothed parallax accumulators — separate from scroll position so they don't fight
  const parallaxOffset = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    // Fetch targeted camera position and lookAt target from our shared scroll state
    const targetPos = new THREE.Vector3(scrollState.camX, scrollState.camY, scrollState.camZ);
    const targetLook = new THREE.Vector3(scrollState.lookX, scrollState.lookY, scrollState.lookZ);

    // Calculate a frame-rate independent interpolation factor
    const lerpFactor = Math.min(delta * 4.0, 1);

    // Mouse parallax — smooth the raw mouse values first
    const strength = PARALLAX_STRENGTH[String(scrollState.activeStage)] ?? 0.3;
    parallaxOffset.current.x = THREE.MathUtils.lerp(
      parallaxOffset.current.x,
      scrollState.mouseParallaxX * strength,
      Math.min(delta * 2.5, 1)
    );
    parallaxOffset.current.y = THREE.MathUtils.lerp(
      parallaxOffset.current.y,
      -scrollState.mouseParallaxY * strength * 0.6, // Y axis inverted, reduced magnitude
      Math.min(delta * 2.5, 1)
    );

    // Apply parallax on top of scroll target (additive, so scroll still wins)
    targetPos.x += parallaxOffset.current.x;
    targetPos.y += parallaxOffset.current.y;

    // Smoothly interpolate current camera properties
    currentPos.current.lerp(targetPos, lerpFactor);
    currentLook.current.lerp(targetLook, lerpFactor);

    // Apply to Three.js camera
    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}
