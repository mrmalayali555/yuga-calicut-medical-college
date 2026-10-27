import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Calendar, Medal, Award, User, Sparkles } from "lucide-react";
import { getAchievement } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { COLLEGE } from "@/lib/site";

import { AchievementCoverViewer } from "@/components/achievements/achievement-cover-viewer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getAchievement(slug);
  if (!item) return { title: "Achievement Not Found" };

  const description = item.description.slice(0, 160);
  const images = item.coverImage ? [{ url: item.coverImage }] : [{ url: "/og.png" }];

  return {
    title: item.title,
    description,
    alternates: {
      canonical: `/achievements/${slug}`,
    },
    openGraph: {
      title: item.title,
      description,
      type: "article",
      url: `/achievements/${slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: item.coverImage ? [item.coverImage] : ["/og.png"],
    },
  };
}

export default async function AchievementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getAchievement(slug);
  if (!item) notFound();

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/achievements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all laurels</span>
        </Link>

        {/* Category Pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className="rounded-full bg-[var(--accent-subtle)] border border-[var(--accent)]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            {item.category.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)]">
            <Trophy className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Official College Laurel</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)] tracking-tight leading-tight">
          {item.title}
        </h1>

        {/* Recipient & Date Tile */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[var(--text-secondary)] border-b border-[var(--border-primary)] pb-6">
          {item.awardWinner && (
            <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
              <User className="h-4 w-4 text-[var(--accent)]" />
              <span>Conferred to: {item.awardWinner}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[var(--accent)]" />
            <span>Achieved on {formatDate(item.date)}</span>
          </div>
        </div>

        {/* Cover Image with Lightbox */}
        {item.coverImage && (
          <AchievementCoverViewer
            coverImage={item.coverImage}
            title={item.title}
            category={item.category}
          />
        )}

        {/* Narrative Card */}
        <div className="mt-8 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
            Achievement Narrative
          </h2>
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] font-normal">
            {item.description}
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-primary)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Institution: {COLLEGE.name}</span>
            <span className="font-semibold text-[var(--accent)]">Verified by YUGA Union</span>
          </div>
        </div>
      </div>
    </div>
  );
}
