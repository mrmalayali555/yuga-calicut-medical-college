import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Calendar, Download, Paperclip, AlertTriangle } from "lucide-react";
import { getNotification } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { COLLEGE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNotification(slug);
  if (!item) return { title: "Notification Not Found · YUGA" };

  return {
    title: `${item.title} · YUGA Official Circular`,
    description: item.description.slice(0, 160),
  };
}

export default async function NotificationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNotification(slug);
  if (!item) notFound();

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/20 via-white to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/notifications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all circulars</span>
        </Link>

        {/* Priority Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Bell className="h-3.5 w-3.5 text-emerald-700" />
            <span>Official Union Circular</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          {item.title}
        </h1>

        {/* Circular Date */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 border-b border-slate-100 pb-6">
          <Calendar className="h-4 w-4 text-emerald-700" />
          <span>Published on {formatDate(item.date)}</span>
          <span className="text-slate-300">·</span>
          <span>Office of the General Secretary, YUGA</span>
        </div>

        {/* Main Circular Body */}
        <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
            {item.description}
          </div>

          {/* Download Official Circular PDF */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Paperclip className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Signed Official Circular Copy</h4>
                <p className="text-[11px] text-slate-500">Includes institutional seal & approval signatures</p>
              </div>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-2xs"
            >
              <Download className="h-4 w-4" />
              <span>Download Circular PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
