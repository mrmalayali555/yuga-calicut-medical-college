import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  console.log("🌱 Seeding ADVAYA database…");

  // --- Admin ---
  const email = process.env.ADMIN_EMAIL || "admin@yuga.local";
  const password = process.env.ADMIN_PASSWORD || "yuga123";
  const name = process.env.ADMIN_NAME || "YUGA Union Admin";
  const passwordHash = await bcrypt.hash(password, 12);

  await db.admin.upsert({
    where: { email },
    update: { passwordHash, name, role: "superadmin" },
    create: { email, name, passwordHash, role: "superadmin" },
  });
  console.log(`   ✓ Admin: ${email} / ${password}`);

  // Also support legacy fallback
  const fallbackHash = await bcrypt.hash("advaya123", 12);
  await db.admin.upsert({
    where: { email: "admin@advaya.local" },
    update: { passwordHash: fallbackHash, name: "YUGA Admin", role: "superadmin" },
    create: { email: "admin@advaya.local", name: "YUGA Admin", passwordHash: fallbackHash, role: "superadmin" },
  });


  // --- Marquee ---
  await db.marquee.deleteMany();
  await db.marquee.create({
    data: {
      enabled: true,
      text: "Welcome to ADVAYA — Union Day celebrations begin 15 August. Registrations now open.",
      buttonText: "View Details",
      buttonUrl: "/events",
    },
  });

  // --- Settings (contact, socials, hero, about summary) ---
  const settings = {
    hero: {
      badge: "Alappuzha Government Medical College",
      title: "The voice of every student.",
      subtitle:
        "ADVAYA is the official college union — celebrating achievements, powering events, and standing for every student at Alappuzha Medical College.",
    },
    contact: {
      address:
        "Alappuzha Government Medical College, Vandanam, Alappuzha, Kerala 688005",
      phone: "+91 477 000 0000",
      email: "advaya.union@example.com",
    },
    stats: {
      students: 1200,
      events: 48,
      achievements: 96,
      committees: 12,
    },
  };
  for (const [key, value] of Object.entries(settings)) {
    await db.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
  }

  // --- Pages (about / ug / pg) ---
  const pages = [
    {
      key: "about",
      title: "About the Union",
      content: JSON.stringify({
        history:
          "ADVAYA (അദ്വയ) is the elected student union of Alappuzha Government Medical College, representing undergraduate and postgraduate students across all departments.",
        mission:
          "To give every student a voice, nurture talent in arts, sports and academics, and build a college community rooted in fairness and care.",
        vision:
          "A medical college where students lead, support one another, and grow into compassionate professionals.",
        chairperson:
          "It is my privilege to serve the students of Alappuzha Medical College. Together we will make this a year of achievement, unity and unforgettable memories.",
      }),
    },
  ];
  for (const p of pages) {
    await db.page.upsert({
      where: { key: p.key },
      update: { title: p.title, content: p.content },
      create: p,
    });
  }

  // --- Achievements ---
  const achievements = [
    {
      title: "Overall Champions — KUHS Inter-Zone Arts Festival 2026",
      slug: "kuhs-arts-champions",
      category: "arts",
      awardWinner: "Calicut Medicos Arts Contingent (All Batches)",
      description:
        "Lifted the prestigious Ever-Rolling Golden Trophy for the 4th consecutive year with 18 first prizes across competitive disciplines.",
      date: daysFromNow(-20),
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
      date: daysFromNow(-40),
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
      date: daysFromNow(-8),
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
      date: daysFromNow(-60),
      coverImage:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    },
  ];
  for (const a of achievements) {
    await db.achievement.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  // --- Events ---
  const events = [
    {
      title: "YUGA Arts Fest 2026 — Rhythms of GMC",
      slug: "yuga-arts-fest",
      description:
        "Annual inter-batch cultural battle across 42 competitive disciplines including music, dance, literary arts, and theatrical performances.",
      date: daysFromNow(5),
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
      date: daysFromNow(12),
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
      date: daysFromNow(20),
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
      date: daysFromNow(-10),
      time: "9:00 AM – 1:00 PM",
      venue: "OPD Complex Ground Floor",
      status: "completed",
      poster:
        "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80",
    },
  ];
  for (const e of events) {
    await db.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: e,
    });
  }

  // --- Registration Forms ---
  await db.registrationSubmission.deleteMany();
  await db.registrationField.deleteMany();
  await db.registrationForm.deleteMany();

  const unionEvent = await db.event.findFirst({ where: { status: "upcoming" } });
  if (unionEvent) {
    const regForm = await db.registrationForm.create({
      data: {
        title: "YUGA Union Day 2026 — Delegate Pass Registration",
        slug: "yuga-union-day-2026-delegate-pass",
        description:
          "Official delegate enrollment for YUGA Union Day celebrations. Please fill in your academic batch and contact details to generate your digital gate pass.",
        eventId: unionEvent.id,
        deadline: daysFromNow(18),
        published: true,
        fields: {
          create: [
            { label: "Full Name", type: "text", required: true, placeholder: "Dr. / Medico Full Name", order: 0 },
            { label: "Email Address", type: "email", required: true, placeholder: "name@gmc.edu", order: 1 },
            {
              label: "Batch / Academic Year",
              type: "radio",
              required: true,
              options: "MBBS 2021, MBBS 2022, MBBS 2023, MBBS 2024, MBBS 2025, House Surgeon / Intern, PG Resident",
              order: 2,
            },
            { label: "WhatsApp Phone Number", type: "number", required: true, placeholder: "+91 98765 43210", order: 3 },
            {
              label: "Delegate Category",
              type: "select",
              required: false,
              options: "Student Delegate, Stage Performer, Sports Team, Volunteer, Alumni Guest",
              order: 4,
            },
          ],
        },
      },
    });

    // Seed 2 sample participant submissions
    await db.registrationSubmission.create({
      data: {
        formId: regForm.id,
        data: JSON.stringify({
          _ticketRef: "YUG-842091",
          _submittedAt: new Date().toISOString(),
          "Full Name": "Dr. Rohit Menon",
          "Email Address": "rohit.menon@gmck.edu",
          "Batch / Academic Year": "MBBS 2022",
          "WhatsApp Phone Number": "+91 98471 23456",
          "Delegate Category": "Student Delegate",
        }),
      },
    });

    await db.registrationSubmission.create({
      data: {
        formId: regForm.id,
        data: JSON.stringify({
          _ticketRef: "YUG-319582",
          _submittedAt: new Date().toISOString(),
          "Full Name": "Dr. Ananya Varma",
          "Email Address": "ananya.varma@gmck.edu",
          "Batch / Academic Year": "House Surgeon / Intern",
          "WhatsApp Phone Number": "+91 94470 65432",
          "Delegate Category": "Stage Performer",
        }),
      },
    });
    console.log("   ✓ Registration Form & Sample Attendees seeded");
  }

  // --- Notifications ---
  await db.notification.deleteMany();
  const notifications = [
    {
      title: "Union Day registrations open",
      slug: "union-day-registrations-open",
      description:
        "Register for cultural and sports events before 10 August. Slots are limited.",
      date: daysFromNow(-1),
    },
    {
      title: "Revised internal exam timetable",
      slug: "revised-internal-exam-timetable",
      description:
        "The internal assessment schedule has been revised. Please check the attached notice.",
      date: daysFromNow(-3),
    },
    {
      title: "Holiday declared on 15 October",
      slug: "holiday-15-october",
      description:
        "The college will remain closed on 15 October on account of the local festival.",
      date: daysFromNow(-6),
    },
  ];
  for (const n of notifications) {
    await db.notification.create({ data: n });
  }

  // --- Finance ---
  await db.financeEntry.deleteMany();
  await db.financeEntry.createMany({
    data: [
      { kind: "income", category: "Union Fund", label: "Annual union fund collection", amount: 480000 },
      { kind: "income", category: "Other Income", label: "Sponsorships & donations", amount: 125000 },
      { kind: "expenditure", category: "Union Expenditure", label: "Union Day 2025 arrangements", amount: 210000 },
      { kind: "expenditure", category: "Union Expenditure", label: "Sports equipment & kits", amount: 86000 },
    ],
  });

  // --- Emergency contacts (Official Directory 2025-26) ---
  await db.emergencyContact.deleteMany();
  await db.emergencyContact.createMany({
    data: [
      { category: "Emergency Services", name: "National Emergency Number", phone: "112", description: "All-in-one national emergency helpline", order: 1, active: true, showOnHomepage: true },
      { category: "Emergency Services", name: "Police Helpline", phone: "100", description: "Police control room", order: 2, active: true, showOnHomepage: true },
      { category: "Emergency Services", name: "Fire Force", phone: "101", description: "Fire and rescue control room", order: 3, active: true, showOnHomepage: true },
      { category: "Emergency Services", name: "Ambulance / Disaster Management", phone: "102, 108", description: "Emergency medical transport & disaster response", order: 4, active: true, showOnHomepage: true },
      { category: "Emergency Services", name: "Woman Helpline", phone: "1091", description: "24x7 women safety and emergency helpline", order: 5, active: true, showOnHomepage: true },
      { category: "Emergency Services", name: "KSEB Electricity", phone: "9496010101", description: "Kerala State Electricity Board emergency helpline", order: 6, active: true, showOnHomepage: true },
      { category: "College & Hospital", name: "College Contact Number", phone: "0477 2282611", description: "Govt T.D. Medical College Alappuzha official office", order: 10, active: true },
      { category: "College & Hospital", name: "Hospital Help Desk", phone: "0477 2282367", description: "T.D. Medical College Hospital help desk & reception", order: 11, active: true },
      { category: "College & Hospital", name: "Hospital Ambulance", phone: "80864 13064", description: "T.D. Medical College Hospital 24x7 ambulance", order: 12, active: true },
      { category: "College & Hospital", name: "Sergeant (Mr. Abhaya Kumar)", phone: "88488 22576", description: "Campus security sergeant", order: 13, active: true },
      { category: "College Union", name: "Sann Mariya (Chairperson)", phone: "85908 80366", description: "Sattva College Union Chairperson", order: 20, active: true },
      { category: "College Union", name: "Mahadevan (General Secretary)", phone: "94964 75272", description: "Sattva College Union General Secretary", order: 21, active: true },
      { category: "College Union", name: "Mina Younus (UUC)", phone: "85475 36746", description: "University Union Councillor (UUC)", order: 22, active: true },
      { category: "Men's Hostel", name: "Muhammed Nishad (MH 1 Secretary)", phone: "85903 97925", description: "Men's Hostel 1 Secretary", order: 30, active: true },
      { category: "Men's Hostel", name: "Jazeel (MH 2 Secretary)", phone: "81369 94226", description: "Men's Hostel 2 Secretary", order: 31, active: true },
      { category: "Men's Hostel", name: "Ralchim (MH 3 Secretary)", phone: "93492 79201", description: "Men's Hostel 3 Secretary", order: 32, active: true },
      { category: "Men's Hostel", name: "Dr. Jamshad (Warden)", phone: "98468 35786", description: "Men's Hostel Warden", order: 33, active: true },
      { category: "Men's Hostel", name: "Dr. Alan (Assistant Warden)", phone: "94962 19851", description: "Men's Hostel Assistant Warden", order: 34, active: true },
      { category: "Ladies' Hostel", name: "Adithya P (LH 1 Secretary)", phone: "90480 32076", description: "Ladies' Hostel 1 Secretary", order: 40, active: true },
      { category: "Ladies' Hostel", name: "Anjana Rajesh (LH 2 Secretary)", phone: "70342 73129", description: "Ladies' Hostel 2 Secretary", order: 41, active: true },
      { category: "Ladies' Hostel", name: "Dr. Rani Raphael (Warden)", phone: "94463 39030", description: "Ladies' Hostel Warden", order: 42, active: true },
      { category: "Ladies' Hostel", name: "Dr. Mekha (Assistant Warden)", phone: "97459 05537", description: "Ladies' Hostel Assistant Warden", order: 43, active: true },
      { category: "Police Station", name: "Punnapra Police Station", phone: "0477 2287669", description: "Jurisdiction police station for Vandanam / TDMC Campus", order: 50, active: true },
      { category: "Auto-Drivers (Night)", name: "Mr. Saleem (Night Auto)", phone: "98951 55452", description: "Night auto driver service for campus & hospital", order: 60, active: true },
      { category: "Auto-Drivers (Night)", name: "Mr. Jabbar (Night Auto)", phone: "80860 92812", description: "Night auto driver service for campus & hospital", order: 61, active: true },
      { category: "College Watchmen", name: "Mr. Krishnakumar (Watchman)", phone: "99466 41956", description: "College security watchman", order: 70, active: true },
      { category: "College Watchmen", name: "Mr. Satheesh (Watchman)", phone: "91422 29998", description: "College security watchman", order: 71, active: true },
      { category: "College Watchmen", name: "Mr. Sebastian (Watchman)", phone: "96455 33771", description: "College security watchman", order: 72, active: true },
      { category: "College Watchmen", name: "Mr. Anandu (Watchman)", phone: "98463 81767", description: "College security watchman", order: 73, active: true },
      { category: "College Watchmen", name: "Mr. Harikrishnan (Watchman)", phone: "80787 88043", description: "College security watchman", order: 74, active: true },
      { category: "College Watchmen", name: "Mr. Renjith (Watchman)", phone: "62829 97904", description: "College security watchman", order: 75, active: true },
      { category: "College Watchmen", name: "Mr. Sujith (Watchman)", phone: "90741 94761", description: "College security watchman", order: 76, active: true },
      { category: "College Watchmen", name: "Mr. Saran (Watchman)", phone: "79946 68518", description: "College security watchman", order: 77, active: true },
    ],
  });

  // --- Committees ---
  await db.committeeMember.deleteMany();
  await db.committee.deleteMany();
  const arts = await db.committee.create({
    data: {
      name: "Arts & Cultural Committee",
      slug: "arts-cultural",
      description: "Organises cultural fests, music, dance and drama.",
      order: 1,
    },
  });
  const sports = await db.committee.create({
    data: {
      name: "Sports Committee",
      slug: "sports",
      description: "Runs tournaments, teams and the annual athletics meet.",
      order: 2,
    },
  });
  await db.committeeMember.createMany({
    data: [
      { committeeId: arts.id, name: "Convenor — Arts", position: "Convenor", order: 1 },
      { committeeId: arts.id, name: "Joint Convenor — Arts", position: "Joint Convenor", order: 2 },
      { committeeId: sports.id, name: "Convenor — Sports", position: "Convenor", order: 1 },
    ],
  });

  // --- Interventions ---
  await db.intervention.deleteMany();
  const interventions = [
    {
      title: "Representation regarding Hostel Library & 24/7 Study Room Facility",
      slug: "representation-hostel-library-247-study-room",
      category: "Infrastructure",
      description:
        "The Union submitted a formal representation to the Principal requesting the installation of air conditioning and 24/7 lighting/Wi-Fi access in the Men's and Women's hostel reading rooms prior to university exams.",
      date: daysFromNow(-4),
      pinned: true,
      published: true,
    },
    {
      title: "Request for Immediate Repair of OPD Block Elevator & Ramp Access",
      slug: "request-opd-elevator-ramp-repair",
      category: "Campus Safety",
      description:
        "Official letter submitted to the Medical Superintendent highlighting difficulties faced by wheel-chair bound patients and clinical postings students due to non-functioning elevators.",
      date: daysFromNow(-12),
      pinned: false,
      published: true,
    },
    {
      title: "Memorandum on Stipend Disbursal Schedule for PG Residents & House Surgeons",
      slug: "memorandum-stipend-disbursal-schedule",
      category: "Academic & Welfare",
      description:
        "Official petition addressed to the Directorate of Medical Education (DME) ensuring timely monthly credit of stipends for senior and junior resident doctors.",
      date: daysFromNow(-25),
      pinned: false,
      published: true,
    },
  ];
  for (const inv of interventions) {
    await db.intervention.create({ data: inv });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
