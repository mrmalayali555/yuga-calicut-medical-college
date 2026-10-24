import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy, Calendar, Medal, Award, User, Sparkles } from "lucide-react";
import { getAchievement } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { COLLEGE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getAchievement(slug);
  if (!item) return { title: "Achievement Not Found · YUGA" };

  return {
    title: `${item.title} · YUGA Laurels & Honors`,
    description: item.description.slice(0, 160),
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
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/20 via-white to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/achievements"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all laurels</span>
        </Link>

        {/* Category Pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            {item.category.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Trophy className="h-3.5 w-3.5 text-emerald-700" />
            <span>Official College Laurel</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          {item.title}
        </h1>

        {/* Recipient & Date Tile */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-b border-slate-100 pb-6">
          {item.awardWinner && (
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <User className="h-4 w-4 text-emerald-700" />
              <span>Conferred to: {item.awardWinner}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-emerald-700" />
            <span>Achieved on {formatDate(item.date)}</span>
          </div>
        </div>

        {/* Cover Image */}
        {item.coverImage && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <img
              src={item.coverImage}
              alt={item.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Narrative Card */}
        <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            Achievement Narrative
          </h2>
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
            {item.description}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Institution: {COLLEGE.name}</span>
            <span className="font-semibold text-emerald-800">Verified by YUGA Union</span>
          </div>
        </div>
      </div>
    </div>
  );
}
