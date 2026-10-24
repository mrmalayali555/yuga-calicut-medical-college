import Link from "next/link";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { timeAgo, truncate } from "@/lib/utils";

export default async function AdminComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;
  const items = await db.complaint.findMany({
    where: {
      ...(status !== "all" ? { status } : {}),
      ...(q ? { message: { contains: q } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const tabs = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "read", label: "Read" },
    { key: "resolved", label: "Resolved" },
  ];

  return (
    <>
      <AdminHeader
        title="Student Grievances & Suggestions"
        description="All confidential and named issues submitted through Campus Voice appear here."
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "all" ? "/admin/complaints" : `/admin/complaints?status=${t.key}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              status === t.key
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "border border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-accent)]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyRow>No suggestions or grievances{status !== "all" ? ` marked '${status}'` : ""} yet.</EmptyRow>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Link
              key={c.id}
              href={`/admin/complaints/${c.id}`}
              className="block rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 transition-all hover:border-[var(--border-accent)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)] break-words">
                    {c.anonymous ? "Anonymous Student" : c.name || "Student"}
                  </span>
                  <StatusPill status={c.status} />
                </div>
                <span className="text-xs text-[var(--text-muted)] shrink-0">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-secondary)] break-words">{truncate(c.message, 160)}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
