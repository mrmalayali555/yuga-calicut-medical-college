import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, Calendar, ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function FormSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const form = await db.registrationForm.findUnique({
    where: { id },
    include: {
      event: { select: { title: true, date: true, slug: true } },
      fields: { orderBy: { order: "asc" } },
      submissions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!form) notFound();

  const formattedSubmissions = form.submissions.map((sub) => {
    let parsedData: Record<string, any> = {};
    try {
      parsedData = JSON.parse(sub.data);
    } catch (e) {
      parsedData = { raw: sub.data };
    }
    return {
      id: sub.id,
      createdAt: formatDate(sub.createdAt),
      data: parsedData,
    };
  });

  return (
    <>
      <div className="mb-4">
        <Link
          href="/admin/forms"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Forms
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Attendee Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-1">
            {form.title}
          </h1>
          {form.event && (
            <p className="mt-1 text-sm text-slate-600 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              Event: {form.event.title} ({formatDate(form.event.date)})
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/forms/${form.id}`}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Edit Questions
          </Link>
          {form.event?.slug && (
            <Link
              href={`/events/${form.event.slug}/register`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
            >
              Public Form
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      <SubmissionsTable
        formTitle={form.title}
        fields={form.fields.map((f) => ({
          id: f.id,
          label: f.label,
          order: f.order,
        }))}
        submissions={formattedSubmissions}
      />
    </>
  );
}
