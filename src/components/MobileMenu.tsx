import { AnimatePresence, motion } from "framer-motion";
import { BracketButton } from "./ClientHeaderHelperComponents";
import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utilities";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
  onSignOut: () => void;
  isGalleryOpen: boolean;
  year: number | undefined;
  closeGallery: () => void;
  direction: number;
  isUploadButtonPressed: boolean;
  onCancelUpload: () => void;
}
const MobileMenuComponent: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  onUpload,
  onSignOut,
  isGalleryOpen,
  year,
  closeGallery,
  isUploadButtonPressed,
  onCancelUpload,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  const handleUploadClick = useCallback(() => {
    onClose();
    if (isUploadButtonPressed) {
      onCancelUpload();
    } else {
      onUpload();
    }
  }, [onClose, isUploadButtonPressed, onUpload, onCancelUpload]);

  const handleCloseGallery = useCallback(() => {
    onClose();
    if (isGalleryOpen) {
      closeGallery();
    }
  }, [onClose, isGalleryOpen, closeGallery]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="mmenu"
          className={MOBILE_MENU_BASE}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            duration: 0.4,
            ease: [0.8, 0.77, 0.77, 0.8],
            type: "tween",
          }}
          role="navigation"
          aria-label="Mobile menu"
          data-testid="mobile-menu"
        >
          <BracketButton
            disabled={!isGalleryOpen}
            label={isGalleryOpen ? `close year ${year}` : "indigo's gallery"}
            onClick={handleCloseGallery}
          />
          <BracketButton
            label={isUploadButtonPressed ? "cancel upload" : "upload photos"}
            onClick={handleUploadClick}
          />
          <BracketButton label="sign out" onClick={onSignOut} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

const BodyPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
};

export const MobileMenu: React.FC<MobileMenuProps> = (props) => (
  <BodyPortal>
    <MobileMenuComponent {...props} />
  </BodyPortal>
);

const MOBILE_MENU_BASE = cn(
  "fixed inset-y-0 right-0 z-[300] w-[78vw] max-w-xs",
  "bg-gray-900/95 shadow-xl flex flex-col px-4 py-5 space-y-8 backdrop-blur-sm md:hidden"
);
