"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { CIRCULARS } from "@/lib/data";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)] mb-3">
            Official Despatches
          </p>
          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)]">
            Circulars & Notices
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            Authenticated communications from the College Union, Dean of
            Academics, KUHS Senate, and Hostel Wardens.
          </p>
        </motion.div>

        {/* List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="space-y-3"
        >
          {CIRCULARS.map((c) => (
            <motion.div
              key={c.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 120, damping: 20 },
                },
              }}
              className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[var(--border-primary)] bg-[var(--bg-card)] shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                    {c.category}
                  </span>
                  {c.priority === "high" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                      Priority
                    </span>
                  )}
                  <span className="text-[11px] text-[var(--text-faint)] font-mono font-medium">
                    {c.date}
                  </span>
                </div>

                <Link href={`/notifications/${c.id}`} className="block group">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {c.title}
                  </h3>
                </Link>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {c.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/notifications/${c.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-subtle)] px-3.5 py-2 text-xs font-semibold text-[var(--accent)] hover:brightness-110 transition-colors"
                >
                  Read Circular →
                </Link>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-colors cursor-pointer">
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{c.fileSize || "PDF"}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
