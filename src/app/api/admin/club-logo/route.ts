import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const VALID_SLUGS = ["jeevanam", "praanah", "godha", "ocha"];
const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

export async function POST(req: NextRequest) {
  // Auth check
  const session = await getSession();
  if (!session?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("logo");
  const slug = formData.get("slug") as string;

  if (!slug || !VALID_SLUGS.includes(slug)) {
    return NextResponse.json({ error: "Invalid club slug." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No logo file provided." }, { status: 400 });
  }

  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_IMAGE_MIMES.includes(mime)) {
    return NextResponse.json(
      { error: `Unsupported image type (${mime}). Use PNG, JPEG, WebP, GIF or SVG.` },
      { status: 415 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 8 MB." }, { status: 413 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `club-logo-${slug}-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  const blobTokenEntry = Object.entries(process.env).find(
    ([key, val]) =>
      Boolean(val) &&
      (key === "BLOB_READ_WRITE_TOKEN" ||
        key === "VERCEL_BLOB_READ_WRITE_TOKEN" ||
        (key.startsWith("BLOB_") && key.includes("TOKEN")))
  );
  const token = blobTokenEntry ? String(blobTokenEntry[1]).trim() : undefined;

  let url: string;

  if (token) {
    const blob = await put(`clubs/${filename}`, buffer, {
      access: "public",
      token,
      contentType: mime,
    });
    url = blob.url;
  } else {
    const isServerless = Boolean(
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NODE_ENV === "production"
    );
    if (isServerless) {
      return NextResponse.json(
        { error: "Set BLOB_READ_WRITE_TOKEN to enable uploads in production." },
        { status: 503 }
      );
    }
    // Local dev: save to public/clubs/
    const clubDir = path.join(process.cwd(), "public", "clubs");
    await mkdir(clubDir, { recursive: true });
    const filePath = path.join(clubDir, filename);
    await writeFile(filePath, buffer);
    url = `/clubs/${filename}`;
  }

  // Persist new logo URL into club settings
  try {
    const existing = await db.setting.findUnique({ where: { key: `club:${slug}` } }).catch(() => null);
    const current = existing ? JSON.parse(existing.value) : {};
    const updated = { ...current, logo: url };
    await db.setting.upsert({
      where: { key: `club:${slug}` },
      update: { value: JSON.stringify(updated) },
      create: { key: `club:${slug}`, value: JSON.stringify(updated) },
    });
    revalidatePath(`/clubs/${slug}`);
    revalidatePath(`/admin/clubs/${slug}`);
    revalidatePath(`/admin/clubs`);
    revalidatePath(`/subcommittees`);
    revalidatePath(`/`);
  } catch (err) {
    console.warn("Could not persist logo URL to DB:", err);
  }

  return NextResponse.json({ success: true, url }, { status: 201 });
}
