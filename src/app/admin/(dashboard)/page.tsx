import Link from "next/link";
import { Trophy, CalendarDays, Bell, MessageSquareWarning, ArrowUpRight, Siren, FileText } from "lucide-react";
import { AdminHeader, StatCard, AdminCard, EmptyRow, StatusPill } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDate, timeAgo } from "@/lib/utils";

export default async function DashboardPage() {
  const admin = await requireAdmin();

  const [
    achievements,
    events,
    notifications,
    complaints,
    newComplaints,
    recentComplaints,
    recentEvents,
    interventions,
    emergencyContacts,
  ] = await Promise.all([
    db.achievement.count(),
    db.event.count(),
    db.notification.count(),
    db.complaint.count(),
    db.complaint.count({ where: { status: "new" } }),
    db.complaint.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.event.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.intervention.count(),
    db.emergencyContact.count(),
  ]);

  return (
    <>
      <AdminHeader
        title={`Welcome back, ${admin.name.split(" ")[0]}`}
        description="Here is what is happening across the YUGA Union Portal."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Events"
          value={events}
          href="/admin/events"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          label="Achievements"
          value={achievements}
          href="/admin/achievements"
          icon={<Trophy className="h-5 w-5" />}
        />
        <StatCard
          label="Notifications"
          value={notifications}
          href="/admin/notifications"
          icon={<Bell className="h-5 w-5" />}
        />
        <StatCard
          label={newComplaints > 0 ? `Grievances (${newComplaints} new)` : "Grievances"}
          value={complaints}
          href="/admin/complaints"
          icon={<MessageSquareWarning className="h-5 w-5" />}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          label="Union Interventions"
          value={interventions}
          href="/admin/interventions"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Emergency Directory"
          value={emergencyContacts}
          href="/admin/emergency"
          icon={<Siren className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[var(--text-primary)]">Recent Grievances</h2>
            <Link
              href="/admin/complaints"
              className="text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          {recentComplaints.length === 0 ? (
            <EmptyRow>No grievances submitted yet.</EmptyRow>
          ) : (
            <ul className="divide-y divide-[var(--border-primary)]">
              {recentComplaints.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/complaints/${c.id}`}
                    className="group flex items-start gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {c.anonymous ? "Anonymous Student" : c.name || "Student"}
                        </span>
                        <StatusPill status={c.status} />
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-muted)]">
                        {c.message}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-[var(--text-muted)]">
                      {timeAgo(c.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[var(--text-primary)]">Upcoming & Recent Events</h2>
            <Link
              href="/admin/events"
              className="text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          {recentEvents.length === 0 ? (
            <EmptyRow>No events created yet.</EmptyRow>
          ) : (
            <ul className="divide-y divide-[var(--border-primary)]">
              {recentEvents.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/admin/events/${e.id}`}
                    className="group flex items-center gap-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-[var(--text-primary)]">
                          {e.title}
                        </span>
                        <StatusPill status={e.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{formatDate(e.date)}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </>
  );
}
