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
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  live: {
    label: "Happening Now",
    className: "bg-red-50 text-red-700 border-red-200 animate-pulse",
  },
  completed: {
    label: "Completed",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 border-red-200",
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
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/20 via-white to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors mb-8"
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
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              <Users className="h-3 w-3 text-emerald-700" />
              <span>{event.committee.name}</span>
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          {event.title}
        </h1>

        {/* Poster Image */}
        {event.poster && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <img
              src={event.poster}
              alt={event.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Registration Banner (if form exists or open) */}
        {event.registrationForm && event.registrationForm.published && (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                Official Delegate Passes Available
              </h3>
              <p className="mt-0.5 text-xs text-emerald-800 font-normal">
                {event.registrationForm.deadline
                  ? `Enrollment closes on ${formatDate(new Date(event.registrationForm.deadline))}`
                  : "Reserve your seat and entry barcode pass online"}
              </p>
            </div>
            <Link
              href={`/events/${slug}/register`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-transform active:scale-95 shrink-0"
            >
              <Ticket className="h-4 w-4" />
              <span>Register Entry Pass</span>
            </Link>
          </div>
        )}

        {/* Meta Tiles */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Schedule Date
              </span>
              <span className="block text-xs font-semibold text-slate-800 truncate">
                {formatDate(event.date)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Timings
              </span>
              <span className="block text-xs font-semibold text-slate-800 truncate">
                {event.time || "To be confirmed"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Venue
              </span>
              <span className="block text-xs font-semibold text-slate-800 truncate">
                {event.venue || COLLEGE.name}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10 border-t border-slate-100 pt-8">
          <h2 className="text-base font-bold text-slate-900 mb-4">Event Overview</h2>
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
            {event.description}
          </div>
        </div>

        {/* Attachments / Circulars */}
        {event.attachments && event.attachments.length > 0 && (
          <div className="mt-10 border-t border-slate-100 pt-8 space-y-3">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Official Downloads & Documents
            </h2>
            {event.attachments.map((att) => (
              <a
                key={att.id}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Paperclip className="h-4 w-4 text-emerald-700" />
                  <span className="text-xs font-semibold text-slate-800">
                    {att.name}
                  </span>
                </div>
                <Download className="h-4 w-4 text-slate-400" />
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
