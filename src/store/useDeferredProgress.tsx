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

export function useDeferredProgress(): ProgressState {
  const raw = useProgress();
  const [state, setState] = useState<ProgressState>(raw);

  useEffect(() => {
    setState(raw);
  }, [raw]);

  return state;
}
