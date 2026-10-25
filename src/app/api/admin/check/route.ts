import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (session) {
      return NextResponse.json({
        isAdmin: true,
        name: session.name,
        email: session.email,
        role: session.role,
        id: session.sub,
      });
    }
    return NextResponse.json({ isAdmin: false });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
