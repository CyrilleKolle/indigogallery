"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";

export default function LoadingOverlay() {
  const { active, progress, item } = useLoading();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const id = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(id);
    } else {
      setVisible(true);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-none">
      <div className="text-white text-center">
        <h1 className="text-4xl">Entering space… {item}</h1>
        <p>{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
