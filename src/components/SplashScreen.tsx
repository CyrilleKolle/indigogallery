"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import type { AnimationItem } from "lottie-web";

const MESSAGES = [
  "Taking off into the cosmos...",
  "Entering the Indigo Galaxy...",
  "Exploring the stars...",
  "Charting new worlds...",
  "Discovering cosmic wonders...",
  "Navigating the universe...",
];
export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [tagline, cycleTagline] = useCycle(...MESSAGES);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: AnimationItem;
    import("lottie-web").then((lottie) => {
      if (containerRef.current) {
        anim = lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/spaceship.json",
        });

        anim.addEventListener("complete", () => {
          onFinish();
        });
      }
    });

    document.cookie = "intro-shown=true; path=/";

    return () => {
      anim?.destroy();
    };
  }, [onFinish]);

  useEffect(() => {
    const id = setInterval(cycleTagline, 2000);
    return () => clearInterval(id);
  }, [cycleTagline]);

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex flex-col items-center justify-center
                   bg-[radial-gradient(circle_at_center,_#000016,_#000)]
                   z-50"
      >
        <div ref={containerRef} className="w-72 h-72" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="mt-4 text-white text-lg"
          role="status"
          aria-live="polite"
        >
          {tagline}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
