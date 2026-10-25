"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface ShortLink {
  id: string;
  slug: string;
  targetUrl: string;
  title?: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

const SETTINGS_KEY = "admin_shortlinks";

/**
 * Get all configured short links
 */
export async function getShortLinks(): Promise<ShortLink[]> {
  try {
    const setting = await db.setting.findUnique({
      where: { key: SETTINGS_KEY },
    });

    if (!setting || !setting.value) {
      return [];
    }

    const parsed = JSON.parse(setting.value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error fetching short links:", error);
    return [];
  }
}

/**
 * Create or update a shortened link
 */
export async function createShortLink(formData: FormData) {
  try {
    const rawSlug = String(formData.get("slug") || "").trim().toLowerCase();
    const targetUrl = String(formData.get("targetUrl") || "").trim();
    const title = String(formData.get("title") || "").trim();

    if (!rawSlug || !targetUrl) {
      return { success: false, error: "Custom Slug and Destination URL are required." };
    }

    // Clean slug: keep alphanumeric and dashes
    const slug = rawSlug.replace(/[^a-z0-9-_]/g, "");
    if (!slug) {
      return { success: false, error: "Invalid slug. Use only letters, numbers, and hyphens." };
    }

    // Format target URL
    let formattedUrl = targetUrl;
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("/")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const existing = await getShortLinks();

    // Check collision
    const existingIndex = existing.findIndex((item) => item.slug === slug);
    const now = new Date().toISOString();

    let updatedList: ShortLink[];

    if (existingIndex >= 0) {
      // Update existing
      updatedList = existing.map((item, idx) =>
        idx === existingIndex
          ? {
              ...item,
              targetUrl: formattedUrl,
              title: title || item.title || slug,
              updatedAt: now,
            }
          : item
      );
    } else {
      // Append new
      const newLink: ShortLink = {
        id: `sl-${Date.now()}`,
        slug,
        targetUrl: formattedUrl,
        title: title || slug,
        clicks: 0,
        createdAt: now,
        updatedAt: now,
      };
      updatedList = [newLink, ...existing];
    }

    // Save to master array in Setting
    await db.setting.upsert({
      where: { key: SETTINGS_KEY },
      create: {
        key: SETTINGS_KEY,
        value: JSON.stringify(updatedList),
      },
      update: {
        value: JSON.stringify(updatedList),
      },
    });

    // Also write dedicated single key for ultra-fast redirect lookup
    await db.setting.upsert({
      where: { key: `shortlink:${slug}` },
      create: {
        key: `shortlink:${slug}`,
        value: JSON.stringify({
          slug,
          targetUrl: formattedUrl,
          title: title || slug,
        }),
      },
      update: {
        value: JSON.stringify({
          slug,
          targetUrl: formattedUrl,
          title: title || slug,
        }),
      },
    });

    revalidatePath("/admin/tools");
    return { success: true, slug, url: `/s/${slug}` };
  } catch (error) {
    console.error("Error creating short link:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create short link.",
    };
  }
}

/**
 * Delete a shortened link
 */
export async function deleteShortLink(slug: string) {
  try {
    const existing = await getShortLinks();
    const updated = existing.filter((item) => item.slug !== slug);

    await db.setting.upsert({
      where: { key: SETTINGS_KEY },
      create: {
        key: SETTINGS_KEY,
        value: JSON.stringify(updated),
      },
      update: {
        value: JSON.stringify(updated),
      },
    });

    try {
      await db.setting.delete({
        where: { key: `shortlink:${slug}` },
      });
    } catch {
      // Ignore if key was already absent
    }

    revalidatePath("/admin/tools");
    return { success: true };
  } catch (error) {
    console.error("Error deleting short link:", error);
    return { success: false, error: "Failed to delete short link." };
  }
}
