import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useCallback, useState, useRef } from "react";
import { cn } from "@/utilities";
import { useCharLimit } from "@/store/useCharLimit";
import { DESCRIPTION_LIMIT } from "@/lib/upload-schema";
import {
  DescriptionBar,
  ImageDisplay,
  RetractButton,
} from "./FullScreenComponents";

interface FullscreenViewerProps {
  file: string | null;
  year: string;
  onClose: () => void;
  description?: string;
}

export const FullscreenViewerComponent: React.FC<FullscreenViewerProps> = ({
  file,
  year,
  onClose,
  description = "No description available.",
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [editingDescription, setEditingDescription] = useState(
    description.length === 0
  );

  const { value, onChange, error, length, setValue } =
    useCharLimit(DESCRIPTION_LIMIT);
  const savedDescription = useRef(description);

  const escHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  /*   * Closes the overlay when clicking outside the image or pressing Escape.
   * The buttonRef is used to focus the close button after the animation completes. */
  useEffect(() => {
    if (!file) return;
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [file, escHandler]);

  const handleCancel = useCallback(() => {
    setValue(savedDescription.current);
    setEditingDescription(false);
  }, [setValue, savedDescription]);

  const handleSave = useCallback(() => {
    savedDescription.current = value;
    // TODO: Save the description to the server or state management
    setEditingDescription(false);
  }, [value, setEditingDescription]);

  const handleStartEdit = useCallback(() => {
    setEditingDescription(true);
  }, [setEditingDescription]);
  return (
    <AnimatePresence>
      {file && (
        <motion.div
          key="overlay"
          className={cn(CONTAINER_BASE)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.5, 0.52, 0.52, 0.5],
            type: "tween",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={onClose}
          onAnimationComplete={() => {
            buttonRef.current?.focus();
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.5, 0.52, 0.52, 0.5],
              type: "tween",
            }}
            className={INNER_CONTAINER}
          >
            <ImageDisplay
              src={`/years/${year}/${file}`}
              alt={`Fullscreen photo ${file}`}
              layoutId={`photo-${file}`}
            />

            <DescriptionBar
              editing={editingDescription}
              value={value}
              length={length}
              error={error}
              onChange={onChange}
              onSave={handleSave}
              startEdit={handleStartEdit}
              onCancel={handleCancel}
            />
          </motion.div>
          <RetractButton ref={buttonRef} onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CONTAINER_BASE = cn(
  "fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/95",
  "p-[var(--viewer-pad-inline)] py-16",
  "overflow-y-auto"
);
const INNER_CONTAINER = cn(
  "grid w-full h-full max-w-6xl max-h-[98vh]",
  "grid-rows-[1fr_auto] gap-4"
);

export const FullscreenViewer = React.memo(
  FullscreenViewerComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.file === nextProps.file &&
      prevProps.year === nextProps.year &&
      prevProps.description === nextProps.description &&
      prevProps.onClose === nextProps.onClose
    );
  }
);

RetractButton.displayName = "RetractButton";
FullscreenViewer.displayName = "FullscreenViewer";
