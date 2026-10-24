"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { destroySession } from "@/lib/auth";

export async function revokeSession(id: string) {
  await requireAdmin();
  await db.adminSession.delete({ where: { id } });
  revalidatePath("/admin/sessions");
}

export async function revokeAllOtherSessions(currentToken: string) {
  await requireAdmin();
  await db.adminSession.deleteMany({ where: { token: { not: currentToken } } });
  revalidatePath("/admin/sessions");
}
