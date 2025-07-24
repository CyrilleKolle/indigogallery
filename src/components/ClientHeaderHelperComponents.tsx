"use client";

import { motion, Variants } from "framer-motion";
import React, { ComponentPropsWithoutRef, memo } from "react";
import clsx from "clsx";
import { cn } from "@/utilities";

const slideVariants: Variants = {
  initial: (dir: number) => ({ opacity: 0, y: dir * -24 }),
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      stiffness: 380,
      damping: 32,
      duration: 0.4,
      ease: [0.5, 0.62, 0.62, 0.5],
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir * 24,
    transition: {
      type: "tween",
      stiffness: 380,
      damping: 32,
      duration: 0.4,
      ease: [0.5, 0.62, 0.62, 0.5],
    },
  }),
};

interface BracketButtonProps
  extends ComponentPropsWithoutRef<typeof motion.button> {
  label: string;
  layout?: "position" | "size";
  extraClassName?: string;
  brackets?: boolean;
}

export const BracketButton = memo(
  ({
    label,
    layout = "position",
    extraClassName,
    brackets = true,
    ...rest
  }: BracketButtonProps) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(BTN_BASE, extraClassName)}
      layout={layout}
      {...rest}
    >
      {brackets && (
        <span className={clsx(HOVER_SPAN, "group-hover:scale-125")}>[</span>
      )}
      <span className={clsx(HOVER_SPAN, "group-hover:scale-90")}>{label}</span>
      {brackets && (
        <span className={clsx(HOVER_SPAN, "group-hover:scale-125")}>]</span>
      )}
    </motion.button>
  )
);
BracketButton.displayName = "BracketButton";

interface GalleryControlsProps {
  galleryControlLabel: string;
  onClose(): void;
  custom?: number;
  closeButtonLabel?: string;
}

export const GalleryControls = memo(
  ({
    galleryControlLabel,
    onClose,
    custom,
    closeButtonLabel,
  }: GalleryControlsProps) => (
    <motion.div
      className="flex items-center gap-6"
      custom={custom}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h1 layout="position" className={TITLE_STYLE}>
        <span className={clsx(HOVER_SPAN, "group-hover:scale-125")}>[</span>
        <span className={clsx(HOVER_SPAN, "group-hover:scale-90")}>
          {galleryControlLabel}
        </span>
        <span className={clsx(HOVER_SPAN, "group-hover:scale-125")}>]</span>
      </motion.h1>

      <BracketButton label={closeButtonLabel ?? "close"} onClick={onClose} />
    </motion.div>
  )
);
GalleryControls.displayName = "GalleryControls";

export const BrandHeading = memo(({ custom }: { custom: number }) => (
  <motion.h1
    variants={slideVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    custom={custom}
    layout="position"
    className={TITLE_STYLE}
  >
    Indigo&apos;s&nbsp;Gallery
  </motion.h1>
));
BrandHeading.displayName = "BrandHeading";

const HOVER_SPAN =
  "transform inline-block origin-center transition-transform duration-200";
const TITLE_STYLE = clsx(
  "group flex flex-row gap-1 md:gap-2 text-lg/2 md:text-2xl text-gray-300 uppercase",
  "tracking-wide select-none transition-colors duration-150 hover:text-indigo-300 justify-between"
);
const BTN_BASE = clsx(
  "group inline-flex items-start gap-1 md:gap-2 text-lg/2 md:text-2xl text-gray-300 uppercase",
  "transition-colors duration-150 hover:text-indigo-300 cursor-pointer"
);
