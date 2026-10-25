import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/content?page=home
 * Returns all content blocks for a given page.
 * Public — anyone can read content overrides (they are the live site content).
 */
export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get("page");
  if (!pageId) {
    return NextResponse.json({ blocks: [] });
  }

  try {
    const blocks = await db.contentBlock.findMany({
      where: {
        OR: [{ pageId }, { pageId: "global" }],
      },
      select: {
        id: true,
        pageId: true,
        blockId: true,
        content: true,
        type: true,
        edits: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { previousValue: true, fieldLabel: true },
        },
      },
    });

    const formatted = blocks.map((b) => ({
      pageId: b.pageId,
      blockId: b.blockId,
      content: b.content,
      type: b.type,
      previousValue: b.edits[0]?.previousValue ?? "",
      label: b.edits[0]?.fieldLabel ?? b.blockId,
    }));

    return NextResponse.json({ blocks: formatted });
  } catch {
    // DB not ready or schema not pushed yet — return empty
    return NextResponse.json({ blocks: [] });
  }
}

/**
 * POST /api/content
 * Save a content block edit. Admin-only.
 * Body: { pageId, blockId, content, previousValue, label?, pageName?, type? }
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { pageId, blockId, content, previousValue, label, pageName, type } = body;

    if (!pageId || !blockId || content === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: pageId, blockId, content" },
        { status: 400 }
      );
    }

    // Upsert the content block
    const block = await db.contentBlock.upsert({
      where: { pageId_blockId: { pageId, blockId } },
      create: {
        pageId,
        blockId,
        content,
        type: type || "text",
      },
      update: {
        content,
        type: type || "text",
      },
    });

    // Record the edit in the audit log
    await db.contentEdit.create({
      data: {
        contentBlockId: block.id,
        adminId: session.sub,
        adminName: session.name,
        previousValue: previousValue ?? "",
        newValue: content,
        fieldLabel: label || blockId,
        pageName: pageName || pageId,
      },
    });

    return NextResponse.json({ success: true, block });
  } catch (error) {
    console.error("Failed to save content block:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
