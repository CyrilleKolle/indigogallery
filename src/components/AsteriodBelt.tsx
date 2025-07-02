import { useMemo } from "react";
import * as THREE from "three";
type AsteroidBeltProps = {
  innerR: number;
  outerR: number;
  count?: number;
};

export function AsteroidBelt({
  innerR,
  outerR,
  count = 1000,
}: AsteroidBeltProps) {
  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const θ = Math.random() * 2 * Math.PI;
      const r = innerR + Math.random() * (outerR - innerR);
      const x = Math.cos(θ) * r;
      const z = Math.sin(θ) * r;
      const y = (Math.random() - 0.5) * 0.05;
      pts.set([x, y, z], i * 3);
    }
    return pts;
  }, [innerR, outerR, count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          usage={THREE.DynamicDrawUsage}
          normalized={false}
          onUpload={(attr: THREE.BufferAttribute) => {
            if (attr) {
              attr.needsUpdate = true;
            }
          }}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#888" depthWrite={false} 
        transparent 
        opacity={0.9} 
        sizeAttenuation={true} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
