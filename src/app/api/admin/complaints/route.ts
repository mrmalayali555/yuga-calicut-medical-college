import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { submitComplaint } from "@/lib/actions/complaints";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const name = typeof body.name === "string" ? body.name : undefined;
    const email = typeof body.email === "string" ? body.email : undefined;
    const message = typeof body.message === "string" ? body.message : "";
    const category = typeof body.category === "string" ? body.category : undefined;
    const batch = typeof body.batch === "string" ? body.batch : undefined;
    const subject = typeof body.subject === "string" ? body.subject : undefined;
    const anonymous = typeof body.anonymous === "boolean" ? body.anonymous : undefined;

    const res = await submitComplaint({
      name,
      email,
      message,
      category,
      batch,
      subject,
      anonymous,
    });

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      id: res.id,
      referenceId: res.referenceId,
    }, { status: 201 });
  } catch (error: any) {
    console.error("[api/admin/complaints] POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process complaint" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

    const complaints = await db.complaint.findMany({
      where: status && status !== "all" ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error: any) {
    console.error("[api/admin/complaints] GET error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}
