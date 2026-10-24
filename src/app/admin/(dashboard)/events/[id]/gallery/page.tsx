import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { notFound, redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { createGallery } from "@/lib/actions/gallery";
import { Sparkles, Grid, Camera, Layers, Bookmark } from "lucide-react";

export default async function GalleryThemeSelectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    include: { gallery: true },
  });

  if (!event) notFound();

  if (event.gallery) {
    redirect(`/admin/events/${event.id}/gallery/customize`);
  }

  const themes = [
    {
      id: "normal",
      name: "Clean Grid (Masonry)",
      description:
        "Modern responsive masonry columns for unlimited event photographs with hover zoom and lightbox.",
      preview: "🖼️",
      color: "bg-slate-100",
    },
    {
      id: "bohemian",
      name: "The Bohemian",
      description:
        "Scattered polaroids rotated gently around center serif typography on a warm emerald background.",
      preview: "🎨",
      color: "bg-emerald-50/60",
    },
    {
      id: "scrapbook",
      name: "Scrapbook Memory",
      description:
        "Playful polaroids pinned with colored washi tape strips on a textured craft background.",
      preview: "📎",
      color: "bg-amber-50/70",
    },
    {
      id: "corkboard",
      name: "Campus Corkboard",
      description:
        "Photographs pinned to a wood-textured notice board with push-pins and handwritten cursive captions.",
      preview: "📌",
      color: "bg-[#d9ab7b]/40",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Select Gallery Style: ${event.title}`}
        description="Choose how memories, polaroids, and photographs will be presented on the public event page."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] shadow-xs transition-shadow hover:shadow-md"
          >
            {/* Visual Preview */}
            <div
              className={`flex h-40 items-center justify-center ${theme.color} relative overflow-hidden p-4`}
            >
              <span className="text-5xl">{theme.preview}</span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {theme.name}
              </h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[var(--text-secondary)] font-normal">
                {theme.description}
              </p>

              <form
                action={async () => {
                  "use server";
                  await createGallery(event.id, theme.id);
                }}
                className="mt-5"
              >
                <button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
                >
                  Apply {theme.name}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
