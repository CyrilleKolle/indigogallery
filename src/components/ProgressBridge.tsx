"use client";

import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { useSetLoading } from "@/contexts/LoadingContext";

/** Must live inside <Canvas> so that useProgress works */
export default function ProgressBridge() {
  const { active, progress, item } = useProgress();
  const setLoading = useSetLoading();

  useEffect(() => {
    setLoading({ active, progress, item });
  }, [active, progress, item, setLoading]);

  return null;
}
