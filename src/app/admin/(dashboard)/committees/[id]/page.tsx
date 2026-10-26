import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, SubmitBtn, DeleteBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { updateCommittee, deleteCommittee } from "@/lib/actions/committees";

export default async function EditCommitteePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await db.committee.findUnique({ where: { id } });
  if (!c) notFound();

  return (
    <>
      <AdminHeader title="Edit Committee / Club" description={c.name} />
      <AdminCard className="max-w-2xl">
        <form action={updateCommittee.bind(null, id)} className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" defaultValue={c.name} required />
            <Field label="Category" name="category" defaultValue={c.category ?? ""} placeholder="Sports · Arts · Literary · Medical Social" />
          </div>
          <TextArea label="Description" name="description" defaultValue={c.description ?? ""} rows={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Logo URL (or /clubs/filename.png)" name="logo" defaultValue={c.logo ?? ""} />
            <Field label="Dedicated Portal URL" name="portalUrl" defaultValue={c.portalUrl ?? ""} placeholder="https://..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Accent Colour (hex)" name="accent" defaultValue={c.accent ?? ""} placeholder="#e11d48" />
            <Field label="Display Order" name="order" type="number" defaultValue={c.order} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Club Social Links</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {(() => {
                let links: { instagram?: string; youtube?: string; website?: string } = {};
                try { links = JSON.parse(c.socialLinks ?? "{}"); } catch {}
                return (
                  <>
                    <Field label="Instagram URL" name="social_instagram" defaultValue={links.instagram ?? ""} />
                    <Field label="YouTube URL" name="social_youtube" defaultValue={links.youtube ?? ""} />
                    <Field label="Website / Portal URL" name="social_website" defaultValue={links.website ?? ""} />
                  </>
                );
              })()}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <SubmitBtn>Save changes</SubmitBtn>
            <Link
              href="/admin/committees"
              className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </AdminCard>
      <form action={deleteCommittee.bind(null, id)} className="mt-6">
        <DeleteBtn label="Delete committee" />
      </form>
    </>
  );
}
