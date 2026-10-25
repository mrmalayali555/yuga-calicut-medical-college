"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/data";
import { motion } from "framer-motion";
import { EditableText } from "@/components/admin/inline/editable-text";

// Visual photographs paired with each achievement
const ACHIEVEMENT_VISUALS: Record<string, string> = {
  "kuhs-arts-champions": "/pulse-stage.jpg",
  "intermed-football-trophy": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
  "icmr-sts-grants": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80",
  "national-quiz-gold": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
};

// Deterministic organic stack rotation angles
const STACK_ANGLES = [-5, 4.5, -3, 6];

export function AchievementsShowcase() {
  const items = ACHIEVEMENTS.slice(0, 4);
  const n = items.length;
  const [k, setK] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Sync initial CSS custom properties on mount
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.setProperty("--n", n.toString());
      sectionRef.current.style.setProperty("--k", k.toString());
    }
  }, [n, k]);

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

  return (
    <section className="py-24 sm:py-32 border-t border-[var(--border-primary)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8"
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
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
              const photoUrl =
                ACHIEVEMENT_VISUALS[item.id] ||
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80";

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
                      src={photoUrl}
                      alt={item.title}
                      className="achievements-deck-img"
                      loading="lazy"
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
                      <span>Official Event: <strong className="text-[var(--text-primary)]">{item.event}</strong></span>
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
                    onClick={() => {
                      setK(idx);
                      sectionRef.current?.style.setProperty("--k", idx.toString());
                    }}
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
    </section>
  );
}
