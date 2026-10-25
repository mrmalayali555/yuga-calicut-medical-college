"use server";

import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";
import { del } from "@vercel/blob";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function deleteMedia(id: string) {
  await requireAdmin();
  const media = await db.media.findUnique({ where: { id } });

  if (media) {
    const token =
      process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      process.env.VERCEL_BLOB_READ_WRITE_TOKEN?.trim();

    // 1. If stored in Vercel Blob cloud storage, delete from blob
    if (media.url.includes("blob.vercel-storage.com")) {
      try {
        await del(media.url, token ? { token } : undefined);
      } catch (err) {
        console.warn("Failed to delete asset from Vercel Blob:", err);
      }
    } else if (media.url.startsWith("/uploads/")) {
      // 2. If stored in local development filesystem
      try {
        const filePath = path.join(process.cwd(), "public", media.url);
        await unlink(filePath).catch(() => {});
      } catch (err) {
        // Silently ignore if file doesn't exist
      }
    }

    // 3. Remove database record
    await db.media.delete({ where: { id } });
  }

  revalidatePath("/admin/media");
}
