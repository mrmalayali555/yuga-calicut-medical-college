"use client";

import Link from "next/link";
import { Download, FileText, Bell, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

export interface DynamicNotificationItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date | string;
  image?: string | null;
  pdfUrl?: string | null;
  category?: string;
  priority?: string;
  fileSize?: string;
}

interface NotificationsViewProps {
  initialNotifications: DynamicNotificationItem[];
  columns?: 1 | 2 | 3;
}

export function NotificationsView({
  initialNotifications,
  columns = 1,
}: NotificationsViewProps) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 120, damping: 20 },
    },
  };

  const gridCls =
    columns === 1
      ? "space-y-3"
      : columns === 2
      ? "grid gap-4 sm:grid-cols-2"
      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="max-w-2xl mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--accent-subtle)] px-3.5 py-1 mb-4 shadow-2xs">
          <Bell className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            Official Despatches
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
          Circulars &amp; Notices
        </h1>
        <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed font-normal">
          Authenticated communications from the College Union, Dean of
          Academics, KUHS Senate, and Hostel Wardens.
        </p>
      </motion.div>

      {/* List or Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={gridCls}
      >
        {initialNotifications.map((c) => {
          const itemKey = c.slug || c.id;
          const dateStr =
            typeof c.date === "string" ? c.date : formatDate(new Date(c.date));

          return (
            <motion.div
              key={c.id}
              variants={itemVariants}
              className={`p-5 sm:p-6 rounded-2xl flex flex-col justify-between gap-4 border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-xs hover:border-[var(--accent)] transition-all ${
                columns === 1 ? "sm:flex-row sm:items-center" : ""
              }`}
            >
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                    {c.category || "General Circular"}
                  </span>
                  {c.priority === "high" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                      Priority
                    </span>
                  )}
                  <span className="text-[11px] text-[var(--text-faint)] font-mono font-medium">
                    {dateStr}
                  </span>
                </div>

                <Link href={`/notifications/${itemKey}`} className="block group">
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                </Link>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 font-normal">
                  {c.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <Link
                  href={`/notifications/${itemKey}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--accent-subtle)] px-3.5 py-2 text-xs font-semibold text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                >
                  Read Circular →
                </Link>

                {c.pdfUrl && c.pdfUrl !== "#" ? (
                  <a
                    href={c.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>Download</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span>{c.fileSize || "PDF"}</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
