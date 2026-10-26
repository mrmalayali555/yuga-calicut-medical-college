"use client";

import { useEffect, useState, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
} from "lucide-react";
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
  const [zoomLevel, setZoomLevel] = useState<1 | 1.8 | 2.5>(1);

  // Reset zoom whenever image changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
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

  const handleZoomToggle = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel((prev) => (prev === 1 ? 1.8 : 1));
  }, []);

  const zoomIn = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => (prev === 1 ? 1.8 : 2.5));
  }, []);

  const zoomOut = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => (prev === 2.5 ? 1.8 : 1));
  }, []);

  const resetZoom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
  }, []);

  if (!src) return null;

  const isZoomed = zoomLevel > 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] flex flex-col h-[100dvh] w-[100vw] bg-black/95 backdrop-blur-md select-none touch-manipulation overflow-hidden"
          onClick={(e) => {
            // Clicking the backdrop closes the modal
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* ========================================================================= */}
          {/* FLOATING TOP-RIGHT CLOSE BUTTON — High contrast, large mobile hit area    */}
          {/* ========================================================================= */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close full size view"
            className="fixed top-3 right-3 sm:top-5 sm:right-5 z-[140] flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/85 hover:bg-black active:scale-90 text-white border-2 border-white/40 shadow-2xl backdrop-blur-md transition-all cursor-pointer group"
            title="Close (ESC)"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:rotate-90 group-hover:scale-110" />
            <span className="sr-only">Close</span>
          </button>

          {/* ========================================================================= */}
          {/* TOP BAR: Clean header info with room for close button                     */}
          {/* ========================================================================= */}
          <div
            className="relative z-30 flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-black/60 border-b border-white/10 shrink-0 pr-16 sm:pr-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff2e56] block truncate">
                {subtitle || "Original Document / High-Res Photograph"}
              </span>
              <h3 className="text-xs sm:text-base font-semibold text-white truncate max-w-md sm:max-w-xl">
                {title || alt}
              </h3>
            </div>

            {/* Quick Actions on Tablet & Desktop */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {pdfUrl && pdfUrl !== "#" && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] hover:brightness-110 text-white text-xs font-medium transition-colors shadow-xs"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Open PDF</span>
                </a>
              )}
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                title="Download original file"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MAIN IMAGE DISPLAY AREA — Guaranteed 100% full view on all mobile phones  */}
          {/* ========================================================================= */}
          <div
            className={`relative flex-1 w-full min-h-0 flex items-center justify-center p-2 sm:p-4 overflow-auto overscroll-contain ${
              isZoomed ? "cursor-grab active:cursor-grabbing items-start" : "cursor-pointer items-center"
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose();
              }
            }}
          >
            <motion.div
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center justify-center transition-transform duration-200 ${
                isZoomed
                  ? "w-auto h-auto m-auto"
                  : "w-full h-full max-h-[calc(100dvh-125px)] sm:max-h-[calc(100dvh-140px)] max-w-[calc(100vw-16px)] sm:max-w-[94vw]"
              }`}
            >
              <img
                src={src}
                alt={alt}
                onClick={handleZoomToggle}
                style={{
                  transform: isZoomed ? `scale(${zoomLevel})` : "none",
                  transformOrigin: "center center",
                }}
                className={`transition-transform duration-200 rounded-lg shadow-2xl bg-black/30 border border-white/10 ${
                  isZoomed
                    ? "max-w-[92vw] sm:max-w-[80vw] h-auto my-12 object-contain"
                    : "max-h-[calc(100dvh-125px)] sm:max-h-[calc(100dvh-140px)] max-w-[calc(100vw-16px)] sm:max-w-[94vw] w-auto h-auto object-contain"
                }`}
              />
            </motion.div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM FLOATING CONTROLS — Clean, touch-friendly pill bar for mobile       */}
          {/* ========================================================================= */}
          <div
            className="relative z-30 py-2.5 px-3 sm:px-6 bg-black/75 border-t border-white/10 shrink-0 flex flex-wrap items-center justify-between gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Zoom Controls Pill */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/15">
              <button
                type="button"
                onClick={resetZoom}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  zoomLevel === 1
                    ? "bg-white text-black font-semibold shadow-xs"
                    : "text-white/80 hover:text-white"
                }`}
                title="Fit full image on screen"
              >
                Fit Screen
              </button>

              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomLevel === 2.5}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isZoomed
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "text-white/80 hover:text-white"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title="Zoom in to inspect details"
              >
                <ZoomIn className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">{isZoomed ? `${Math.round(zoomLevel * 100)}%` : "Zoom"}</span>
              </button>

              {isZoomed && (
                <button
                  type="button"
                  onClick={zoomOut}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white/80 hover:text-white transition-all cursor-pointer"
                  title="Zoom out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Action Buttons (Download, PDF, Detail) */}
            <div className="flex items-center gap-2 ml-auto">
              {pdfUrl && pdfUrl !== "#" && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[var(--accent)] text-white text-xs font-medium transition-colors shadow-xs sm:hidden"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>PDF</span>
                </a>
              )}

              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10 sm:hidden"
                title="Download original file"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save</span>
              </a>

              {detailUrl && (
                <a
                  href={detailUrl}
                  className="text-[var(--accent)] hover:underline font-medium text-xs ml-1 hidden xs:inline"
                >
                  Full Docket →
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
