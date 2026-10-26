"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Trophy, ArrowRight, ArrowLeft, Calendar, ChevronRight, Eye, Maximize2 } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { EditableText } from "@/components/admin/inline/editable-text";
import { ImageLightboxModal } from "@/components/ui/image-lightbox-modal";

// Visual photographs paired with each achievement
const ACHIEVEMENT_VISUALS: Record<string, string> = {
  "kuhs-arts-champions": "/pulse-stage.jpg",
  "intermed-football-trophy":
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
  "icmr-sts-grants":
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80",
  "national-quiz-gold":
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
};

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  arts: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
  sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
  academics: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80",
  general: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
};

// Deterministic organic stack rotation angles for desktop 3D deck
const STACK_ANGLES = [-5, 4.5, -3, 6];

export interface FormattedAchievementItem {
  id: string;
  slug: string;
  title: string;
  recipient: string;
  batch: string;
  category: string;
  event: string;
  date: string;
  medal: string;
  description: string;
  image: string;
}

interface AchievementsShowcaseProps {
  initialAchievements?: any[];
  sliderSettings?: {
    autoplay: boolean;
    interval: number; // in seconds
  };
}

function resolveVisual(item: any): string {
  if (item.coverImage && typeof item.coverImage === "string" && item.coverImage.trim() !== "") {
    return item.coverImage;
  }
  const idOrSlug = (item.id || item.slug || "").toLowerCase();
  if (ACHIEVEMENT_VISUALS[idOrSlug]) return ACHIEVEMENT_VISUALS[idOrSlug];

  const title = (item.title || "").toLowerCase();
  if (title.includes("icmr") || title.includes("sts") || title.includes("research")) {
    return "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80";
  }
  if (title.includes("football") || title.includes("soccer")) {
    return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80";
  }
  if (title.includes("athletics") || title.includes("sports")) {
    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80";
  }
  if (title.includes("quiz") || title.includes("pharmacology") || title.includes("paper")) {
    return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80";
  }
  if (title.includes("arts") || title.includes("music") || title.includes("youth") || title.includes("fest")) {
    return "/pulse-stage.jpg";
  }

  const cat = (item.category || "general").toLowerCase();
  return CATEGORY_FALLBACK_IMAGES[cat] || "/pulse-stage.jpg";
}

export function AchievementsShowcase({
  initialAchievements,
  sliderSettings,
}: AchievementsShowcaseProps) {
  // Normalize achievements from DB or fallback mock
  const rawList =
    initialAchievements && initialAchievements.length > 0
      ? initialAchievements
      : ACHIEVEMENTS.slice(0, 4);

  const items: FormattedAchievementItem[] = rawList.map((item, idx) => {
    const id = item.id || item.slug || `achievement-${idx}`;
    const slug = item.slug || item.id || `achievement-${idx}`;
    const title = item.title;

    let recipient = item.recipient || item.awardWinner || "Calicut Medicos Contingent";
    let batch = item.batch || "GMC Kozhikode";

    if (item.awardWinner && item.awardWinner.includes("(") && item.awardWinner.includes(")")) {
      const parts = item.awardWinner.split("(");
      recipient = parts[0].trim();
      batch = parts[1].replace(")", "").trim();
    }

    const category = item.category || "general";
    const medal =
      item.medal ||
      (category === "sports"
        ? "Gold"
        : category === "arts"
        ? "Championship"
        : "National Honor");

    const date =
      typeof item.date === "string"
        ? item.date
        : item.date instanceof Date
        ? item.date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "July 2026";

    const event =
      item.event ||
      (category === "sports"
        ? "All-Kerala Inter-Medicos Tournament"
        : category === "arts"
        ? "KUHS State Youth Festival"
        : "Indian Council of Medical Research (ICMR)");

    const description = item.description || "";
    const image = resolveVisual(item);

    return {
      id,
      slug,
      title,
      recipient,
      batch,
      category,
      event,
      date,
      medal,
      description,
      image,
    };
  });

  const n = items.length;
  const [k, setK] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<{
    src: string;
    alt: string;
    title: string;
    subtitle?: string;
    detailUrl?: string;
  } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Autoplay configuration from props with fallbacks
  const autoplayEnabled = sliderSettings?.autoplay ?? true;
  const intervalSeconds =
    typeof sliderSettings?.interval === "number" &&
    sliderSettings.interval >= 2 &&
    sliderSettings.interval <= 30
      ? sliderSettings.interval
      : 3;
  const intervalMs = intervalSeconds * 1000;

  // Navigate handler that wraps around cleanly
  const navigate = useCallback(
    (inc: number) => {
      setK((prevK) => {
        const nextK = (prevK + inc + n) % n;
        if (sectionRef.current) {
          sectionRef.current.style.setProperty("--k", nextK.toString());
        }
        return nextK;
      });
    },
    [n]
  );

  const goToSlide = useCallback(
    (targetIndex: number) => {
      const validIndex = Math.max(0, Math.min(n - 1, targetIndex));
      setK(validIndex);
      if (sectionRef.current) {
        sectionRef.current.style.setProperty("--k", validIndex.toString());
      }
    },
    [n]
  );

  // Sync CSS properties on mount and active change
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.setProperty("--n", n.toString());
      sectionRef.current.style.setProperty("--k", k.toString());
    }
  }, [n, k]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Track when this section is visible on screen (for autoplay)
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Reset autoplay timer cleanly whenever slide changes or conditions update
  const restartAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!autoplayEnabled || reducedMotion || isHovered || n <= 1 || !isInView) return;

    timerRef.current = setInterval(() => {
      navigate(1);
    }, intervalMs);
  }, [autoplayEnabled, reducedMotion, isHovered, n, intervalMs, navigate, isInView]);

  useEffect(() => {
    restartAutoplay();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [restartAutoplay, k]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigate(-1);
      } else if (e.key === "ArrowRight") {
        navigate(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        navigate(1); // Swipe left -> next
      } else {
        navigate(-1); // Swipe right -> prev
      }
    }
    touchStartXRef.current = null;
  };

  const activeItem = items[k] || items[0];

  return (
    <section
      id="honors"
      className="scroll-mt-16 sm:scroll-mt-20 py-6 sm:py-10 lg:py-32 border-t border-[var(--border-primary)] overflow-hidden bg-[#07080a]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (>= lg / 1024px) — 3D Stacked Card Deck                     */}
        {/* ========================================================================= */}
        <div className="hidden lg:block">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-row items-end justify-between gap-6 mb-8"
          >
            <div>
              <EditableText
                blockId="achievements-label"
                defaultContent="Hall of Fame"
                pageId="home"
                label="Achievements Label"
                as="p"
                className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)] mb-3"
              />
              <EditableText
                blockId="achievements-title"
                defaultContent="Honors &amp; Laurels"
                pageId="home"
                label="Achievements Title"
                as="h2"
                className="text-3xl sm:text-4xl font-display text-[var(--text-primary)]"
              />
            </div>

            <Link href="/achievements" className="btn-secondary text-sm group">
              All Achievements
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          {/* 3D Stacked Card Deck Section */}
          <div className="relative pt-4">
            <section
              ref={sectionRef}
              className="achievements-deck-section"
              style={
                {
                  "--n": n,
                  "--k": k,
                } as React.CSSProperties
              }
            >
              {/* Top row counter in Col 2 */}
              <div className="achievements-deck-counter">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#ff2e56]">
                  <span className="h-2 w-2 rounded-full bg-[#ff2e56] animate-pulse" />
                  Featured Honors · Calicut Medicos
                </span>
                <div className="font-mono text-sm font-bold tracking-widest text-[var(--text-faint)]">
                  <span className="text-[var(--text-primary)] text-base font-semibold">
                    {String(k + 1).padStart(2, "0")}
                  </span>
                  <span className="mx-1.5 text-white/20">/</span>
                  <span>{String(n).padStart(2, "0")}</span>
                </div>
              </div>

              {/* Articles - each contains card visual, title & body for subgrid alignment */}
              {items.map((item, i) => {
                const angle = STACK_ANGLES[i % STACK_ANGLES.length];
                const zVal = (n - 1 + i - k) % n;
                const isActive = k === i;

                return (
                  <article
                    key={item.id}
                    className={`achievements-deck-article ${isActive ? "is-active" : ""}`}
                    style={
                      {
                        "--i": i,
                        "--a": `${angle}deg`,
                        "--z": zVal,
                      } as React.CSSProperties
                    }
                  >
                    {/* Visual card in Column 1 */}
                    <div
                      className="achievements-deck-card group"
                      onClick={() => navigate(1)}
                      role="button"
                      tabIndex={isActive ? 0 : -1}
                      aria-label={`View achievement: ${item.title}`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="achievements-deck-img"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/pulse-stage.jpg";
                        }}
                      />

                      {/* Dark gradient & card badges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090b11] via-black/35 to-black/20 p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 shadow-sm">
                            <Trophy className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                            {item.medal}
                          </span>
                          <span className="text-[11px] font-mono text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                            {item.date}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-[#ff2e56] uppercase tracking-wider block mb-1">
                            {item.recipient}
                          </span>
                          <h4 className="text-white text-base font-semibold leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      {/* Interactive Zoom overlay on active card */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/45 backdrop-blur-[1px] z-20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveModalItem({
                                src: item.image,
                                alt: item.title,
                                title: item.title,
                                subtitle: `${item.medal} • ${item.recipient}`,
                                detailUrl: `/achievements/${item.slug}`,
                              });
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/90 text-white text-xs font-semibold shadow-2xl border border-white/20 hover:border-amber-400 hover:text-amber-400 transition-all cursor-pointer"
                          >
                            <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                            <span>View Original Photo</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Title in Column 2, Row 2 */}
                    <div className="achievements-deck-title">
                      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                        <Trophy className="h-4 w-4 text-amber-400" aria-hidden="true" />
                        <span>{item.medal}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-[var(--text-faint)] font-mono">{item.date}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display text-[var(--text-primary)] leading-tight">
                        {item.title}
                      </h2>
                    </div>

                    {/* Body in Column 2, Row 3 */}
                    <div className="achievements-deck-body space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold text-[var(--accent)]">
                          {item.recipient}
                        </span>
                        <span className="text-xs text-[var(--text-faint)] font-medium px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {item.batch}
                        </span>
                      </div>

                      <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">
                        {item.description}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        <span>
                          Official Event:{" "}
                          <strong className="text-[var(--text-primary)]">{item.event}</strong>
                        </span>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-4">
                        <Link
                          href={`/achievements/${item.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                        >
                          <span>Full Laurel Story</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <span className="text-white/20">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveModalItem({
                              src: item.image,
                              alt: item.title,
                              title: item.title,
                              subtitle: `${item.medal} • ${item.recipient}`,
                              detailUrl: `/achievements/${item.slug}`,
                            });
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-400" />
                          <span>View Original Photo</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Navigation buttons in Column 2, Row 4 */}
              <div className="achievements-deck-controls">
                <button
                  type="button"
                  data-inc="-1"
                  aria-label="Previous achievement"
                  onClick={() => navigate(-1)}
                  className="achievements-deck-btn"
                />
                <button
                  type="button"
                  data-inc="1"
                  aria-label="Next achievement"
                  onClick={() => navigate(1)}
                  className="achievements-deck-btn"
                />

                {/* Dot indicators */}
                <div className="ml-4 flex items-center gap-2">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        k === idx
                          ? "w-8 bg-[#ff2e56] shadow-sm shadow-[#ff2e56]/50"
                          : "w-2.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET VIEW (< lg / 1024px) — Exact Reference Mockup Design       */}
        {/* ========================================================================= */}
        <div className="block lg:hidden">
          {/* Header with Title & Counter */}
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Honors &amp; Laurels
            </h2>
            <div className="font-mono text-xs sm:text-sm tracking-widest shrink-0">
              <span className="font-bold text-white text-sm sm:text-base">
                {String(k + 1).padStart(2, "0")}
              </span>
              <span className="text-white/40 font-medium"> / {String(n).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="flex items-center gap-1.5 mb-3 w-full max-w-xs">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  k === idx ? "bg-[#ff2e56]" : "bg-white/10 hover:bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Layered Card Stack Visual */}
          <div
            className="relative px-1 pt-2 pb-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Layer 1 (Deepest rim) */}
            <div
              className="absolute -top-1 left-5 right-5 h-14 rounded-2xl border border-[#ff2e56]/20 bg-white/[0.015] transform -rotate-2 pointer-events-none transition-transform duration-500"
              aria-hidden="true"
            />
            {/* Background Layer 2 (Middle rim) */}
            <div
              className="absolute top-1 left-3 right-3 h-14 rounded-2xl border border-[#ff2e56]/35 bg-white/[0.025] transform rotate-1.5 pointer-events-none transition-transform duration-500"
              aria-hidden="true"
            />

            {/* Main Interactive Top Card */}
            <div className="relative z-10 w-full aspect-[4/3.2] max-h-[320px] rounded-2xl overflow-hidden border border-white/15 bg-[#090b11] shadow-2xl shadow-black/90">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full flex flex-col justify-between"
                >
                  {/* Full image */}
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/pulse-stage.jpg";
                    }}
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/25 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="relative z-10 p-3.5 sm:p-4 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 shadow-sm">
                      <Trophy className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                      {activeItem.medal}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-white/80 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-sm">
                      <Calendar className="h-3.5 w-3.5 text-white/60" aria-hidden="true" />
                      {activeItem.date}
                    </span>
                  </div>

                  {/* Bottom Text Overlay with Floating Circular Button */}
                  <div className="relative z-10 p-3.5 sm:p-5 flex items-end justify-between gap-3">
                    <div className="space-y-1 pr-2 min-w-0">
                      <div className="inline-block">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#ff2e56] block truncate">
                          {activeItem.recipient}
                        </span>
                        <div className="h-0.5 w-7 bg-[#ff2e56] mt-0.5 rounded-full" />
                      </div>
                      <h3 className="text-base sm:text-xl font-serif font-bold text-white leading-snug line-clamp-2">
                        {activeItem.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModalItem({
                            src: activeItem.image,
                            alt: activeItem.title,
                            title: activeItem.title,
                            subtitle: `${activeItem.medal} • ${activeItem.recipient}`,
                            detailUrl: `/achievements/${activeItem.slug}`,
                          });
                        }}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center shrink-0 hover:bg-black/80 transition-all shadow-md active:scale-95 cursor-pointer"
                        aria-label="View original full photo"
                        title="View original full photo"
                      >
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                      </button>

                      <Link
                        href={`/achievements/${activeItem.slug}`}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#ff2e56]/20 border border-[#ff2e56]/50 text-white flex items-center justify-center shrink-0 hover:bg-[#ff2e56] transition-all shadow-md active:scale-95"
                        aria-label={`View achievement ${activeItem.title}`}
                      >
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Navigation & Dots */}
          <div className="flex items-center justify-center gap-5 pt-4 pb-1">
            <button
              type="button"
              aria-label="Previous achievement"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:border-[#ff2e56] hover:bg-[#ff2e56]/20 active:scale-95 transition-all shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* Centered Dots */}
            <div className="flex items-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    k === idx
                      ? "w-3 h-3 bg-[#ff2e56] shadow-sm shadow-[#ff2e56]/50"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next achievement"
              onClick={() => navigate(1)}
              className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:border-[#ff2e56] hover:bg-[#ff2e56]/20 active:scale-95 transition-all shadow-md"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox modal for original full-resolution photos */}
      <ImageLightboxModal
        isOpen={activeModalItem !== null}
        onClose={() => setActiveModalItem(null)}
        src={activeModalItem?.src || null}
        alt={activeModalItem?.alt || ""}
        title={activeModalItem?.title}
        subtitle={activeModalItem?.subtitle}
        detailUrl={activeModalItem?.detailUrl}
      />
    </section>
  );
}
