import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import React, { useMemo } from "react";
import { RingSpec } from "@/interfaces/planets";

interface RingProps extends RingSpec {
  planetSize: number;
}

export const Ring: React.FC<RingProps> = ({
  innerScale,
  outerScale,
  tiltDeg,
  texture,
  planetSize,
}) => {
  const map = useLoader(THREE.TextureLoader, texture);

  const mesh = useMemo(() => {
    const inner = planetSize * innerScale;
    const outer = planetSize * outerScale;
    const geo = new THREE.RingGeometry(inner, outer, 64);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    return new THREE.Mesh(geo, mat);
  }, [map, innerScale, outerScale, planetSize]);

  mesh.rotation.z = THREE.MathUtils.degToRad(tiltDeg);

  return <primitive object={mesh} />;
};
