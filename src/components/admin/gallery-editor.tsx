"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, X, Pencil, Save, Loader2, Trash2,
  ZoomIn, ZoomOut, Move, RotateCw,
} from "lucide-react";
import { GalleryPhotoImg } from "@/components/ui/gallery-photo-img";
import {
  updateGalleryText,
  addGalleryPhoto,
  removeGalleryPhoto,
  updateGalleryPhoto,
} from "@/lib/actions/gallery";

/* ─── Types ─── */
type Photo = {
  id: string;
  url: string;
  caption: string;
  position: number;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
};

type GalleryData = {
  id: string;
  theme: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  blogText?: string | null;
  photos: Photo[];
  eventId: string;
};

export function GalleryEditor({ gallery }: { gallery: GalleryData }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>(gallery.photos || []);
  const [titleLine1, setTitleLine1] = useState(gallery.titleLine1 || "");
  const [titleLine2, setTitleLine2] = useState(gallery.titleLine2 || "");
  const [subtitle, setSubtitle] = useState(gallery.subtitle || "");
  const [blogText, setBlogText] = useState(gallery.blogText || "");
  const [savingText, setSavingText] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activePhotoEdit, setActivePhotoEdit] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Text Save
  async function handleSaveText(e: React.FormEvent) {
    e.preventDefault();
    setSavingText(true);
    try {
      const fd = new FormData();
      fd.append("titleLine1", titleLine1);
      fd.append("titleLine2", titleLine2);
      fd.append("subtitle", subtitle);
      fd.append("blogText", blogText);
      await updateGalleryText(gallery.id, fd);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save gallery details.");
    } finally {
      setSavingText(false);
    }
  }

  // Handle Photo Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });

        if (!res.ok) throw new Error("Upload failed");
        const json = await res.json();

        const addFd = new FormData();
        addFd.append("url", json.url);
        addFd.append("caption", file.name.replace(/\.[^.]+$/, ""));
        addFd.append("position", String(photos.length + i));

        await addGalleryPhoto(gallery.id, addFd);
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo(s).");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Handle Remove Photo
  async function handleRemovePhoto(photoId: string) {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      await removeGalleryPhoto(photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (activePhotoEdit?.id === photoId) setActivePhotoEdit(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete photo.");
    }
  }

  // Handle Save Photo Adjustments (Crop, Zoom, Pan, Rotation, Caption)
  async function handleSavePhotoAdjustment(photo: Photo) {
    try {
      const fd = new FormData();
      fd.append("caption", photo.caption);
      fd.append("zoom", String(photo.zoom || 1));
      fd.append("offsetX", String(photo.offsetX || 0));
      fd.append("offsetY", String(photo.offsetY || 0));
      fd.append("rotation", String(photo.rotation || 0));

      await updateGalleryPhoto(photo.id, fd);
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? photo : p))
      );
      setActivePhotoEdit(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save adjustments.");
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Section 1: Gallery Text Configuration ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Gallery Theme & Narrative ({gallery.theme.toUpperCase()})
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-normal">
          Configure the headers, subtitle, and event blog recap text displayed above the photo arrangement.
        </p>

        <form onSubmit={handleSaveText} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Header Line 1 (Eyebrow / Script)
              </label>
              <input
                type="text"
                value={titleLine1}
                onChange={(e) => setTitleLine1(e.target.value)}
                placeholder="Memories & Moments"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Header Line 2 (Primary Title)
              </label>
              <input
                type="text"
                value={titleLine2}
                onChange={(e) => setTitleLine2(e.target.value)}
                placeholder="YUGA Fest Highlights"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtitle / Caption Intro
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Captured through the lenses of Calicut Medicos"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Long Narrative / Blog Recap (Optional)
            </label>
            <textarea
              rows={4}
              value={blogText}
              onChange={(e) => setBlogText(e.target.value)}
              placeholder="Write a brief article summarizing how the event concluded, memorable moments, and crowd turnouts..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingText}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 disabled:opacity-50 transition-colors"
            >
              {savingText ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Gallery Details
            </button>
          </div>
        </form>
      </div>

      {/* ── Section 2: Photo Uploader & Grid ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Photographs ({photos.length})
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Upload photographs, adjust framing/zoom/rotation, and add individual captions.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 disabled:opacity-50 transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading photos...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Photos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700">No photos in this gallery yet.</p>
            <p className="text-xs text-slate-400 mt-1">Click &quot;Upload Photos&quot; above to select images.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2.5 shadow-xs transition-all hover:shadow-md"
              >
                <div className="relative overflow-hidden rounded-xl bg-slate-200">
                  <GalleryPhotoImg
                    src={photo.url}
                    alt={photo.caption || ""}
                    aspectRatio="1/1"
                    zoom={photo.zoom || 1}
                    offsetX={photo.offsetX || 0}
                    offsetY={photo.offsetY || 0}
                    rotation={photo.rotation || 0}
                  />

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePhotoEdit(photo)}
                      className="p-2 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-semibold shadow-xs"
                      title="Adjust crop, zoom & caption"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="p-2 rounded-lg bg-red-600/90 text-white hover:bg-red-600 text-xs font-semibold shadow-xs"
                      title="Delete photo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 px-1">
                  <p className="text-xs font-medium text-slate-800 truncate">
                    {photo.caption || "No caption added"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Zoom: {photo.zoom || 1}x · Rot: {photo.rotation || 0}°
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Adjustment Modal (Zoom, Pan, Crop, Rotation, Caption) ── */}
      {activePhotoEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h4 className="text-base font-bold text-slate-900">Adjust Photo Frame</h4>
              <button
                type="button"
                onClick={() => setActivePhotoEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preview Frame */}
            <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-2xl border-2 border-emerald-500 bg-slate-100 shadow-inner">
              <GalleryPhotoImg
                src={activePhotoEdit.url}
                alt=""
                aspectRatio="1/1"
                zoom={activePhotoEdit.zoom || 1}
                offsetX={activePhotoEdit.offsetX || 0}
                offsetY={activePhotoEdit.offsetY || 0}
                rotation={activePhotoEdit.rotation || 0}
              />
            </div>

            {/* Controls */}
            <div className="mt-5 space-y-4">
              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo Caption
                </label>
                <input
                  type="text"
                  value={activePhotoEdit.caption}
                  onChange={(e) =>
                    setActivePhotoEdit({
                      ...activePhotoEdit,
                      caption: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {/* Zoom & Rotation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Zoom Level</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {(activePhotoEdit.zoom || 1).toFixed(1)}x
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={activePhotoEdit.zoom || 1}
                    onChange={(e) =>
                      setActivePhotoEdit({
                        ...activePhotoEdit,
                        zoom: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Rotate</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {activePhotoEdit.rotation || 0}°
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setActivePhotoEdit({
                        ...activePhotoEdit,
                        rotation: ((activePhotoEdit.rotation || 0) + 90) % 360,
                      })
                    }
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>Rotate 90°</span>
                  </button>
                </div>
              </div>

              {/* Offset Pan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Horizontal Offset
                  </label>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={activePhotoEdit.offsetX || 0}
                    onChange={(e) =>
                      setActivePhotoEdit({
                        ...activePhotoEdit,
                        offsetX: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Vertical Offset
                  </label>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={activePhotoEdit.offsetY || 0}
                    onChange={(e) =>
                      setActivePhotoEdit({
                        ...activePhotoEdit,
                        offsetY: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActivePhotoEdit(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSavePhotoAdjustment(activePhotoEdit)}
                className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs"
              >
                Apply & Save Frame
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
