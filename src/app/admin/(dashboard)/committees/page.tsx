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

      <AdminCard className="mb-8">
        <h3 className="mb-4 font-semibold text-[var(--text-primary)]">Add Subcommittee / Club</h3>
        <form action={createCommittee} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" required placeholder="Sports Committee / Arts & Cultural Club" />
            <Field label="Category" name="category" placeholder="Sports · Arts · Literary · Medical Social" />
          </div>
          <TextArea label="Description" name="description" rows={2} placeholder="Brief role of the subcommittee..." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Logo URL" name="logo" placeholder="/clubs/godha.png or https://..." />
            <Field label="Dedicated Portal URL" name="portalUrl" placeholder="https://yugacollegeunion.co.in/clubs/..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Accent Colour (hex)" name="accent" placeholder="#e11d48" />
            <Field label="Order" name="order" type="number" defaultValue={0} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Instagram URL" name="social_instagram" placeholder="https://instagram.com/..." />
            <Field label="YouTube URL" name="social_youtube" placeholder="https://youtube.com/..." />
            <Field label="Website / Portal URL" name="social_website" placeholder="https://..." />
          </div>
          <SubmitBtn>Add Subcommittee / Club</SubmitBtn>
        </form>
      </AdminCard>

      {committees.length === 0 ? (
        <EmptyRow>No subcommittees created yet.</EmptyRow>
      ) : (
        <div className="space-y-6">
          {committees.map((committee) => (
            <AdminCard key={committee.id}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {committee.logo && (
                    <div className="h-10 w-10 rounded-xl border border-[var(--border-primary)] bg-white flex items-center justify-center overflow-hidden shrink-0">
                      <img src={committee.logo} alt={committee.name} className="h-8 w-8 object-contain" />
                    </div>
                  )}
                  {committee.accent && !committee.logo && (
                    <div className="h-10 w-10 rounded-xl shrink-0" style={{ backgroundColor: committee.accent }} />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] truncate">{committee.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {committee.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                          {committee.category}
                        </span>
                      )}
                      {committee.portalUrl && (
                        <a href={committee.portalUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors truncate">
                          Dedicated Portal ↗
                        </a>
                      )}
                    </div>
                    {committee.description && (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{committee.description}</p>
                    )}
                  </div>
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
