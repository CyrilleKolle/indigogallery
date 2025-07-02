import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useGlobeStore } from "@/store/useGlobeStore";

export function CameraRegistrar() {
  const { camera, controls } = useThree();
  const register = useGlobeStore((s) => s.register);

  useEffect(() => {
    if (controls) register(camera as any, controls as any);
  }, [camera, controls, register]);

  return null;
}
