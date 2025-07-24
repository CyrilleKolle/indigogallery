import { motion } from "framer-motion";
import React, { useEffect } from "react";
import NextImage from "next/image";
import { cn } from "@/utilities";
import { DESCRIPTION_LIMIT } from "@/lib/upload-schema";
import { BracketButton } from "@/components/ClientHeaderHelperComponents";
import { ArrowsPointingInIcon } from "@heroicons/react/24/outline";

const MotionImage = motion(NextImage);

interface ImageDisplayProps {
  src: string;
  alt: string;
  layoutId: string;
}
/*
 * ImageDisplay component for displaying images in the fullscreen viewer.
 * It uses Next.js Image component wrapped in a motion component for animations.
 */
export const ImageDisplayComp: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  layoutId,
}) => (
  <MotionImage
    src={src}
    alt={alt}
    layoutId={layoutId}
    width={1920}
    height={1080}
    className={IMAGE_CONTAINER}
    priority
    loading="eager"
    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
  />
);

interface DescBarProps {
  editing: boolean;
  value: string;
  length: number;
  error: string | null;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onSave: () => void;
  startEdit: () => void;
  onCancel: () => void;
}
/*
 * DescriptionBar component for editing and displaying image descriptions.
 * It allows toggling between edit mode and display mode with character limit validation.
 */
export const DescriptionBarComp: React.FC<DescBarProps> = ({
  editing,
  value,
  length,
  error,
  onChange,
  onSave,
  startEdit,
  onCancel,
}) => {
  const limitReached = length >= DESCRIPTION_LIMIT;

  useEffect(() => {
    if (!editing) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [editing, onCancel]);

  return (
    <motion.div layout className={INFO_BAR}>
      {editing ? (
        <motion.div>
          <textarea
            value={value}
            onChange={onChange}
            className={TEXT_AREA}
            rows={3}
            maxLength={DESCRIPTION_LIMIT}
            placeholder="Add a description…"
          />
          <motion.div className={BUTTON_CONTAINER}>
            <span
              className={
                (error ?? limitReached) ? "text-rose-500" : "text-gray-300"
              }
            >
              {error ?? `${length}/${DESCRIPTION_LIMIT}`}
            </span>
            <motion.div className="flex gap-2">
              <motion.button
                disabled={!!error || length === 0}
                onClick={onSave}
                className={SAVE_BUTTON}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
              <motion.button
                onClick={onCancel}
                className={CANCEL_BUTTON}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // disabled={isPending}
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div className="flex flex-col gap-12">
          <p
            aria-label={`Description of the image: ${value}`}
            role="contentinfo"
            tabIndex={0}
            style={{ whiteSpace: "pre-line" }}
            data-testid="image-description"
            aria-live="polite"
            className={DESCRIPTION_TEXT}
          >
            {/* {value} */}
            {value || "No description provided yet."}
          </p>
          <motion.div className="flex justify-end">
            <BracketButton
              label="Edit description"
              onClick={startEdit}
              extraClassName={EDIT_DESCRIPTION}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

interface RetractButtonProps {
  onClick: () => void;
  className?: string;
  ref: React.Ref<HTMLButtonElement>;
}

export const RetractButton = React.forwardRef<
  HTMLButtonElement,
  RetractButtonProps
>(({ onClick, className = RETRACT_BUTTON, ...props }, ref) => {
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
      <ArrowsPointingInIcon className={ARROW_POINTING_IN_ICON} />
    </motion.button>
  );
});

const EDIT_DESCRIPTION = cn("text-purple-500 hover:text-teal-400");

const TEXT_AREA = cn(
  "w-full bg-gray-800 rounded p-2 text-gray-300",
  "focus:outline-none placeholder:text-gray-500"
);
const BUTTON_CONTAINER = cn(
  "flex justify-between text-sm w-full mt-1 md:mt-2 md:text-base lg:text-lg"
);
const SAVE_BUTTON = cn(
  "px-4 md:px-6 py-1 md:py-2 rounded-lg bg-sky-700 hover:bg-cyan-400 disabled:bg-gray-700 hover:text-indigo-700 disabled:cursor-not-allowed hover:disabled:text-gray-400 disabled:text-gray-500",
  "transition-colors font-semibold tracking-wide"
);
const CANCEL_BUTTON = cn(
  "px-4 md:px-6 py-1 md:py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-indigo-900 transition-colors duration-200"
);
const ARROW_POINTING_IN_ICON = cn(
  "h-6 w-6 text-gray-300 hover:text-indigo-900 transition-colors duration-200"
);

const RETRACT_BUTTON = cn(
  "absolute top-3 right-4 md:top-30 md:right-30 p-2 rounded-full bg-purple-600",
  "hover:bg-teal-400 focus-visible:ring-2 ",
  "focus-visible:ring-offset-2 focus-visible:ring-cyan-400",
  "transition-colors duration-200",
  "text-gray-300 hover:text-indigo-900 transition-colors duration-200"
);
const IMAGE_CONTAINER = cn(
  "object-contain w-full max-h-[var(--viewer-max-img-h)] justify-self-center"
);
const DESCRIPTION_TEXT = cn("text-gray-100 text-xl tracking-wider font-thin");
const INFO_BAR = cn(
  "flex flex-col gap-3 justify-end",
  "w-full ",
  "text-gray-300 pb-1 md:pb-6 lg:pb-8"
);

export const DescriptionBar: React.FC<DescBarProps> = React.memo(
  DescriptionBarComp,
  (prevProps, nextProps) => {
    return (
      prevProps.editing === nextProps.editing &&
      prevProps.value === nextProps.value &&
      prevProps.length === nextProps.length &&
      prevProps.error === nextProps.error
    );
  }
);

export const ImageDisplay: React.FC<ImageDisplayProps> = React.memo(
  ImageDisplayComp,
  (prevProps, nextProps) => {
    return (
      prevProps.src === nextProps.src &&
      prevProps.alt === nextProps.alt &&
      prevProps.layoutId === nextProps.layoutId
    );
  }
);
