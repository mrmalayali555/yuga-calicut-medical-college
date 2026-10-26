import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * One-time utility: ensures ALL interventions, achievements, events,
 * and notifications in the DB are marked published = true.
 * Safe to call multiple times (idempotent).
 * Secured via a ADMIN_SECRET env var check.
 */
export async function POST(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  const env = process.env.ADMIN_SECRET || process.env.JWT_SECRET;
  if (!env || secret !== env) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [interventions, achievements, events, notifications] = await Promise.all([
      db.intervention.updateMany({ where: { published: false }, data: { published: true } }),
      db.achievement.updateMany({ where: { published: false }, data: { published: true } }),
      db.event.updateMany({ where: { published: false }, data: { published: true } }),
      db.notification.updateMany({ where: { published: false }, data: { published: true } }),
    ]);

    return NextResponse.json({
      ok: true,
      updated: {
        interventions: interventions.count,
        achievements: achievements.count,
        events: events.count,
        notifications: notifications.count,
      },
    });
  } catch (err) {
    console.error("publish-all error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ info: "POST to this endpoint with x-admin-secret header to publish all records." });
}
