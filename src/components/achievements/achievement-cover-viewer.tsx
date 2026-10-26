"use client";

import { useState } from "react";
import { Maximize2, ZoomIn, Download } from "lucide-react";
import { ImageLightboxModal } from "@/components/ui/image-lightbox-modal";

interface AchievementCoverViewerProps {
  coverImage: string | null;
  title: string;
  category?: string;
}

export function AchievementCoverViewer({
  coverImage,
  title,
  category,
}: AchievementCoverViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!coverImage) return null;

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-md transition-all">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] text-xs">
          <span className="font-bold uppercase tracking-wider text-[var(--accent)] text-[11px]">
            Official Laurel Photograph
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white font-medium hover:brightness-110 transition-colors shadow-2xs cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>View Full Photo</span>
            </button>
            <a
              href={coverImage}
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
          className="relative group cursor-pointer overflow-hidden bg-black/40 flex items-center justify-center p-2 sm:p-4"
        >
          <img
            src={coverImage}
            alt={title}
            className="w-full max-h-[500px] object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Hover Overlay Hint */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 border border-white/20 text-white text-xs font-semibold shadow-xl">
              <ZoomIn className="h-4 w-4 text-amber-400" />
              <span>Click to view original high-resolution picture</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        src={coverImage}
        alt={title}
        title={title}
        subtitle={category?.toUpperCase()}
      />
    </>
  );
}
