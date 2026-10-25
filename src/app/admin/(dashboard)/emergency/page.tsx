import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, Toggle, SubmitBtn } from "@/components/admin/form-fields";
import { AdminEmergencyManager } from "@/components/admin/admin-emergency-manager";
import { db } from "@/lib/db";
import { createEmergency } from "@/lib/actions/emergency";

export default async function AdminEmergencyPage() {
  const items = await db.emergencyContact.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  }).catch(() => []);

  const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 0;

  return (
    <>
      <AdminHeader
        title="Emergency Registry"
        description="Manage critical emergency contacts, hospital helplines, hostel wardens, security and union aid lines."
      />

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <AdminCard>
            <h3 className="mb-4 font-semibold text-[var(--text-primary)]">Add Emergency Contact</h3>
            <form action={createEmergency} className="grid gap-4">
              <Field
                label="Category"
                name="category"
                type="text"
                required
                placeholder="e.g. Casualty, Security, Ambulance, Hostel, Blood Bank"
                hint="Type any custom category name freely"
              />
              <Field
                label="Name / Role"
                name="name"
                type="text"
                required
                placeholder="e.g. Casualty CMO / Main Gate Security"
              />
              <Field
                label="Phone Number"
                name="phone"
                type="text"
                required
                placeholder="e.g. 0495 2350212 or 98470 12345"
              />
              <Field
                label="Description (optional)"
                name="description"
                type="text"
                placeholder="e.g. 24x7 Emergency Line"
              />
              <Field
                label="Display Order (priority)"
                name="order"
                type="number"
                defaultValue={nextOrder}
                hint="Lower numbers appear first on the directory"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Toggle
                  label="Active"
                  name="active"
                  defaultChecked
                  hint="Show on live directory"
                />
                <Toggle
                  label="Show on Homepage"
                  name="showOnHomepage"
                  defaultChecked={false}
                  hint="Highlight on homepage strip"
                />
              </div>
              <SubmitBtn>Add contact</SubmitBtn>
            </form>
          </AdminCard>

          <div>
            <AdminEmergencyManager items={items} />
          </div>
        </div>
      </div>
    </>
  );
}
