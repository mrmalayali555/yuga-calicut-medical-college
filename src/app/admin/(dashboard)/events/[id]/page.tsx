import { notFound } from "next/navigation";
import Link from "next/link";
import { Camera, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { EventForm } from "@/components/admin/event-form";
import { db } from "@/lib/db";
import { updateEvent, deleteEvent } from "@/lib/actions/events";
import { deleteGallery } from "@/lib/actions/gallery";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await db.event.findUnique({
    where: { id },
    include: { registrationForm: true },
  });
  if (!event) notFound();

  const forms = await db.registrationForm.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  const gallery = await db.eventGallery.findUnique({ where: { eventId: id } });

  const update = updateEvent.bind(null, id);
  const remove = deleteEvent.bind(null, id);

  return (
    <>
      <AdminHeader title="Edit event" description={event.title} />
      <EventForm
        event={event}
        forms={forms}
        currentFormId={event.registrationForm?.id}
        action={update}
        deleteAction={remove}
      />

      {/* ── Photo Gallery Section ── */}
      <div className="mt-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 shadow-xs">
        <h3 className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
          <Camera className="h-5 w-5 text-emerald-600" />
          <span>Completed Event Photo Gallery</span>
        </h3>

        {gallery ? (
          <div className="mt-4">
            <p className="text-xs text-[var(--text-secondary)]">
              This event is configured with a <strong className="text-emerald-700 font-semibold">{gallery.theme.toUpperCase()}</strong> theme gallery.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/admin/events/${id}/gallery/customize`}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Customize Gallery & Photos</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteGallery(gallery.id);
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Gallery</span>
                </button>
              </form>
            </div>
          </div>
        ) : event.status === "completed" ? (
          <div className="mt-4">
            <p className="text-xs text-[var(--text-secondary)]">
              The event is marked as completed. Add a photo gallery to showcase memories, polaroids, and highlights publicly.
            </p>
            <Link
              href={`/admin/events/${id}/gallery`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Choose Gallery Theme & Add Photos</span>
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-xs text-[var(--text-muted)]">
            Photo gallery can be customized once the event status is updated to &quot;completed&quot;.
          </p>
        )}
      </div>
    </>
  );
}
