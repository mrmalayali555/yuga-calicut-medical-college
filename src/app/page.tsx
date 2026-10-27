import { Hero } from "@/components/home/hero";
import { QuickPortals } from "@/components/home/quick-portals";
import { CircularsFeed } from "@/components/home/circulars-feed";
import { AchievementsShowcase } from "@/components/home/achievements-showcase";
import { LeadershipSection } from "@/components/home/leadership-section";
import { EmergencyStrip } from "@/components/home/emergency-strip";
import { CampusVoiceCTA } from "@/components/home/campus-voice-cta";
import { db } from "@/lib/db";
import { ensureInitialEvents } from "@/lib/initial-sync";
import { getNotifications, getAchievements, getAchievementsSliderSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  await ensureInitialEvents();

  let heroCard = null;
  try {
    const row = await db.setting.findUnique({ where: { key: "hero_card" } });
    if (row?.value) {
      heroCard = JSON.parse(row.value);
    }
  } catch {
    heroCard = null;
  }

  let dbCirculars: any[] = [];
  try {
    dbCirculars = await getNotifications(4);
  } catch {
    dbCirculars = [];
  }

  let dbAchievements: any[] = [];
  let sliderSettings = { autoplay: true, interval: 4 };
  try {
    const [achievementsRes, settingsRes] = await Promise.all([
      getAchievements({ take: 12 }),
      getAchievementsSliderSettings(),
    ]);
    dbAchievements = achievementsRes;
    sliderSettings = settingsRes;
  } catch (err) {
    console.warn("Could not fetch achievements or slider settings:", err);
  }

  return (
    <>
      {/* 1. Hero with Live Metrics & Announcement Marquee */}
      <Hero heroCard={heroCard} />

      {/* 2. Bento Portals to Core Modules */}
      <QuickPortals />

      {/* 3. Official Circulars & Notices Feed */}
      <CircularsFeed initialCirculars={dbCirculars} />

      {/* 4. Calicut Medicos Hall of Fame */}
      <AchievementsShowcase initialAchievements={dbAchievements} sliderSettings={sliderSettings} />

      {/* 5. Executive Council Leadership */}
      <LeadershipSection />

      {/* 6. Emergency Hospital & Casualty Hotline Strip */}
      <EmergencyStrip />

      {/* 7. Campus Voice Student Grievance Desk */}
      <CampusVoiceCTA />
    </>
  );
}

