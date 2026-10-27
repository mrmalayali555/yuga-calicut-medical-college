import { notFound } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { EVENTS } from "@/lib/data";
import { EventRegistrationView } from "@/components/events/event-registration-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await db.event.findUnique({
    where: { slug },
    select: { title: true },
  });

  return {
    title: event ? `Register for ${event.title}` : "Event Registration Pass",
    description: "Official registration pass and delegate enrollment for GMC Kozhikode union events.",
    alternates: {
      canonical: `/events/${slug}/register`,
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventRegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Try finding in DB
  let dbEvent = await db.event.findUnique({
    where: { slug },
    include: {
      registrationForm: {
        include: {
          fields: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  // If not found in DB by exact slug, check if any event starts with slug or match in mock data
  if (!dbEvent) {
    const mock = EVENTS.find((e) => e.id === slug || e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(slug));
    if (mock) {
      return (
        <EventRegistrationView
          event={{
            id: mock.id,
            title: mock.title,
            slug,
            description: mock.subtitle,
            date: mock.date,
            time: mock.time,
            venue: mock.venue,
            tier: "DELEGATE PASS",
          }}
          form={{
            id: "mock-form-" + mock.id,
            title: `${mock.title} Registration`,
            description: "Please complete your delegate registration details below to reserve your entry pass.",
            deadline: null,
            fields: [
              {
                id: "f-name",
                label: "Full Name",
                type: "text",
                required: true,
                placeholder: "Dr. / Medico Full Name",
                options: null,
                order: 0,
              },
              {
                id: "f-email",
                label: "Email Address",
                type: "email",
                required: true,
                placeholder: "name@gmc.edu",
                options: null,
                order: 1,
              },
              {
                id: "f-batch",
                label: "Batch / Academic Year",
                type: "radio",
                required: true,
                placeholder: null,
                options: "MBBS 2021, MBBS 2022, MBBS 2023, MBBS 2024, MBBS 2025, House Surgeon / Intern, PG Resident",
                order: 2,
              },
              {
                id: "f-phone",
                label: "Contact Phone Number",
                type: "number",
                required: true,
                placeholder: "+91 98765 43210",
                options: null,
                order: 3,
              },
              {
                id: "f-pref",
                label: "Participation Category",
                type: "select",
                required: false,
                placeholder: null,
                options: "Delegate, Competitor, Volunteer, Faculty Guest",
                order: 4,
              },
            ],
          }}
        />
      );
    }
    notFound();
  }

  // If DB event exists but doesn't have a custom form attached yet, provide default medical delegate form
  const form = dbEvent.registrationForm || {
    id: "default-form-" + dbEvent.id,
    title: `${dbEvent.title} Registration`,
    description: dbEvent.description,
    deadline: null,
    fields: [
      {
        id: "f-name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Dr. / Medico Full Name",
        options: null,
        order: 0,
      },
      {
        id: "f-email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "name@gmc.edu",
        options: null,
        order: 1,
      },
      {
        id: "f-batch",
        label: "Batch / Academic Year",
        type: "radio",
        required: true,
        placeholder: null,
        options: "MBBS 2021, MBBS 2022, MBBS 2023, MBBS 2024, MBBS 2025, House Surgeon / Intern, PG Resident",
        order: 2,
      },
      {
        id: "f-phone",
        label: "Phone / WhatsApp",
        type: "number",
        required: true,
        placeholder: "+91 98765 43210",
        options: null,
        order: 3,
      },
      {
        id: "f-dept",
        label: "Department / College ID",
        type: "text",
        required: false,
        placeholder: "e.g. GMCK/2023/142",
        options: null,
        order: 4,
      },
    ],
  };

  return (
    <EventRegistrationView
      event={{
        id: dbEvent.id,
        title: dbEvent.title,
        slug: dbEvent.slug,
        description: dbEvent.description,
        date: formatDate(dbEvent.date),
        time: dbEvent.time,
        venue: dbEvent.venue,
        tier: "DELEGATE PASS",
      }}
      form={{
        id: form.id,
        title: form.title,
        description: form.description,
        deadline: form.deadline ? formatDate(form.deadline) : null,
        fields: form.fields,
      }}
    />
  );
}
