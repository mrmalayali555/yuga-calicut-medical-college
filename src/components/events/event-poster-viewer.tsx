"use client";

import { useState } from "react";
import { Eye, Maximize2, Download } from "lucide-react";
import { ImageLightboxModal } from "@/components/ui/image-lightbox-modal";

interface EventPosterViewerProps {
  posterUrl: string;
  title: string;
  category?: string;
  dateStr?: string;
}

export function EventPosterViewer({
  posterUrl,
  title,
  category,
  dateStr,
}: EventPosterViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-primary)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-primary)]">
            Official Event Poster
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-primary)] text-xs font-semibold text-[var(--accent)] hover:border-[var(--accent)] hover:shadow-xs transition-all cursor-pointer"
          >
            <Maximize2 className="h-3 w-3" />
            <span>View Full Poster</span>
          </button>
        </div>

        {/* Poster preview container */}
        <div
          className="relative group cursor-pointer overflow-hidden bg-black/5"
          onClick={() => setIsOpen(true)}
          title="Click to view full original poster"
        >
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-auto max-h-[560px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Hover overlay badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 text-white text-xs font-semibold shadow-2xl border border-white/20">
              <Eye className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Click to Zoom Original Poster</span>
            </span>
          </div>
        </div>

        {/* Footer caption */}
        <div className="px-5 py-3 border-t border-[var(--border-primary)] flex items-center justify-between text-xs text-[var(--text-muted)] bg-[var(--bg-card)]">
          <span>Click anywhere on the poster to zoom and inspect details</span>
          <a
            href={posterUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors font-medium"
          >
            <Download className="h-3 w-3" />
            <span>Download Poster</span>
          </a>
        </div>
      </div>

      {/* Full-screen lightbox modal */}
      <ImageLightboxModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        src={posterUrl}
        alt={title}
        title={title}
        subtitle={category ? `${category.toUpperCase()} • Official Poster` : "Official Event Poster"}
      />
    </>
  );
}
