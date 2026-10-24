"use client";

import { useState } from "react";
import { GalleryLightbox } from "./gallery-lightbox";
import { GalleryPhotoImg } from "@/components/ui/gallery-photo-img";

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
}: {
  photo?: Photo;
  rotate: string;
  className?: string;
  imgClassName?: string;
  captionFont?: string;
}) {
  if (!photo) return null;
  return (
    <figure
      data-photo-id={photo.id}
      className={`group relative bg-white p-2.5 pb-8 shadow-[2px_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:shadow-[4px_8px_32px_rgba(0,0,0,0.15)] hover:z-20 rounded-xs border border-slate-200/80 ${className}`}
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
          className={`mt-2 text-center text-xs font-medium text-slate-700 ${captionFont}`}
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
  return (
    <div className="relative mx-auto my-12 w-full max-w-5xl rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/40 via-white to-white p-6 sm:p-12 shadow-sm">
      {/* Center text */}
      <div className="mx-auto max-w-2xl text-center mb-12">
        {gallery.titleLine1 && (
          <p className="text-xl sm:text-2xl font-serif text-emerald-800 italic">
            {gallery.titleLine1}
          </p>
        )}
        {gallery.titleLine2 && (
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {gallery.titleLine2}
          </h2>
        )}
        {gallery.subtitle && (
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 leading-relaxed font-normal">
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
  return (
    <div className="mx-auto my-12 w-full max-w-5xl">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2) && (
        <div className="mb-8 text-center">
          {gallery.titleLine1 && (
            <p className="text-xl text-emerald-800 font-serif italic">
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 font-normal">
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Polaroid grid with tape */}
      <div className="rounded-3xl border border-slate-200 bg-[#f9faf9] p-6 sm:p-10 shadow-sm">
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
                className="bg-white p-2.5 pb-7 shadow-md border border-slate-200/90 rounded-sm"
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
                  <figcaption className="mt-2 text-center text-xs font-medium text-slate-700">
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
   Photos pinned to a warm corkboard texture with push pins.
   ═══════════════════════════════════════════════════════════════════════════ */

const CORK_ROTATIONS = [
  "-4deg", "5deg", "-6deg", "3deg", "4deg",
  "-3deg", "2deg", "-5deg", "4deg", "-2deg",
];

export function CorkBoardGallery({ gallery }: { gallery: GalleryData }) {
  return (
    <div className="mx-auto my-12 w-full max-w-5xl">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2) && (
        <div className="mb-8 text-center">
          {gallery.titleLine1 && (
            <p className="text-xl font-serif text-emerald-800 italic">
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 font-normal">
              {gallery.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Corkboard canvas */}
      <div className="rounded-3xl border-4 border-amber-900/40 bg-[#d9ab7b] p-6 sm:p-10 shadow-lg">
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
                className="bg-white p-2.5 pb-7 shadow-lg border border-amber-950/20 rounded-xs"
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
                  <figcaption className="mt-2 text-center text-xs font-serif text-slate-800 italic">
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
  return (
    <div className="mx-auto my-12 w-full max-w-6xl">
      {/* Title */}
      {(gallery.titleLine1 || gallery.titleLine2) && (
        <div className="mb-8 text-center">
          {gallery.titleLine1 && (
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
              {gallery.titleLine1}
            </p>
          )}
          {gallery.titleLine2 && (
            <h2 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
              {gallery.titleLine2}
            </h2>
          )}
          {gallery.subtitle && (
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 font-normal">
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
            className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-emerald-300"
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
              <figcaption className="mt-2.5 px-2 py-1 text-xs text-slate-600 text-center font-medium">
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
    <div className="mt-14 pt-10 border-t border-slate-200/80">
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
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
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2">Event Recap</h3>
          {!showFullBlog ? (
            <>
              <p className="text-sm leading-relaxed text-slate-600">
                {previewText}
                {needsExpand && "..."}
              </p>
              {needsExpand && (
                <button
                  onClick={() => setShowFullBlog(true)}
                  className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Read full narrative →
                </button>
              )}
            </>
          ) : (
            <>
              <div
                className="prose prose-sm max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: gallery.blogText }}
              />
              <button
                onClick={() => setShowFullBlog(false)}
                className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
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
