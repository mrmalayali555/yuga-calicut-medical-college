"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, FileText, ArrowRight, ShieldCheck, Building2, Eye, Maximize2 } from "lucide-react";
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

const FALLBACK_INTERVENTION_IMAGES: Record<string, string> = {
  "representation-regarding-early-publication-of-final-year-mbbs-results":
    "https://tokr4sc45vjvffrx.public.blob.vercel-storage.com/1793030060998-2eb356d4.jpg",
  "representation-regarding-the-delay-in-e-grantz-scholarship":
    "https://tokr4sc45vjvffrx.public.blob.vercel-storage.com/1793030082533-b0fcc17d.jpg",
  "representation-regarding-the-proposed-increase-in-working-hours-of-jrs-under-the-drp":
    "https://tokr4sc45vjvffrx.public.blob.vercel-storage.com/1793030255714-6183f0b9.jpg",
  "inv-reading-rooms":
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
  "inv-opd-ramp":
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
  "inv-stipend-timely":
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  "inv-canteen-night":
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
};

export interface DynamicInterventionItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date | string;
  image?: string | null;
  category?: string | null;
  pinned?: boolean;
  authority?: string;
  status?: string;
  outcome?: string;
  pdfUrl?: string | null;
}

interface InterventionsViewProps {
  initialInterventions: DynamicInterventionItem[];
  columns?: 1 | 2 | 3;
}

export function InterventionsView({
  initialInterventions,
  columns = 2,
}: InterventionsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeModalItem, setActiveModalItem] = useState<{
    src: string;
    alt: string;
    title: string;
    subtitle?: string;
    pdfUrl?: string | null;
    detailUrl?: string;
  } | null>(null);

  // Extract unique categories
  const categories = [
    { id: "all", label: "All Interventions" },
    ...Array.from(
      new Set(
        initialInterventions
          .map((i) => i.category?.trim())
          .filter((c): c is string => Boolean(c))
      )
    ).map((cat) => ({ id: cat, label: cat })),
  ];

  const filtered =
    selectedCategory === "all"
      ? initialInterventions
      : initialInterventions.filter((i) => i.category === selectedCategory);

  const gridCls =
    columns === 1
      ? "grid gap-8 grid-cols-1 max-w-3xl mx-auto"
      : columns === 2
      ? "grid gap-8 grid-cols-1 md:grid-cols-2"
      : "grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--accent-subtle)] px-3.5 py-1 mb-4 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            Advocacy &amp; Student Rights
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
          Union Interventions
        </h1>
        <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed font-normal">
          Official petitions, policy memorandums, and student welfare
          representations submitted by YUGA to DME Kerala, KUHS, and
          Hospital Administration.
        </p>
      </motion.div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-[var(--border-primary)]">
        {categories.map((tab) => {
          const isActive = selectedCategory === tab.id;
          const count =
            tab.id === "all"
              ? initialInterventions.length
              : initialInterventions.filter((i) => i.category === tab.id).length;
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
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "text-white bg-black/20"
                    : "text-[var(--text-muted)] bg-[var(--bg-surface)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cutout Cards Grid */}
      <motion.div layout className={gridCls}>
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const itemKey = item.slug || item.id;
            const imageSrc =
              item.image ||
              FALLBACK_INTERVENTION_IMAGES[itemKey] ||
              FALLBACK_INTERVENTION_IMAGES[item.id] ||
              "/hero-building.jpg";

            const isResolved =
              item.pinned ||
              item.status?.toLowerCase() === "resolved";

            const dateStr =
              typeof item.date === "string"
                ? item.date
                : formatDate(new Date(item.date));

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <CutoutCard className="h-full flex flex-col justify-between border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300">
                  <div>
                    {/* Media container with signature Cutout Corner accents */}
                    <CutoutCardMedia className="h-64 sm:h-72 relative group/thumb cursor-pointer overflow-hidden">
                      <div
                        className="w-full h-full"
                        onClick={() => {
                          setActiveModalItem({
                            src: imageSrc,
                            alt: item.title,
                            title: item.title,
                            subtitle: item.category || "Official Representation Document",
                            pdfUrl: item.pdfUrl,
                            detailUrl: `/interventions/${itemKey}`,
                          });
                        }}
                        title="Click to view full original document photo"
                      >
                        <CutoutCardImage
                          alt={item.title}
                          src={imageSrc}
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                        <CutoutCardOverlay />

                        {/* Interactive Hover Badge to view original photo */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-black/45 backdrop-blur-[1.5px] pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/85 text-white text-xs font-semibold shadow-xl border border-white/20">
                            <Maximize2 className="h-3.5 w-3.5 text-[var(--accent)]" />
                            <span>View Original Photo</span>
                          </span>
                        </div>
                      </div>

                      {/* Inset Label — bottom-left cutout */}
                      <CutoutCardInsetLabel className="bg-[var(--bg-card)] bottom-0 left-0 rounded-tr-[20px] px-4 py-2.5 shadow-2xs border-t border-r border-[var(--border-primary)]/40 pointer-events-none z-10">
                        <span className="text-[var(--accent)] text-[11px] font-bold tracking-wider uppercase">
                          {item.category || "General Advocacy"}
                        </span>
                        <CutoutCorner className="text-[var(--bg-card)] absolute -right-[31px] -bottom-px rotate-90" />
                        <CutoutCorner className="text-[var(--bg-card)] absolute -top-[31px] -left-px rotate-90" />
                      </CutoutCardInsetLabel>

                      {/* Pin Badge — top-right cutout */}
                      <CutoutCardPin
                        className={`top-0 right-0 rounded-bl-[16px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 pointer-events-none z-10 ${
                          isResolved
                            ? "bg-emerald-600 text-white ring-emerald-700/30"
                            : "bg-amber-500 text-white ring-amber-600/30"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {isResolved ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          {item.status || (isResolved ? "Resolved" : "In Progress")}
                        </span>
                        <CutoutCorner
                          className={`absolute top-0 -left-[23px] -rotate-90 ${
                            isResolved ? "text-emerald-600" : "text-amber-500"
                          }`}
                          size={24}
                        />
                        <CutoutCorner
                          className={`absolute right-0 -bottom-[23px] -rotate-90 ${
                            isResolved ? "text-emerald-600" : "text-amber-500"
                          }`}
                          size={24}
                        />
                      </CutoutCardPin>
                    </CutoutCardMedia>

                    {/* Content Section */}
                    <CutoutCardContent className="p-6 sm:p-7">
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2 font-medium">
                        <span className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
                          <Building2 className="h-3.5 w-3.5 text-[var(--accent)]" />
                          To: {item.authority || "DME & Hospital Administration"}
                        </span>
                        <span className="font-mono">{dateStr}</span>
                      </div>

                      <Link href={`/interventions/${itemKey}`} className="group/link block">
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] leading-snug group-hover/link:text-[var(--accent)] transition-colors">
                          {item.title}
                        </h2>
                      </Link>

                      <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                        {item.description}
                      </p>

                      {item.outcome && (
                        <div className="mt-5 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/30 p-3.5 text-xs text-[var(--text-primary)] leading-relaxed font-medium flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--accent)] mt-0.5" />
                          <div>
                            <strong className="font-semibold text-[var(--accent)]">
                              Impact Outcome:{" "}
                            </strong>
                            {item.outcome}
                          </div>
                        </div>
                      )}
                    </CutoutCardContent>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6 pt-2">
                    <CutoutCardFooter className="border-t border-[var(--border-primary)] pt-4">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
                        <FileText className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        <span>Official Union Docket</span>
                      </div>
                      <span className="text-xs font-semibold text-[var(--accent)]">
                        {item.category || "Active Representation"}
                      </span>
                    </CutoutCardFooter>
                  </div>

                  {/* Hover Action */}
                  <CutoutCardAction className="right-6 bottom-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalItem({
                          src: imageSrc,
                          alt: item.title,
                          title: item.title,
                          subtitle: item.category || "Official Representation Document",
                          pdfUrl: item.pdfUrl,
                          detailUrl: `/interventions/${itemKey}`,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)]/90 backdrop-blur-md px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] shadow-2xs transition-all cursor-pointer"
                      title="Inspect original document image"
                    >
                      <Eye className="h-3.5 w-3.5 text-[var(--accent)]" />
                      <span className="hidden sm:inline">Original Photo</span>
                    </button>
                    <Link
                      href={`/interventions/${itemKey}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] hover:bg-[var(--accent-dark)]"
                    >
                      <span>Read Petition</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CutoutCardAction>
                </CutoutCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox modal for original full-resolution documents and photos */}
      <ImageLightboxModal
        isOpen={activeModalItem !== null}
        onClose={() => setActiveModalItem(null)}
        src={activeModalItem?.src || null}
        alt={activeModalItem?.alt || ""}
        title={activeModalItem?.title}
        subtitle={activeModalItem?.subtitle}
        pdfUrl={activeModalItem?.pdfUrl}
        detailUrl={activeModalItem?.detailUrl}
      />
    </div>
  );
}
