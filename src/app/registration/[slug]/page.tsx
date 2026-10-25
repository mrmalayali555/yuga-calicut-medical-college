import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { EVENTS } from "@/lib/data";
import { EventRegistrationView } from "@/components/events/event-registration-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Registration Pass · YUGA`,
    description: "Official registration and delegate enrollment for GMC Kozhikode union activities.",
  };
}

export default async function PublicRegistrationPage({
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

  // If not found by event slug, try finding by registration form slug
  if (!dbEvent) {
    const form = await db.registrationForm.findUnique({
      where: { slug },
      include: {
        event: true,
        fields: { orderBy: { order: "asc" } },
      },
    });

    if (form && form.event) {
      dbEvent = {
        ...form.event,
        registrationForm: form,
      } as any;
    }
  }

  if (dbEvent) {
    const form = dbEvent.registrationForm;
    return (
      <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative z-10">
          <EventRegistrationView
            event={{
              id: dbEvent.id,
              title: dbEvent.title,
              slug: dbEvent.slug,
              description: dbEvent.description,
              date: dbEvent.date.toLocaleDateString(),
              time: dbEvent.time || "To be announced",
              venue: dbEvent.venue || "GMC Kozhikode",
              tier: "DELEGATE PASS",
            }}
            form={{
              id: form?.id || `form-${dbEvent.id}`,
              title: form?.title || dbEvent.title,
              description: form?.description || "Enter your student and contact credentials to confirm enrollment.",
              deadline: form?.deadline ? form.deadline.toISOString() : null,
              fields: form?.fields?.map((f, i) => ({
                id: f.id,
                label: f.label,
                type: f.type,
                required: f.required,
                placeholder: f.placeholder || null,
                options: f.options || null,
                order: f.order ?? i,
              })) || [],
            }}
          />
        </div>
      </div>
    );
  }

  // Fallback to mock events matching slug
  const mock = EVENTS.find(
    (e) => e.id === slug || e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(slug)
  );

  if (mock) {
    return (
      <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative z-10">
          <EventRegistrationView
            event={{
              id: mock.id,
              title: mock.title,
              slug: mock.id,
              description: mock.subtitle,
              date: mock.date,
              time: mock.time,
              venue: mock.venue,
              tier: "DELEGATE PASS",
            }}
            form={{
              id: `mock-form-${mock.id}`,
              title: `${mock.title} — Delegate Registration`,
              description: "Official registration for students and attendees of Government Medical College Kozhikode.",
              deadline: null,
              fields: [
                { id: "f1", label: "Full Name", type: "text", required: true, placeholder: "e.g. Diya Mariam", options: null, order: 0 },
                { id: "f2", label: "Batch / Academic Year", type: "select", required: true, placeholder: null, options: "MBBS 2026, MBBS 2025, MBBS 2024, MBBS 2023, House Surgeon, PG Resident, Other", order: 1 },
                { id: "f3", label: "Admission / Roll Number", type: "text", required: true, placeholder: "e.g. 240182", options: null, order: 2 },
                { id: "f4", label: "Phone Number", type: "text", required: true, placeholder: "+91 98765 43210", options: null, order: 3 },
                { id: "f5", label: "Institutional Email", type: "email", required: true, placeholder: "student@cmc.kerala.gov.in", options: null, order: 4 },
              ],
            }}
          />
        </div>
      </div>
    );
  }

  notFound();
}
