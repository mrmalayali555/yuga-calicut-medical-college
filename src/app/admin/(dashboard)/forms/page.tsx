import Link from "next/link";
import { Plus, Pencil, Users, Eye, FileText, Calendar, CheckCircle2, Clock } from "lucide-react";
import { AdminHeader, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminFormsPage() {
  const forms = await db.registrationForm.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      event: { select: { id: true, title: true, date: true } },
      fields: { select: { id: true } },
      _count: { select: { submissions: true } },
    },
  });

  return (
    <>
      <AdminHeader
        title="Registration Forms"
        description="Build custom mini Google Forms, link them to upcoming events, and manage participant registrations."
        action={{ label: "New Registration Form", href: "/admin/forms/new" }}
      />

      {forms.length === 0 ? (
        <EmptyRow>
          <div className="py-8 text-center space-y-3">
            <p className="text-slate-600 font-medium">
              No registration forms created yet.
            </p>
            <Link
              href="/admin/forms/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create First Form
            </Link>
          </div>
        </EmptyRow>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-left text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Form Title</th>
                <th className="px-6 py-4">Linked Event</th>
                <th className="px-6 py-4">Questions</th>
                <th className="px-6 py-4">Submissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {forms.map((f) => {
                const totalSubmissions = f._count.submissions;
                const fieldCount = f.fields.length;

                return (
                  <tr key={f.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <Link
                        href={`/admin/forms/${f.id}`}
                        className="hover:text-emerald-700 transition-colors"
                      >
                        {f.title}
                      </Link>
                      <p className="text-xs text-slate-400 font-mono font-normal">
                        slug: /{f.slug}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {f.event ? (
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[200px]">{f.event.title}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No event linked</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {fieldCount} {fieldCount === 1 ? "field" : "fields"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/forms/${f.id}/submissions`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      >
                        <Users className="h-3.5 w-3.5" />
                        {totalSubmissions} {totalSubmissions === 1 ? "Attendee" : "Attendees"}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <StatusPill status={f.published ? "published" : "draft"} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/forms/${f.id}/submissions`}
                          title="View attendee submissions"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/forms/${f.id}`}
                          title="Edit form questions"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
