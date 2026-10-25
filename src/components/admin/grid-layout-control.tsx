"use client";

import React, { useState, useTransition } from "react";
import { LayoutGrid, Rows, Columns2, Columns3, Check, Loader2, Sparkles } from "lucide-react";
import { updateGridLayoutAction } from "@/lib/actions/content";

interface GridLayoutControlProps {
  type: "events" | "interventions" | "notifications";
  initialColumns: 1 | 2 | 3;
  label?: string;
  compact?: boolean;
}

export function GridLayoutControl({
  type,
  initialColumns = 2,
  label,
  compact = false,
}: GridLayoutControlProps) {
  const [columns, setColumns] = useState<1 | 2 | 3>(initialColumns);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSelect = (col: 1 | 2 | 3) => {
    if (col === columns) return;
    setColumns(col);
    setSaved(false);

    startTransition(async () => {
      const res = await updateGridLayoutAction(type, col);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  const title = label || (type === "events" ? "Public Events Grid" : type === "interventions" ? "Public Interventions Grid" : "Notifications List");

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-3 py-1.5 shadow-2xs">
        <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1.5">
          <LayoutGrid className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span>Public Layout:</span>
        </span>

        <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded-xl border border-[var(--border-primary)]">
          <button
            type="button"
            onClick={() => handleSelect(1)}
            disabled={isPending}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              columns === 1
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            title="1 Item Per Row (Single Column List)"
          >
            <Rows className="h-3 w-3" />
            <span>1 / row</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect(2)}
            disabled={isPending}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              columns === 2
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            title="2 Items Per Row (Split Dual Grid)"
          >
            <Columns2 className="h-3 w-3" />
            <span>2 / row</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect(3)}
            disabled={isPending}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              columns === 3
                ? "bg-[var(--accent)] text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            title="3 Items Per Row (Classic Bento Grid)"
          >
            <Columns3 className="h-3 w-3" />
            <span>3 / row</span>
          </button>
        </div>

        {isPending && <Loader2 className="h-3 w-3 animate-spin text-[var(--accent)]" />}
        {saved && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <Check className="h-3 w-3" /> Saved!
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-[var(--accent)]" />
            <span>{title}</span>
          </h4>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Choose how many cards appear per row on the public website for this section.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            <span>Live Layout Updated</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1 per row */}
        <button
          type="button"
          onClick={() => handleSelect(1)}
          disabled={isPending}
          className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
            columns === 1
              ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
              : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <Rows className={`h-4 w-4 ${columns === 1 ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-faint)]">
              1 per row
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--text-primary)]">
            Full-Width Hero List
          </span>
          <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
            1 large comprehensive card per row
          </span>
        </button>

        {/* 2 per row */}
        <button
          type="button"
          onClick={() => handleSelect(2)}
          disabled={isPending}
          className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
            columns === 2
              ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
              : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <Columns2 className={`h-4 w-4 ${columns === 2 ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-faint)]">
              2 per row
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--text-primary)]">
            Split Dual Grid
          </span>
          <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
            2 spacious cards per row
          </span>
        </button>

        {/* 3 per row */}
        <button
          type="button"
          onClick={() => handleSelect(3)}
          disabled={isPending}
          className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
            columns === 3
              ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
              : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
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
  );
}
