import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Mail, ShieldCheck } from "lucide-react";
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
    await db.complaint.update({ where: { id }, data: { status: "read" } });
  }

  return (
    <>
      <Link
        href="/admin/complaints"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to grievances
      </Link>
      <AdminHeader title="Grievance Details" description={formatDate(c.createdAt)} />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <AdminCard>
          <div className="mb-4 flex items-center gap-2">
            <StatusPill status={c.status === "new" ? "read" : c.status} />
            {c.anonymous && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                <ShieldCheck className="h-3.5 w-3.5" /> Anonymous Submission
              </span>
            )}
          </div>
          <p className="whitespace-pre-line leading-relaxed text-[var(--text-primary)] text-sm">{c.message}</p>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard>
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Submitted by</h3>
            {c.anonymous ? (
              <p className="text-xs text-[var(--text-muted)]">Submitted with anonymous identity protection enabled.</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <User className="h-4 w-4 text-[var(--accent)]" /> {c.name || "—"}
                </div>
                {c.email && (
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Mail className="h-4 w-4 text-[var(--accent)]" />
                    <a href={`mailto:${c.email}`} className="hover:text-[var(--accent)]">
                      {c.email}
                    </a>
                  </div>
                )}
              </div>
            )}
          </AdminCard>

          <AdminCard>
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Update status</h3>
            <form action={setComplaintStatus.bind(null, id)} className="space-y-3">
              <select
                name="status"
                defaultValue={c.status === "new" ? "read" : c.status}
                className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              >
                <option value="new">New</option>
                <option value="read">Read / Under Review</option>
                <option value="resolved">Resolved</option>
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
