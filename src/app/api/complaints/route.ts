import { NextRequest, NextResponse } from "next/server";
import { submitComplaint } from "@/lib/actions/complaints";

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

    return NextResponse.json(
      {
        success: true,
        id: res.id,
        referenceId: res.referenceId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[api/complaints] POST error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit grievance" },
      { status: 500 }
    );
  }
}
