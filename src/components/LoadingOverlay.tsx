"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import clsx from "clsx";

const BLACK_ALPHA_7 = "rgba(0,0,0,0.70)";
const BLACK_ALPHA_0 = "rgba(0,0,0,0)";

export default function LoadingOverlay() {
  const { active, progress, item } = useLoading();
  const [show, setShow] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!active && progress === 100) {
      const id = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(id);
    }
    setShow(true);
  }, [active, progress]);

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  return (
    <AnimatePresence>
      <LayoutGroup>
        {show && (
          <motion.div
            key="overlay"
            className={LOADING_CONTAINER}
            initial={false}
            style={{ backgroundColor: BLACK_ALPHA_7 }}
            animate={{ backgroundColor: BLACK_ALPHA_7 }}
            exit={{ backgroundColor: BLACK_ALPHA_0 }}
            transition={{
              duration: 0.3,
              ease: [0.5, 0.62, 0.62, 0.5],
              delay: 0.1,
              type: "tween",
            }}
          >
            <motion.div
              className={INNER_LOADING}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.5, 0.62, 0.62, 0.5],
                delay: 0.1,
                type: "tween",
              }}
            >
              <h1 className="text-4xl">Entering space… {item}</h1>
              <p>{Math.round(progress)}%</p>
            </motion.div>
          </motion.div>
        )}
      </LayoutGroup>
    </AnimatePresence>
  );
}

const LOADING_CONTAINER = clsx(
  "fixed inset-0 z-20 flex items-center justify-center backdrop-blur-sm pointer-events-auto"
);

const INNER_LOADING = clsx("text-white text-center select-none");
