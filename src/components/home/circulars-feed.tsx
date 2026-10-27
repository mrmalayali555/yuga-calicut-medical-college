"use client";

import Link from "next/link";
import { ArrowRight, Download, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface CircularFeedItem {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  priority?: string;
  date: Date | string;
  summary?: string;
  description?: string;
  fileSize?: string;
  pdfUrl?: string | null;
}

interface CircularsFeedProps {
  initialCirculars?: CircularFeedItem[];
}

export function CircularsFeed({ initialCirculars }: CircularsFeedProps) {
  const items: CircularFeedItem[] = (initialCirculars ?? []).slice(0, 4);

  return (
    <section className="py-24 sm:py-32 border-t border-[var(--border-primary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)] mb-3">
              Official Communications
            </p>
            <h2 className="text-3xl sm:text-4xl font-display text-[var(--text-primary)]">
              Circulars &amp; Notices
            </h2>
          </div>

          <Link href="/notifications" className="btn-secondary text-sm group">
            All Circulars
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Table-style list */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm p-10 text-center">
            <Bell className="h-8 w-8 text-[var(--accent)] opacity-30 mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">No circulars posted yet. Check back soon.</p>
          </div>
        ) : (
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm overflow-hidden">
          {items.map((c, i) => {
            const dateStr =
              typeof c.date === "string" ? c.date : formatDate(new Date(c.date));
            const slug = c.slug || c.id;
            const summaryText = c.summary || c.description || "";

            return (
              <motion.div
                key={c.id || i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 hover:bg-[var(--bg-card-hover)] transition-colors ${
                  i < items.length - 1 ? "border-b border-[var(--border-primary)]" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                      {c.category || "Official Notice"}
                    </span>
                    {c.priority === "high" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse-soft" />
                        Priority
                      </span>
                    )}
                    <span className="text-[11px] text-[var(--text-faint)] font-mono font-medium">
                      {dateStr}
                    </span>
                  </div>
                  <Link href={`/notifications/${slug}`}>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                      {c.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] line-clamp-1">
                    {summaryText}
                  </p>
                </div>

                <Link
                  href={c.pdfUrl && c.pdfUrl !== "#" ? c.pdfUrl : `/notifications/${slug}`}
                  target={c.pdfUrl && c.pdfUrl !== "#" ? "_blank" : undefined}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-[color,border-color,background] duration-[160ms]"
                >
                  <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                  <span>{c.fileSize || "Read"}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        )}

      </div>
    </section>
  );
}

