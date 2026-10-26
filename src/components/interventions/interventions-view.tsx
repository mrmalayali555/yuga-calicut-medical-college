"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileText,
  ArrowRight,
  ShieldCheck,
  Building2,
  Eye,
  Maximize2,
  Search,
  X,
  LayoutGrid,
  Users,
  Stethoscope,
  Tag,
  AlertCircle,
} from "lucide-react";
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
  mobileColumns?: 1 | 2;
}

function getCategoryIcon(catId: string) {
  const lower = catId.toLowerCase();
  if (lower === "all") return LayoutGrid;
  if (lower.includes("infra") || lower.includes("building") || lower.includes("campus")) return Building2;
  if (lower.includes("safety") || lower.includes("security")) return ShieldCheck;
  if (lower.includes("academic") || lower.includes("welfare") || lower.includes("student")) return Users;
  if (lower.includes("health") || lower.includes("hospital") || lower.includes("clinical")) return Stethoscope;
  return Tag;
}

function getDocumentLabel(pdfUrl?: string | null): string {
  if (!pdfUrl || pdfUrl === "#" || pdfUrl.trim() === "" || pdfUrl === "/") {
    return "Official_Letter.pdf";
  }
  try {
    const raw = pdfUrl.split("/").pop() || "";
    const clean = raw.replace(/^\d+-/, "").trim();
    if (!clean || clean === "#") return "Official_Letter.pdf";
    return clean.endsWith(".pdf") ? clean : `${clean}.pdf`;
  } catch {
    return "Official_Letter.pdf";
  }
}

export function InterventionsView({
  initialInterventions,
  columns = 2,
}: InterventionsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalItem, setActiveModalItem] = useState<{
    src: string;
    alt: string;
    title: string;
    subtitle?: string;
    pdfUrl?: string | null;
    detailUrl?: string;
  } | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        initialInterventions
          .map((i) => i.category?.trim())
          .filter((c): c is string => Boolean(c))
      )
    );
    return [
      { id: "all", label: "All Interventions" },
      ...unique.map((cat) => ({ id: cat, label: cat })),
    ];
  }, [initialInterventions]);

  // Combined reactive filtering (category + search query)
  const filtered = useMemo(() => {
    return initialInterventions.filter((i) => {
      const matchesCategory =
        selectedCategory === "all" || i.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const title = (i.title || "").toLowerCase();
      const desc = (i.description || "").toLowerCase();
      const category = (i.category || "").toLowerCase();
      const authority = (i.authority || "").toLowerCase();
      const outcome = (i.outcome || "").toLowerCase();

      return (
        title.includes(q) ||
        desc.includes(q) ||
        category.includes(q) ||
        authority.includes(q) ||
        outcome.includes(q)
      );
    });
  }, [initialInterventions, selectedCategory, searchQuery]);

  const desktopGridCls = [
    "grid gap-6 sm:gap-8",
    columns === 1
      ? "grid-cols-1 max-w-3xl mx-auto"
      : columns === 2
      ? "grid-cols-2"
      : "grid-cols-2 lg:grid-cols-3",
  ].join(" ");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Mobile Editorial Header (< md) */}
      <div className="block md:hidden mb-6">
        <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
          Interventions
        </div>
        <h1 className="text-3xl font-serif text-white tracking-tight leading-tight">
          From voices{" "}
          <span className="italic text-[var(--accent)] font-normal">
            to action.
          </span>
        </h1>
        <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
          Representations, initiatives and follow-ups for a better GMC.
        </p>
      </div>

      {/* Desktop Header (>= md) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block max-w-2xl mb-10"
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

      {/* Category Filter Strip — Compact, swipeable on mobile, wrapping on desktop */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0 md:flex-wrap md:overflow-visible select-none">
        {categories.map((tab) => {
          const isActive = selectedCategory === tab.id;
          const count =
            tab.id === "all"
              ? initialInterventions.length
              : initialInterventions.filter((i) => i.category === tab.id).length;
          const Icon = getCategoryIcon(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`shrink-0 inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/25"
                  : "bg-[#0e1015] text-[var(--text-secondary)] border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-black/25 text-white"
                    : "bg-white/[0.08] text-[var(--text-muted)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search interventions..."
            className="w-full h-11 pl-10 pr-10 rounded-2xl bg-[#0e1015] border border-white/10 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-hidden focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 p-1 rounded-full text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Empty State when no items match filters */}
      {filtered.length === 0 && (
        <div className="py-16 text-center rounded-2xl bg-[#0e1015] border border-white/10 px-4 my-6">
          <AlertCircle className="h-8 w-8 text-[var(--accent)] mx-auto mb-3 opacity-80" />
          <h3 className="text-base font-semibold text-white mb-1">
            No interventions found
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No representations match "${searchQuery}". Try a different search term or clear the filter.`
              : "No representations found in this category."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-dark)] transition-colors cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* =====================================================================
          MOBILE VIEW (< md): Single-Column Compact Horizontal Card Feed
         ===================================================================== */}
      <div className="block md:hidden space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const itemKey = item.slug || item.id;
            const imageSrc =
              item.image ||
              FALLBACK_INTERVENTION_IMAGES[itemKey] ||
              FALLBACK_INTERVENTION_IMAGES[item.id] ||
              "/hero-building.jpg";

            const isResolved =
              item.pinned || item.status?.toLowerCase() === "resolved";

            const dateStr =
              typeof item.date === "string"
                ? item.date
                : formatDate(new Date(item.date));

            const docName = getDocumentLabel(item.pdfUrl);

            return (
              <motion.div
                layout
                key={`mobile-${item.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-row items-stretch gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#0e1015] border border-white/10 shadow-xs hover:border-[var(--accent)]/40 transition-colors"
              >
                {/* Thumbnail (~88-104px wide, clickable to lightbox) */}
                <div
                  className="w-[92px] sm:w-[104px] shrink-0 self-stretch min-h-[128px] relative rounded-xl overflow-hidden bg-black/40 border border-white/5 cursor-pointer group/thumb select-none"
                  onClick={() => {
                    setActiveModalItem({
                      src: imageSrc,
                      alt: item.title,
                      title: item.title,
                      subtitle:
                        item.category || "Official Representation Document",
                      pdfUrl: item.pdfUrl,
                      detailUrl: `/interventions/${itemKey}`,
                    });
                  }}
                  title="Click to view full original document"
                >
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                    sizes="104px"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <Maximize2 className="h-4 w-4 text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Right Content Hierarchy */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    {/* 1. Category label + Verified indicator */}
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <span className="text-[10px] font-bold tracking-wider text-[var(--accent)] uppercase truncate">
                        {item.category || "General Advocacy"}
                      </span>
                      {isResolved && (
                        <span
                          className="inline-flex items-center justify-center shrink-0 text-emerald-400"
                          title="Resolved / Verified"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </span>
                      )}
                    </div>

                    {/* 2. Recipient and date in compact metadata row */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-medium mb-1 truncate">
                      <span className="font-semibold text-white/90 truncate max-w-[130px] xs:max-w-[160px]">
                        To: {item.authority || "DME & KUHS"}
                      </span>
                      <span className="opacity-30 shrink-0">|</span>
                      <span className="shrink-0">{dateStr}</span>
                    </div>

                    {/* 3. Intervention title, clearly readable and moderately emphasized */}
                    <Link
                      href={`/interventions/${itemKey}`}
                      className="group/title block"
                    >
                      <h2 className="text-[14.5px] xs:text-[15px] font-serif font-bold text-[var(--text-primary)] leading-snug line-clamp-2 group-hover/title:text-[var(--accent)] transition-colors">
                        {item.title}
                      </h2>
                    </Link>

                    {/* 4. Short description preview, clamped to two lines */}
                    <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-2 font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* 5 & 6: Document indicator + Clear 'Read representation →' action */}
                  <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1 text-[10.5px] text-[var(--text-muted)] font-mono truncate min-w-0 flex-1 mr-2">
                      <FileText className="h-3 w-3 shrink-0 text-white/40" />
                      <span className="truncate">{docName}</span>
                    </div>

                    <Link
                      href={`/interventions/${itemKey}`}
                      className="inline-flex items-center gap-1 text-[11.5px] xs:text-xs font-semibold text-[var(--accent)] hover:text-[#ff2e56] transition-colors shrink-0 ml-auto whitespace-nowrap"
                    >
                      <span>Read representation</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* =====================================================================
          DESKTOP VIEW (>= md): Existing Cutout Cards Grid Layout (Preserved)
         ===================================================================== */}
      <div className="hidden md:block">
        <motion.div layout className={desktopGridCls}>
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const itemKey = item.slug || item.id;
              const imageSrc =
                item.image ||
                FALLBACK_INTERVENTION_IMAGES[itemKey] ||
                FALLBACK_INTERVENTION_IMAGES[item.id] ||
                "/hero-building.jpg";

              const isResolved =
                item.pinned || item.status?.toLowerCase() === "resolved";

              const dateStr =
                typeof item.date === "string"
                  ? item.date
                  : formatDate(new Date(item.date));

              return (
                <motion.div
                  layout
                  key={`desktop-${item.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CutoutCard className="h-full flex flex-col justify-between border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300">
                    <div className="flex-1 flex flex-col">
                      {/* Media container with signature Cutout Corner accents */}
                      <CutoutCardMedia className="h-64 sm:h-72 relative group/thumb cursor-pointer overflow-hidden">
                        <div
                          className="w-full h-full"
                          onClick={() => {
                            setActiveModalItem({
                              src: imageSrc,
                              alt: item.title,
                              title: item.title,
                              subtitle:
                                item.category ||
                                "Official Representation Document",
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
                        <CutoutCardInsetLabel className="bg-[var(--bg-card)] bottom-0 left-0 rounded-tr-[16px] sm:rounded-tr-[20px] px-4 py-2.5 shadow-2xs border-t border-r border-[var(--border-primary)]/40 pointer-events-none z-10">
                          <span className="text-[var(--accent)] text-[11px] font-bold tracking-wider uppercase">
                            {item.category || "General Advocacy"}
                          </span>
                          <CutoutCorner className="text-[var(--bg-card)] absolute -right-[31px] -bottom-px rotate-90" />
                          <CutoutCorner className="text-[var(--bg-card)] absolute -top-[31px] -left-px rotate-90" />
                        </CutoutCardInsetLabel>

                        {/* Pin Badge — top-right cutout */}
                        <CutoutCardPin
                          className={`top-0 right-0 rounded-bl-[14px] sm:rounded-bl-[16px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 pointer-events-none z-10 ${
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
                            <span>
                              {item.status ||
                                (isResolved ? "Resolved" : "In Progress")}
                            </span>
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
                      <CutoutCardContent className="p-6 sm:p-7 flex-1 flex flex-col">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2 font-medium gap-1">
                            <span className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)] truncate max-w-[140px] sm:max-w-none">
                              <Building2 className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                              <span className="truncate">
                                To:{" "}
                                {item.authority ||
                                  "DME & Hospital Administration"}
                              </span>
                            </span>
                            <span className="font-mono shrink-0 ml-1">
                              {dateStr}
                            </span>
                          </div>

                          <Link
                            href={`/interventions/${itemKey}`}
                            className="group/link block"
                          >
                            <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)] leading-snug group-hover/link:text-[var(--accent)] transition-colors line-clamp-2 min-h-[3.5rem]">
                              {item.title}
                            </h2>
                          </Link>

                          <p className="mt-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal line-clamp-2 min-h-[2.4rem]">
                            {item.description}
                          </p>

                          <div className="mt-2">
                            <Link
                              href={`/interventions/${itemKey}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                            >
                              <span>Read full representation</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>

                        {item.outcome && (
                          <div className="mt-3.5 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent)]/30 p-2.5 sm:p-3.5 text-xs text-[var(--text-primary)] leading-relaxed font-medium flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--accent)] mt-0.5" />
                            <div className="line-clamp-2">
                              <strong className="font-semibold text-[var(--accent)]">
                                Impact:{" "}
                              </strong>
                              {item.outcome}
                            </div>
                          </div>
                        )}
                      </CutoutCardContent>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-2">
                      <CutoutCardFooter className="border-t border-[var(--border-primary)] pt-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono truncate max-w-[130px] sm:max-w-none">
                          <FileText className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
                          <span className="truncate">Official Docket</span>
                        </div>
                        <span className="text-xs font-semibold text-[var(--accent)] truncate max-w-[100px] sm:max-w-none">
                          {item.category || "Representation"}
                        </span>
                      </CutoutCardFooter>
                    </div>

                    {/* Hover Action */}
                    <CutoutCardAction className="right-6 bottom-6 flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalItem({
                            src: imageSrc,
                            alt: item.title,
                            title: item.title,
                            subtitle:
                              item.category ||
                              "Official Representation Document",
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
      </div>

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
