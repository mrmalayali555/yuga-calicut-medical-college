import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Mail, ShieldCheck, Clock, Hash } from "lucide-react";
import { AdminHeader, AdminCard, StatusPill } from "@/components/admin/admin-ui";
import { DeleteBtn, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { setComplaintStatus, deleteComplaint } from "@/lib/actions/complaints";

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await db.complaint.findUnique({ where: { id } });
  if (!c) notFound();

  if (c.status === "new") {
    await db.complaint.update({ where: { id }, data: { status: "read" } }).catch(() => {});
  }

  const docketId = `YUGA-GRV-${c.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}`;

  return (
    <>
      <Link
        href="/admin/complaints"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to grievances
      </Link>
      <AdminHeader
        title={`Grievance · ${docketId}`}
        description={`Submitted on ${formatDate(c.createdAt)}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <AdminCard>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20">
              <Hash className="h-3 w-3" />
              {docketId}
            </span>
            <StatusPill status={c.status === "new" ? "read" : c.status} />
            {c.anonymous ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-500">
                <ShieldCheck className="h-3.5 w-3.5" /> Anonymous Submission
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                <User className="h-3.5 w-3.5" /> {c.name || "Identified Medico"}
              </span>
            )}
          </div>
          <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-5">
            <p className="whitespace-pre-line leading-relaxed text-[var(--text-primary)] text-sm font-sans">
              {c.message}
            </p>
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard>
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Student Details</h3>
            {c.anonymous ? (
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 text-xs text-[var(--text-secondary)] space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-500">
                  <ShieldCheck className="h-4 w-4" />
                  Protected Anonymous Mode
                </div>
                <p className="text-[var(--text-muted)]">
                  The student requested strict confidentiality. Their identity is omitted from all council databases.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <User className="h-4 w-4 text-[var(--accent)]" /> {c.name || "—"}
                </div>
                {c.email ? (
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Mail className="h-4 w-4 text-[var(--accent)]" />
                    <a href={`mailto:${c.email}`} className="text-[var(--accent)] hover:underline">
                      {c.email}
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-[var(--text-muted)] italic">
                    No email address provided for follow-up
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-primary)]">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(c.createdAt)}
                </div>
              </div>
            )}
          </AdminCard>

          <AdminCard>
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Update Redressal Status</h3>
            <form action={setComplaintStatus.bind(null, id)} className="space-y-3">
              <select
                name="status"
                defaultValue={c.status === "new" ? "read" : c.status}
                className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              >
                <option value="new">New (Unreviewed)</option>
                <option value="read">Read / Under Review by Committee</option>
                <option value="resolved">Resolved / Action Completed</option>
              </select>
              <SubmitBtn>Update status</SubmitBtn>
            </form>
          </AdminCard>

          <form action={deleteComplaint.bind(null, id)}>
            <DeleteBtn label="Delete grievance" />
          </form>
        </div>
      </div>
    </>
  );
}
