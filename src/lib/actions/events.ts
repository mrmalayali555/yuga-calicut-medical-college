"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "event";
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.event.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    slug = `${root}-${i++}`;
  }
  return slug;
}

function parse(formData: FormData) {
  const endDateRaw = String(formData.get("endDate") || "").trim();
  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    date: new Date(String(formData.get("date") || Date.now())),
    endDate: endDateRaw ? new Date(endDateRaw) : null,
    time: String(formData.get("time") || "").trim() || null,
    venue: String(formData.get("venue") || "").trim() || null,
    poster: String(formData.get("poster") || "").trim() || null,
    status: String(formData.get("status") || "upcoming"),
    published: formData.get("published") ? true : false,
  };
}

export async function createEvent(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  if (!data.title) return;
  const slug = await uniqueSlug(data.title);
  const event = await db.event.create({ data: { ...data, slug } });

  const registrationFormId = String(formData.get("registrationFormId") || "").trim();
  const requiresRegistration = formData.get("requiresRegistration") === "on" || formData.get("requiresRegistration") === "true";

  if (requiresRegistration) {
    if (registrationFormId && registrationFormId !== "none" && registrationFormId !== "create_default") {
      await db.registrationForm.update({
        where: { id: registrationFormId },
        data: { eventId: event.id },
      });
    } else {
      // Auto-create standard pass form
      const formSlug = await uniqueSlug(event.title + "-reg");
      await db.registrationForm.create({
        data: {
          title: `${event.title} Registration`,
          slug: formSlug,
          description: "Official registration and entry pass enrollment.",
          eventId: event.id,
          published: true,
        },
      });
    }
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  const slug = await uniqueSlug(data.title, id);
  await db.event.update({ where: { id }, data: { ...data, slug } });

  const registrationFormId = String(formData.get("registrationFormId") || "").trim();
  const requiresRegistration = formData.get("requiresRegistration") === "on" || formData.get("requiresRegistration") === "true";

  // First unlink any previously linked form
  await db.registrationForm.updateMany({
    where: { eventId: id },
    data: { eventId: null },
  });

  if (requiresRegistration) {
    if (registrationFormId && registrationFormId !== "none" && registrationFormId !== "create_default") {
      await db.registrationForm.update({
        where: { id: registrationFormId },
        data: { eventId: id },
      });
    } else {
      // Create new pass form if none existed
      const formSlug = await uniqueSlug(data.title + "-reg");
      await db.registrationForm.create({
        data: {
          title: `${data.title} Registration`,
          slug: formSlug,
          description: "Official registration and entry pass enrollment.",
          eventId: id,
          published: true,
        },
      });
    }
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  revalidatePath("/");
  redirect("/admin/events");
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  const existing = await db.event.findUnique({ where: { id }, select: { slug: true } });
  await db.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  if (existing?.slug) {
    revalidatePath(`/events/${existing.slug}`);
  }
  revalidatePath("/");
  redirect("/admin/events");
}
