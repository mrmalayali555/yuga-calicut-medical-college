import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Maximum file size limits
const MAX_SIZES = {
  image: 8 * 1024 * 1024, // 8 MB
  video: 50 * 1024 * 1024, // 50 MB
  pdf: 20 * 1024 * 1024, // 20 MB
};

// Supported MIME types
const ALLOWED_MIMES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  pdf: ["application/pdf"],
};

function getFileType(mime: string): "image" | "video" | "pdf" | null {
  const normalized = mime.toLowerCase().trim();
  if (ALLOWED_MIMES.image.includes(normalized)) return "image";
  if (ALLOWED_MIMES.video.includes(normalized)) return "video";
  if (ALLOWED_MIMES.pdf.includes(normalized)) return "pdf";
  return null;
}

/**
 * Validate real file signature (magic bytes) to prevent extension/MIME spoofing.
 */
function validateMagicBytes(buffer: Buffer, kind: "image" | "video" | "pdf", mime: string): boolean {
  if (buffer.length < 4) return false;

  // PNG: 89 50 4E 47
  if (mime === "image/png") {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }

  // JPEG / JPG: FF D8 FF
  if (mime === "image/jpeg" || mime === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // WebP: RIFF .... WEBP
  if (mime === "image/webp") {
    if (buffer.length < 12) return false;
    const isRiff = buffer.subarray(0, 4).toString("ascii") === "RIFF";
    const isWebp = buffer.subarray(8, 12).toString("ascii") === "WEBP";
    return isRiff && isWebp;
  }

  // GIF: GIF8
  if (mime === "image/gif") {
    return buffer.subarray(0, 4).toString("ascii") === "GIF8";
  }

  // AVIF: ....ftyp
  if (mime === "image/avif") {
    if (buffer.length < 12) return false;
    return buffer.subarray(4, 12).toString("ascii").includes("ftyp");
  }

  // PDF: %PDF-
  if (kind === "pdf") {
    if (buffer.length < 5) return false;
    return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  }

  // Video: MP4 / MOV / WebM
  if (kind === "video") {
    if (mime === "video/webm") {
      return buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3;
    }
    if (buffer.length >= 8) {
      const brand = buffer.subarray(4, 8).toString("ascii");
      return brand === "ftyp" || brand === "moov";
    }
    return true;
  }

  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate admin user
    const session = await getSession();
    if (!session || !session.sub) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required to upload media." },
        { status: 401 }
      );
    }

    // 2. Parse uploaded form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file was provided in the upload request." },
        { status: 400 }
      );
    }

    // 3. Validate declared MIME type
    const mime = file.type || "application/octet-stream";
    const kind = getFileType(mime);

    if (!kind) {
      return NextResponse.json(
        {
          error: `Unsupported file type (${mime}). Accepted formats: JPG, PNG, WebP, AVIF, GIF, PDF, MP4, WebM.`,
        },
        { status: 415 }
      );
    }

    // 4. Validate file size limits
    const maxSize = MAX_SIZES[kind];
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB for ${kind}s.`,
        },
        { status: 413 }
      );
    }

    // 5. Inspect file content buffer & verify magic bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!validateMagicBytes(buffer, kind, mime)) {
      return NextResponse.json(
        {
          error: "File verification failed: Content signature does not match declared file type.",
        },
        { status: 400 }
      );
    }

    // 6. Generate collision-resistant sanitized filename
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

    // 7. Store file in Vercel Blob (Cloud Object Storage)
    let url: string;
    const foundTokenEntry = Object.entries(process.env).find(
      ([key, val]) =>
        Boolean(val) &&
        (key === "BLOB_READ_WRITE_TOKEN" ||
          key === "VERCEL_BLOB_READ_WRITE_TOKEN" ||
          key.endsWith("_READ_WRITE_TOKEN") ||
          (key.startsWith("BLOB_") && key.includes("TOKEN")))
    );
    const token = foundTokenEntry ? String(foundTokenEntry[1]).trim() : undefined;

    if (token) {
      // Production & configured cloud storage: Upload directly to Vercel Blob
      const blob = await put(filename, buffer, {
        access: "public",
        token,
        contentType: mime,
      });
      url = blob.url;
    } else {
      // Check if running on Vercel or in serverless production
      const isServerless = Boolean(
        process.env.VERCEL ||
        process.env.AWS_LAMBDA_FUNCTION_NAME ||
        process.env.NODE_ENV === "production"
      );

      if (isServerless) {
        // In serverless environments, local filesystem is read-only (EROFS).
        // Return a clear, actionable configuration message.
        return NextResponse.json(
          {
            error:
              "Persistent storage is not configured. Please set the BLOB_READ_WRITE_TOKEN environment variable in your Vercel Project Settings (Dashboard -> Storage -> Blob) to enable file uploads in production.",
          },
          { status: 503 }
        );
      }

      // Offline local development fallback: Write to public/uploads
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      url = `/uploads/${filename}`;
    }

    // 8. Record asset in database media library
    const media = await db.media.create({
      data: {
        name: file.name,
        url,
        type: kind,
        mime: file.type,
        size: file.size,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        url,
        id: media.id,
        type: kind,
        name: file.name,
        size: file.size,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Critical upload error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Internal server error occurred while processing the upload.",
      },
      { status: 500 }
    );
  }
}
