"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2 } from "lucide-react";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);
    setProgress(0);

    try {
      for (const file of Array.from(files)) {
        await new Promise<void>((resolve, reject) => {
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
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              try {
                const data = JSON.parse(xhr.responseText);
                reject(new Error(data.error || "Upload failed."));
              } catch {
                reject(new Error("Upload failed."));
              }
            }
          });

          xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));

          xhr.open("POST", "/api/admin/upload");
          xhr.send(fd);
        });
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-10 text-center transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]">
        {busy ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Uploading media ({progress}%)…
            </span>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 text-[var(--text-muted)]" />
            <span className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
              Click or drag to upload images, videos or PDFs
            </span>
          </>
        )}
        <span className="mt-1 text-xs text-[var(--text-muted)]">Select multiple files (Images up to 8MB, PDFs up to 20MB)</span>
        <input
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
