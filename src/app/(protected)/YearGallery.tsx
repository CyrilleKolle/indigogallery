"use client";

import React, { useState, useCallback } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import {
  LoadingImagesOverlay,
  MemoizedGalleryItem,
  VirtualizedGallery,
} from "./YearGalleryHelperComponents";

import { cn } from "@/utilities";
import Banner from "@/components/GalleryBanner";
import { useVisibility } from "@/store";
import { FullscreenViewer } from "./FullscreenViewer";
import { PageWrapper } from "./upload/UploadClientComponents";

const VIRTUALIZE_THRESHOLD = 220;
const INITIAL_LOAD_TARGET = 5;

interface YearGalleryProps {
  year: string;
  files: string[];
}

const YearGalleryComponent: React.FC<YearGalleryProps> = ({ year, files }) => {
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [overlayId, setOverlayId] = useState<string | null>(null);

  const mainRoot =
    typeof window !== "undefined"
      ? document.getElementById("main-content")
      : null;
  const isVisible = useVisibility(sentinelRef, {
    root: mainRoot,
    rootMargin: "-5px 0px 0px 0px",
  });

  const toggleExpand = (file: string) => {
    setExpandedId((prev) => (prev === file ? null : file));
    setHoveredId(null);
  };
  const handleImageLoad = useCallback(() => {
    setLoadedCount((c) => c + 1);
  }, []);

  const handleScrollTop = useCallback(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sectionRef]);

  const handleOpenImageInOverlay = useCallback(
    (file: string) => {
      setOverlayId(file);
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    },
    [sectionRef]
  );

  const handleOnCloseOverlay = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      setOverlayId(null);
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    },
    [sectionRef]
  );

  const showLoading = loadedCount < Math.min(INITIAL_LOAD_TARGET, files.length);
  const useVirtual = files.length > VIRTUALIZE_THRESHOLD;

  return (
    <AnimatePresence>
      <LayoutGroup>
        <motion.div
          className={cn(GALLERY_CONTAINER, COMMON_BASE)}
          layout
          key={`year-gallery-${year}`}
        >
          <PageWrapper
            key={`year-gallery-section-${year}`}
            ref={sectionRef}
            id={`year-gallery-${year}`}
            className={cn(SECTION_BASE)}
            data-year={year}
          >
            <Banner
              year={year}
              isVisible={isVisible}
              scrollTopFunction={handleScrollTop}
            />
            <div ref={sentinelRef} className="h-px w-full" />
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
                <motion.div
                  className={GALLERY_GRID}
                  layout
                  key={`gallery-grid-${year}`}
                >
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
                      openImageOverlay={handleOpenImageInOverlay}
                    />
                  ))}
                </motion.div>
              </LayoutGroup>
            )}
            {showLoading && <LoadingImagesOverlay />}
          </PageWrapper>
        </motion.div>
        <FullscreenViewer
          key="fullscreen-viewer"
          file={overlayId}
          year={year}
          onClose={handleOnCloseOverlay}
        />
      </LayoutGroup>
    </AnimatePresence>
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

const GALLERY_CONTAINER = cn(
  "max-w-[90vw] lg:max-w-4xl xl:max-w-6xl relative z-90 rounded-2xl",
  "my-auto"
);
const COMMON_BASE = cn(
  "flex flex-col items-center h-fit  overflow-y-auto",
  "w-full mx-auto bg-gray-900/90 shadow-lg shadow-cyan-50/5",
  "transition-opacity duration-200"
);

const SECTION_BASE = cn(
  "w-full mx-auto rounded-2xl",
  "py-3 px-3 md:px-8 md:py-8 flex ",
  "flex-col items-center relative z-90"
);
const GALLERY_GRID = cn(
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full transition-opacity duration-200 mx-auto"
);
