import * as THREE from "three";
import { useLoader, useFrame } from "@react-three/fiber";
import { type ReactElement, useMemo, useRef } from "react";
import { sphericalToCartesian } from "@/utilities";
import { CelestialBodyProps } from "@/interfaces";
import "@react-three/fiber";

/**
 * The CelestialBody component represents a spherical celestial body in 3D space.
 * It uses a texture for the diffuse map and an optional emissive map for lighting effects.
 * The body can be positioned based on spherical coordinates (distance, elevation, azimuth).
 */
export const CelestialBody: React.FC<CelestialBodyProps> = ({
  distance,
  elevation,
  azimuth,
  size,
  texture,
  emissive = texture,
  color,
  intensity,
  name,
  bumpMap,
  normalMap,
  emissiveIntensity,
  enableLight = true,
}): ReactElement => {
  const [x, y, z] = sphericalToCartesian(distance, elevation, azimuth);
  const urls = [
    texture,
    bumpMap || texture,
    normalMap || texture,
    emissive || texture,
  ];
  const [diffTex, bumpTex, normTex, emisTex] = useLoader(
    THREE.TextureLoader,
    urls
  ) as [THREE.Texture, THREE.Texture, THREE.Texture, THREE.Texture];

  // A <group> so that the entire body can be rotated
  const group = useRef<THREE.Group>(null!);

  const mesh = useMemo<THREE.Mesh>(() => {
    const geo = new THREE.SphereGeometry(size, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      map: diffTex,
      emissiveMap: emissive ? emisTex : undefined,
      emissive: new THREE.Color(color),
      emissiveIntensity: emissiveIntensity ?? 2,
      roughness: 1,
      metalness: 0,
      toneMapped: false,
      bumpMap: bumpMap ? bumpTex : undefined,
      normalMap: normalMap ? normTex : undefined,
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.name = name;
    sphere.castShadow = sphere.receiveShadow = false;
    return sphere;
  }, [
    diffTex,
    emisTex,
    size,
    color,
    name,
    bumpMap,
    normalMap,
    emissiveIntensity,
    bumpTex,
    normTex,
    emissive,
  ]);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.02;
  });

  return (
    <group ref={group} position={[x, y, z]} name={`${name}-group`}>
      <primitive object={mesh} />
      {enableLight && (
        <pointLight
          position={[0, 0, 0]}
          color={color}
          intensity={intensity}
          decay={2}
          name={`${name}-light`}
        />
      )}
    </group>
  );
};
