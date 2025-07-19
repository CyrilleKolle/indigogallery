import { AnimatePresence, motion } from "framer-motion";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useCallback } from "react";
import NextImage from "next/image";
import { cn } from "@/utilities";

interface FullscreenViewerProps {
  file: string | null;
  year: string;
  onClose: () => void;
  description?: string;
}

const MotionImage = motion(NextImage);

export const FullscreenViewerComponent: React.FC<FullscreenViewerProps> = ({
  file,
  year,
  onClose,
  description = "No description available.",
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
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
            <MotionImage
              src={`/years/${year}/${file}`}
              alt={`Fullscreen photo ${file}`}
              width={1500}
              height={1000}
              className={IMAGE_CONTAINER}
              id={`photo-${file}`}
              layoutId={`photo-${file}`}
              loading="eager"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
            {description && (
              <motion.div className={IMAGE_INFO_CONTAINER}>
                <h2 className="sr-only">About image</h2>
                <p
                  aria-label={`Description of the image: ${description}`}
                  role="contentinfo"
                  tabIndex={0}
                  style={{ whiteSpace: "pre-line" }}
                  data-testid="image-description"
                  aria-live="polite"
                  className={DESCRIPTION_TEXT}
                >
                  {description}
                </p>
              </motion.div>
            )}
          </motion.div>
          <RetractButton ref={buttonRef} onClick={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CONTAINER_BASE =
  "fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/95 p-8";
const INNER_CONTAINER = cn(
  "relative max-h-full max-w-full flex items-center justify-center flex-col gap-4"
);
const IMAGE_CONTAINER = cn("object-contain max-h-[80vh] max-w-[90vw]");
const IMAGE_INFO_CONTAINER = cn(
  "flex flex-col items-center justify-between text-gray-300 p-4 rounded-lg backdrop-blur-sm h-full",
  "lg:max-w-6xl w-full "
);
const DESCRIPTION_TEXT = cn("text-gray-100 text-xl tracking-wider font-thin");

interface RetractButtonProps {
  onClick: () => void;
  className?: string;
  ref: React.Ref<HTMLButtonElement>;
}

export const RetractButton = React.forwardRef<
  HTMLButtonElement,
  RetractButtonProps
>(
  (
    {
      onClick,
      className = cn(
        "absolute top-30 right-30 p-2 rounded-full bg-indigo-600/45",
        "hover:bg-cyan-400 focus-visible:ring-2 ",
        "focus-visible:ring-offset-2 focus-visible:ring-cyan-400",
        "transition-colors duration-200",
        "text-gray-300 hover:text-indigo-900 transition-colors duration-200"
      ),
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        type="button"
        aria-hidden="true"
        aria-label="Close viewer"
        className={className}
        {...props}
      >
        <ArrowsPointingInIcon className="h-6 w-6 text-gray-300 hover:text-indigo-900 transition-colors duration-200" />
      </motion.button>
    );
  }
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
FullscreenViewer.displayName = "FullscreenViewer";
