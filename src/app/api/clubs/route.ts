import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_SLUGS = ["jeevanam", "praanah", "godha", "ocha"];

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || !VALID_SLUGS.includes(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  try {
    const row = await db.setting.findUnique({ where: { key: `club:${slug}` } });
    if (!row) return NextResponse.json(null);
    return NextResponse.json(JSON.parse(row.value));
  } catch {
    return NextResponse.json(null);
  }
}
