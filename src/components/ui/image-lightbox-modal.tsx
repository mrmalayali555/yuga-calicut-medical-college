"use client";

import { useEffect, useState, useCallback } from "react";
import { X, ZoomIn, ZoomOut, Download, ExternalLink, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string | null;
  alt: string;
  title?: string;
  subtitle?: string;
  pdfUrl?: string | null;
  detailUrl?: string;
}

export function ImageLightboxModal({
  isOpen,
  onClose,
  src,
  alt,
  title,
  subtitle,
  pdfUrl,
  detailUrl,
}: ImageLightboxModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset zoom whenever image changes or opens
  useEffect(() => {
    if (isOpen) {
      setIsZoomed(false);
    }
  }, [isOpen, src]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const toggleZoom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed((prev) => !prev);
  }, []);

  if (!src) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex flex-col bg-black/92 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Top Bar with metadata and controls */}
          <div
            className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/40 border-b border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title / Subtitle */}
            <div className="min-w-0 pr-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff2e56] block">
                {subtitle || "Original Document / High-Res Photograph"}
              </span>
              <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-xl">
                {title || alt}
              </h3>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Zoom Button */}
              <button
                type="button"
                onClick={toggleZoom}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                title={isZoomed ? "Fit to screen" : "Zoom to 100%"}
              >
                {isZoomed ? (
                  <>
                    <ZoomOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Fit Screen</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Full Size</span>
                  </>
                )}
              </button>

              {/* PDF button if present */}
              {pdfUrl && pdfUrl !== "#" && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:brightness-110 text-white text-xs font-medium transition-colors"
                  title="Open Official PDF"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </a>
              )}

              {/* Raw / Download button */}
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                title="Open raw original image in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Original</span>
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors ml-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Image Display Area */}
          <div
            className={`relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto ${
              isZoomed ? "cursor-zoom-out items-start" : "cursor-zoom-in"
            }`}
            onClick={toggleZoom}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`transition-all duration-300 ${
                isZoomed
                  ? "w-auto max-w-none my-auto"
                  : "max-h-[82vh] max-w-[92vw] flex items-center justify-center"
              }`}
              onClick={(e) => {
                // Allow clicking the image to toggle zoom
                toggleZoom(e);
              }}
            >
              <img
                src={src}
                alt={alt}
                className={`rounded-lg shadow-2xl transition-all duration-300 ${
                  isZoomed
                    ? "w-auto max-w-none object-contain"
                    : "max-h-[80vh] max-w-[90vw] w-auto h-auto object-contain bg-black/40 border border-white/10"
                }`}
              />
            </motion.div>
          </div>

          {/* Bottom Bar Hints */}
          <div
            className="py-2.5 px-4 bg-black/60 border-t border-white/5 text-center text-xs text-white/60 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="hidden sm:inline text-[11px]">
              Tip: Click image to toggle zoom • Press ESC or click outside to close
            </span>
            <span className="sm:hidden text-[11px]">
              Tap image to zoom • Tap outside to close
            </span>

            {detailUrl && (
              <a
                href={detailUrl}
                className="text-[var(--accent)] hover:underline font-medium text-xs ml-auto"
              >
                View full petition details →
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
