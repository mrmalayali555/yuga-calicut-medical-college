import "server-only";
import { db } from "./db";
import {
  EVENTS,
  CIRCULARS,
  ACHIEVEMENTS,
  INTERVENTIONS,
  EMERGENCY_CONTACTS,
} from "./data";
import { SITE, COLLEGE, YUGA } from "./site";

/** Safely parse a JSON settings/page string. */
function parseJSON<T>(value: string | undefined | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await db.setting.findUnique({ where: { key } });
    return parseJSON<T>(row?.value, fallback);
  } catch {
    return fallback;
  }
}

export type SiteTheme = "emerald" | "obsidian-crimson";

export async function getActiveTheme(): Promise<SiteTheme> {
  const themeSetting = await getSetting<{ active: SiteTheme }>("theme", { active: "obsidian-crimson" });
  return themeSetting?.active === "emerald" ? "emerald" : "obsidian-crimson";
}


export async function getPage(key: string) {
  try {
    const page = await db.page.findUnique({ where: { key } });
    if (!page) return null;
    return { ...page, data: parseJSON<Record<string, unknown>>(page.content, {}) };
  } catch {
    return null;
  }
}

export async function getMarquee() {
  try {
    const [m, speedSetting] = await Promise.all([
      db.marquee.findFirst({ orderBy: { updatedAt: "desc" } }),
      db.setting.findUnique({ where: { key: "marquee_speed" } }),
    ]);
    if (!m?.enabled) return null;
    return {
      ...m,
      speed: speedSetting ? parseInt(speedSetting.value) || 8 : 8,
    };
  } catch {
    return null;
  }
}

// --- Achievements ---
export async function getAchievements(opts?: { category?: string; take?: number }) {
  await ensureInitialAchievements();
  try {
    const dbAchievements = await db.achievement.findMany({
      where: {
        published: true,
        ...(opts?.category && opts.category !== "all"
          ? { category: opts.category }
          : {}),
      },
      orderBy: { date: "desc" },
      take: opts?.take,
      include: { media: { orderBy: { order: "asc" } } },
    });
    const totalCount = await db.achievement.count();
    if (totalCount > 0) return dbAchievements;
  } catch (err) {
    console.error("Error querying achievements from db:", err);
  }

  // Fallback to mock data
  let list = ACHIEVEMENTS.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.id,
    category: a.category,
    description: a.description,
    date: new Date(a.date),
    coverImage: null as string | null,
    awardWinner: `${a.recipient} (${a.batch})`,
    published: true,
    media: [] as { id: string; url: string; type: string; caption: string | null; order: number }[],
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  if (opts?.category && opts.category !== "all") {
    list = list.filter((a) => a.category === opts.category);
  }
  if (opts?.take) {
    list = list.slice(0, opts.take);
  }
  return list;
}

export async function getAchievement(slug: string) {
  try {
    const item = await db.achievement.findUnique({
      where: { slug },
      include: { media: { orderBy: { order: "asc" } } },
    });
    if (item) return item;
  } catch (err) {
    console.error("Error querying achievement:", err);
  }

  const mock = ACHIEVEMENTS.find((a) => a.id === slug);
  if (!mock) return null;

  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    category: mock.category,
    description: mock.description,
    date: new Date(mock.date),
    coverImage: null as string | null,
    awardWinner: `${mock.recipient} (${mock.batch})`,
    published: true,
    media: [] as { id: string; url: string; type: string; caption: string | null; order: number }[],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// --- Events ---
import { ensureInitialEvents, ensureInitialAchievements } from "@/lib/initial-sync";

export async function getEvents(opts?: { status?: string; take?: number }) {
  await ensureInitialEvents();
  try {
    const dbEvents = await db.event.findMany({
      where: {
        published: true,
        ...(opts?.status && opts.status !== "all" ? { status: opts.status } : {}),
      },
      orderBy: { date: opts?.status === "completed" ? "desc" : "asc" },
      take: opts?.take,
      include: {
        media: { orderBy: { order: "asc" } },
        attachments: true,
        gallery: { include: { photos: { orderBy: { position: "asc" } } } },
        committee: { select: { id: true, name: true, slug: true } },
        committees: { select: { id: true, name: true, slug: true } },
        registrationForm: { select: { id: true, title: true, slug: true, published: true, deadline: true } },
      },
    });
    const totalCount = await db.event.count();
    if (totalCount > 0) return dbEvents;
  } catch (err) {
    console.error("Error querying events from db:", err);
  }

  // Fallback to mock data
  let list = EVENTS.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.id,
    description: e.subtitle,
    date: new Date(e.date.split("–")[0].trim() || Date.now()),
    endDate: null as Date | null,
    time: e.time,
    venue: e.venue,
    poster: null as string | null,
    status: e.status,
    published: true,
    committeeId: null as string | null,
    committee: null as { id: string; name: string; slug: string } | null,
    committees: [] as { id: string; name: string; slug: string }[],
    media: [] as { id: string; url: string; type: string; caption: string | null; order: number }[],
    attachments: [] as { id: string; name: string; url: string }[],
    gallery: null as any,
    registrationForm: e.registrationOpen
      ? { id: `form-${e.id}`, title: e.title, slug: e.id, published: true, deadline: null }
      : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  if (opts?.status && opts.status !== "all") {
    list = list.filter((e) => e.status === opts.status);
  }
  if (opts?.take) {
    list = list.slice(0, opts.take);
  }
  return list;
}

export async function getUpcomingEvents(take = 3) {
  return getEvents({ status: "upcoming", take });
}

export async function getEvent(slug: string) {
  try {
    const item = await db.event.findUnique({
      where: { slug },
      include: {
        media: { orderBy: { order: "asc" } },
        attachments: true,
        gallery: { include: { photos: { orderBy: { position: "asc" } } } },
        registrationForm: true,
        committee: { select: { id: true, name: true, slug: true } },
        committees: { select: { id: true, name: true, slug: true } },
      },
    });
    if (item) return item;
  } catch (err) {
    console.error("Error querying event:", err);
  }

  const mock = EVENTS.find((e) => e.id === slug || e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(slug));
  if (!mock) return null;

  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    description: `${mock.subtitle}\n\nOrganized by the YUGA College Union 2026-2027 at Government Medical College Kozhikode. This premier event invites medicos, delegates, and campus enthusiasts to join together for an unforgettable experience.`,
    date: new Date(mock.date.split("–")[0].trim() || Date.now()),
    endDate: null as Date | null,
    time: mock.time,
    venue: mock.venue,
    poster: null as string | null,
    status: mock.status,
    published: true,
    committeeId: null as string | null,
    committee: { id: "c-arts", name: "Arts & Cultural Wing", slug: "arts" },
    committees: [{ id: "c-arts", name: "Arts & Cultural Wing", slug: "arts" }],
    media: [] as { id: string; url: string; type: string; caption: string | null; order: number }[],
    attachments: [
      { id: "att-brochure", name: "Official Event Brochure & Guidelines (PDF)", url: "#" },
    ],
    gallery: null as any,
    registrationForm: mock.registrationOpen
      ? {
          id: `form-${mock.id}`,
          title: mock.title,
          slug: mock.id,
          published: true,
          deadline: null,
          description: "Online delegate enrollment and event entry ticket confirmation.",
        }
      : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// --- Notifications ---
export async function getNotifications(take?: number) {
  try {
    const dbNotifs = await db.notification.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      take,
    });
    if (dbNotifs.length > 0) return dbNotifs;
  } catch (err) {
    console.error("Error querying notifications:", err);
  }

  let list = CIRCULARS.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.id,
    description: c.summary,
    date: new Date(c.date),
    image: null as string | null,
    pdfUrl: "#",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  if (take) list = list.slice(0, take);
  return list;
}

export async function getNotification(slug: string) {
  try {
    const item = await db.notification.findUnique({
      where: { slug },
    });
    if (item) return item;
  } catch (err) {
    console.error("Error querying notification:", err);
  }

  const mock = CIRCULARS.find((c) => c.id === slug);
  if (!mock) return null;

  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    description: `${mock.summary}\n\nIssued by the Office of the General Secretary, YUGA College Union 2026-2027, Government Medical College Kozhikode for wide circulation among students and faculty members.`,
    date: new Date(mock.date),
    image: null as string | null,
    pdfUrl: "#",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// --- Interventions ---
export async function getInterventions(take?: number) {
  try {
    const dbItems = await db.intervention.findMany({
      where: { published: true },
      orderBy: [{ pinned: "desc" }, { date: "desc" }],
      take,
    });
    if (dbItems.length > 0) return dbItems;
  } catch (err) {
    console.error("Error querying interventions:", err);
  }

  let list = INTERVENTIONS.map((i) => ({
    id: i.id,
    title: i.title,
    slug: i.id,
    description: i.description,
    date: new Date(i.date),
    image: null as string | null,
    pdfUrl: "#",
    category: i.category,
    pinned: i.status === "Resolved",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  if (take) list = list.slice(0, take);
  return list;
}

export async function getIntervention(slug: string) {
  try {
    const item = await db.intervention.findUnique({
      where: { slug },
    });
    if (item) return item;
  } catch (err) {
    console.error("Error querying intervention:", err);
  }

  const mock = INTERVENTIONS.find((i) => i.id === slug);
  if (!mock) return null;

  return {
    id: mock.id,
    title: mock.title,
    slug: mock.id,
    description: `${mock.description}\n\nSubmitted to: ${mock.authority}\nStatus: ${mock.status}\nOutcome: ${mock.outcome || "In active representation and follow-up."}`,
    date: new Date(mock.date),
    image: null as string | null,
    pdfUrl: "#",
    category: mock.category,
    pinned: mock.status === "Resolved",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// --- Emergency Contacts ---
export async function getEmergencyContacts() {
  try {
    const dbContacts = await db.emergencyContact.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    if (dbContacts.length > 0) return dbContacts;
  } catch (err) {
    console.error("Error querying emergency contacts:", err);
  }

  return EMERGENCY_CONTACTS.map((e, idx) => ({
    id: e.id,
    category: e.department.includes("Casualty") || e.department.includes("IMCH") ? "Hospital" : e.department.includes("Ambulance") ? "Ambulance" : e.department.includes("Blood") ? "Blood Bank" : "Campus Safety",
    name: e.title,
    phone: e.phone,
    description: e.available,
    order: idx,
    active: true,
    showOnHomepage: Boolean(e.primary),
  }));
}

// --- Committees / Clubs ---
export async function getCommittees() {
  try {
    const dbCommittees = await db.committee.findMany({
      orderBy: { order: "asc" },
      include: {
        members: { orderBy: { order: "asc" } },
      },
    });
    if (dbCommittees.length > 0) return dbCommittees;
  } catch (err) {
    console.error("Error querying committees:", err);
  }

  return [
    {
      id: "arts-club",
      name: "Arts & Cultural Wing",
      slug: "arts",
      description: "Nurturing creative expression, musical nights, dramatics, literary summits, and inter-collegiate arts fest championships.",
      order: 1,
      createdAt: new Date(),
      members: [
        { id: "m1", committeeId: "arts-club", name: "Arjun Radhakrishnan", position: "Arts Secretary", photo: null, contact: "+91 94471 22334", order: 1 },
        { id: "m2", committeeId: "arts-club", name: "Ananya S. Kumar", position: "Joint Secretary (Arts)", photo: null, contact: "+91 98950 11223", order: 2 },
      ],
    },
    {
      id: "sports-club",
      name: "Sports & Athletics Association",
      slug: "sports",
      description: "Driving the Calicut Medicos Premier League (CMPL), inter-batch football, basketball, badminton, and athletics meets.",
      order: 2,
      createdAt: new Date(),
      members: [
        { id: "m3", committeeId: "sports-club", name: "Mohammed Farhan", position: "General Sports Captain", photo: null, contact: "+91 94472 33445", order: 1 },
        { id: "m4", committeeId: "sports-club", name: "Diya Mariam", position: "Athletics Convenor", photo: null, contact: "+91 94473 44556", order: 2 },
      ],
    },
    {
      id: "academic-council",
      name: "Academic & Research Conclave",
      slug: "academic",
      description: "Undergraduate research facilitation, MedEx journal clubs, clinical case study groups, and KUHS exam orientation wings.",
      order: 3,
      createdAt: new Date(),
      members: [
        { id: "m5", committeeId: "academic-council", name: "Dr. Siddharth Menon", position: "Academic Secretary", photo: null, contact: "+91 94474 55667", order: 1 },
      ],
    },
    {
      id: "social-welfare",
      name: "Social Service & Blood Donation Wing",
      slug: "social-service",
      description: "Round-the-clock voluntary blood donor coordination, flood relief, disaster response, and campus health camps across Malabar.",
      order: 4,
      createdAt: new Date(),
      members: [
        { id: "m6", committeeId: "social-welfare", name: "Nandana V.", position: "Social Service Convenor", photo: null, contact: "+91 94475 66778", order: 1 },
      ],
    },
  ];
}

export async function getCommittee(slug: string) {
  try {
    const item = await db.committee.findUnique({
      where: { slug },
      include: {
        members: { orderBy: { order: "asc" } },
      },
    });
    if (item) return item;
  } catch (err) {
    console.error("Error querying committee:", err);
  }

  const list = await getCommittees();
  return list.find((c) => c.slug === slug) || null;
}

export async function getCommitteeEvents(committeeId: string) {
  try {
    return await db.event.findMany({
      where: {
        published: true,
        OR: [
          { committeeId },
          { committees: { some: { id: committeeId } } },
        ],
      },
      orderBy: { date: "desc" },
      include: {
        media: { orderBy: { order: "asc" } },
        attachments: true,
        committee: { select: { id: true, name: true, slug: true } },
        committees: { select: { id: true, name: true, slug: true } },
      },
    });
  } catch {
    return [];
  }
}

// --- Finance ---
export async function getFinanceEntries() {
  try {
    return await db.financeEntry.findMany({
      orderBy: { date: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getFinanceSummary() {
  const entries = await getFinanceEntries();
  const totalIncome = entries
    .filter((e) => e.kind === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenditure = entries
    .filter((e) => e.kind === "expenditure")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenditure;

  // Categories breakdown
  const categoryMap: Record<string, { income: number; expenditure: number }> = {};
  for (const e of entries) {
    if (!categoryMap[e.category]) {
      categoryMap[e.category] = { income: 0, expenditure: 0 };
    }
    if (e.kind === "income") {
      categoryMap[e.category].income += e.amount;
    } else {
      categoryMap[e.category].expenditure += e.amount;
    }
  }

  return {
    totalIncome,
    totalExpenditure,
    balance,
    entries,
    categories: Object.entries(categoryMap).map(([category, amounts]) => ({
      category,
      income: amounts.income,
      expenditure: amounts.expenditure,
    })),
  };
}

// --- Global Search ---
const STATIC_PAGES = [
  {
    title: "YUGA 2026-2027 — Official College Union Portal",
    href: "/",
    description: "Government Medical College Kozhikode student union digital headquarters.",
    keywords: "yuga calicut medicos gmc kozhikode medical college union home arts sports academic 2026 2027",
  },
  {
    title: "Events & Fests",
    href: "/events",
    description: "Browse flagship cultural events, CMPL sports tournaments, MedEx conclaves, and reserve tickets.",
    keywords: "events fests arts music dance sports cricket football cmpl registration passes tickets",
  },
  {
    title: "KUHS Academic Calendar",
    href: "/calendar",
    description: "University examinations, clinical postings, internal assessments, and clerkship schedules.",
    keywords: "calendar academic exam kuhs datesheet timetable postings batch mbbs intern pg schedule",
  },
  {
    title: "Laurels & Student Achievements",
    href: "/achievements",
    description: "Celebrating triumphs in national arts, university sports championships, and research honors.",
    keywords: "achievements laurels awards medals gold champions sports arts research papers winners",
  },
  {
    title: "Union Interventions & Representations",
    href: "/interventions",
    description: "Student rights representations, hostel infrastructural enhancements, and stipend schedule advocacy.",
    keywords: "interventions representations letters demand stipend hostel library rights students welfare",
  },
  {
    title: "24/7 Emergency & Casualty Directory",
    href: "/emergency",
    description: "GMC Kozhikode casualty desk, ambulance radio, IMCH labor room, blood centre, and campus security.",
    keywords: "emergency casualty ambulance blood bank hospital trauma imch police security 24/7 phone hotline",
  },
  {
    title: "Subcommittees & Student Clubs",
    href: "/subcommittees",
    description: "Clubs, student wings, organising teams, and executive office bearers.",
    keywords: "clubs subcommittees wings sports arts literary nature debate photography student council",
  },
  {
    title: "Campus Voice Grievance & Complaints",
    href: "/complaints",
    description: "Submit suggestions, academic grievances, or hostel feedback directly to the union.",
    keywords: "complaints grievance suggestions anonymous helpdesk report ragging hostel feedback issue",
  },
  {
    title: "Union Accounts & Transparent Finance",
    href: "/finance",
    description: "Public transparency ledger, union fund collections, event expenditure, and balance statements.",
    keywords: "finance accounts balance budget income expenditure audit transparency money ledger",
  },
  {
    title: "Official Contact Desk",
    href: "/contact",
    description: "Campus address, location maps, official phone numbers, and enquiry form.",
    keywords: "contact address phone email location directions google map office hours gmc calicut",
  },
  {
    title: "About YUGA & GMC Kozhikode",
    href: "/about",
    description: "Legacy of Calicut Medical College established in 1957, union constitution, and executive office.",
    keywords: "about history legacy 1957 constitution calicut medical college principal union",
  },
];

export async function searchAll(q: string) {
  const query = q.trim();
  if (!query) {
    return {
      pages: [],
      achievements: [],
      events: [],
      notifications: [],
      interventions: [],
      emergencyContacts: [],
      subcommittees: [],
    };
  }

  const contains = { contains: query };
  const lowerQ = query.toLowerCase();
  const qWords = lowerQ.split(/\s+/).filter(Boolean);

  const pages = STATIC_PAGES.filter((p) => {
    const text = `${p.title} ${p.description} ${p.keywords}`.toLowerCase();
    return qWords.every((w) => text.includes(w)) || text.includes(lowerQ);
  });

  try {
    const [
      achievements,
      events,
      notifications,
      interventions,
      emergencyContacts,
      subcommittees,
    ] = await Promise.all([
      db.achievement.findMany({
        where: {
          published: true,
          OR: [{ title: contains }, { description: contains }],
        },
        take: 8,
        orderBy: { date: "desc" },
      }),
      db.event.findMany({
        where: {
          published: true,
          OR: [
            { title: contains },
            { description: contains },
            { venue: contains },
          ],
        },
        take: 8,
        orderBy: { date: "desc" },
      }),
      db.notification.findMany({
        where: {
          published: true,
          OR: [{ title: contains }, { description: contains }],
        },
        take: 8,
        orderBy: { date: "desc" },
      }),
      db.intervention.findMany({
        where: {
          published: true,
          OR: [
            { title: contains },
            { description: contains },
          ],
        },
        take: 8,
        orderBy: { date: "desc" },
      }),
      db.emergencyContact.findMany({
        where: {
          active: true,
          OR: [
            { name: contains },
            { category: contains },
            { phone: contains },
          ],
        },
        take: 8,
        orderBy: { order: "asc" },
      }),
      db.committee.findMany({
        where: {
          OR: [{ name: contains }, { description: contains }],
        },
        take: 8,
        orderBy: { order: "asc" },
      }),
    ]);

    return {
      pages,
      achievements,
      events,
      notifications,
      interventions,
      emergencyContacts,
      subcommittees,
    };
  } catch (err) {
    console.error("Error searching database, returning pages and mock matches:", err);
    // Mock fallbacks
    return {
      pages,
      achievements: ACHIEVEMENTS.filter((a) => a.title.toLowerCase().includes(lowerQ) || a.recipient.toLowerCase().includes(lowerQ)).map(a => ({
        id: a.id,
        title: a.title,
        slug: a.id,
        category: a.category,
        date: new Date(a.date),
      })),
      events: EVENTS.filter((e) => e.title.toLowerCase().includes(lowerQ) || e.venue.toLowerCase().includes(lowerQ)).map(e => ({
        id: e.id,
        title: e.title,
        slug: e.id,
        date: new Date(e.date.split("–")[0].trim() || Date.now()),
        endDate: null as Date | null,
        venue: e.venue,
      })),
      notifications: CIRCULARS.filter((c) => c.title.toLowerCase().includes(lowerQ)).map(c => ({
        id: c.id,
        title: c.title,
        slug: c.id,
        date: new Date(c.date),
      })),
      interventions: INTERVENTIONS.filter((i) => i.title.toLowerCase().includes(lowerQ)).map(i => ({
        id: i.id,
        title: i.title,
        slug: i.id,
        date: new Date(i.date),
      })),
      emergencyContacts: EMERGENCY_CONTACTS.filter((e) => e.title.toLowerCase().includes(lowerQ) || e.department.toLowerCase().includes(lowerQ)).map(e => ({
        id: e.id,
        name: e.title,
        phone: e.phone,
        category: e.department,
      })),
      subcommittees: [],
    };
  }
}
