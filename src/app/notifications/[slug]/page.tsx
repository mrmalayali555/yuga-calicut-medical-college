import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Calendar, Download, Paperclip, AlertTriangle } from "lucide-react";
import { getNotification } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { COLLEGE, SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNotification(slug);
  if (!item) return { title: "Circular Not Found" };

  const description = item.description.slice(0, 160);

  return {
    title: item.title,
    description,
    alternates: {
      canonical: `/notifications/${slug}`,
    },
    openGraph: {
      title: item.title,
      description,
      type: "article",
      url: `/notifications/${slug}`,
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

export default async function NotificationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNotification(slug);
  if (!item) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.description,
    datePublished: new Date(item.date).toISOString(),
    author: {
      "@type": "Organization",
      name: `YUGA College Union — ${COLLEGE.name}`,
    },
    publisher: {
      "@type": "Organization",
      name: COLLEGE.name,
      url: SITE.url,
    },
    image: [`${SITE.url}/og.png`],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/notifications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all circulars</span>
        </Link>

        {/* Priority Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            <Bell className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Official Union Circular</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)] tracking-tight leading-tight">
          {item.title}
        </h1>

        {/* Circular Date */}
        <div className="mt-6 flex items-center gap-2 text-xs text-[var(--text-secondary)] border-b border-[var(--border-primary)] pb-6">
          <Calendar className="h-4 w-4 text-[var(--accent)]" />
          <span>Published on {formatDate(item.date)}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>Office of the General Secretary, YUGA</span>
        </div>

        {/* Main Circular Body */}
        <div className="mt-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-xs">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] font-normal">
            {item.description}
          </div>

          {/* Download Official Circular PDF */}
          <div className="mt-8 pt-6 border-t border-[var(--border-primary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
                <Paperclip className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">Signed Official Circular Copy</h4>
                <p className="text-[11px] text-[var(--text-muted)]">Includes institutional seal & approval signatures</p>
              </div>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition-colors shadow-2xs"
            >
              <Download className="h-4 w-4" />
              <span>Download Circular PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
