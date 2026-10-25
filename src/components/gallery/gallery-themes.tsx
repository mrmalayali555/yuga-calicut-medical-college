"use client";

import { useState } from "react";
import { GalleryLightbox } from "./gallery-lightbox";
import { GalleryPhotoImg } from "@/components/ui/gallery-photo-img";
import { useTheme } from "@/components/theme/theme-context";

/* ─── Types ─── */
export type Photo = {
  id: string;
  url: string;
  caption: string;
  position: number;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
};

export type GalleryData = {
  id: string;
  theme: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  blogText?: string | null;
  photos: Photo[];
};

/* ─── Shared polaroid frame ─── */
function Polaroid({
  photo,
  rotate,
  className = "",
  imgClassName = "",
  captionFont = "font-sans",
  isObsidian = false,
}: {
  photo?: Photo;
  rotate: string;
  className?: string;
  imgClassName?: string;
  captionFont?: string;
  isObsidian?: boolean;
}) {
  if (!photo) return null;
  return (
    <figure
      data-photo-id={photo.id}
      className={`group relative p-2.5 pb-8 transition-all duration-300 hover:scale-105 hover:z-20 rounded-xs border ${
        isObsidian
          ? "bg-[#141624] text-white border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.7),0_0_16px_rgba(225,29,72,0.12)] hover:border-[#e11d48]/50"
          : "bg-white text-slate-800 border-slate-200/80 shadow-[2px_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[4px_8px_32px_rgba(0,0,0,0.15)]"
      } ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <GalleryPhotoImg
        src={photo.url}
        alt={photo.caption || "Gallery photo"}
        aspectRatio="3/4"
        zoom={photo.zoom || 1}
        offsetX={photo.offsetX || 0}
        offsetY={photo.offsetY || 0}
        rotation={photo.rotation || 0}
        className={imgClassName}
      />
      {photo.caption && (
        <figcaption
          className={`mt-2 text-center text-xs font-medium ${
            isObsidian ? "text-white/80" : "text-slate-700"
          } ${captionFont}`}
        >
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME 1 — BOHEMIAN
   Scattered polaroids around center title with gentle offsets.
   ═══════════════════════════════════════════════════════════════════════════ */

const BOHEMIAN_ROTATIONS = [
  "-4deg", "3deg", "6deg", "-3deg", "-8deg", "5deg", "-2deg", "-5deg", "4deg",
];

export function BohemianGallery({ gallery }: { gallery: GalleryData }) {
  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";

  return (
    <div
      className={`relative mx-auto my-12 w-full max-w-5xl rounded-3xl border p-6 sm:p-12 shadow-sm transition-colors ${
        isObsidian
          ? "border-white/10 bg-gradient-to-b from-[#131623]/95 via-[#0c0e16]/98 to-[#090a10] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(225,29,72,0.1)]"
          : "border-emerald-100 bg-gradient-to-b from-emerald-50/40 via-white to-white"
      }`}
    >
      {/* Center text */}
      <div className="mx-auto max-w-2xl text-center mb-12">
        {gallery.titleLine1 && (
          <p
            className={`text-xl sm:text-2xl font-serif italic ${
              isObsidian ? "text-[#ff2e56]" : "text-emerald-800"
            }`}
          >
            {gallery.titleLine1}
          </p>
        )}
        {gallery.titleLine2 && (
          <h2
            className={`mt-1 text-3xl font-bold tracking-tight sm:text-4xl ${
              isObsidian ? "text-white" : "text-slate-900"
            }`}
          >
            {gallery.titleLine2}
          </h2>
        )}
        {gallery.subtitle && (
          <p
            className={`mx-auto mt-3 max-w-md text-sm leading-relaxed font-normal ${
              isObsidian ? "text-white/65" : "text-slate-600"
            }`}
          >
            {gallery.subtitle}
          </p>
        )}
      </div>

      {/* Scattered photos grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.photos.map((photo, i) => (
          <Polaroid
            key={photo.id}
            photo={photo}
            isObsidian={isObsidian}
            rotate={BOHEMIAN_ROTATIONS[i % BOHEMIAN_ROTATIONS.length]}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME 2 — SCRAPBOOK
   Polaroids with colorful washi tape strips on a textured surface.
   ═══════════════════════════════════════════════════════════════════════════ */

const TAPE_COLORS = [
  "bg-emerald-200/90",
  "bg-teal-200/90",
  "bg-amber-200/90",
  "bg-rose-200/90",
  "bg-sky-200/90",
];

const SCRAPBOOK_ROTATIONS = [
  "-3deg", "2deg", "-5deg", "4deg", "-2deg", "5deg",
  "-4deg", "3deg", "-1deg", "4deg",
];

export function ScrapbookGallery({ gallery }: { gallery: GalleryData }) {
  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";

  return (
    <div className="mx-auto my-12 w-full max-w-5xl">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2) && (
        <div className="mb-8 text-center">
          {gallery.titleLine1 && (
            <p
              className={`text-xl font-serif italic ${
                isObsidian ? "text-[#ff2e56]" : "text-emerald-800"
              }`}
            >
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2
              className={`mt-1 text-3xl font-bold sm:text-4xl ${
                isObsidian ? "text-white" : "text-slate-900"
              }`}
            >
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p
              className={`mx-auto mt-2 max-w-md text-sm font-normal ${
                isObsidian ? "text-white/65" : "text-slate-600"
              }`}
            >
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Polaroid grid with tape */}
      <div
        className={`rounded-3xl border p-6 sm:p-10 shadow-sm transition-colors ${
          isObsidian
            ? "border-white/10 bg-[#0e1018]/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
            : "border-slate-200 bg-[#f9faf9]"
        }`}
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.photos.map((photo, i) => (
            <div
              key={photo.id}
              className="group relative transition-all duration-300 hover:scale-105 hover:z-10"
              style={{
                transform: `rotate(${SCRAPBOOK_ROTATIONS[i % SCRAPBOOK_ROTATIONS.length]})`,
              }}
            >
              {/* Washi tape strip */}
              <div
                className={`absolute -top-3 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rotate-[-2deg] ${
                  TAPE_COLORS[i % TAPE_COLORS.length]
                } shadow-2xs border border-white/40`}
                style={{ clipPath: "polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)" }}
              />

              <figure
                data-photo-id={photo.id}
                className={`p-2.5 pb-7 rounded-sm border transition-colors ${
                  isObsidian
                    ? "bg-[#141624] text-white border-white/15 shadow-[0_10px_28px_rgba(0,0,0,0.6)]"
                    : "bg-white text-slate-800 border-slate-200/90 shadow-md"
                }`}
              >
                <GalleryPhotoImg
                  src={photo.url}
                  alt={photo.caption || ""}
                  aspectRatio="1/1"
                  zoom={photo.zoom || 1}
                  offsetX={photo.offsetX || 0}
                  offsetY={photo.offsetY || 0}
                  rotation={photo.rotation || 0}
                  className="rounded-xs"
                />
                {photo.caption && (
                  <figcaption
                    className={`mt-2 text-center text-xs font-medium ${
                      isObsidian ? "text-white/80" : "text-slate-700"
                    }`}
                  >
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME 3 — CORK BOARD
   Photos pinned to a warm or dark luxury corkboard texture with push pins.
   ═══════════════════════════════════════════════════════════════════════════ */

const CORK_ROTATIONS = [
  "-4deg", "5deg", "-6deg", "3deg", "4deg",
  "-3deg", "2deg", "-5deg", "4deg", "-2deg",
];

export function CorkBoardGallery({ gallery }: { gallery: GalleryData }) {
  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";

  return (
    <div className="mx-auto my-12 w-full max-w-5xl">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2) && (
        <div className="mb-8 text-center">
          {gallery.titleLine1 && (
            <p
              className={`text-xl font-serif italic ${
                isObsidian ? "text-[#ff2e56]" : "text-emerald-800"
              }`}
            >
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2
              className={`mt-1 text-3xl font-bold sm:text-4xl ${
                isObsidian ? "text-white" : "text-slate-900"
              }`}
            >
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p
              className={`mx-auto mt-2 max-w-md text-sm font-normal ${
                isObsidian ? "text-white/65" : "text-slate-600"
              }`}
            >
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Corkboard canvas */}
      <div
        className={`rounded-3xl p-6 sm:p-10 shadow-lg border-4 transition-colors ${
          isObsidian
            ? "border-white/10 bg-gradient-to-br from-[#1a1418] via-[#120f16] to-[#0c0a0f] shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
            : "border-amber-900/40 bg-[#d9ab7b]"
        }`}
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.photos.map((photo, i) => (
            <div
              key={photo.id}
              className="group relative transition-all duration-300 hover:scale-105 hover:z-10"
              style={{
                transform: `rotate(${CORK_ROTATIONS[i % CORK_ROTATIONS.length]})`,
              }}
            >
              {/* Push pin */}
              <div className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-red-600 shadow-md border-2 border-red-800 ring-1 ring-white/50" />

              <figure
                data-photo-id={photo.id}
                className={`p-2.5 pb-7 shadow-lg rounded-xs border transition-colors ${
                  isObsidian
                    ? "bg-[#161826] text-white border-white/15"
                    : "bg-white text-slate-800 border-amber-950/20"
                }`}
              >
                <GalleryPhotoImg
                  src={photo.url}
                  alt={photo.caption || ""}
                  aspectRatio="1/1"
                  zoom={photo.zoom || 1}
                  offsetX={photo.offsetX || 0}
                  offsetY={photo.offsetY || 0}
                  rotation={photo.rotation || 0}
                  className="rounded-xs"
                />
                {photo.caption && (
                  <figcaption
                    className={`mt-2 text-center text-xs font-serif italic ${
                      isObsidian ? "text-white/80" : "text-slate-800"
                    }`}
                  >
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME 4 — CLEAN GRID / MASONRY
   Modern responsive column grid with hover lift and caption pill.
   ═══════════════════════════════════════════════════════════════════════════ */

export function NormalGallery({ gallery }: { gallery: GalleryData }) {
  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";

  return (
    <div className="mx-auto my-12 w-full max-w-6xl">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2) && (
        <div className="mb-8 text-center">
          {gallery.titleLine1 && (
            <p
              className={`text-sm font-bold uppercase tracking-wider ${
                isObsidian ? "text-[#ff2e56]" : "text-emerald-700"
              }`}
            >
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2
              className={`mt-1 text-3xl font-bold sm:text-4xl ${
                isObsidian ? "text-white" : "text-slate-900"
              }`}
            >
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p
              className={`mx-auto mt-2 max-w-md text-sm font-normal ${
                isObsidian ? "text-white/65" : "text-slate-600"
              }`}
            >
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Columns Grid */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {gallery.photos.map((photo) => (
          <figure
            key={photo.id}
            data-photo-id={photo.id}
            className={`mb-6 break-inside-avoid overflow-hidden rounded-2xl p-2.5 transition-all duration-300 border ${
              isObsidian
                ? "bg-[#121420] border-white/10 text-white shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:border-[#e11d48]/50 hover:shadow-[0_16px_40px_rgba(225,29,72,0.15)]"
                : "border-slate-200 bg-white shadow-xs hover:shadow-xl hover:border-emerald-300"
            }`}
          >
            <GalleryPhotoImg
              src={photo.url}
              alt={photo.caption || "Gallery photo"}
              zoom={photo.zoom || 1}
              offsetX={photo.offsetX || 0}
              offsetY={photo.offsetY || 0}
              rotation={photo.rotation || 0}
              className="rounded-xl"
            />
            {photo.caption && (
              <figcaption
                className={`mt-2.5 px-2 py-1 text-xs text-center font-medium ${
                  isObsidian ? "text-white/80" : "text-slate-600"
                }`}
              >
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ─── Master Renderer that switches theme dynamically ─── */
export function EventGalleryRenderer({ gallery }: { gallery: GalleryData }) {
  const [showFullBlog, setShowFullBlog] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url: string;
    caption: string | null;
    zoom?: number;
    offsetX?: number;
    offsetY?: number;
    rotation?: number;
  } | null>(null);

  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";

  // Strip HTML for preview
  const plainText = gallery.blogText
    ? gallery.blogText
        .replace(/&nbsp;/g, " ")
        .replace(/<\/?(p|div|br|h[1-6])[^>]*>/gi, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
    : "";
  const previewText = plainText.slice(0, 200);
  const needsExpand = plainText.length > 200;

  return (
    <div
      className={`mt-14 pt-10 border-t ${
        isObsidian ? "border-white/10" : "border-slate-200/80"
      }`}
    >
      <div className="text-center mb-6">
        <span
          className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${
            isObsidian
              ? "text-[#ff2e56] bg-[#e11d48]/15 border-[#e11d48]/35 shadow-[0_0_15px_rgba(225,29,72,0.3)]"
              : "text-emerald-800 bg-emerald-50 border-emerald-200"
          }`}
        >
          Event Memories
        </span>
      </div>

      {/* Intercept clicks on gallery items to open lightbox */}
      <GalleryClickWrapper onPhotoClick={setLightboxPhoto} gallery={gallery}>
        {gallery.theme === "bohemian" && <BohemianGallery gallery={gallery} />}
        {gallery.theme === "scrapbook" && <ScrapbookGallery gallery={gallery} />}
        {gallery.theme === "corkboard" && <CorkBoardGallery gallery={gallery} />}
        {gallery.theme !== "bohemian" &&
          gallery.theme !== "scrapbook" &&
          gallery.theme !== "corkboard" && <NormalGallery gallery={gallery} />}
      </GalleryClickWrapper>

      {/* Lightbox Modal */}
      {lightboxPhoto !== null && (
        <GalleryLightbox
          photos={[lightboxPhoto]}
          initialIndex={0}
          onClose={() => setLightboxPhoto(null)}
        />
      )}

      {/* Blog & Event Story */}
      {gallery.blogText && plainText && (
        <div
          className={`mx-auto mt-10 max-w-2xl rounded-2xl border p-6 shadow-xs transition-colors ${
            isObsidian
              ? "border-white/10 bg-[#0f111c]/95 text-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.7)]"
              : "border-emerald-100 bg-emerald-50/30 text-slate-700"
          }`}
        >
          <h3
            className={`text-base font-bold mb-2 ${
              isObsidian ? "text-white" : "text-slate-900"
            }`}
          >
            Event Recap
          </h3>
          {!showFullBlog ? (
            <>
              <p
                className={`text-sm leading-relaxed ${
                  isObsidian ? "text-white/70" : "text-slate-600"
                }`}
              >
                {previewText}
                {needsExpand && "..."}
              </p>
              {needsExpand && (
                <button
                  onClick={() => setShowFullBlog(true)}
                  className={`mt-3 text-xs font-bold transition-colors ${
                    isObsidian
                      ? "text-[#ff2e56] hover:text-white"
                      : "text-emerald-700 hover:text-emerald-800"
                  }`}
                >
                  Read full narrative →
                </button>
              )}
            </>
          ) : (
            <>
              <div
                className={`prose prose-sm max-w-none ${
                  isObsidian ? "prose-invert text-white/80" : "text-slate-700"
                }`}
                dangerouslySetInnerHTML={{ __html: gallery.blogText }}
              />
              <button
                onClick={() => setShowFullBlog(false)}
                className={`mt-4 text-xs font-bold transition-colors ${
                  isObsidian
                    ? "text-[#ff2e56] hover:text-white"
                    : "text-emerald-700 hover:text-emerald-800"
                }`}
              >
                Show less ←
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Click Wrapper ─── */
function GalleryClickWrapper({
  children,
  onPhotoClick,
  gallery,
}: {
  children: React.ReactNode;
  onPhotoClick: (photo: {
    url: string;
    caption: string | null;
    zoom?: number;
    offsetX?: number;
    offsetY?: number;
    rotation?: number;
  }) => void;
  gallery: GalleryData;
}) {
  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const figure = target.closest("figure");
    if (!figure) return;

    const id = figure.getAttribute("data-photo-id");
    const img = figure.querySelector("img");

    const photo = gallery.photos.find((p) => p.id === id);

    if (photo) {
      e.preventDefault();
      onPhotoClick({
        url: photo.url,
        caption: photo.caption || null,
        zoom: photo.zoom,
        offsetX: photo.offsetX,
        offsetY: photo.offsetY,
        rotation: photo.rotation,
      });
    } else if (img) {
      e.preventDefault();
      let src = img.src;
      try {
        const urlObj = new URL(src, window.location.origin);
        if (urlObj.pathname.startsWith("/_next/image")) {
          const orig = urlObj.searchParams.get("url");
          if (orig) src = orig;
        }
      } catch {}
      onPhotoClick({ url: src, caption: null });
    }
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}
