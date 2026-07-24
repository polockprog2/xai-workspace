"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

export default function CameraRig() {
  const currentPos = useRef(new THREE.Vector3(0, 0, 14));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Fetch targeted camera position and lookAt target from our shared scroll state
    const targetPos = new THREE.Vector3(scrollState.camX, scrollState.camY, scrollState.camZ);
    const targetLook = new THREE.Vector3(scrollState.lookX, scrollState.lookY, scrollState.lookZ);

    // Calculate a frame-rate independent interpolation factor
    const lerpFactor = Math.min(delta * 4.0, 1);

    // Smoothly interpolate current camera properties
    currentPos.current.lerp(targetPos, lerpFactor);
    currentLook.current.lerp(targetLook, lerpFactor);

    // Apply to Three.js camera
    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLook.current);
  });

  return null;
}
