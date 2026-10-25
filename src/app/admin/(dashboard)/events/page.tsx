import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { formatDateRange } from "@/lib/utils";

export default async function AdminEventsPage() {
  const events = await db.event.findMany({ orderBy: { date: "desc" } }).catch(() => []);

  return (
    <>
      <AdminHeader
        title="Events"
        description="Create and manage union events, workshops, cultural fests, and sports meets."
        action={{ label: "New event", href: "/admin/events/new" }}
      />

      {events.length === 0 ? (
        <EmptyRow>No events created yet. Click &apos;New event&apos; to add one.</EmptyRow>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-primary)] bg-[var(--bg-elevated)] text-left text-xs uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Title</th>
                <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">Date</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="hidden px-5 py-3.5 font-semibold md:table-cell">Published</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {events.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-[var(--bg-elevated)]">
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/events/${e.id}`}
                      className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)]"
                    >
                      {e.title}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-4 text-[var(--text-muted)] sm:table-cell">
                    {formatDateRange(e.date, e.endDate)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={e.status} />
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    <StatusPill status={e.published ? "published" : "draft"} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/events/${e.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
