"use client";

import React, { useState, useCallback } from "react";
import { motion, LayoutGroup } from "framer-motion";
import {
  LoadingImagesOverlay,
  MemoizedGalleryItem,
  VirtualizedGallery,
} from "./YearGalleryHelperComponents";

const VIRTUALIZE_THRESHOLD = 120;
const INITIAL_LOAD_TARGET = 12;

interface YearGalleryProps {
  year: string;
  files: string[];
}

const YearGalleryComponent: React.FC<YearGalleryProps> = ({ year, files }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);

  const toggleExpand = (file: string) => {
    setExpandedId((prev) => (prev === file ? null : file));
    setHoveredId(null);
  };
  const handleImageLoad = useCallback(() => {
    setLoadedCount((c) => c + 1);
  }, []);

  const showLoading = loadedCount < Math.min(INITIAL_LOAD_TARGET, files.length);
  const useVirtual = files.length > VIRTUALIZE_THRESHOLD;

  return (
    <motion.section
      className={SECTION_BASE}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.5,
        ease: [0.5, 0.62, 0.62, 0.5],
        type: "tween",
      }}
    >
      {useVirtual ? (
        //TODO: Implement VirtualizedGallery as it currently does not animate properly
        <VirtualizedGallery
          year={year}
          files={files}
          expandedId={expandedId}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          onToggleExpand={toggleExpand}
          onImageLoad={handleImageLoad}
        />
      ) : (
        <LayoutGroup>
          <motion.div className={GALLERY_GRID} layout>
            {files.map((file) => (
              <MemoizedGalleryItem
                key={`${year}/${file}`}
                file={file}
                year={year}
                expanded={expandedId === file}
                onToggleExpand={toggleExpand}
                onImageLoad={handleImageLoad}
                hovered={hoveredId === file}
                setHoveredId={setHoveredId}
                isDimmed={Boolean(expandedId) && hoveredId !== file}
              />
            ))}
          </motion.div>
        </LayoutGroup>
      )}

      {showLoading && <LoadingImagesOverlay />}
    </motion.section>
  );
};

const YearGallery = React.memo(YearGalleryComponent, (prevProps, nextProps) => {
  return (
    prevProps.year === nextProps.year &&
    prevProps.files.length === nextProps.files.length &&
    prevProps.files.every((f, i) => f === nextProps.files[i])
  );
});
export { YearGallery };
export default YearGallery;

const SECTION_BASE =
  "py-8 px-4 md:px-8 flex flex-col items-center gap-8 z-50 fixed inset-0 pointer-events-auto max-h-screen overflow-y-auto top-20 mx-auto h-fit my-auto ";

const GALLERY_GRID =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full max-w-6xl bg-gray-900 p-4 rounded-lg shadow-lg opacity-95 transition-opacity duration-200 overflow-visible shadow-cyan-50/5 shadow-xl";
