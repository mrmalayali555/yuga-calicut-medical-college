"use client";

import React, { useState, useTransition } from "react";
import {
  LayoutGrid,
  Rows,
  Columns2,
  Columns3,
  Check,
  Loader2,
  Monitor,
  Smartphone,
} from "lucide-react";
import { updateGridLayoutAction } from "@/lib/actions/content";

interface GridLayoutControlProps {
  type: "events" | "interventions" | "achievements" | "notifications";
  initialColumns: 1 | 2 | 3;
  initialMobileColumns?: 1 | 2;
  label?: string;
  compact?: boolean;
}

export function GridLayoutControl({
  type,
  initialColumns = 2,
  initialMobileColumns = 1,
  label,
  compact = false,
}: GridLayoutControlProps) {
  const [columns, setColumns] = useState<1 | 2 | 3>(initialColumns);
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(initialMobileColumns);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleDesktopSelect = (col: 1 | 2 | 3) => {
    if (col === columns) return;
    setColumns(col);
    setSaved(false);

    startTransition(async () => {
      const res = await updateGridLayoutAction(type, col, mobileColumns);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  const handleMobileSelect = (mobCol: 1 | 2) => {
    if (mobCol === mobileColumns) return;
    setMobileColumns(mobCol);
    setSaved(false);

    startTransition(async () => {
      const res = await updateGridLayoutAction(type, columns, mobCol);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  const title =
    label ||
    (type === "events"
      ? "Public Events Grid"
      : type === "interventions"
      ? "Public Union Interventions Grid"
      : type === "achievements"
      ? "Public Honors & Achievements Grid"
      : "Notifications List");

  if (compact) {
    return (
      <div className="inline-flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-3.5 py-2 shadow-2xs">
        {/* Desktop control */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
            <Monitor className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="hidden sm:inline">Desktop:</span>
          </span>
          <div className="flex items-center gap-0.5 bg-[var(--bg-surface)] p-0.5 rounded-xl border border-[var(--border-primary)]">
            <button
              type="button"
              onClick={() => handleDesktopSelect(1)}
              disabled={isPending}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                columns === 1
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              1
            </button>
            <button
              type="button"
              onClick={() => handleDesktopSelect(2)}
              disabled={isPending}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                columns === 2
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              2
            </button>
            <button
              type="button"
              onClick={() => handleDesktopSelect(3)}
              disabled={isPending}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                columns === 3
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              3
            </button>
          </div>
        </div>

        {/* Mobile control */}
        {type !== "notifications" && (
          <div className="flex items-center gap-1.5 border-l border-[var(--border-primary)] pl-3">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1">
              <Smartphone className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              <span className="hidden sm:inline">Mobile:</span>
            </span>
            <div className="flex items-center gap-0.5 bg-[var(--bg-surface)] p-0.5 rounded-xl border border-[var(--border-primary)]">
              <button
                type="button"
                onClick={() => handleMobileSelect(1)}
                disabled={isPending}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  mobileColumns === 1
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                title="1 card per row on mobile"
              >
                1 / row
              </button>
              <button
                type="button"
                onClick={() => handleMobileSelect(2)}
                disabled={isPending}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  mobileColumns === 2
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                title="2 cards per row on mobile"
              >
                2 / row
              </button>
            </div>
          </div>
        )}

        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent)]" />}
        {saved && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <Check className="h-3 w-3" /> Saved!
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-primary)] pb-3">
        <div>
          <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-[var(--accent)]" />
            <span>{title}</span>
          </h4>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Configure how many cards appear per row across desktop and mobile screens.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            <span>Layout Updated Live</span>
          </span>
        )}
      </div>

      {/* Desktop Configuration */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <Monitor className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
            Desktop &amp; Tablet Display (≥ 768px)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1 per row */}
          <button
            type="button"
            onClick={() => handleDesktopSelect(1)}
            disabled={isPending}
            className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              columns === 1
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
                : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <Rows className={`h-4 w-4 ${columns === 1 ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
              <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-faint)]">
                1 per row
              </span>
            </div>
            <span className="text-xs font-bold text-[var(--text-primary)]">
              Single Hero Column
            </span>
            <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
              1 large card per row
            </span>
          </button>

          {/* 2 per row */}
          <button
            type="button"
            onClick={() => handleDesktopSelect(2)}
            disabled={isPending}
            className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              columns === 2
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
                : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <Columns2 className={`h-4 w-4 ${columns === 2 ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
              <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-faint)]">
                2 per row
              </span>
            </div>
            <span className="text-xs font-bold text-[var(--text-primary)]">
              Split Dual Grid
            </span>
            <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
              2 balanced cards per row
            </span>
          </button>

          {/* 3 per row */}
          <button
            type="button"
            onClick={() => handleDesktopSelect(3)}
            disabled={isPending}
            className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              columns === 3
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
                : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <Columns3 className={`h-4 w-4 ${columns === 3 ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
              <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-faint)]">
                3 per row
              </span>
            </div>
            <span className="text-xs font-bold text-[var(--text-primary)]">
              Classic Bento Grid
            </span>
            <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
              3 compact cards per row
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Configuration (for events, interventions, achievements) */}
      {type !== "notifications" && (
        <div className="pt-2 border-t border-[var(--border-primary)]/60">
          <div className="flex items-center gap-2 mb-2.5">
            <Smartphone className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Mobile Phone View (&lt; 768px)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mobile 1 per row */}
            <button
              type="button"
              onClick={() => handleMobileSelect(1)}
              disabled={isPending}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mobileColumns === 1
                  ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
                  : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <Rows className={`h-4 w-4 ${mobileColumns === 1 ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-faint)]">
                  1 card / row
                </span>
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                Full-Width Vertical Scroll (Recommended)
              </span>
              <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
                1 spacious card per row with clear readability on mobile
              </span>
            </button>

            {/* Mobile 2 per row */}
            <button
              type="button"
              onClick={() => handleMobileSelect(2)}
              disabled={isPending}
              className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mobileColumns === 2
                  ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
                  : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <Columns2 className={`h-4 w-4 ${mobileColumns === 2 ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-faint)]">
                  2 cards / row
                </span>
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)]">
                Compact Dual-Column Grid
              </span>
              <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
                2 cards side-by-side per row for fast mobile browsing
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
