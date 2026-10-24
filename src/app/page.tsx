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

export default async function HomePage() {
  // Check if there is an active upcoming event in DB with a linked registration form
  let dbFeaturedEvent = null;
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
  } catch (e) {
    // Graceful fallback to static/mock
    dbFeaturedEvent = null;
  }

  return (
    <>
      {/* 1. Hero with Live Metrics & Announcement Marquee */}
      <Hero />

      {/* 2. Bento Portals to Core Modules */}
      <QuickPortals />

      {/* 3. Featured Event Pass & Fest Spotlight with Ovio Ticket */}
      <EventShowcase dbFeaturedEvent={dbFeaturedEvent} />

      {/* 4. Official Circulars & Notices Feed */}
      <CircularsFeed />

      {/* 5. Calicut Medicos Hall of Fame */}
      <AchievementsShowcase />

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
