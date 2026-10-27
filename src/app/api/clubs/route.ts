import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_SLUGS = ["jeevanam", "praanah", "godha", "ocha"];

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    try {
      const rows = await db.setting.findMany({
        where: { key: { in: VALID_SLUGS.map((s) => `club:${s}`) } },
      });
      const map: Record<string, unknown> = {};
      rows.forEach((r) => {
        const s = r.key.replace("club:", "");
        try {
          map[s] = JSON.parse(r.value);
        } catch {}
      });
      return NextResponse.json(map);
    } catch {
      return NextResponse.json({});
    }
  }

  if (!VALID_SLUGS.includes(slug)) {
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

