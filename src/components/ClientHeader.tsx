"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { clientAuth } from "@/lib/firebaseClient";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useGlobeStore } from "@/store/useGlobeStore";
import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useLoading } from "@/contexts/LoadingContext";
import {
  BracketButton,
  BrandHeading,
  GalleryControls,
} from "./ClientHeaderHelperComponents";
import { HamburgerIcon } from "./HamburgerIcon";
import { MobileMenu } from "./MobileMenu";

function ClientHeaderComponent() {
  const router = useRouter();
  const reset = useGlobeStore((s) => s.reset);
  const { active, progress } = useLoading();
  const [isUploadButtonPressed, setIsUploadButtonPressed] = useState(false);

  const [showHeader, setShowHeader] = useState(false);
  const focused = useGlobeStore((s) => s.mode);
  const year = useGlobeStore((s) => s.focusedYear);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isGalleryOpen = focused === "focused";
  const direction = isGalleryOpen ? 1 : -1;

  const headerVariants = {
    hidden: { opacity: 0, y: -10, pointerEvents: "none" as const },
    visible: { opacity: 1, y: 0, pointerEvents: "auto" as const },
  };

  useEffect(() => {
    if (!active && progress === 100) {
      const id = setTimeout(() => setShowHeader(true), 500);
      return () => clearTimeout(id);
    }
    setShowHeader(false);
  }, [active, progress]);

  const handleUpload = useCallback(() => {
    setIsUploadButtonPressed((prev) => !prev);
    router.push("/upload");
  }, [setIsUploadButtonPressed, router]);

  const handleSignOut = useCallback(async () => {
    await signOut(clientAuth);
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    router.replace("/login");
  }, [router]);

  const handleCloseGallery = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  const handleCloseUpload = useCallback(() => {
    setIsUploadButtonPressed((prev) => !prev);
    router.back();
  }, [setIsUploadButtonPressed, router]);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <LayoutGroup>
          <motion.header
            layout
            variants={headerVariants}
            className={HEADER_STYLE}
            animate={showHeader ? "visible" : "hidden"}
            transition={{
              duration: 0.8,
              ease: [0.5, 0.62, 0.62, 0.5],
              type: "tween",
            }}
          >
            <motion.div className={INNER_HEADER_STYLE} layout>
              <div className="hidden md:block">
                <AnimatePresence mode="wait" custom={direction}>
                  {isUploadButtonPressed ? (
                    <GalleryControls
                      key="uploading"
                      galleryControlLabel={"uploading photos"}
                      onClose={handleCloseUpload}
                      custom={direction}
                      closeButtonLabel="cancel upload"
                    />
                  ) : (
                    <BracketButton
                      label="upload photos"
                      onClick={handleUpload}
                    />
                  )}
                </AnimatePresence>
              </div>
              <HamburgerIcon
                open={mobileMenuOpen}
                toggle={() => setMobileMenuOpen((prev) => !prev)}
              />
              <AnimatePresence mode="wait" custom={direction}>
                {isGalleryOpen ? (
                  <GalleryControls
                    key="gallery"
                    galleryControlLabel={
                      year !== null ? `year ${year}` : "2022"
                    }
                    onClose={handleCloseGallery}
                    custom={direction}
                    closeButtonLabel="close gallery"
                  />
                ) : (
                  <BrandHeading key="brand" custom={direction} />
                )}
              </AnimatePresence>
              <div className="hidden md:block">
                <BracketButton label="sign out" onClick={handleSignOut} />
              </div>
            </motion.div>
          </motion.header>
        </LayoutGroup>
      </AnimatePresence>
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen((prev) => !prev)}
        onUpload={handleUpload}
        onSignOut={handleSignOut}
        isGalleryOpen={isGalleryOpen}
        year={year}
        closeGallery={handleCloseGallery}
        direction={direction}
        isUploadButtonPressed={isUploadButtonPressed}
        onCancelUpload={handleCloseUpload}
      />
    </>
  );
}
const ClientHeader = React.memo(ClientHeaderComponent);
export default ClientHeader;

ClientHeader.displayName = "ClientHeader";

const HEADER_STYLE = clsx(
  "relative w-full max-w-6xl mx-auto h-auto top-2 px-4 z-90 mb-12"
);
const INNER_HEADER_STYLE = clsx(
  "flex items-center justify-between w-full h-full z-90"
);
