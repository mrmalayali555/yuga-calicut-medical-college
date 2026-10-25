import { Hero } from "@/components/home/hero";
import { QuickPortals } from "@/components/home/quick-portals";
import { EventShowcase } from "@/components/home/event-showcase";
import { CircularsFeed } from "@/components/home/circulars-feed";
import { AchievementsShowcase } from "@/components/home/achievements-showcase";
import { HeritageMonument3D } from "@/components/home/heritage-monument-3d";
import { LeadershipSection } from "@/components/home/leadership-section";
import { EmergencyStrip } from "@/components/home/emergency-strip";
import { CampusVoiceCTA } from "@/components/home/campus-voice-cta";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ensureInitialEvents } from "@/lib/initial-sync";
import { getNotifications, getAchievements, getAchievementsSliderSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  await ensureInitialEvents();

  // Check if there is an active upcoming event in DB with a linked registration form
  let dbFeaturedEvent = null;
  let dbRestEvents = null;

  try {
    let event = await db.event.findFirst({
      where: {
        status: "upcoming",
        published: true,
        registrationForm: { isNot: null },
      },
      orderBy: { date: "asc" },
      include: {
        registrationForm: {
          include: {
            _count: { select: { fields: true } },
          },
        },
      },
    });

    if (!event) {
      event = await db.event.findFirst({
        where: { status: "upcoming", published: true },
        orderBy: { date: "asc" },
        include: {
          registrationForm: {
            include: {
              _count: { select: { fields: true } },
            },
          },
        },
      });
    }

    if (event) {
      dbFeaturedEvent = {
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        date: formatDate(event.date),
        time: event.time,
        venue: event.venue,
        fieldsCount: event.registrationForm?._count?.fields ?? 0,
      };
    }

    const otherEvents = await db.event.findMany({
      where: {
        published: true,
        ...(event ? { id: { not: event.id } } : {}),
      },
      orderBy: { date: "asc" },
      take: 3,
    });

    if (otherEvents.length > 0) {
      dbRestEvents = otherEvents.map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        description: e.description,
        date: formatDate(e.date),
        time: e.time,
        venue: e.venue,
      }));
    }
  } catch (e) {
    // Graceful fallback to static/mock
    dbFeaturedEvent = null;
    dbRestEvents = null;
  }

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
  let sliderSettings = { autoplay: true, interval: 3 };
  try {
    const [achievementsRes, settingsRes] = await Promise.all([
      getAchievements({ take: 6 }),
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

      {/* 3. Featured Event Pass & Fest Spotlight with Ovio Ticket */}
      <EventShowcase dbFeaturedEvent={dbFeaturedEvent} dbRestEvents={dbRestEvents} />

      {/* 4. Official Circulars & Notices Feed */}
      <CircularsFeed initialCirculars={dbCirculars} />

      {/* 5. Calicut Medicos Hall of Fame */}
      <AchievementsShowcase initialAchievements={dbAchievements} sliderSettings={sliderSettings} />

      {/* 6. Interactive 3D Heritage Monument (Tenshu Growth Study) */}
      <HeritageMonument3D />

      {/* 7. Executive Council Leadership */}
      <LeadershipSection />

      {/* 8. Emergency Hospital & Casualty Hotline Strip */}
      <EmergencyStrip />

      {/* 9. Campus Voice Student Grievance Desk */}
      <CampusVoiceCTA />
    </>
  );
}
