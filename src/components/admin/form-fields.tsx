"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Loader2, Upload, X, FileText, Trash2, Crop, CheckCircle2, Sparkles } from "lucide-react";
import { ImageCropperModal } from "@/components/admin/image-cropper-modal";

const inputCls =
  "w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] min-w-0 max-w-full";

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
  hint,
  list,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  list?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        list={list}
        step={type === "number" ? "any" : undefined}
        className={inputCls}
      />
      {hint && <p className="mt-1 text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  rows = 5,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputCls + " resize-y"}
      />
    </div>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </label>
      <select id={name} name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked = true,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-3">
      <div>
        <div className="text-sm font-medium text-[var(--text-primary)]">{label}</div>
        {hint && <div className="text-xs text-[var(--text-muted)]">{hint}</div>}
      </div>
      <input type="hidden" name={name} value={on ? "on" : ""} />
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          on ? "bg-[var(--accent)]" : "bg-[var(--border-primary)]"
        }`}
        aria-pressed={on}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

/** Single-file upload that stores the resulting URL in a hidden input, with live framing and crop studio. */
export function UploadField({
  label,
  name,
  defaultUrl,
  accept = "image/*",
  hint,
  aspectRatio = 16 / 9,
}: {
  label: string;
  name: string;
  defaultUrl?: string | null;
  accept?: string;
  hint?: string;
  aspectRatio?: number;
}) {
  const [url, setUrl] = useState(defaultUrl || "");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropSuccess, setCropSuccess] = useState(false);

  useEffect(() => {
    setUrl(defaultUrl || "");
  }, [defaultUrl]);

  const isPdf = url.toLowerCase().endsWith(".pdf");

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setProgress(0);
    setCropSuccess(false);
    try {
      const data = await new Promise<{ url: string; error?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        fd.append("file", file);

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const p = Math.round((event.loaded / event.total) * 100);
            setProgress(p);
          }
        });

        xhr.addEventListener("load", () => {
          try {
            const d = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(d);
            } else {
              reject(new Error(d.error || "Upload failed."));
            }
          } catch {
            reject(new Error("Upload failed."));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));

        xhr.open("POST", "/api/admin/upload");
        xhr.send(fd);
      });

      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </label>
        {url && !isPdf && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Image Attached</span>
          </span>
        )}
      </div>

      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="space-y-2">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] shadow-sm">
            {isPdf ? (
              <div className="flex items-center gap-3 p-4">
                <FileText className="h-8 w-8 text-[var(--accent)]" />
                <span className="truncate text-sm text-[var(--text-primary)]">{url.split("/").pop()}</span>
              </div>
            ) : (
              <div className="relative aspect-[16/9] w-full bg-[var(--bg-surface)]">
                <Image src={url} alt="Cover preview" fill className="object-cover" unoptimized />
                
                {/* Visual badge overlay */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-white/90">
                  <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                  <span>Public Viewport Simulation</span>
                </div>
              </div>
            )}

            {/* Quick action buttons in top-right */}
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
              {!isPdf && (
                <button
                  type="button"
                  onClick={() => setCropperOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-black/75 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-black transition-colors backdrop-blur-xs border border-white/10"
                  title="Adjust Framing / Crop"
                >
                  <Crop className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Adjust Framing</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setCropSuccess(false);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/80 text-white shadow hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Cropper Modal */}
          {!isPdf && (
            <ImageCropperModal
              isOpen={cropperOpen}
              imageUrl={url}
              initialAspectRatio={aspectRatio}
              onClose={() => setCropperOpen(false)}
              onCropComplete={(newUrl) => {
                setUrl(newUrl);
                setCropSuccess(true);
              }}
            />
          )}

          {cropSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Framing applied &amp; saved! Ready for publication.</span>
            </div>
          )}
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-8 text-center transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]">
          {busy ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
              <span className="text-xs text-[var(--text-muted)]">Uploading ({progress}%)…</span>
            </div>
          ) : (
            <>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] mb-1">
                <Upload className="h-5 w-5" />
              </div>
              <span className="mt-2 text-sm font-bold text-[var(--text-primary)]">
                Click to upload cover photo / document
              </span>
              <span className="mt-0.5 text-xs text-[var(--text-muted)]">{hint || accept}</span>
              <span className="mt-2 text-[10px] uppercase font-bold tracking-wider text-[var(--accent)]">
                Supports High-Res Images &amp; Interactive Framing
              </span>
            </>
          )}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                handleFile(f);
                e.target.value = "";
              }
            }}
          />
        </label>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function SubmitBtn({ children = "Save" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-60 sm:w-auto"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function DeleteBtn({ label = "Delete" }: { label?: string }) {
  const { pending } = useFormStatus();
  if (label === "") {
    return (
      <button
        type="submit"
        disabled={pending}
        onClick={(e) => {
          if (!confirm("Are you sure? This cannot be undone.")) e.preventDefault();
        }}
        title="Delete"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    );
  }
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("Are you sure? This cannot be undone.")) e.preventDefault();
      }}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-60 sm:w-auto shrink-0"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {label}
    </button>
  );
}
