import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { Field, TextArea, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { createCommittee, deleteMember } from "@/lib/actions/committees";
import { AddMemberForm } from "@/components/admin/add-member-form";

export default async function AdminCommitteesPage() {
  const committees = await db.committee.findMany({
    orderBy: { order: "asc" },
    include: { members: { orderBy: { order: "asc" } } },
  }).catch(() => []);

  return (
    <>
      <AdminHeader
        title="Subcommittees & Clubs"
        description="Manage union subcommittees, wing convenors, club leadership and student volunteers."
      />

      <AdminCard className="mb-8 max-w-xl">
        <h3 className="mb-4 font-semibold text-[var(--text-primary)]">Add Subcommittee / Club</h3>
        <form action={createCommittee} className="grid gap-4">
          <Field label="Name" name="name" required placeholder="Sports Committee / Arts & Cultural Club" />
          <TextArea label="Description" name="description" rows={2} placeholder="Brief role of the subcommittee..." />
          <Field label="Order" name="order" type="number" defaultValue={0} />
          <SubmitBtn>Add committee</SubmitBtn>
        </form>
      </AdminCard>

      {committees.length === 0 ? (
        <EmptyRow>No subcommittees created yet.</EmptyRow>
      ) : (
        <div className="space-y-6">
          {committees.map((committee) => (
            <AdminCard key={committee.id}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{committee.name}</h3>
                  {committee.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{committee.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/committees/${committee.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {committee.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[var(--text-primary)]">{m.name}</div>
                      {m.position && (
                        <div className="truncate text-xs text-[var(--text-muted)]">{m.position}</div>
                      )}
                    </div>
                    <form action={deleteMember.bind(null, m.id)}>
                      <button
                        type="submit"
                        className="text-[var(--text-muted)] hover:text-red-400 p-1"
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                ))}
              </div>

              <AddMemberForm committeeId={committee.id} />
            </AdminCard>
          ))}
        </div>
      )}
    </>
  );
}
