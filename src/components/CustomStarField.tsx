"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";

export function CustomStarField() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 20000; i++) {
      pts.push(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
    }
    return new Float32Array(pts);
  }, []);
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
          normalized={false}
          onUpload={() => {
            if (ref.current) {
              ref.current.geometry.attributes.position.needsUpdate = true;
            }
          }}
        />
      </bufferGeometry>
      <pointsMaterial size={1} sizeAttenuation 
        color="#ffffff" 
        depthWrite={false} 
        transparent 
        opacity={0.5} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}