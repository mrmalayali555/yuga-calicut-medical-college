"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Medal, Award, ArrowUpRight, Eye, Maximize2 } from "lucide-react";
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
import { ImageLightboxModal } from "@/components/ui/image-lightbox-modal";

const FALLBACK_IMAGES: Record<string, string> = {
  "kuhs-arts-champions":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  "intermed-football-trophy":
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
  "icmr-sts-grants":
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  "national-quiz-gold":
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  "inter-medical-football-2026":
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
  "state-youth-festival-music":
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
  "best-research-paper-med-conclave":
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  "gold-inter-college-athletics":
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
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
  columns = 3,
  mobileColumns = 1,
}: {
  initialAchievements: AchievementItemProps[];
  columns?: 1 | 2 | 3;
  mobileColumns?: 1 | 2;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModalItem, setActiveModalItem] = useState<{
    src: string;
    alt: string;
    title: string;
    subtitle?: string;
    detailUrl?: string;
  } | null>(null);

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
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-subtle)] px-3.5 py-1 mb-4 shadow-2xs">
          <Trophy className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            Hall of Fame & Laurels
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
          Honors & Achievements
        </h1>
        <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed font-normal">
          Commemorating championships, KUHS Arts festival triumphs, ICMR grants,
          and sports laurels won by Calicut Medicos.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-[var(--border-primary)]">
        {ACHIEVEMENT_CATEGORIES.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-white bg-[var(--accent)] shadow-sm"
                  : "text-[var(--text-primary)] border border-[var(--border-primary)] bg-[var(--bg-card)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Achievement Cards */}
      <motion.div
        layout
        className={[
          "grid",
          mobileColumns === 2 ? "grid-cols-2 gap-3 sm:gap-6" : "grid-cols-1 gap-6 sm:gap-8",
          columns === 1
            ? "md:grid-cols-1 max-w-3xl mx-auto"
            : columns === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-2 lg:grid-cols-3",
        ].join(" ")}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const itemKey = item.slug || item.id;
            const cat = (item.category || "general").toLowerCase();
            const categoryDefault =
              cat === "sports"
                ? "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80"
                : cat === "arts"
                ? "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
                : cat === "academics"
                ? "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80"
                : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";

            const imageSrc =
              item.coverImage ||
              FALLBACK_IMAGES[itemKey] ||
              FALLBACK_IMAGES[item.id] ||
              categoryDefault;

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
                <CutoutCard className="h-full flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex-1 flex flex-col">
                    {/* Media container with Cutout Corners */}
                    <CutoutCardMedia className={`${mobileColumns === 2 ? "h-40 xs:h-48 sm:h-60" : "h-56 sm:h-60"} relative group/thumb cursor-pointer overflow-hidden`}>
                      <div
                        className="w-full h-full"
                        onClick={() => {
                          setActiveModalItem({
                            src: imageSrc,
                            alt: item.title,
                            title: item.title,
                            subtitle: `${medalLabel} • ${item.category.toUpperCase()}`,
                            detailUrl: `/achievements/${itemKey}`,
                          });
                        }}
                        title="Click to view full original photo"
                      >
                        <CutoutCardImage
                          alt={item.title}
                          src={imageSrc}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <CutoutCardOverlay />

                        {/* Interactive Hover Badge */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/45 backdrop-blur-[1.5px] pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/85 text-white text-xs font-semibold shadow-xl border border-white/20">
                            <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                            <span>View Original Photo</span>
                          </span>
                        </div>
                      </div>

                      {/* Inset Label — bottom-left cutout */}
                      <CutoutCardInsetLabel className={`bg-[var(--bg-card)] bottom-0 left-0 rounded-tr-[16px] sm:rounded-tr-[20px] ${mobileColumns === 2 ? "px-2.5 py-1.5" : "px-4 py-2"} shadow-2xs border-t border-r border-[var(--border-primary)]/40 pointer-events-none z-10`}>
                        <span className={`text-[var(--accent)] ${mobileColumns === 2 ? "text-[9px] sm:text-[11px]" : "text-[11px]"} font-bold tracking-wider uppercase`}>
                          {item.category.toUpperCase()}
                        </span>
                        <CutoutCorner className="text-[var(--bg-card)] absolute -right-[31px] -bottom-px rotate-90" />
                        <CutoutCorner className="text-[var(--bg-card)] absolute -top-[31px] -left-px rotate-90" />
                      </CutoutCardInsetLabel>

                      {/* Pin Badge — top-right cutout */}
                      <CutoutCardPin className={`top-0 right-0 rounded-bl-[14px] sm:rounded-bl-[16px] ${mobileColumns === 2 ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs"} font-bold uppercase tracking-wider shadow-sm ring-1 bg-amber-500 text-white ring-amber-600/30 pointer-events-none z-10`}>
                        <span className="inline-flex items-center gap-1.5">
                          <Medal className="h-3.5 w-3.5" />
                          <span className={mobileColumns === 2 ? "hidden xs:inline" : ""}>{medalLabel}</span>
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
                    <CutoutCardContent className={`${mobileColumns === 2 ? "p-3.5 sm:p-6" : "p-6"} flex-1 flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2 font-medium">
                          <span className="text-[var(--accent)] font-semibold truncate max-w-[130px] sm:max-w-[200px]">
                            {recipientText}
                          </span>
                          <span className="font-mono">{dateText}</span>
                        </div>

                        <Link href={`/achievements/${itemKey}`} className="group/link block">
                          <h3 className={`${mobileColumns === 2 ? "text-base sm:text-xl" : "text-xl"} font-display font-bold text-[var(--text-primary)] leading-snug group-hover/link:text-[var(--accent)] transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3.25rem]`}>
                            {item.title}
                          </h3>
                        </Link>

                        {item.batch && (
                          <p className="mt-1 text-xs text-[var(--text-muted)] font-medium truncate">
                            {item.batch}
                          </p>
                        )}

                        <p className="mt-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal line-clamp-2 min-h-[2.2rem]">
                          {item.description}
                        </p>
                      </div>
                    </CutoutCardContent>
                  </div>

                  {/* Footer */}
                  <div className={mobileColumns === 2 ? "px-3.5 pb-3.5 pt-1 sm:px-6 sm:pb-6" : "px-6 pb-6 pt-1"}>
                    <CutoutCardFooter className="border-t border-[var(--border-primary)] pt-3.5">
                      <span className="text-xs font-medium text-[var(--text-secondary)] truncate max-w-[140px] sm:max-w-[220px]">
                        {item.event || "GMC Kozhikode"}
                      </span>
                      <Trophy className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
                    </CutoutCardFooter>
                  </div>

                  {/* Hover Action */}
                  <CutoutCardAction className={`${mobileColumns === 2 ? "right-3.5 bottom-3.5 sm:right-5 sm:bottom-5" : "right-5 bottom-5"} flex items-center gap-1.5 sm:gap-2`}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalItem({
                          src: imageSrc,
                          alt: item.title,
                          title: item.title,
                          subtitle: `${medalLabel} • ${item.category.toUpperCase()}`,
                          detailUrl: `/achievements/${itemKey}`,
                        });
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)]/90 backdrop-blur-md ${mobileColumns === 2 ? "p-2 sm:px-3 sm:py-2" : "px-3 py-2"} text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] shadow-2xs transition-all cursor-pointer`}
                      title="Inspect original photo"
                    >
                      <Eye className="h-3.5 w-3.5 text-amber-500" />
                      <span className="hidden sm:inline">Photo</span>
                    </button>
                    <Link
                      href={`/achievements/${itemKey}`}
                      className={`inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] ${mobileColumns === 2 ? "px-3 py-2 text-[11px] sm:px-4 sm:py-2 sm:text-xs" : "px-4 py-2 text-xs"} font-semibold text-white shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] hover:brightness-110`}
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

      {/* Lightbox modal for full original photos */}
      <ImageLightboxModal
        isOpen={activeModalItem !== null}
        onClose={() => setActiveModalItem(null)}
        src={activeModalItem?.src || null}
        alt={activeModalItem?.alt || ""}
        title={activeModalItem?.title}
        subtitle={activeModalItem?.subtitle}
        detailUrl={activeModalItem?.detailUrl}
      />
    </div>
  );
}
