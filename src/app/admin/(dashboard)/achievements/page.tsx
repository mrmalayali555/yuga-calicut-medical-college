import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ensureInitialAchievements } from "@/lib/initial-sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAchievementsPage() {
  await ensureInitialAchievements();
  const items = await db.achievement.findMany({ orderBy: { date: "desc" } }).catch(() => []);

  return (
    <>
      <AdminHeader
        title="Achievements"
        description="Celebrate wins and records across sports tournaments, arts fests, and medical academic conferences."
        action={{ label: "New achievement", href: "/admin/achievements/new" }}
      />
      {items.length === 0 ? (
        <EmptyRow>No achievements recorded yet. Click &apos;New achievement&apos; to add one.</EmptyRow>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)]">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border-primary)] bg-[var(--bg-elevated)] text-left text-xs uppercase tracking-wider text-[var(--text-muted)]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Title</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">Date</th>
                <th className="px-5 py-3.5 font-semibold">Published</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {items.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-[var(--bg-elevated)]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {a.coverImage ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)]">
                          <img
                            src={a.coverImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-dashed border-[var(--border-primary)] text-[var(--text-muted)] text-[10px] font-bold">
                          NO IMG
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/admin/achievements/${a.id}`}
                          className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)]"
                        >
                          {a.title}
                        </Link>
                        {a.awardWinner && (
                          <p className="text-xs text-[var(--text-muted)]">{a.awardWinner}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={a.category} />
                  </td>
                  <td className="hidden px-5 py-4 text-[var(--text-muted)] sm:table-cell">
                    {formatDate(a.date)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={a.published ? "published" : "draft"} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/achievements/${a.id}`}
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
