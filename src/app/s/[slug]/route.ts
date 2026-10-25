import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ShortLink } from "@/lib/actions/tools";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = (slug || "").toLowerCase().trim();

    if (!cleanSlug) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 1. Look up fast key
    const single = await db.setting.findUnique({
      where: { key: `shortlink:${cleanSlug}` },
    });

    let targetUrl: string | null = null;

    if (single && single.value) {
      try {
        const parsed = JSON.parse(single.value);
        targetUrl = parsed.targetUrl;
      } catch {
        // Fallback
      }
    }

    // 2. Fallback to master list if not found in single key
    if (!targetUrl) {
      const master = await db.setting.findUnique({
        where: { key: "admin_shortlinks" },
      });
      if (master && master.value) {
        try {
          const list: ShortLink[] = JSON.parse(master.value);
          const found = list.find((item) => item.slug === cleanSlug);
          if (found) {
            targetUrl = found.targetUrl;
          }
        } catch {
          // Ignore
        }
      }
    }

    // If still not found, redirect to home
    if (!targetUrl) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Increment click count in background
    (async () => {
      try {
        const master = await db.setting.findUnique({
          where: { key: "admin_shortlinks" },
        });
        if (master && master.value) {
          const list: ShortLink[] = JSON.parse(master.value);
          const updated = list.map((item) =>
            item.slug === cleanSlug ? { ...item, clicks: (item.clicks || 0) + 1 } : item
          );
          await db.setting.update({
            where: { key: "admin_shortlinks" },
            data: { value: JSON.stringify(updated) },
          });
        }
      } catch (err) {
        console.error("Failed to increment click count for shortlink:", err);
      }
    })();

    // Construct valid absolute or relative URL
    if (targetUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(targetUrl, req.url), 307);
    }

    return NextResponse.redirect(targetUrl, 307);
  } catch (error) {
    console.error("Error redirecting short link:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
