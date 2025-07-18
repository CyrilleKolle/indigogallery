"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { FixedSizeGrid as Grid } from "react-window";
import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const AutoSizer = dynamic(() => import("react-virtualized-auto-sizer"), {
  ssr: false,
});

const SCROLL_OPTS: ScrollIntoViewOptions = {
  behavior: "smooth",
  block: "center",
};

interface GalleryItemProps {
  file: string;
  year: string;
  expanded: boolean;
  hovered: boolean;
  isDimmed: boolean;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
  onToggleExpand: (file: string) => void;
  onImageLoad: () => void;
}

interface VirtualizedGalleryProps {
  year: string;
  files: string[];
  expandedId: string | null;
  hoveredId: string | null;
  setHoveredId: React.Dispatch<React.SetStateAction<string | null>>;
  onToggleExpand: (file: string) => void;
  onImageLoad: () => void;
}

/**
 * Overlay shown while images are loading.
 * Displays a spinner centered on the screen.
 */
export const LoadingImagesOverlay = () => {
  const messages = [
    "memories",
    "first steps",
    "laughters",
    "adventures",
    "journeys",
    "smiles",
    "sunsets",
    "moments",
    "discoveries",
    "dreams",
    "wonders",
    "happiness",
    "joys",
    "explorations",
  ];
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % messages.length),
      1600
    );
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-gray-900/60">
      <div className="relative flex items-center justify-center">
        <div className="w-48 h-48 rounded-full animate-spin rainbow-ring"></div>
        <div className="absolute flex flex-col items-center text-indigo-50 font-medium">
          <span className="text-2xl">Loading</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={messages[idx]}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.5, 0.62, 0.62, 0.5],
                type: "tween",
              }}
              className="text-2xl tracking-wide text-gray-300"
            >
              {messages[idx]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/**
 * Virtualized gallery component that displays images in a grid.
 * Uses react-window for efficient rendering of large lists.
 * @param param0
 * @returns
 */
const VirtualizedGallery: React.FC<VirtualizedGalleryProps> = ({
  year,
  files,
  expandedId,
  hoveredId,
  setHoveredId,
  onToggleExpand,
  onImageLoad,
}) => {
  const gridOuterRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="w-full h-[70vh] max-w-6xl" ref={gridOuterRef}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => {
          const columnWidth = 220;
          const rowHeight = 220;
          const columnCount = Math.max(1, Math.floor(width / columnWidth));
          const rowCount = Math.ceil(files.length / columnCount);

          return (
            <Grid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
              outerRef={gridOuterRef}
            >
              {({ columnIndex, rowIndex, style }) => {
                const index = rowIndex * columnCount + columnIndex;
                if (index >= files.length) return null;
                const file = files[index];
                return (
                  <div style={style} className="p-2">
                    <MemoizedGalleryItem
                      file={file}
                      year={year}
                      expanded={expandedId === file}
                      onToggleExpand={onToggleExpand}
                      onImageLoad={onImageLoad}
                      hovered={hoveredId === file}
                      setHoveredId={setHoveredId}
                      isDimmed={hoveredId !== file && !expandedId}
                    />
                  </div>
                );
              }}
            </Grid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export { VirtualizedGallery };

/**
 * Gallery item component that displays a single image.
 * Handles hover and click events to expand or collapse the image.
 * @param param0
 * @returns
 */
export function GalleryItem({
  file,
  year,
  expanded,
  hovered,
  isDimmed,
  setHoveredId,
  onToggleExpand,
  onImageLoad,
}: GalleryItemProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (expanded && cardRef.current) {
      cardRef.current.scrollIntoView(SCROLL_OPTS);
    }
  }, [expanded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggleExpand(file);
    }
  };

  const handleHoverStart = () => !expanded && setHoveredId(file);
  const handleHoverEnd = () =>
    setHoveredId((prev) => (prev === file ? null : prev));

  const cardShadow =
    hovered && !expanded
      ? "0px 16px 24px rgba(0,0,0,0.18)"
      : "0px 4px  6px  rgba(0,0,0,0.12)";
  const cardScale = hovered && !expanded ? 1 : 1;

  const imgVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.15, rotate: 0 },
  };

  return (
    <motion.div
      ref={cardRef}
      key={file}
      layout={!expanded}
      layoutId={file}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => onToggleExpand(file)}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      animate={{ scale: cardScale, boxShadow: cardShadow }}
      className={clsx(
        "relative overflow-hidden rounded-lg cursor-pointer",
        expanded ? "z-20" : "shadow-lg"
      )}
      style={expanded ? { gridColumn: "span 3", gridRow: "span 3" } : {}}
      transition={{
        duration: 0.2,
        ease: [0.5, 0.62, 0.62, 0.5],
        type: "tween",
      }}
      whileHover={expanded ? "rest" : "hover"}
      initial="rest"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        variants={imgVariants}
        className="w-full h-full"
        style={expanded ? { originX: 0.5, originY: 0.5 } : {}}
        transition={
          expanded
            ? { duration: 0.4, ease: [0.5, 0.62, 0.62, 0.5], type: "tween" }
            : {}
        }
      >
        <Image
          src={`/years/${year}/${file}`}
          alt={`Photo from ${year} – ${file.replace(/\.[^/.]+$/, "")}`}
          width={200}
          height={200}
          className={clsx("w-full h-full object-cover pointer-events-none")}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          onLoad={onImageLoad}
        />
      </motion.div>
      <AnimatePresence>
        {!expanded && isDimmed && (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.5, 0.62, 0.62, 0.5],
              type: "tween",
            }}
            className={IMAGE_OVERLAY}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export const MemoizedGalleryItem = React.memo(GalleryItem);
MemoizedGalleryItem.displayName = "MemoizedGalleryItem";

const IMAGE_OVERLAY = clsx(
  "absolute inset-0 bg-black/60 z-90 pointer-events-none backdrop-saturate-20"
);
