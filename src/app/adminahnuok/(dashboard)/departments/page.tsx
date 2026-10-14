import Link from "next/link";
import { Building2, Plus, Phone } from "lucide-react";
import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminDepartmentsPage() {
  await requireAdmin();

  const departments = await db.department.findMany({
    include: { _count: { select: { doctors: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <AdminHeader
        title="Hospital Clinical Departments"
        description="Clinical, pre-clinical, and super-specialty departments across Calicut Medical College & IMCH."
      />

      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-ink-900">
            All Departments ({departments.length})
          </h2>
        </div>

        {departments.length === 0 ? (
          <div className="py-12 text-center text-sm text-ink-500">
            <p>No departments configured in the database yet.</p>
            <p className="mt-1 text-xs text-ink-400">
              Clinical departments are active via the default system directory.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="rounded-xl border border-ink-100 bg-ink-50/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink-900">{dept.name}</span>
                  <span className="rounded bg-white px-2 py-0.5 text-xs font-medium text-ink-600 border border-ink-200">
                    {dept.code}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-500 capitalize">{dept.type} Department</p>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-400 border-t border-ink-200/60 pt-2">
                  <span>OP: {dept.opDays || "Monday – Saturday"}</span>
                  <span>{dept._count.doctors} Doctors listed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </>
  );
}
