"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Medal, Award, ArrowUpRight } from "lucide-react";
import { ACHIEVEMENT_CATEGORIES } from "@/lib/site";
import { motion, AnimatePresence } from "framer-motion";
import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
} from "@/components/ui/cutout-card";
import { formatDate } from "@/lib/utils";

const FALLBACK_IMAGES: Record<string, string> = {
  "kuhs-arts-champions":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  "intermed-football-trophy":
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
  "icmr-sts-grants":
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  "national-quiz-gold":
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
};

export interface AchievementItemProps {
  id: string;
  title: string;
  slug?: string;
  category: string;
  description: string;
  date: Date | string;
  coverImage?: string | null;
  awardWinner?: string | null;
  recipient?: string;
  batch?: string;
  event?: string;
  medal?: string;
}

export function AchievementsView({
  initialAchievements,
}: {
  initialAchievements: AchievementItemProps[];
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered =
    selectedCategory === "all"
      ? initialAchievements
      : initialAchievements.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1 mb-4 shadow-2xs">
          <Trophy className="h-3.5 w-3.5 text-emerald-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Hall of Fame & Laurels
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
          Honors & Achievements
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
          Commemorating championships, KUHS Arts festival triumphs, ICMR grants,
          and sports laurels won by Calicut Medicos.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-slate-200/80">
        {ACHIEVEMENT_CATEGORIES.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-white bg-emerald-700 shadow-sm"
                  : "text-emerald-950 border border-emerald-200/80 bg-white hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Achievement Cards */}
      <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const itemKey = item.slug || item.id;
            const imageSrc =
              item.coverImage ||
              FALLBACK_IMAGES[itemKey] ||
              FALLBACK_IMAGES[item.id] ||
              "/hero-building.jpg";

            const recipientText = item.awardWinner || item.recipient || "Calicut Medicos";
            const dateText = typeof item.date === "string" ? item.date : formatDate(new Date(item.date));
            const medalLabel = item.medal || "Laurel";

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <CutoutCard className="h-full flex flex-col justify-between border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div>
                    {/* Media container with Cutout Corners */}
                    <CutoutCardMedia className="h-56 sm:h-60 relative">
                      <CutoutCardImage
                        alt={item.title}
                        src={imageSrc}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <CutoutCardOverlay />

                      {/* Inset Label — bottom-left cutout */}
                      <CutoutCardInsetLabel className="bg-white bottom-0 left-0 rounded-tr-[20px] px-4 py-2 shadow-2xs">
                        <span className="text-emerald-800 text-[11px] font-bold tracking-wider uppercase">
                          {item.category.toUpperCase()}
                        </span>
                        <CutoutCorner className="text-white absolute -right-[31px] -bottom-px rotate-90" />
                        <CutoutCorner className="text-white absolute -top-[31px] -left-px rotate-90" />
                      </CutoutCardInsetLabel>

                      {/* Pin Badge — top-right cutout */}
                      <CutoutCardPin className="top-0 right-0 rounded-bl-[16px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 bg-amber-500 text-white ring-amber-600/30">
                        <span className="inline-flex items-center gap-1.5">
                          <Medal className="h-3.5 w-3.5" />
                          {medalLabel}
                        </span>
                        <CutoutCorner
                          className="text-amber-500 absolute top-0 -left-[23px] -rotate-90"
                          size={24}
                        />
                        <CutoutCorner
                          className="text-amber-500 absolute right-0 -bottom-[23px] -rotate-90"
                          size={24}
                        />
                      </CutoutCardPin>
                    </CutoutCardMedia>

                    {/* Content Section */}
                    <CutoutCardContent className="p-6">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                        <span className="text-emerald-800 font-semibold truncate max-w-[200px]">
                          {recipientText}
                        </span>
                        <span className="font-mono">{dateText}</span>
                      </div>

                      <Link href={`/achievements/${itemKey}`} className="group/link block">
                        <h3 className="text-xl font-display font-bold text-slate-900 leading-snug group-hover/link:text-emerald-700 transition-colors">
                          {item.title}
                        </h3>
                      </Link>

                      {item.batch && (
                        <p className="mt-1 text-xs text-slate-500 font-medium">
                          {item.batch}
                        </p>
                      )}

                      <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
                        {item.description}
                      </p>
                    </CutoutCardContent>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6 pt-1">
                    <CutoutCardFooter className="border-t border-slate-100 pt-3.5">
                      <span className="text-xs font-medium text-slate-600 truncate max-w-[220px]">
                        {item.event || "GMC Kozhikode"}
                      </span>
                      <Trophy className="h-4 w-4 text-amber-600 shrink-0" aria-hidden="true" />
                    </CutoutCardFooter>
                  </div>

                  {/* Hover Action */}
                  <CutoutCardAction className="right-5 bottom-5">
                    <Link
                      href={`/achievements/${itemKey}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>View Laurel</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </CutoutCardAction>
                </CutoutCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
