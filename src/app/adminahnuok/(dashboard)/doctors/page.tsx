import Link from "next/link";
import { Plus, Users, Stethoscope, Building2, MapPin, Clock } from "lucide-react";
import { AdminHeader, AdminCard, EmptyRow } from "@/components/admin/admin-ui";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminDoctorsPage() {
  await requireAdmin();

  const [doctors, departments] = await Promise.all([
    db.doctor.findMany({
      include: { department: true },
      orderBy: [{ isHOD: "desc" }, { order: "asc" }],
    }),
    db.department.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <AdminHeader
        title="Doctors & Faculty Directory"
        description="Manage hospital consultants, professors, OP consultation days and clinic rooms."
        action={{
          label: "Departments",
          href: "/adminahnuok/departments",
        }}
      />

      <div className="space-y-6">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">
              Consultants & HODs ({doctors.length})
            </h2>
          </div>

          {doctors.length === 0 ? (
            <div className="py-12 text-center text-sm text-ink-500">
              <p>No doctors added to the directory yet.</p>
              <p className="mt-1 text-xs text-ink-400">
                Default clinical faculty are currently displayed from the institutional catalogue.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-ink-100">
              {doctors.map((doc) => (
                <div key={doc.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink-900">{doc.name}</span>
                      {doc.isHOD && (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700">
                          HOD
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-500">
                      {doc.designation} — {doc.department?.name} ({doc.qualifications})
                    </p>
                    <p className="mt-1 text-xs text-ink-400">
                      OP: {doc.opSchedule || "As scheduled"} | Room: {doc.roomNo || "Main Block"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </>
  );
}
