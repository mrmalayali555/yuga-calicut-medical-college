import Image from "next/image";
import { FileText, Film, Trash2 } from "lucide-react";
import { AdminHeader, EmptyRow } from "@/components/admin/admin-ui";
import { MediaUploader } from "@/components/admin/media-uploader";
import { db } from "@/lib/db";
import { deleteMedia } from "@/lib/actions/media";

export default async function AdminMediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <>
      <AdminHeader
        title="Media Assets Library"
        description="Central repository for posters, circular PDFs, photos and event banners."
      />

      <div className="mb-8">
        <MediaUploader />
      </div>

      {media.length === 0 ? (
        <EmptyRow>No media assets uploaded yet.</EmptyRow>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <div
              key={m.id}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] transition-colors hover:border-[var(--border-accent)]"
            >
              <div className="relative aspect-square bg-[var(--bg-elevated)]">
                {m.type === "image" ? (
                  <Image src={m.url} alt={m.name} fill className="object-cover" sizes="200px" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-[var(--text-muted)]">
                    {m.type === "video" ? <Film className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                    <span className="mt-2 px-2 text-center text-[10px] uppercase font-bold tracking-wider">{m.type}</span>
                  </div>
                )}
                <form
                  action={deleteMedia.bind(null, m.id)}
                  className="absolute right-2 top-2 opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100"
                >
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80 text-white shadow hover:bg-red-600 transition-colors"
                    title="Delete media"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-[var(--text-primary)]">{m.name}</p>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block truncate text-[11px] text-[var(--accent)] hover:underline"
                >
                  {m.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
