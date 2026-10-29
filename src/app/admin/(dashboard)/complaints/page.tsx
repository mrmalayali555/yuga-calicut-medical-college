import Link from "next/link";
import { ShieldCheck, Mail, Search, MessageSquareWarning } from "lucide-react";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { timeAgo, truncate } from "@/lib/utils";

export default async function AdminComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;

  const [totalCount, newCount, readCount, resolvedCount, allItems] = await Promise.all([
    db.complaint.count().catch(() => 0),
    db.complaint.count({ where: { status: "new" } }).catch(() => 0),
    db.complaint.count({ where: { status: "read" } }).catch(() => 0),
    db.complaint.count({ where: { status: "resolved" } }).catch(() => 0),
    db.complaint.findMany({
      where: status !== "all" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    }).catch(() => []),
  ]);

  let items = allItems;
  if (q.trim()) {
    const qLower = q.trim().toLowerCase();
    items = items.filter(
      (c) =>
        c.message.toLowerCase().includes(qLower) ||
        (c.name && c.name.toLowerCase().includes(qLower)) ||
        (c.email && c.email.toLowerCase().includes(qLower)) ||
        c.id.toLowerCase().includes(qLower)
    );
  }

  const tabs = [
    { key: "all", label: "All", count: totalCount },
    { key: "new", label: "New", count: newCount },
    { key: "read", label: "Read", count: readCount },
    { key: "resolved", label: "Resolved", count: resolvedCount },
  ];

  return (
    <>
      <AdminHeader
        title="Student Grievances & Suggestions"
        description="All confidential and named issues submitted through Campus Voice appear here in real time."
      />

      {/* Tabs & Search */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.key === "all" ? "/admin/complaints" : `/admin/complaints?status=${t.key}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                status === t.key
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  status === t.key
                    ? "bg-white/20 text-white"
                    : "bg-[var(--accent-subtle)] text-[var(--accent)]"
                }`}
              >
                {t.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Quick keyword filter */}
        <form method="GET" action="/admin/complaints" className="relative w-full sm:w-64">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search keywords..."
            className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] pl-9 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
          />
        </form>
      </div>

      {items.length === 0 ? (
        <EmptyRow>
          No suggestions or grievances{status !== "all" ? ` marked '${status}'` : ""}{q ? ` matching "${q}"` : ""} yet.
        </EmptyRow>
      ) : (
        <div className="space-y-3">
          {items.map((c) => {
            const docketId = `YUGA-GRV-${c.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}`;
            return (
              <Link
                key={c.id}
                href={`/admin/complaints/${c.id}`}
                className="group block rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 transition-all hover:border-[var(--border-accent)] hover:shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
                      {docketId}
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)] break-words">
                      {c.anonymous ? "Anonymous Student" : c.name || "Student"}
                    </span>
                    {c.anonymous ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        Confidential
                      </span>
                    ) : c.email ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                        <Mail className="h-3 w-3 text-[var(--accent)]" />
                        {c.email}
                      </span>
                    ) : null}
                    <StatusPill status={c.status} />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] shrink-0">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-2.5 text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {truncate(c.message, 220)}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
