import Link from "next/link";
import { CalendarDays, Plus, Clock, FileText } from "lucide-react";
import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDate } from "@/lib/utils";

export default async function AdminAcademicCalendarPage() {
  await requireAdmin();

  const events = await db.academicCalendarEvent.findMany({
    orderBy: { startDate: "asc" },
  });

  return (
    <>
      <AdminHeader
        title="Academic Calendar Manager"
        description="Schedule examination timetables, clinical rotations, and internal assessments across MBBS & PG batches."
      />

      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink-900">
            Scheduled Academic Events ({events.length})
          </h2>
        </div>

        {events.length === 0 ? (
          <div className="py-12 text-center text-sm text-ink-500">
            <p>No custom calendar dates created in database yet.</p>
            <p className="mt-1 text-xs text-ink-400">
              The public portal is displaying the live official KUHS schedule.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {events.map((ev) => (
              <div key={ev.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink-900">{ev.title}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {ev.batch}
                    </span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                      {ev.eventType}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">{ev.description}</p>
                </div>
                <div className="text-right text-xs text-ink-500 shrink-0">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-ink-400" />
                    <span>{formatDate(ev.startDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </>
  );
}
