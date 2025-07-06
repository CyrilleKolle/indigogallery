"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls as DreiOrbitControls,
  Stars,
  Environment,
} from "@react-three/drei";
import { PLANETS } from "@/constants";
import { OrbitingPlanet } from "./OrbitingPlanet";
import { CustomStarField } from "./CustomStarField";
import { Sun } from "./Sun";
import { LabeledGlobe } from "./Indigo";
import { Suspense, useRef } from "react";
import { AsteroidBelt } from "./AsteriodBelt";

import type { OrbitControls as ThreeOrbitControls } from "three-stdlib";
import CameraRegistrar from "./CameraRegistrar";
import ProgressBridge from "./ProgressBridge";

// import { useAuth } from "./AuthProvider";

export function YearGlobe() {
  const controlsRef = useRef<ThreeOrbitControls>(null);
  const galaxyHDR = "/galaxy.hdr";

  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      style={casvasStyle}
      dpr={1}
      camera={{ position: [60, 200, 800], fov: 50, near: 0.1, far: 2000 }}
      shadows={false}
    >
      <Suspense fallback={null}>
        <ProgressBridge />
        <CameraRegistrar controlsRef={controlsRef} />
        <Environment
          files={galaxyHDR}
          background
          frames={100}
          resolution={256}
          backgroundBlurriness={0.1}
          backgroundIntensity={0.2}
          environmentIntensity={0.1}
          ground={{
            radius: 100,
            height: 0.1,
            scale: 1,
          }}
        />
        <AsteroidBelt innerR={22} outerR={28} />
        <hemisphereLight args={[0xffffff, 0x222222, 0.8]} />
        <directionalLight castShadow={false} />
        <Sun />
        <ambientLight intensity={1} />
        <directionalLight position={[15, 40, 100]} intensity={1} />
        <directionalLight position={[-15, -40, -100]} intensity={0.5} />
        <DreiOrbitControls
          makeDefault
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minDistance={20}
          maxDistance={1000}
          enableDamping
          dampingFactor={0.1}
        />
        <Stars
          radius={1000}
          depth={10}
          count={100000}
          factor={4}
          fade
          speed={1.2}
          saturation={0.8}
        />
        <CustomStarField />
        <LabeledGlobe radius={4} />

        {PLANETS.map((p) => (
          <group key={p.name} position={[0, 0, 0]}>
            <OrbitingPlanet
              key={p.name}
              radius={p.radius * 0.3}
              speed={p.speed}
              size={p.size}
              texture={p.bumpMap}
              bumpMap={p.texture}
            />
          </group>
        ))}
      </Suspense>
    </Canvas>
  );
}

const casvasStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  background: "transparent",
};
