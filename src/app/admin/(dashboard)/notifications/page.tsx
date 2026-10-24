import Link from "next/link";
import { Pencil, FileText } from "lucide-react";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminNotificationsPage() {
  const items = await db.notification.findMany({ orderBy: { date: "desc" } });

  return (
    <>
      <AdminHeader
        title="Notifications & Circulars"
        description="Publish official university orders, union circulars, and academic notifications."
        action={{ label: "New notification", href: "/admin/notifications/new" }}
      />
      {items.length === 0 ? (
        <EmptyRow>No notifications posted yet. Click &apos;New notification&apos; to publish one.</EmptyRow>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-primary)] bg-[var(--bg-elevated)] text-left text-xs uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Title</th>
                <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">Date</th>
                <th className="px-5 py-3.5 font-semibold">PDF Attached</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {items.map((n) => (
                <tr key={n.id} className="transition-colors hover:bg-[var(--bg-elevated)]">
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/notifications/${n.id}`}
                      className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)]"
                    >
                      {n.title}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-4 text-[var(--text-muted)] sm:table-cell">
                    {formatDate(n.date)}
                  </td>
                  <td className="px-5 py-4">
                    {n.pdfUrl ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[var(--accent)]">
                        <FileText className="h-3.5 w-3.5" /> PDF
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={n.published ? "published" : "draft"} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/notifications/${n.id}`}
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
