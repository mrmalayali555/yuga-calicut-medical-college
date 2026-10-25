"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import type { SiteTheme } from "@/lib/queries";

/** Save a rich page's JSON content (about / ug / pg). */
/** Save a rich page's JSON content (about / ug / pg). */
export async function savePage(key: string, formData: FormData) {
  try {
    await requireAdmin();
    const title = String(formData.get("title") || "").trim();

    let content: Record<string, string> = {};
    if (key === "about") {
      content = {
        history: String(formData.get("history") || "").trim(),
        mission: String(formData.get("mission") || "").trim(),
        vision: String(formData.get("vision") || "").trim(),
        chairperson: String(formData.get("chairperson") || "").trim(),
        generalSecretary: String(formData.get("generalSecretary") || "").trim(),
      };
    } else {
      content = { intro: String(formData.get("intro") || "").trim() };
    }

    await db.page.upsert({
      where: { key },
      update: { title, content: JSON.stringify(content) },
      create: { key, title, content: JSON.stringify(content) },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${key === "about" ? "about" : key}`);
    revalidatePath("/");
  } catch (err) {
    console.warn(`Could not save page ${key}:`, err);
  }
}

/** Save a key-value setting (hero, contact, stats, socials). */
export async function saveSetting(key: string, value: Record<string, unknown>) {
  try {
    await requireAdmin();
    await db.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  } catch (err) {
    console.warn(`Could not save setting ${key} to DB:`, err);
  }
}

/** Set site active theme (emerald | obsidian-crimson). */
export async function setSiteThemeAction(theme: SiteTheme) {
  await requireAdmin();
  const validTheme: SiteTheme = theme === "obsidian-crimson" ? "obsidian-crimson" : "emerald";

  try {
    await db.setting.upsert({
      where: { key: "theme" },
      update: { value: JSON.stringify({ active: validTheme }) },
      create: { key: "theme", value: JSON.stringify({ active: validTheme }) },
    });
  } catch (err) {
    console.warn("Notice: could not save theme setting to DB (using cookie):", err);
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set("yuga_theme", validTheme, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  } catch {}

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true, theme: validTheme };
}

export async function saveSettingsForm(formData: FormData) {
  try {
    await requireAdmin();

    const hero = {
      badge: String(formData.get("hero_badge") || "").trim(),
      title: String(formData.get("hero_title") || "").trim(),
      subtitle: String(formData.get("hero_subtitle") || "").trim(),
    };
    const identity = {
      unionName: String(formData.get("union_name") || "").trim(),
      unionMalayalam: String(formData.get("union_malayalam") || "").trim(),
      collegeName: String(formData.get("college_name") || "").trim(),
      academicYear: String(formData.get("academic_year") || "").trim(),
      tagline: String(formData.get("tagline") || "").trim(),
    };
    const contact = {
      address: String(formData.get("contact_address") || "").trim(),
      phone: String(formData.get("contact_phone") || "").trim(),
      emergencyPhone: String(formData.get("contact_emergency_phone") || "").trim(),
      email: String(formData.get("contact_email") || "").trim(),
    };
    const stats = {
      students: Number(formData.get("stats_students") || 0),
      events: Number(formData.get("stats_events") || 0),
      achievements: Number(formData.get("stats_achievements") || 0),
      committees: Number(formData.get("stats_committees") || 0),
    };
    const socials = {
      instagram: String(formData.get("social_instagram") || "").trim(),
      youtube: String(formData.get("social_youtube") || "").trim(),
      whatsapp: String(formData.get("social_whatsapp") || "").trim(),
      telegram: String(formData.get("social_telegram") || "").trim(),
    };
    const navSearch = {
      showMobile: formData.get("search_show_mobile") === "on",
      showDesktop: formData.get("search_show_desktop") === "on",
    };

    const activeThemeRaw = formData.get("active_theme");
    const promises: Promise<unknown>[] = [
      saveSetting("hero", hero),
      saveSetting("identity", identity),
      saveSetting("contact", contact),
      saveSetting("stats", stats),
      saveSetting("socials", socials),
      saveSetting("nav_search", navSearch),
    ];

    if (activeThemeRaw) {
      const activeTheme: SiteTheme = activeThemeRaw === "obsidian-crimson" ? "obsidian-crimson" : "emerald";
      try {
        const cookieStore = await cookies();
        cookieStore.set("yuga_theme", activeTheme, { path: "/", maxAge: 31536000, sameSite: "lax" });
      } catch {}

      promises.push(
        db.setting.upsert({
          where: { key: "theme" },
          update: { value: JSON.stringify({ active: activeTheme }) },
          create: { key: "theme", value: JSON.stringify({ active: activeTheme }) },
        }).catch((err) => {
          console.warn("Could not save theme to DB:", err);
        })
      );
    }

    await Promise.all(promises);

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
  } catch (err) {
    console.error("Error in saveSettingsForm:", err);
  }
}

