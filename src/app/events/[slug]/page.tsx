import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  Paperclip,
  Download,
  Ticket,
  Users,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { getEvent } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { SITE, COLLEGE } from "@/lib/site";
import { EventGalleryRenderer } from "@/components/gallery/gallery-themes";

const statusTone: Record<string, { label: string; className: string }> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--border-accent)]",
  },
  live: {
    label: "Happening Now",
    className: "bg-red-500/10 text-red-500 border-red-500/30 animate-pulse",
  },
  completed: {
    label: "Completed",
    className: "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-primary)]",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event Not Found · YUGA" };

  const title = `${event.title} · YUGA Events`;
  const description = event.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: event.poster ? [{ url: event.poster }] : [{ url: "/og.png" }],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const status = statusTone[event.status] || statusTone.upcoming;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all events</span>
        </Link>

        {/* Status Pill & Committees */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${status.className}`}
          >
            {status.label}
          </span>

          {event.committee && (
            <Link
              href={`/subcommittees/${event.committee.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-primary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <Users className="h-3 w-3 text-[var(--accent)]" />
              <span>{event.committee.name}</span>
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)] tracking-tight leading-tight">
          {event.title}
        </h1>

        {/* Poster Image */}
        {event.poster && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm">
            <img
              src={event.poster}
              alt={event.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Registration Banner (only if registration is required & active) */}
        {(event.status === "upcoming" || event.status === "live") &&
          Boolean(event.registrationForm && event.registrationForm.published) && (
          <div className="mt-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Official Delegate Passes Available
              </h3>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)] font-normal">
                {event.registrationForm?.deadline
                  ? `Enrollment closes on ${formatDate(new Date(event.registrationForm.deadline))}`
                  : "Reserve your seat and entry barcode pass online"}
              </p>
            </div>
            <Link
              href={`/events/${slug}/register`}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-dark)] transition-transform active:scale-95 shrink-0"
            >
              <Ticket className="h-4 w-4" />
              <span>Register Entry Pass</span>
            </Link>
          </div>
        )}

        {/* Meta Tiles */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                Schedule Date
              </span>
              <span className="block text-xs font-semibold text-[var(--text-primary)] truncate">
                {formatDate(event.date)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                Timings
              </span>
              <span className="block text-xs font-semibold text-[var(--text-primary)] truncate">
                {event.time || "To be confirmed"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                Venue
              </span>
              <span className="block text-xs font-semibold text-[var(--text-primary)] truncate">
                {event.venue || COLLEGE.name}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 border-t border-[var(--border-primary)] pt-8">
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-4">Event Overview</h2>
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] font-normal">
            {event.description}
          </div>
        </div>

        {/* Attachments / Circulars */}
        {event.attachments && event.attachments.length > 0 && (
          <div className="mt-10 border-t border-[var(--border-primary)] pt-8 space-y-3">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
              Official Downloads & Documents
            </h2>
            {event.attachments.map((att) => (
              <a
                key={att.id}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-2xs transition-all hover:border-[var(--accent)] hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Paperclip className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {att.name}
                  </span>
                </div>
                <Download className="h-4 w-4 text-[var(--text-muted)]" />
              </a>
            ))}
          </div>
        )}

        {/* Completed Event Photo Gallery */}
        {event.gallery && event.gallery.photos && event.gallery.photos.length > 0 && (
          <EventGalleryRenderer gallery={event.gallery} />
        )}
      </div>
    </div>
  );
}
