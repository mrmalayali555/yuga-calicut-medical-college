import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Calendar, Building2, Download, Paperclip, Share2 } from "lucide-react";
import { getIntervention } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { COLLEGE, YUGA } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getIntervention(slug);
  if (!item) return { title: "Intervention Not Found · YUGA" };

  return {
    title: `${item.title} · YUGA Union Interventions`,
    description: item.description.slice(0, 160),
  };
}

export default async function InterventionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getIntervention(slug);
  if (!item) notFound();

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/20 via-white to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/interventions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to representations</span>
        </Link>

        {/* Category & Status Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            {item.category || "Student Welfare"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Official Union Representation</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          {item.title}
        </h1>

        {/* Date and Metadata */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-emerald-700" />
            <span>Submitted on {formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-emerald-700" />
            <span>Government Medical College, Kozhikode</span>
          </div>
        </div>

        {/* Narrative & Body */}
        <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            Representation Details & Resolution
          </h2>
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
            {item.description}
          </div>

          {/* Download Official Letter */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Paperclip className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Signed Memorandum Copy</h4>
                <p className="text-[11px] text-slate-500">Official memorandum stamped by General Secretary</p>
              </div>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Signed Copy</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
