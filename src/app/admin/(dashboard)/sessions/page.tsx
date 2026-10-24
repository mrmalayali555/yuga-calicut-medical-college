import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Smartphone, Monitor, Globe, Clock, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function revokeSession(formData: FormData) {
  "use server";
  const sessionId = formData.get("id") as string;
  await db.adminSession.delete({ where: { id: sessionId } });
  revalidatePath("/admin/sessions");
}

export default async function AdminSessionsPage() {
  const currentSession = await getSession();
  if (!currentSession) redirect("/admin/login");

  const sessions = await db.adminSession.findMany({
    orderBy: { lastActiveAt: "desc" },
    include: { admin: { select: { email: true, name: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Active Admin Sessions"
        description="Monitor logged-in sessions across devices and revoke any unauthorized access."
      />

      {sessions.length === 0 ? (
        <EmptyRow>No active sessions found.</EmptyRow>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => {
            const isMobile = s.userAgent?.toLowerCase().includes("mobile");
            const isCurrent = s.adminId === currentSession.sub;

            return (
              <AdminCard key={s.id} className="transition-all hover:border-[var(--border-accent)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                      {isMobile ? <Smartphone className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[var(--text-primary)] truncate">
                          {s.admin.name} ({s.admin.email})
                        </h3>
                        {isCurrent && (
                          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                            Current Session
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1.5 break-all">
                          <Globe className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
                          {s.location || "Local host"} (IP: {s.ipAddress || "127.0.0.1"})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[var(--accent)]" />
                          Last active: {new Date(s.lastActiveAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-1.5 text-[10px] text-[var(--text-muted)] font-mono truncate max-w-lg">
                        {s.userAgent}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-[var(--border-primary)] pt-3 sm:border-t-0 sm:pt-0">
                    <form action={revokeSession}>
                      <input type="hidden" name="id" value={s.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-[36px] items-center justify-center gap-2 rounded-xl border border-red-500/30 px-3.5 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" /> Revoke
                      </button>
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
