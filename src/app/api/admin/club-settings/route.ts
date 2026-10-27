import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const VALID_SLUGS = ["jeevanam", "praanah", "godha", "ocha"];

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, settings } = body;

    if (!slug || !VALID_SLUGS.includes(slug)) {
      return NextResponse.json({ error: "Invalid club slug." }, { status: 400 });
    }

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
    }

    await db.setting.upsert({
      where: { key: `club:${slug}` },
      update: { value: JSON.stringify(settings) },
      create: { key: `club:${slug}`, value: JSON.stringify(settings) },
    });

    revalidatePath(`/clubs/${slug}`);
    revalidatePath(`/admin/clubs/${slug}`);
    revalidatePath(`/admin/clubs`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error saving club settings:", err);
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}
