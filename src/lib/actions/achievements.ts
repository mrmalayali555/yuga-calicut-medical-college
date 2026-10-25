"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "achievement";
  let slug = root;
  let i = 1;
  while (true) {
    const existing = await db.achievement.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) break;
    slug = `${root}-${i++}`;
  }
  return slug;
}

function parse(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    category: String(formData.get("category") || "general"),
    description: String(formData.get("description") || "").trim(),
    date: new Date(String(formData.get("date") || Date.now())),
    coverImage: String(formData.get("coverImage") || "").trim() || null,
    awardWinner: String(formData.get("awardWinner") || "").trim() || null,
    published: formData.get("published") ? true : false,
  };
}

export async function createAchievement(formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  if (!data.title) return;
  const slug = await uniqueSlug(data.title);
  await db.achievement.create({ data: { ...data, slug } });
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath("/");
  redirect("/admin/achievements");
}

export async function updateAchievement(id: string, formData: FormData) {
  await requireAdmin();
  const data = parse(formData);
  const slug = await uniqueSlug(data.title, id);
  await db.achievement.update({ where: { id }, data: { ...data, slug } });
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  revalidatePath(`/achievements/${slug}`);
  revalidatePath("/");
  redirect("/admin/achievements");
}

export async function deleteAchievement(id: string) {
  await requireAdmin();
  const existing = await db.achievement.findUnique({ where: { id }, select: { slug: true } });
  await db.achievement.delete({ where: { id } });
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  if (existing?.slug) {
    revalidatePath(`/achievements/${existing.slug}`);
  }
  revalidatePath("/");
  redirect("/admin/achievements");
}

export async function updateAchievementsSliderAction(data: { autoplay: boolean; interval: number }) {
  await requireAdmin();
  let interval = Number(data.interval);
  if (isNaN(interval) || interval < 2) interval = 2;
  if (interval > 30) interval = 30;
  const autoplay = Boolean(data.autoplay);

  await db.setting.upsert({
    where: { key: "achievements_slider" },
    update: { value: JSON.stringify({ autoplay, interval }) },
    create: { key: "achievements_slider", value: JSON.stringify({ autoplay, interval }) },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/achievements");
  return { success: true, autoplay, interval };
}

export async function saveAchievementsSliderForm(formData: FormData) {
  await requireAdmin();
  const autoplay = formData.get("achievements_autoplay") === "on" || formData.get("autoplay") === "true";
  let interval = Number(formData.get("achievements_interval") || formData.get("interval") || 3);
  if (isNaN(interval) || interval < 2) interval = 2;
  if (interval > 30) interval = 30;

  await db.setting.upsert({
    where: { key: "achievements_slider" },
    update: { value: JSON.stringify({ autoplay, interval }) },
    create: { key: "achievements_slider", value: JSON.stringify({ autoplay, interval }) },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/achievements");
}
