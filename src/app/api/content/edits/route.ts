import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/content/edits?limit=50&offset=0
 * Returns the edit history for all content blocks. Admin-only.
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");

  try {
    const [edits, total] = await Promise.all([
      db.contentEdit.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          contentBlock: {
            select: { pageId: true, blockId: true, content: true },
          },
        },
      }),
      db.contentEdit.count(),
    ]);

    return NextResponse.json({ edits, total, limit, offset });
  } catch {
    return NextResponse.json({ edits: [], total: 0, limit, offset });
  }
}

/**
 * POST /api/content/edits
 * Undo a specific edit. Admin-only.
 * Body: { editId }
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { editId } = await request.json();
    if (!editId) {
      return NextResponse.json({ error: "Missing editId" }, { status: 400 });
    }

    // Find the edit
    const edit = await db.contentEdit.findUnique({
      where: { id: editId },
      include: { contentBlock: true },
    });

    if (!edit) {
      return NextResponse.json({ error: "Edit not found" }, { status: 404 });
    }

    if (edit.reverted) {
      return NextResponse.json(
        { error: "This edit has already been reverted" },
        { status: 400 }
      );
    }

    // Revert the content block to the previous value
    await db.contentBlock.update({
      where: { id: edit.contentBlockId },
      data: { content: edit.previousValue },
    });

    // Mark the edit as reverted
    await db.contentEdit.update({
      where: { id: editId },
      data: { reverted: true },
    });

    // Create a new edit record for the revert action
    await db.contentEdit.create({
      data: {
        contentBlockId: edit.contentBlockId,
        adminId: session.sub,
        adminName: session.name,
        previousValue: edit.newValue,
        newValue: edit.previousValue,
        fieldLabel: `Undo: ${edit.fieldLabel || edit.contentBlock.blockId}`,
        pageName: edit.pageName || edit.contentBlock.pageId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to undo edit:", error);
    return NextResponse.json(
      { error: "Failed to undo edit" },
      { status: 500 }
    );
  }
}
