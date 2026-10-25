"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { CALENDAR_EVENTS } from "@/lib/data";
import { ACADEMIC_BATCHES, COLLEGE } from "@/lib/site";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const [selectedBatch, setSelectedBatch] = useState("all");

  const filtered =
    selectedBatch === "all"
      ? CALENDAR_EVENTS
      : CALENDAR_EVENTS.filter((e) => e.batch === selectedBatch);

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
            University Schedules
          </p>
          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)]">
            Academic Calendar
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            KUHS examinations, clinical postings, internal assessments, and
            clerkship rotations at {COLLEGE.name}.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-8 mb-8 border-b border-[var(--border-primary)]">
          {ACADEMIC_BATCHES.map((b) => {
            const isActive = selectedBatch === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBatch(b.id)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-white bg-[var(--accent)] shadow-sm"
                    : "text-[var(--text-primary)] border border-[var(--border-primary)] bg-[var(--bg-card)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]"
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Schedule List */}
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[var(--border-primary)] bg-[var(--bg-card)] shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                      {item.batchLabel}
                    </span>
                    <span className="text-[11px] text-[var(--text-faint)] font-mono font-medium">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-display text-[var(--text-primary)]">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                      <span className="font-medium text-[var(--text-secondary)]">{item.dateRange}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                      <span className="font-medium text-[var(--text-secondary)]">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-subtle)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
