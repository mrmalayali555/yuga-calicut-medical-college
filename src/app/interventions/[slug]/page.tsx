import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Calendar, Building2, Download, Paperclip, Share2 } from "lucide-react";
import { getIntervention } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { COLLEGE, YUGA } from "@/lib/site";

import { InterventionDocViewer } from "@/components/interventions/intervention-doc-viewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getIntervention(slug);
  if (!item) return { title: "Intervention Not Found" };

  const description = item.description.slice(0, 160);

  return {
    title: item.title,
    description,
    alternates: {
      canonical: `/interventions/${slug}`,
    },
    openGraph: {
      title: item.title,
      description,
      type: "article",
      url: `/interventions/${slug}`,
      images: [{ url: "/og.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: ["/og.png"],
    },
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

  const downloadTarget = item.pdfUrl || item.image;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/interventions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to representations</span>
        </Link>

        {/* Category & Status Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            {item.category || "Student Welfare"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-primary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Official Union Representation</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)] tracking-tight leading-tight">
          {item.title}
        </h1>

        {/* Date and Metadata */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[var(--text-secondary)] border-b border-[var(--border-primary)] pb-6">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[var(--accent)]" />
            <span>Submitted on {formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-[var(--accent)]" />
            <span>Government Medical College, Kozhikode</span>
          </div>
        </div>

        {/* Interactive Original Document Photo / Lightbox Viewer */}
        {item.image && (
          <InterventionDocViewer
            image={item.image}
            title={item.title}
            category={item.category}
            pdfUrl={item.pdfUrl}
          />
        )}

        {/* Narrative & Body */}
        <div className="mt-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
            Representation Details & Resolution
          </h2>
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] font-normal">
            {item.description}
          </div>

          {/* Download Official Letter */}
          {downloadTarget && (
            <div className="mt-8 pt-6 border-t border-[var(--border-primary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
                  <Paperclip className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">Signed Memorandum Copy</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {item.pdfUrl ? "Official circular PDF format" : "High-resolution signed document photograph"}
                  </p>
                </div>
              </div>

              <a
                href={downloadTarget}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-white hover:brightness-110 transition-colors cursor-pointer shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>{item.pdfUrl ? "Download Signed PDF" : "Download Full Photo"}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
