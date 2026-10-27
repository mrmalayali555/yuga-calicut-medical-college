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
          const val = JSON.parse(r.value);
          if (s === "jeevanam" || s === "godha") {
            val.stats = [];
          }
          if (s === "godha") {
            val.initiatives = [];
          }
          map[s] = val;
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
    const parsed = JSON.parse(row.value);
    let mutated = false;
    if (slug === "jeevanam" || slug === "godha") {
      if (parsed.stats && parsed.stats.length > 0) {
        parsed.stats = [];
        mutated = true;
      } else {
        parsed.stats = [];
      }
    }
    if (slug === "godha") {
      if (parsed.initiatives && parsed.initiatives.length > 0) {
        parsed.initiatives = [];
        mutated = true;
      } else {
        parsed.initiatives = [];
      }
    }
    if (mutated) {
      db.setting.update({
        where: { key: `club:${slug}` },
        data: { value: JSON.stringify(parsed) },
      }).catch(() => {});
    }
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(null);
  }
}

