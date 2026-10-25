import { AdminHeader } from "@/components/admin/admin-ui";
import { EventForm } from "@/components/admin/event-form";
import { createEvent } from "@/lib/actions/events";
import { db } from "@/lib/db";

export default async function NewEventPage() {
  const forms = await db.registrationForm.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminHeader title="New event" description="Add an event to the YUGA union calendar." />
      <EventForm forms={forms} action={createEvent} />
    </>
  );
}
