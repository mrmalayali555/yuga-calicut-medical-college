"use client";

import { useState } from "react";
import { Maximize2, Download, FileText, ZoomIn, Eye } from "lucide-react";
import { ImageLightboxModal } from "@/components/ui/image-lightbox-modal";

interface InterventionDocViewerProps {
  image: string | null;
  title: string;
  category?: string | null;
  pdfUrl?: string | null;
}

export function InterventionDocViewer({
  image,
  title,
  category,
  pdfUrl,
}: InterventionDocViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!image) return null;

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-md transition-all">
        {/* Document Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[var(--accent)] text-[11px]">
              Official Representation Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Full Size Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white font-medium hover:brightness-110 transition-colors shadow-2xs cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>View Full Resolution</span>
            </button>

            {/* Direct Download/Original Link */}
            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] font-medium transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>

        {/* Clickable Image Container */}
        <div
          onClick={() => setIsOpen(true)}
          className="relative group cursor-pointer overflow-hidden bg-black/40 flex items-center justify-center p-3 sm:p-6"
        >
          <img
            src={image}
            alt={title}
            className="w-full max-h-[550px] object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Hover Overlay Hint */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/75 border border-white/20 text-white text-xs font-semibold shadow-xl">
              <ZoomIn className="h-4 w-4 text-[var(--accent)]" />
              <span>Click to inspect original full-size photo</span>
            </span>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-[var(--bg-elevated)] border-t border-[var(--border-primary)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
          <span>Click image anytime to zoom and inspect official letter text</span>
          <span className="font-mono">YUGA Official Record</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        src={image}
        alt={title}
        title={title}
        subtitle={category || "Official Signed Representation"}
        pdfUrl={pdfUrl}
      />
    </>
  );
}
