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

export const INITIAL_YUGA_INTERVENTIONS = [
  {
    title: "Representation regarding early publication of Final-year MBBS results",
    slug: "representation-regarding-early-publication-of-final-year-mbbs-results",
    category: "Academic & Welfare",
    description: "The College Union '26, has submitted representations to KUHS and the Directorate of Medical Education seeking early evaluation and publication of the Final-Year MBBS results to facilitate timely registration and internship formalities.\n\nThe Union has also requested early commencement of House Surgency and interim deployment of NAJRs to ensure adequate resident manpower and a smooth transition between the outgoing and incoming batches, thereby maintaining uninterrupted patient care.",
    date: new Date("2026-09-07T18:30:00.000Z"),
    image: "https://tokr4sc45vjvffrx.public.blob.vercel-storage.com/1793030060998-2eb356d4.jpg",
    pinned: true,
  },
  {
    title: "Representation regarding the delay in E Grantz Scholarship",
    slug: "representation-regarding-the-delay-in-e-grantz-scholarship",
    category: "Scholarships & Welfare",
    description: "The Union has informed the Principal of the issue of delay in E Grantz Scholarship regarding mess refund for SC/ST students and Tuition fee refund for OBC students and that if the issue is not resolved immediately, protesting measures will be taken. Following the Representation, the Principal has given the assurance to take the needed measures.",
    date: new Date("2026-09-07T18:30:00.000Z"),
    image: "https://tokr4sc45vjvffrx.public.blob.vercel-storage.com/1793030082533-b0fcc17d.jpg",
    pinned: true,
  },
  {
    title: "Representation regarding the proposed increase in working hours of JRs under the DRP",
    slug: "representation-regarding-the-proposed-increase-in-working-hours-of-jrs-under-the-drp",
    category: "Resident Welfare",
    description: "The College Union submitted a representation to the Deputy Superintendent, GGH Kozhikode, highlighting concerns regarding the proposed increase in working hours of Junior Residents under the DRP. The representation requested reconsideration of the proposed arrangement, considering the additional workload it may place on residents.",
    date: new Date("2026-08-30T18:30:00.000Z"),
    image: "https://tokr4sc45vjvffrx.public.blob.vercel-storage.com/1793030255714-6183f0b9.jpg",
    pinned: true,
  },
  {
    title: "Representation regarding Hostel Library & 24/7 Study Room Facility",
    slug: "representation-hostel-library-247-study-room",
    category: "Infrastructure",
    description: "The Union submitted a formal representation to the Principal requesting the installation of air conditioning and 24/7 lighting/Wi-Fi access in the Men's and Women's hostel reading rooms prior to university exams.",
    date: new Date("2026-10-22T09:30:56.984Z"),
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    pinned: false,
  },
  {
    title: "Request for Immediate Repair of OPD Block Elevator & Ramp Access",
    slug: "request-opd-elevator-ramp-repair",
    category: "Campus Safety",
    description: "Official letter submitted to the Medical Superintendent highlighting difficulties faced by wheel-chair bound patients and clinical postings students due to non-functioning elevators.",
    date: new Date("2026-10-14T09:30:56.984Z"),
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    pinned: false,
  },
  {
    title: "Memorandum on Stipend Disbursal Schedule for PG Residents & House Surgeons",
    slug: "memorandum-stipend-disbursal-schedule",
    category: "Academic & Welfare",
    description: "Official petition addressed to the Directorate of Medical Education (DME) ensuring timely monthly credit of stipends for senior and junior resident doctors.",
    date: new Date("2026-10-01T09:30:56.984Z"),
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    pinned: false,
  },
];

export async function ensureInitialInterventions() {
  try {
    const syncSetting = await db.setting.findUnique({
      where: { key: "yuga_initial_interventions_synced" },
    }).catch(() => null);

    if (syncSetting?.value === "true") {
      return;
    }

    for (const item of INITIAL_YUGA_INTERVENTIONS) {
      await db.intervention.upsert({
        where: { slug: item.slug },
        update: {},
        create: {
          title: item.title,
          slug: item.slug,
          category: item.category,
          description: item.description,
          date: item.date,
          image: item.image,
          pinned: item.pinned,
          published: true,
        },
      });
    }

    await db.setting.upsert({
      where: { key: "yuga_initial_interventions_synced" },
      update: { value: "true" },
      create: { key: "yuga_initial_interventions_synced", value: "true" },
    });
  } catch (err) {
    // Graceful fallback
  }
}

export const INITIAL_YUGA_NOTIFICATIONS: any[] = [];

export async function ensureInitialNotifications() {
  // Hardcoded initial notices disabled
  return;
}

