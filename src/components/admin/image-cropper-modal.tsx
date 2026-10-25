"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crop,
  Move,
  Loader2,
  Sparkles,
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
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setError(null);
      setImageLoaded(false);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
      };
      img.onerror = () => {
        setError("Failed to load image for cropping.");
      };
    }
  }, [isOpen, imageUrl]);

  // Pointer drag handling for pan
  const handlePointerDown = (e: React.PointerEvent) => {
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

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetFraming = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Perform crop and upload
  const handleSaveCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;
    setSaving(true);
    setError(null);

    try {
      const img = imageRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Determine the crop frame dimensions within the container
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      let cropWidth = containerWidth;
      let cropHeight = containerWidth / aspectRatio;

      if (cropHeight > containerHeight) {
        cropHeight = containerHeight;
        cropWidth = containerHeight * aspectRatio;
      }

      // High-res output dimensions
      const targetWidth = Math.min(1920, Math.max(1200, cropWidth * 2));
      const targetHeight = Math.round(targetWidth / aspectRatio);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not initialize canvas context");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Calculate how the image is positioned inside the crop frame
      // Source image natural aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      
      // Base fit dimensions inside container
      let baseWidth: number;
      let baseHeight: number;
      
      if (imgAspect > aspectRatio) {
        // Image is wider than crop box - fit height
        baseHeight = cropHeight;
        baseWidth = cropHeight * imgAspect;
      } else {
        // Image is taller than crop box - fit width
        baseWidth = cropWidth;
        baseHeight = cropWidth / imgAspect;
      }

      const scaledWidth = baseWidth * zoom;
      const scaledHeight = baseHeight * zoom;

      // Position relative to crop center
      const centerX = cropWidth / 2 + offset.x;
      const centerY = cropHeight / 2 + offset.y;

      const scaleRatio = targetWidth / cropWidth;

      // Fill canvas background
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw image onto canvas transformed
      ctx.drawImage(
        img,
        (centerX - scaledWidth / 2) * scaleRatio,
        (centerY - scaledHeight / 2) * scaleRatio,
        scaledWidth * scaleRatio,
        scaledHeight * scaleRatio
      );

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92);
      });

      if (!blob) throw new Error("Failed to process cropped image blob");

      // Upload the cropped image to /api/admin/upload
      const fileName = `crop-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to upload cropped photo.");
      }

      const data = await res.json();
      onCropComplete(data.url);
      onClose();
    } catch (err) {
      console.error("Crop error:", err);
      setError(err instanceof Error ? err.message : "Error saving cropped image.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-6 py-4 bg-[var(--bg-card)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white shadow-xs">
              <Crop className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
                Framing &amp; Cover Crop Studio
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Pan, zoom, and frame your cover photo so it displays perfectly on campus pages
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Aspect Ratio Selector Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-primary)] px-6 py-3 bg-[var(--bg-surface)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Crop Aspect:</span>
            <div className="flex items-center gap-1">
              {ASPECT_RATIOS.map((item) => {
                const active = Math.abs(aspectRatio - item.value) < 0.05;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setAspectRatio(item.value);
                      resetFraming();
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      active
                        ? "bg-[var(--accent)] text-white shadow-xs"
                        : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={resetFraming}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Pan &amp; Zoom</span>
          </button>
        </div>

        {/* Canvas / Drag Area */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] bg-[#070709] overflow-hidden flex items-center justify-center select-none">
          {!imageLoaded && !error && (
            <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
              <Loader2 className="h-7 w-7 animate-spin text-[var(--accent)]" />
              <span className="text-xs">Loading media asset…</span>
            </div>
          )}

          {error && (
            <div className="p-6 text-center text-red-400 text-sm">
              <p>{error}</p>
            </div>
          )}

          {imageLoaded && (
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden touch-none"
            >
              {/* Crop Frame Box */}
              <div
                style={{
                  aspectRatio: `${aspectRatio}`,
                  maxHeight: "86%",
                  maxWidth: "92%",
                }}
                className="relative w-full border-2 border-[var(--accent)] shadow-[0_0_0_9999px_rgba(0,0,0,0.72)] rounded-lg pointer-events-none z-20 flex items-center justify-center"
              >
                {/* Rule of thirds grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
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

                {/* Helpful drag tip */}
                <div className="absolute bottom-2 left-2 z-30 inline-flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-xs">
                  <Move className="h-2.5 w-2.5 text-[var(--accent)]" />
                  <span>Drag to pan position</span>
                </div>
              </div>

              {/* Underlying Image */}
              {imageRef.current && (
                <div
                  className="absolute pointer-events-none transition-transform duration-75"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Crop preview"
                    className="max-h-[500px] max-w-[800px] object-contain rounded"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Zoom Slider & Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border-primary)] px-6 py-4 bg-[var(--bg-card)]">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 w-full sm:w-72">
            <ZoomOut className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent)] h-1.5 bg-[var(--border-primary)] rounded-lg cursor-pointer"
            />
            <ZoomIn className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
            <span className="text-xs font-mono text-[var(--text-muted)] shrink-0 w-10 text-right">
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
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-dark)] rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
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
