"use client";

import { Canvas } from "@react-three/fiber";
import DataCore from "./DataCore";
import CameraRig from "./CameraRig";

export default function PersistentScene() {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full pointer-events-none"
      camera={{ position: [0, 0, 18], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      {/* 
        We use alpha: true so the canvas background is transparent,
        allowing the warm paper tone from globals.css body to show through.
      */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 8, 5]} intensity={1.5} color="#FAF8F5" />
      <pointLight position={[0, 5, 0]} intensity={1.0} color="#C2410C" distance={25} />

      <CameraRig />
      <DataCore />
    </Canvas>
  );
}
