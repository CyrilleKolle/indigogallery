"use client";

import { sphericalToCartesian } from "@/utilities";

export function Sun({
  distance = 500,
  elevation = 30,
  azimuth = 45,
  size = 50,
  color = "#ffdd66",
  intensity = 2,
}: {
  distance?: number;
  elevation?: number;
  azimuth?: number;
  size?: number;
  color?: string;
  intensity?: number;
}) {
  const position = sphericalToCartesian(distance, elevation, azimuth);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={intensity} distance={0} decay={2} />
    </group>
  );
}
