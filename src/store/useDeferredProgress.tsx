import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

interface ProgressState {
  active: boolean;
  progress: number;
  item: string | undefined;
  errors: string[];
  loaded: number;
  total: number;
}

// wrap the drei hook so updates only flow through an effect
export function useDeferredProgress(): ProgressState {
  const raw = useProgress();
  const [state, setState] = useState<ProgressState>(raw);

  // whenever any of these fields change, schedule an update *after* render
  useEffect(() => {
    setState(raw);
  }, [
    raw.active,
    raw.progress,
    raw.item,
    raw.loaded,
    raw.total,
    raw.errors.join(","),
  ]);

  return state;
}
