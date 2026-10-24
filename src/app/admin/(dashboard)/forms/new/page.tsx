import { AdminHeader } from "@/components/admin/admin-ui";
import { RegistrationFormBuilder } from "@/components/admin/registration-form-builder";
import { createRegistrationForm } from "@/lib/actions/forms";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function NewRegistrationFormPage() {
  const events = await db.event.findMany({
    where: { status: "upcoming" },
    orderBy: { date: "asc" },
    select: { id: true, title: true, date: true },
  });

  const formattedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    date: formatDate(e.date),
  }));

  return (
    <>
      <AdminHeader
        title="New Registration Form"
        description="Design a custom registration form and link it to an upcoming union event."
      />
      <RegistrationFormBuilder
        events={formattedEvents}
        action={createRegistrationForm}
      />
    </>
  );
}
