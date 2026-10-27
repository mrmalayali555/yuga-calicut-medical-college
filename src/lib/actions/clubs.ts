"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { put } from "@vercel/blob";
import { unlink, writeFile } from "fs/promises";
import path from "path";

export type ClubSlug = "jeevanam" | "praanah" | "godha" | "ocha";

export interface ClubStat {
  label: string;
  value: string;
  hint: string;
}

export interface ClubInitiative {
  title: string;
  description: string;
  category: string;
  status: string;
}

export interface ClubAchievement {
  title: string;
  year: string;
  awarder: string;
}

export interface ClubTeamMember {
  role: string;
  name: string;
  batch: string;
  phone: string;
  email: string;
}

export interface ClubSettings {
  name?: string;
  malayalam?: string;
  tagline?: string;
  category?: string;
  founded?: string;
  logo?: string;
  accent?: string;
  accentRgb?: string;
  heroGradient?: string;
  mission?: string;
  vision?: string;
  heroDescription?: string;
  stats?: ClubStat[];
  initiatives?: ClubInitiative[];
  achievements?: ClubAchievement[];
  team?: ClubTeamMember[];
}

/** Read persisted overrides for a club from the Settings table. Returns null if none saved. */
export async function getClubSettings(slug: ClubSlug): Promise<ClubSettings | null> {
  try {
    const row = await db.setting.findUnique({ where: { key: `club:${slug}` } });
    if (!row) return null;
    return JSON.parse(row.value) as ClubSettings;
  } catch {
    return null;
  }
}

/** Save full club settings. */
export async function saveClubSettings(slug: ClubSlug, data: ClubSettings) {
  await requireAdmin();
  await db.setting.upsert({
    where: { key: `club:${slug}` },
    update: { value: JSON.stringify(data) },
    create: { key: `club:${slug}`, value: JSON.stringify(data) },
  });
  revalidatePath(`/clubs/${slug}`);
  revalidatePath(`/admin/clubs/${slug}`);
  revalidatePath(`/admin/clubs`);
  revalidatePath(`/subcommittees`);
  revalidatePath(`/`);
  return { success: true };
}

/** Upload a club logo image and save the resulting URL as the logo for the club. */
export async function uploadClubLogo(slug: ClubSlug, formData: FormData) {
  await requireAdmin();

  const file = formData.get("logo") as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: "No file provided." };
  }

  const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Only PNG, JPEG, WebP, SVG, or GIF images are allowed." };
  }

  if (file.size > 8 * 1024 * 1024) {
    return { success: false, error: "Image must be under 8 MB." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const filename = `clubs/${slug}-logo-${Date.now()}.${ext}`;

  const blobToken =
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN?.trim();

  let logoUrl: string;

  if (blobToken) {
    // Production: Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      token: blobToken,
    });
    logoUrl = blob.url;
  } else {
    // Development: Save to public/uploads/
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const localFilename = `${slug}-logo-${Date.now()}.${ext}`;
    const localPath = path.join(uploadDir, localFilename);
    try {
      await writeFile(localPath, buffer);
    } catch {
      // If uploads dir doesn't exist, save to public/clubs/
      const clubDir = path.join(process.cwd(), "public", "clubs");
      await writeFile(path.join(clubDir, localFilename), buffer);
      logoUrl = `/clubs/${localFilename}`;
      // Save URL to club settings
      const current = await getClubSettings(slug);
      await saveClubSettings(slug, { ...current, logo: logoUrl });
      revalidatePath(`/clubs/${slug}`);
      return { success: true, url: logoUrl };
    }
    logoUrl = `/uploads/${localFilename}`;
  }

  // Persist the new logo URL in club settings
  const current = await getClubSettings(slug);
  await saveClubSettings(slug, { ...current, logo: logoUrl });
  revalidatePath(`/clubs/${slug}`);

  return { success: true, url: logoUrl };
}
