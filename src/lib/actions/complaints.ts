"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export interface SubmitComplaintInput {
  name?: string | null;
  email?: string | null;
  batch?: string | null;
  category?: string | null;
  subject?: string | null;
  message: string;
  anonymous?: boolean;
}

export async function submitComplaint(input: SubmitComplaintInput) {
  try {
    const rawMessage = (input.message || "").trim();
    if (!rawMessage) {
      return { success: false, error: "Please enter your message or proposal." };
    }

    const hasName = Boolean(input.name && input.name.trim().length > 0);
    const hasEmail = Boolean(input.email && input.email.trim().length > 0);
    // If anonymous is explicitly specified as false and name is provided, keep named; otherwise default anonymous
    const isAnonymous = input.anonymous ?? (!hasName && !hasEmail);

    const name = isAnonymous ? null : (input.name?.trim() || null);
    const email = isAnonymous ? null : (input.email?.trim() || null);

    // Build readable metadata header if category/batch/subject provided
    const headers: string[] = [];
    if (input.category) {
      headers.push(`[Category: ${input.category.toUpperCase()}]`);
    }
    if (input.batch) {
      headers.push(`[Batch/Phase: ${input.batch}]`);
    }
    if (input.subject) {
      headers.push(`[Subject: ${input.subject.trim()}]`);
    }

    const fullMessage = headers.length > 0 ? `${headers.join(" ")}\n\n${rawMessage}` : rawMessage;

    const complaint = await db.complaint.create({
      data: {
        name,
        email,
        message: fullMessage,
        anonymous: isAnonymous,
        status: "new",
      },
    });

    const suffix = complaint.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() || Math.floor(100000 + Math.random() * 900000).toString();
    const referenceId = `YUGA-GRV-${suffix}`;

    try {
      revalidatePath("/admin/complaints");
      revalidatePath("/admin");
    } catch {
      // In non-request context or background, revalidation failure is non-fatal
    }

    return {
      success: true,
      id: complaint.id,
      referenceId,
    };
  } catch (error: any) {
    console.error("[submitComplaint] Error creating complaint:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred while submitting your grievance. Please try again.",
    };
  }
}

export async function setComplaintStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") || "new");
  await db.complaint.update({ where: { id }, data: { status } });
  revalidatePath("/admin/complaints");
  revalidatePath(`/admin/complaints/${id}`);
}

export async function deleteComplaint(id: string) {
  await requireAdmin();
  await db.complaint.delete({ where: { id } });
  revalidatePath("/admin/complaints");
  redirect("/admin/complaints");
}
