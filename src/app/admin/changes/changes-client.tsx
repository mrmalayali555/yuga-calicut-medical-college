"use client";

import { useState, useEffect, useCallback } from "react";
import {
  History,
  Undo2,
  CheckCircle2,
  Clock,
  User,
  FileText,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface ContentEditRecord {
  id: string;
  adminId: string;
  adminName: string;
  previousValue: string;
  newValue: string;
  fieldLabel: string | null;
  pageName: string | null;
  reverted: boolean;
  createdAt: string;
  contentBlock: {
    pageId: string;
    blockId: string;
    content: string;
  };
}

export function ChangesHistoryClient() {
  const [edits, setEdits] = useState<ContentEditRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [undoing, setUndoing] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const limit = 25;

  const fetchEdits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/content/edits?limit=${limit}&offset=${page * limit}`
      );
      const data = await res.json();
      setEdits(data.edits || []);
      setTotal(data.total || 0);
    } catch {
      setEdits([]);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchEdits();
  }, [fetchEdits]);

  const handleUndo = async (editId: string) => {
    setUndoing(editId);
    try {
      const res = await fetch("/api/content/edits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editId }),
      });
      if (res.ok) {
        fetchEdits();
      }
    } catch {
      // Silently fail
    }
    setUndoing(null);
  };

  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncate = (str: string, maxLen: number) =>
    str.length > maxLen ? str.slice(0, maxLen) + "…" : str;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <History className="h-6 w-6 text-[var(--accent)]" />
            Changes History
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Every inline edit made on the public site is recorded here. You can
            review and undo any change.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchEdits}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
            Total Edits
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            {total}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
            Active Changes
          </div>
          <div className="text-2xl font-bold text-[var(--accent)] mt-1">
            {edits.filter((e) => !e.reverted && !e.fieldLabel?.startsWith("Undo:")).length}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
            Reverted
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {edits.filter((e) => e.reverted).length}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-xs font-semibold text-[var(--text-faint)] uppercase tracking-wider">
            Pages Modified
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            {new Set(edits.map((e) => e.contentBlock.pageId)).size}
          </div>
        </div>
      </div>

      {/* Edits Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
            <span className="ml-2 text-sm text-[var(--text-muted)]">
              Loading changes…
            </span>
          </div>
        ) : edits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <History className="h-12 w-12 text-[var(--text-faint)] mb-3 opacity-30" />
            <h3 className="text-base font-semibold text-[var(--text-secondary)]">
              No changes yet
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">
              When admins edit content on the public site using the inline
              editor, all changes will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-primary)]">
            {edits.map((edit) => (
              <div
                key={edit.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                  edit.reverted
                    ? "bg-amber-50/30 dark:bg-amber-900/10 opacity-60"
                    : "hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                {/* Icon */}
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    edit.reverted
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      : edit.fieldLabel?.startsWith("Undo:")
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-[var(--accent-subtle)] text-[var(--accent)]"
                  }`}
                >
                  {edit.reverted ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : edit.fieldLabel?.startsWith("Undo:") ? (
                    <Undo2 className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {edit.fieldLabel || edit.contentBlock.blockId}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-faint)] uppercase tracking-wider border border-[var(--border-primary)]">
                      {edit.pageName || edit.contentBlock.pageId}
                    </span>
                    {edit.reverted && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-wider">
                        Reverted
                      </span>
                    )}
                  </div>

                  {/* Before → After */}
                  <div className="mt-2 flex flex-col sm:flex-row gap-2 text-xs">
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-red-600 dark:text-red-400 text-[10px] uppercase tracking-wider">
                        Before
                      </span>
                      <div className="mt-0.5 rounded bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30 px-2.5 py-1.5 text-[var(--text-secondary)] line-clamp-2 break-all">
                        {truncate(edit.previousValue || "(empty)", 120)}
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-[var(--text-faint)] shrink-0">
                      →
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-green-600 dark:text-green-400 text-[10px] uppercase tracking-wider">
                        After
                      </span>
                      <div className="mt-0.5 rounded bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30 px-2.5 py-1.5 text-[var(--text-secondary)] line-clamp-2 break-all">
                        {truncate(edit.newValue || "(empty)", 120)}
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--text-faint)]">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {edit.adminName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(edit.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Undo Button */}
                <div className="shrink-0 pt-1">
                  {!edit.reverted && !edit.fieldLabel?.startsWith("Undo:") && (
                    <button
                      type="button"
                      onClick={() => handleUndo(edit.id)}
                      disabled={undoing === edit.id}
                      className="flex items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:border-amber-400 hover:text-amber-600 transition-colors disabled:opacity-50"
                    >
                      {undoing === edit.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Undo2 className="h-3.5 w-3.5" />
                      )}
                      Undo
                    </button>
                  )}
                  {edit.reverted && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Undone
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-primary)] bg-[var(--bg-surface)]">
            <span className="text-xs text-[var(--text-muted)]">
              Page {page + 1} of {totalPages} · {total} total edits
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
