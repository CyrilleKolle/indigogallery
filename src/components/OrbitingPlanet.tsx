"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export function OrbitingPlanet({
  radius,
  speed,
  size,
  texture,
  bumpMap,
  normalMap,
  emissive,
  emissiveIntensity = 0,
}: {
  radius: number;
  speed: number;
  size: number;
  texture: string;
  bumpMap?: string;
  normalMap?: string;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const [map, bump, normal] = useLoader(THREE.TextureLoader, [
    texture,
    ...(bumpMap ? [bumpMap] : []),
    ...(normalMap ? [normalMap] : []),
  ]);
  const PLANET_SIZE_SCALE = 0.2;
  const scaledRadius = radius / 3;
  const scaledSize = size * PLANET_SIZE_SCALE;
  const ringThickness = scaledSize * 0.05;
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    const x = Math.cos(t) * scaledRadius;
    const z = Math.sin(t) * scaledRadius;
    if (ref.current) {
      ref.current.position.set(x, 0, z);
      ref.current.rotation.y = t * 0.5; // spin
    }
  });

  return (
    <group>
      <mesh ref={ref} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[scaledSize, 64, 64]} />
        <meshStandardMaterial
          map={map}
          bumpMap={bump}
          normalMap={normal}
          metalness={0.2}
          roughness={0.7}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[
            scaledRadius - ringThickness / 2,
            scaledRadius + ringThickness / 2,
            256,
          ]}
        />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
