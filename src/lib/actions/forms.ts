"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "form";
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.registrationForm.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    slug = `${root}-${i++}`;
  }
  return slug;
}

export type FieldDefinition = {
  id?: string;
  label: string;
  type: string; // text | email | number | textarea | select | radio | checkbox
  required: boolean;
  placeholder?: string;
  options?: string; // comma-separated or newline-separated
  order?: number;
};

export async function createRegistrationForm(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required");

  const description = String(formData.get("description") || "").trim() || null;
  const eventId = String(formData.get("eventId") || "").trim() || null;
  const deadlineRaw = String(formData.get("deadline") || "").trim();
  const deadline = deadlineRaw ? new Date(deadlineRaw) : null;
  const published = formData.get("published") === "on" || formData.get("published") === "true";

  const fieldsJson = String(formData.get("fieldsJson") || "[]");
  let fields: FieldDefinition[] = [];
  try {
    fields = JSON.parse(fieldsJson);
  } catch (e) {
    fields = [];
  }

  const slug = await uniqueSlug(title);

  await db.$transaction(async (tx) => {
    // If event is already linked to another form, unlink it first
    if (eventId) {
      await tx.registrationForm.updateMany({
        where: { eventId },
        data: { eventId: null },
      });
    }

    const form = await tx.registrationForm.create({
      data: {
        title,
        slug,
        description,
        eventId,
        deadline,
        published,
      },
    });

    if (fields.length > 0) {
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        await tx.registrationField.create({
          data: {
            formId: form.id,
            label: f.label.trim(),
            type: f.type || "text",
            required: Boolean(f.required),
            placeholder: f.placeholder?.trim() || null,
            options: f.options?.trim() || null,
            order: i,
          },
        });
      }
    }
  });

  revalidatePath("/admin/forms");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/forms");
}

export async function updateRegistrationForm(id: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Title is required");

  const description = String(formData.get("description") || "").trim() || null;
  const eventId = String(formData.get("eventId") || "").trim() || null;
  const deadlineRaw = String(formData.get("deadline") || "").trim();
  const deadline = deadlineRaw ? new Date(deadlineRaw) : null;
  const published = formData.get("published") === "on" || formData.get("published") === "true";

  const fieldsJson = String(formData.get("fieldsJson") || "[]");
  let fields: FieldDefinition[] = [];
  try {
    fields = JSON.parse(fieldsJson);
  } catch (e) {
    fields = [];
  }

  const slug = await uniqueSlug(title, id);

  await db.$transaction(async (tx) => {
    // If event is already linked to another form, unlink it first
    if (eventId) {
      await tx.registrationForm.updateMany({
        where: { eventId, NOT: { id } },
        data: { eventId: null },
      });
    }

    await tx.registrationForm.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        eventId,
        deadline,
        published,
      },
    });

    // Delete existing fields and re-create to maintain order
    await tx.registrationField.deleteMany({ where: { formId: id } });

    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      await tx.registrationField.create({
        data: {
          formId: id,
          label: f.label.trim(),
          type: f.type || "text",
          required: Boolean(f.required),
          placeholder: f.placeholder?.trim() || null,
          options: f.options?.trim() || null,
          order: i,
        },
      });
    }
  });

  revalidatePath("/admin/forms");
  revalidatePath(`/admin/forms/${id}`);
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/forms");
}

export async function deleteRegistrationForm(id: string) {
  await requireAdmin();
  await db.registrationForm.delete({ where: { id } });
  revalidatePath("/admin/forms");
  revalidatePath("/events");
  revalidatePath("/");
  redirect("/admin/forms");
}

export async function submitRegistration(formId: string, answers: Record<string, any>) {
  const form = await db.registrationForm.findUnique({
    where: { id: formId },
    include: { fields: true },
  });

  if (!form || !form.published) {
    throw new Error("Registration is currently closed or unavailable.");
  }

  if (form.deadline && new Date() > new Date(form.deadline)) {
    throw new Error("Registration deadline has passed.");
  }

  // Validate required fields
  for (const field of form.fields) {
    if (field.required) {
      const val = answers[field.id] || answers[field.label];
      if (val === undefined || val === null || String(val).trim() === "") {
        throw new Error(`Field '${field.label}' is required.`);
      }
    }
  }

  // Generate unique pass code
  const ticketRef = `YUG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const payload = {
    ...answers,
    _ticketRef: ticketRef,
    _submittedAt: new Date().toISOString(),
  };

  const submission = await db.registrationSubmission.create({
    data: {
      formId: form.id,
      data: JSON.stringify(payload),
    },
  });

  revalidatePath(`/admin/forms/${form.id}/submissions`);
  revalidatePath("/events");
  revalidatePath("/");

  return {
    success: true,
    submissionId: submission.id,
    ticketId: ticketRef,
  };
}
