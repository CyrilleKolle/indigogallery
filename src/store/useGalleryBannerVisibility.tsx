"use client";

import React from "react";

export function useVisibility(
  targetRef: React.RefObject<Element | null>,
  {
    root = null,
    rootMargin = "0px",
    threshold = 0,
  }: { root?: Element | null; rootMargin?: string; threshold?: number } = {}
) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { root, rootMargin, threshold }
    );
    io.observe(target);
    return () => io.disconnect();
  }, [targetRef, root, rootMargin, threshold]);
  return visible;
}
