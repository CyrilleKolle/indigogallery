"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

import { RingSpec } from "@/interfaces";
import { CelestialBody } from "./CalestialBody";
import { Ring } from "./Rings";

/* OrbitingPlanet component renders a planet that orbits around a central point.
 * It includes a pivot that moves in a circular path, simulating the orbit
 * and an optional planetary ring.
 * The planet's position is updated based on the elapsed time and its speed.
 * The orbit path is represented by a ring mesh that remains static at the origin.
 * The planet's size and orbit radius are scaled down for better visualization.
 * The component accepts various properties for the planet's appearance and behavior.
 */
export const ORBIT_RADIUS_SCALE = 1 / 3;
export const PLANET_SIZE_SCALE = 0.2;
const ORBIT_PATH_WIDTH_FACTOR = 0.05; // 5 % of planet size

interface OrbitingPlanetProps {
  radius: number;
  speed: number;
  size: number;
  texture: string;
  bumpMap?: string;
  normalMap?: string;
  emissive?: string;
  emissiveIntensity?: number;
  ring?: RingSpec;
  name: string;
}

export const OrbitingPlanet: React.FC<OrbitingPlanetProps> = ({
  radius,
  speed,
  size,
  ring,
  ...bodyProps
}) => {
  const orbitRadius = radius * ORBIT_RADIUS_SCALE;
  const planetSize = size * PLANET_SIZE_SCALE;

  const pivot = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    if (pivot.current) {
      pivot.current.position.set(
        Math.cos(t) * orbitRadius,
        0,
        Math.sin(t) * orbitRadius
      );
      pivot.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
        <ringGeometry
          args={[
            orbitRadius - planetSize * ORBIT_PATH_WIDTH_FACTOR,
            orbitRadius + planetSize * ORBIT_PATH_WIDTH_FACTOR,
            128,
          ]}
        />
        <meshBasicMaterial
          color="#D3D3D3"
          opacity={0.2}
          depthWrite={false}
          toneMapped={false}
          transparent 
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={pivot}>
        <CelestialBody
          {...bodyProps}
          distance={0}
          elevation={0}
          azimuth={0}
          size={planetSize}
          enableLight={false}
          color="#ffffff"
          intensity={1}
        />
        {ring && (
          <Ring
            planetSize={planetSize}
            innerScale={ring.innerScale}
            outerScale={ring.outerScale}
            tiltDeg={ring.tiltDeg}
            texture={ring.texture}
          />
        )}
      </group>
    </group>
  );
};
