import { AnimatePresence, cubicBezier, motion } from "framer-motion";
import React from "react";
import { BracketButton } from "./ClientHeaderHelperComponents";
import { cn } from "@/utilities";

interface BannerProps {
  year: string;
  isVisible: boolean;
  scrollTopFunction?: () => void;
}

const BannerComponent: React.FC<BannerProps> = ({
  year,
  isVisible,
  scrollTopFunction,
}) => {
  return (
    <AnimatePresence>
      {!isVisible && (
        <motion.aside
          key={`gallery-banner-${year}`}
          variants={BANNER_VARIANTS}
          initial={"hidden"}
          animate={!isVisible ? "shown" : "hidden"}
          className={BANNER_BASE}
          style={{ opacity: !isVisible ? 1 : 0 }}
          transition={BANNER_TRANSITION}
          role="banner"
          aria-label={`Gallery banner for ${year}`}
          data-testid="gallery-banner"
          data-year={year}
          data-visible={!isVisible}
          data-animate={!isVisible ? "shown" : "hidden"}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.4,
              type: "tween",
              ease: cubicBezier(0.2, 0.62, 0.62, 0.5),
            },
          }}
        >
          <motion.h2 variants={BANNER_TEXT_VARIANTS} className={BANNER_TEXT}>
            Window into how {year} looked like
          </motion.h2>
          <BracketButton
            label="back to top"
            onClick={scrollTopFunction}
            layout="size"
          />
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export const Banner = React.memo(BannerComponent, (prevProps, nextProps) => {
  return (
    prevProps.year === nextProps.year &&
    prevProps.isVisible === nextProps.isVisible
  );
});
export default Banner;

const BANNER_BASE = cn(
  "sticky top-0 z-100 w-full backdrop-blur-md p-2  md:p-4 transition-opacity duration-200 bg-gray-900/60 shadow-lg shadow-cyan-50/5",
  "flex items-center justify-between md:gap-4"
);
const BANNER_TEXT =
  "text-lg/2 md:text-2xl font-medium tracking-wide text-gray-300 uppercase max-w-[65%] leading-none";
const BANNER_TRANSITION = {
  duration: 0.4,
  ease: cubicBezier(0.5, 0.62, 0.62, 0.5),
  delay: 0.5,
  type: "tween" as const,
};
const BANNER_VARIANTS = {
  hidden: { opacity: 0, transition: { duration: 0.4 } },
  shown: { opacity: 1, transition: { duration: 0.4 } },
};
const BANNER_TEXT_VARIANTS = {
  hidden: { y: 20, opacity: 0, transition: { duration: 0.4 } },
  shown: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};
