"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { GalleryPhotoImg } from "@/components/ui/gallery-photo-img";

type LightboxPhoto = {
  url: string;
  caption?: string | null;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
};

export function GalleryLightbox({
  photos,
  initialIndex,
  onClose,
}: {
  photos: LightboxPhoto[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const photo = photos[index];

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)",
    }),
  };

  if (!mounted) return null;

  const content = (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Floating Top-Right Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close Lightbox"
        className="fixed right-3 top-3 sm:right-5 sm:top-5 z-[9999999] flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#e11d48] hover:bg-[#be123c] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-2xl border-2 border-white/60 backdrop-blur-md transition-all cursor-pointer group"
        title="Close (ESC)"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-90 group-hover:scale-110" />
        <span>Close</span>
      </button>

      {/* Nav buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous Photo"
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next Photo"
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Main photo container */}
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="flex flex-col items-center"
          >
            <div className="relative max-h-[80vh] overflow-hidden rounded-xl bg-black/40 shadow-2xl">
              <GalleryPhotoImg
                src={photo.url}
                alt={photo.caption || "Gallery photo"}
                fitMode="contain"
                zoom={photo.zoom || 1}
                offsetX={photo.offsetX || 0}
                offsetY={photo.offsetY || 0}
                rotation={photo.rotation || 0}
                className="max-h-[80vh] w-auto"
              />
            </div>

            {photo.caption && (
              <p className="mt-4 max-w-lg text-center text-sm font-medium text-white/90 drop-shadow-md">
                {photo.caption}
              </p>
            )}

            {photos.length > 1 && (
              <div className="mt-2 text-xs font-mono text-white/50">
                {index + 1} / {photos.length}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return createPortal(content, document.body);
}
