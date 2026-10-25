"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Crop,
  Move,
  Loader2,
  Sparkles,
  Maximize2,
} from "lucide-react";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedUrl: string) => void;
  initialAspectRatio?: number; // width / height, e.g. 16/9
}

const ASPECT_RATIOS = [
  { label: "16:9 Banner", value: 16 / 9 },
  { label: "4:3 Standard", value: 4 / 3 },
  { label: "1:1 Square", value: 1 },
  { label: "3:2 Photo", value: 3 / 2 },
  { label: "9:16 Story", value: 9 / 16 },
];

export function ImageCropperModal({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete,
  initialAspectRatio = 16 / 9,
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<number>(initialAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Natural dimensions of loaded image
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  // Measured viewport dimensions on screen
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({ w: 560, h: 315 });

  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Measure and compute viewport dimensions whenever modal opens, container resizes, or aspect ratio changes
  const updateViewportSize = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const maxW = containerRect.width * 0.92;
    const maxH = containerRect.height * 0.88;

    let targetW = maxW;
    let targetH = targetW / aspectRatio;

    if (targetH > maxH) {
      targetH = maxH;
      targetW = targetH * aspectRatio;
    }

    setViewportSize({
      w: Math.round(targetW),
      h: Math.round(targetH),
    });
  }, [aspectRatio]);

  // Load image on open
  useEffect(() => {
    if (isOpen && imageUrl) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setError(null);
      setImageLoaded(false);

      const img = new Image();
      // Handle same-origin or CORS
      if (!imageUrl.startsWith("data:")) {
        img.crossOrigin = "anonymous";
      }
      img.src = imageUrl;

      img.onload = () => {
        imageElementRef.current = img;
        setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
        setImageLoaded(true);
      };

      img.onerror = () => {
        // Fallback without crossOrigin if CORS rejected
        const fallbackImg = new Image();
        fallbackImg.src = imageUrl;
        fallbackImg.onload = () => {
          imageElementRef.current = fallbackImg;
          setNaturalSize({ w: fallbackImg.naturalWidth, h: fallbackImg.naturalHeight });
          setImageLoaded(true);
        };
        fallbackImg.onerror = () => {
          setError("Failed to load image. Check the URL or upload a fresh file.");
        };
      };
    }
  }, [isOpen, imageUrl]);

  // Re-measure viewport whenever image is loaded or aspect ratio changes
  useEffect(() => {
    if (imageLoaded) {
      updateViewportSize();
      window.addEventListener("resize", updateViewportSize);
      return () => window.removeEventListener("resize", updateViewportSize);
    }
  }, [imageLoaded, updateViewportSize]);

  // Pointer drag handling for pan with pointer capture
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(3, Math.max(1, +(prev + delta).toFixed(2))));
  };

  const resetFraming = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Effective dimensions of the image taking rotation into account
  const isRotated90or270 = rotation === 90 || rotation === 270;
  const effectiveNW = isRotated90or270 ? naturalSize.h : naturalSize.w;
  const effectiveNH = isRotated90or270 ? naturalSize.w : naturalSize.h;

  // Scale required to cover the on-screen viewport
  const coverScale =
    effectiveNW > 0 && effectiveNH > 0
      ? Math.max(viewportSize.w / effectiveNW, viewportSize.h / effectiveNH)
      : 1;

  // Base and zoomed rendered dimensions on screen
  const renderedW = effectiveNW * coverScale * zoom;
  const renderedH = effectiveNH * coverScale * zoom;

  // Center coordinates relative to viewport
  const imgLeft = (viewportSize.w - renderedW) / 2 + offset.x;
  const imgTop = (viewportSize.h - renderedH) / 2 + offset.y;

  // Perform crop and upload with 100% WYSIWYG accuracy
  const handleSaveCrop = async () => {
    if (!imageElementRef.current || naturalSize.w === 0) return;
    setSaving(true);
    setError(null);

    try {
      const img = imageElementRef.current;

      // High-resolution canvas dimensions matching aspect ratio
      const targetWidth = Math.min(2400, Math.max(1280, Math.round(viewportSize.w * 2)));
      const targetHeight = Math.round(targetWidth / aspectRatio);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not initialize 2D canvas context.");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Ratio from on-screen viewport to canvas output
      const scaleMultiplier = targetWidth / viewportSize.w;

      // Fill canvas background
      ctx.fillStyle = "#070709";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Destination coordinates on the canvas
      const destX = imgLeft * scaleMultiplier;
      const destY = imgTop * scaleMultiplier;
      const destW = renderedW * scaleMultiplier;
      const destH = renderedH * scaleMultiplier;

      // Handle rotation around destination center
      const centerX = destX + destW / 2;
      const centerY = destY + destH / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw the original image centered at (0, 0) in rotated space
      // In rotated space, width and height correspond to naturalSize.w and naturalSize.h
      const originalW = (isRotated90or270 ? destH : destW);
      const originalH = (isRotated90or270 ? destW : destH);

      ctx.drawImage(
        img,
        -originalW / 2,
        -originalH / 2,
        originalW,
        originalH
      );
      ctx.restore();

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92);
      });

      if (!blob) throw new Error("Failed to process cropped canvas image.");

      // Upload file to /api/admin/upload
      const fileName = `crop-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // If upload returned non-200, check if we can return dataURL fallback
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        onCropComplete(dataUrl);
        onClose();
        return;
      }

      const data = await res.json();
      onCropComplete(data.url);
      onClose();
    } catch (err) {
      console.error("Crop save error:", err);
      setError(err instanceof Error ? err.message : "Error saving cropped image.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-6 py-4 bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-sm">
              <Crop className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Interactive Cover Framing Studio</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                  WYSIWYG 1:1
                </span>
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Drag to reposition. Scroll wheel or slider to zoom. What you see inside the box is exactly what is saved.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Toolbar: Aspect Ratios & Tools */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-primary)] px-6 py-2.5 bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
              Aspect Ratio:
            </span>
            <div className="flex items-center gap-1">
              {ASPECT_RATIOS.map((item) => {
                const active = Math.abs(aspectRatio - item.value) < 0.05;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setAspectRatio(item.value);
                      setOffset({ x: 0, y: 0 });
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      active
                        ? "bg-[var(--accent)] text-white shadow-xs"
                        : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={rotateClockwise}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] transition-colors"
              title="Rotate 90 degrees clockwise"
            >
              <RotateCw className="h-3 w-3" />
              <span>Rotate</span>
            </button>

            <button
              type="button"
              onClick={resetFraming}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Center &amp; Reset</span>
            </button>
          </div>
        </div>

        {/* Workspace Canvas / Viewport */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          className="relative flex-1 min-h-[360px] sm:min-h-[440px] bg-[#050507] overflow-hidden flex items-center justify-center select-none p-4"
        >
          {!imageLoaded && !error && (
            <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
              <Loader2 className="h-7 w-7 animate-spin text-[var(--accent)]" />
              <span className="text-xs">Preparing high-res image…</span>
            </div>
          )}

          {error && (
            <div className="p-6 text-center text-red-400 text-sm max-w-md">
              <p>{error}</p>
            </div>
          )}

          {imageLoaded && (
            <div className="relative flex items-center justify-center">
              {/* THE ACTIVE CROP VIEWPORT */}
              <div
                ref={viewportRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{
                  width: `${viewportSize.w}px`,
                  height: `${viewportSize.h}px`,
                }}
                className="relative overflow-hidden rounded-2xl border-2 border-[var(--accent)] shadow-[0_0_0_9999px_rgba(5,5,7,0.78)] cursor-grab active:cursor-grabbing touch-none select-none z-10"
              >
                {/* Rendered Image Inside Viewport */}
                <div
                  style={{
                    position: "absolute",
                    left: `${imgLeft}px`,
                    top: `${imgTop}px`,
                    width: `${renderedW}px`,
                    height: `${renderedH}px`,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Source"
                    className="w-full h-full object-fill pointer-events-none select-none"
                    draggable={false}
                  />
                </div>

                {/* Rule of Thirds Overlay Grid */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-r border-b border-white" />
                  <div className="border-b border-white" />
                  <div className="border-r border-white" />
                  <div className="border-r border-white" />
                  <div />
                </div>

                {/* Corner Accents */}
                <div className="absolute top-2 left-2 pointer-events-none">
                  <div className="h-3 w-3 border-t-2 border-l-2 border-white/80" />
                </div>
                <div className="absolute top-2 right-2 pointer-events-none">
                  <div className="h-3 w-3 border-t-2 border-r-2 border-white/80" />
                </div>
                <div className="absolute bottom-2 left-2 pointer-events-none">
                  <div className="h-3 w-3 border-b-2 border-l-2 border-white/80" />
                </div>
                <div className="absolute bottom-2 right-2 pointer-events-none">
                  <div className="h-3 w-3 border-b-2 border-r-2 border-white/80" />
                </div>

                {/* Live Drag Badge */}
                <div className="absolute bottom-3 left-3 pointer-events-none inline-flex items-center gap-1.5 rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-xs">
                  <Move className="h-3 w-3 text-[var(--accent)]" />
                  <span>Drag image to position</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Zoom Slider & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-primary)] px-6 py-4 bg-[var(--bg-card)]">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 w-full sm:w-80">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.1).toFixed(2)))}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.02"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent)] h-1.5 bg-[var(--border-primary)] rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.1).toFixed(2)))}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-[var(--text-muted)] shrink-0 w-12 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--border-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              disabled={saving || !imageLoaded}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-dark)] rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing &amp; Saving…</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Apply &amp; Save Framing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
