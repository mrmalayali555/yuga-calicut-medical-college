import Link from "next/link";
import { Pencil, Pin, Eye, EyeOff, FileText, Calendar } from "lucide-react";
import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { DeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import {
  deleteIntervention,
  togglePublishIntervention,
  togglePinIntervention,
} from "@/lib/actions/interventions";
import { ensureInitialInterventions } from "@/lib/initial-sync";
import { getGridLayoutSettings } from "@/lib/queries";
import { GridLayoutControl } from "@/components/admin/grid-layout-control";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInterventionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await ensureInitialInterventions();
  const { status = "all", q = "" } = await searchParams;

  const [items, gridLayout] = await Promise.all([
    db.intervention.findMany({
      where: {
        ...(status === "published" ? { published: true } : {}),
        ...(status === "draft" ? { published: false } : {}),
        ...(status === "pinned" ? { pinned: true } : {}),
        ...(q ? { OR: [{ title: { contains: q } }, { description: { contains: q } }] } : {}),
      },
      orderBy: [{ pinned: "desc" }, { date: "desc" }],
    }).catch(() => []),
    getGridLayoutSettings(),
  ]);

  const tabs = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Drafts" },
    { key: "pinned", label: "Pinned" },
  ];

  return (
    <>
      <AdminHeader
        title="Union Interventions"
        description="Official representations, charter submissions, and institutional memoranda submitted to university and college administrations."
        action={{ label: "Add intervention", href: "/admin/interventions/new" }}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <GridLayoutControl
          compact
          type="interventions"
          initialColumns={gridLayout.interventionsColumns}
          initialMobileColumns={gridLayout.interventionsMobileColumns}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key === "all" ? "/admin/interventions" : `/admin/interventions?status=${t.key}`}
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

      {/* List */}
      {items.length === 0 ? (
        <EmptyRow>No interventions found{status !== "all" ? ` for "${status}"` : ""}.</EmptyRow>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const formattedDate = formatDate(item.date);
            return (
              <AdminCard key={item.id} className="transition-all hover:border-[var(--border-accent)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[var(--text-primary)] truncate">{item.title}</h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            item.published
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {item.published ? "Published" : "Draft"}
                        </span>
                        {item.pinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-muted)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--accent-light)]">
                            <Pin className="h-3 w-3 fill-current" /> Pinned
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[var(--accent)]" /> {formattedDate}
                        </span>
                        {item.pdfUrl && <span className="text-[var(--accent)] font-medium">PDF Attached</span>}
                        {item.image && <span>• Document Scan</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border-primary)] pt-3 sm:border-t-0 sm:pt-0">
                    <form action={togglePinIntervention.bind(null, item.id, item.pinned)}>
                      <button
                        type="submit"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                          item.pinned
                            ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                            : "border-[var(--border-primary)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)]"
                        }`}
                        title={item.pinned ? "Unpin" : "Pin to top"}
                      >
                        <Pin className="h-4 w-4" />
                      </button>
                    </form>

                    <form action={togglePublishIntervention.bind(null, item.id, item.published)}>
                      <button
                        type="submit"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                          item.published
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-[var(--border-primary)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-emerald-400"
                        }`}
                        title={item.published ? "Unpublish (Save as draft)" : "Publish"}
                      >
                        {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </form>

                    <Link
                      href={`/admin/interventions/${item.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-primary)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)]"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <form action={deleteIntervention.bind(null, item.id)}>
                      <DeleteBtn label="" />
                    </form>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}
    </>
  );
}
