import { db } from "@/lib/db";

export const INITIAL_YUGA_EVENTS = [
  {
    title: "YUGA Arts Fest 2026 — Rhythms of GMC",
    slug: "yuga-arts-fest",
    description:
      "Annual inter-batch cultural battle across 42 competitive disciplines including music, dance, literary arts, and theatrical performances.",
    date: new Date("2026-10-24T09:00:00.000Z"),
    time: "9:00 AM onwards",
    venue: "Main Auditorium & Open Air Stage",
    status: "upcoming",
    poster:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Calicut Medicos Premier League (CMPL VIII)",
    slug: "calicut-medicos-premier-league",
    description:
      "Under-floodlights night cricket tournament with 12 franchise batches competing for the coveted Calicut Medicos Cup.",
    date: new Date("2026-11-03T17:00:00.000Z"),
    time: "5:00 PM – 11:00 PM",
    venue: "GMC Stadium Ground",
    status: "live",
    poster:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Caduceus Acoustic Night & Unplugged Jam",
    slug: "caduceus-music-night",
    description:
      "Soulful musical journey curated by the GMC Fine Arts Club featuring indie melodies, violin overtures, and acoustic medleys.",
    date: new Date("2026-11-12T18:30:00.000Z"),
    time: "6:30 PM",
    venue: "OAT Amphitheatre",
    status: "upcoming",
    poster:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Mega Voluntary Blood Donation Drive",
    slug: "blood-donation-camp",
    description:
      "Organised in association with CMC Blood Bank & Red Cross. Every donor counts — be a lifesaver for patients across North Kerala.",
    date: new Date("2026-10-14T09:00:00.000Z"),
    time: "9:00 AM – 1:00 PM",
    venue: "OPD Complex Ground Floor",
    status: "completed",
    poster:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80",
  },
];

export const INITIAL_YUGA_ACHIEVEMENTS = [
  {
    title: "Overall Champions — KUHS Inter-Zone Arts Festival 2026",
    slug: "kuhs-arts-champions",
    category: "arts",
    awardWinner: "Calicut Medicos Arts Contingent (All Batches)",
    description:
      "Lifted the prestigious Ever-Rolling Golden Trophy for the 4th consecutive year with 18 first prizes across competitive disciplines.",
    date: new Date("2026-09-15T10:00:00.000Z"),
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "State Inter-Medical Football Championship Winners",
    slug: "intermed-football-trophy",
    category: "sports",
    awardWinner: "CMC Kozhikode Football Team (UG & PG)",
    description:
      "Defeated the tournament hosts 3-1 in a nail-biting final under floodlights to secure the championship trophy.",
    date: new Date("2026-08-20T16:00:00.000Z"),
    coverImage:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "14 ICMR Short-Term Studentship (STS) Research Awards",
    slug: "icmr-sts-grants",
    category: "academics",
    awardWinner: "Undergraduate Scholars (MBBS Phase 2 & 3)",
    description:
      "Highest number of ICMR research grants bagged by any single medical institution in Kerala for student-led biomedical inquiries.",
    date: new Date("2026-07-10T11:00:00.000Z"),
    coverImage:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "First Prize — National Pharmacology Conclave Quiz",
    slug: "national-quiz-gold",
    category: "academics",
    awardWinner: "Dr. Rohith Krishna & Dr. Sneha Paul (Final MBBS)",
    description:
      "Secured top position competing against 64 premier medical colleges across India in clinical therapeutics and pharmacology.",
    date: new Date("2026-06-18T14:00:00.000Z"),
    coverImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  },
];

export async function ensureInitialEvents() {
  try {
    const syncSetting = await db.setting.findUnique({
      where: { key: "yuga_initial_events_synced" },
    }).catch(() => null);

    if (syncSetting?.value === "true") {
      return;
    }

    // Clean up any legacy template placeholder slugs if present
    await db.event
      .deleteMany({
        where: {
          slug: { in: ["advaya-arts-fest", "advaya-sports-meet", "advaya-music-night"] },
        },
      })
      .catch(() => {});

    for (const e of INITIAL_YUGA_EVENTS) {
      await db.event.upsert({
        where: { slug: e.slug },
        update: {},
        create: {
          title: e.title,
          slug: e.slug,
          description: e.description,
          date: e.date,
          time: e.time,
          venue: e.venue,
          status: e.status,
          poster: e.poster,
          published: true,
        },
      });
    }

    await db.setting.upsert({
      where: { key: "yuga_initial_events_synced" },
      update: { value: "true" },
      create: { key: "yuga_initial_events_synced", value: "true" },
    });
  } catch (err) {
    // Graceful fallback if database is currently unreachable
  }
}

export async function ensureInitialAchievements() {
  try {
    const syncSetting = await db.setting.findUnique({
      where: { key: "yuga_initial_achievements_synced" },
    }).catch(() => null);

    if (syncSetting?.value === "true") {
      return;
    }

    for (const a of INITIAL_YUGA_ACHIEVEMENTS) {
      await db.achievement.upsert({
        where: { slug: a.slug },
        update: {},
        create: {
          title: a.title,
          slug: a.slug,
          category: a.category,
          awardWinner: a.awardWinner,
          description: a.description,
          date: a.date,
          coverImage: a.coverImage,
          published: true,
        },
      });
    }

    await db.setting.upsert({
      where: { key: "yuga_initial_achievements_synced" },
      update: { value: "true" },
      create: { key: "yuga_initial_achievements_synced", value: "true" },
    });
  } catch (err) {
    // Graceful fallback
  }
}
