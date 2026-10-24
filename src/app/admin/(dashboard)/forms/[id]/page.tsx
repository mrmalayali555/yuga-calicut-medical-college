import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { RegistrationFormBuilder } from "@/components/admin/registration-form-builder";
import { updateRegistrationForm, deleteRegistrationForm } from "@/lib/actions/forms";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function EditRegistrationFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const form = await db.registrationForm.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { order: "asc" } },
    },
  });

  if (!form) notFound();

  const events = await db.event.findMany({
    orderBy: { date: "asc" },
    select: { id: true, title: true, date: true },
  });

  const formattedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    date: formatDate(e.date),
  }));

  const updateWithId = updateRegistrationForm.bind(null, id);
  const deleteWithId = deleteRegistrationForm.bind(null, id);

  return (
    <>
      <AdminHeader
        title={`Edit Form: ${form.title}`}
        description="Update form configuration, fields, and options."
      />
      <RegistrationFormBuilder
        initialForm={{
          id: form.id,
          title: form.title,
          description: form.description,
          eventId: form.eventId,
          deadline: form.deadline,
          published: form.published,
          fields: form.fields.map((f) => ({
            id: f.id,
            label: f.label,
            type: f.type,
            required: f.required,
            placeholder: f.placeholder || undefined,
            options: f.options || undefined,
            order: f.order,
          })),
        }}
        events={formattedEvents}
        action={updateWithId}
        deleteAction={deleteWithId}
      />
    </>
  );
}
