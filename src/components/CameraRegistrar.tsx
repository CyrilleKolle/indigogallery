import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useGlobeStore } from "@/store/useGlobeStore";
import type { OrbitControls as ThreeOrbitControls } from "three-stdlib";

export default function CameraRegistrar({
  controlsRef,
}: {
  controlsRef: React.RefObject<ThreeOrbitControls | null>;
}) {
  const { camera } = useThree();
  const register = useGlobeStore((s) => s.register);

  useEffect(() => {
    if (controlsRef.current) {
      register(camera as any, controlsRef.current);
    }
  }, [camera, register, controlsRef]);

  return null;
}
