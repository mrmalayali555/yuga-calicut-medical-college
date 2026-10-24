import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Palette,
  Trophy,
  BookOpen,
  Users,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-static";

type ClubSlug = "jeevanam" | "praanah" | "godha" | "ocha";

interface ClubData {
  id: ClubSlug;
  name: string;
  malayalamName: string;
  tagline: string;
  category: string;
  description: string;
  fullOverview: string;
  logo: string;
  accent: string;
  accentLight: string;
  gradient: string;
  heroBg: string;
  badgeBg: string;
  icon: typeof Heart;
  mission: string;
  vision: string;
  stats: { label: string; value: string }[];
  initiatives: { title: string; desc: string }[];
  achievements: string[];
  team: { role: string; name: string; batch: string; phone?: string }[];
  subcommitteeSlug: string;
}

const CLUBS_DATA: Record<ClubSlug, ClubData> = {
  jeevanam: {
    id: "jeevanam",
    name: "Jeevanam",
    malayalamName: "ജീവനം",
    tagline: "Voluntary Blood Donation Club",
    category: "Emergency & Social Service",
    description:
      "Jeevanam is the premier voluntary blood donation and rapid-response medical assistance wing of the YUGA Student Union at Government Medical College, Kozhikode.",
    fullOverview:
      "Established to ensure zero donor shortages across Calicut Medical College Hospital, the Institute of Maternal and Child Health (IMCH), and the Super Specialty Block, Jeevanam coordinates 24/7 blood mobilization, maintains an active verified registry of over 1,500 student and staff donors, and facilitates emergency platelet apheresis and rare blood group matching.",
    logo: "/clubs/jeevanam.jpg",
    accent: "#dc2626",
    accentLight: "#fef2f2",
    gradient: "from-red-600 via-rose-600 to-red-800",
    heroBg: "bg-gradient-to-br from-red-950 via-slate-900 to-rose-950",
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: Heart,
    mission:
      "To provide swift, voluntary, and safe blood donor matching within 15 minutes for any trauma, obstetric, or oncology emergency at GMC Kozhikode.",
    vision:
      "A compassionate campus collective where voluntary donation is second nature, eliminating commercial donor dependence across North Kerala.",
    stats: [
      { label: "Active Donors", value: "1,850+" },
      { label: "Units Mobilized", value: "3,200+" },
      { label: "Avg Response Time", value: "< 20 mins" },
      { label: "Emergency Drives", value: "48+" },
    ],
    initiatives: [
      {
        title: "24/7 Emergency Blood Matching Desk",
        desc: "Instant live triage matching for ICU, trauma casualty, and pediatric emergency requests coordinated with GMC Blood Bank.",
      },
      {
        title: "Single-Donor Platelet (SDP) Roster",
        desc: "Pre-screened student registry for dengue and leukemia emergency apheresis donations.",
      },
      {
        title: "World Blood Donor Day Mega Drive",
        desc: "Annual mega-camp in association with Kerala State Blood Transfusion Council collecting 200+ units in a single day.",
      },
      {
        title: "Rare Blood Group Mapping",
        desc: "Specialized directory of Bombay Blood, Rh-negative, and AB-negative medicos for critical transfers.",
      },
    ],
    achievements: [
      "State Award for Highest Voluntary Youth Donations (Govt of Kerala, 2024)",
      "Zero unfulfilled emergency obstetric requests during 2023–2024 academic cycle",
      "Over 650 units donated during the Nipah & flood relief standby medical operations",
      "Recognized by Indian Red Cross Society Calicut Chapter",
    ],
    team: [
      {
        role: "Convenor",
        name: "Muhammed Shafi",
        batch: "Final MBBS Part 1",
        phone: "+91 94471 23401",
      },
      {
        role: "Emergency Coordinator",
        name: "Dr. Ananya Pillai",
        batch: "House Surgeon",
        phone: "+91 94471 23402",
      },
      {
        role: "Registry In-Charge",
        name: "Rohan M. Varghese",
        batch: "Phase 2 MBBS",
        phone: "+91 94471 23403",
      },
      {
        role: "Outreach Secretary",
        name: "Fathima Noor",
        batch: "Phase 1 MBBS",
        phone: "+91 94471 23404",
      },
    ],
    subcommitteeSlug: "social-service",
  },
  praanah: {
    id: "praanah",
    name: "Praanah",
    malayalamName: "പ്രാണഃ",
    tagline: "Fine Arts & Cultural Club",
    category: "Creative & Performing Arts",
    description:
      "Praanah is the creative pulse of GMC Kozhikode, uniting musicians, dancers, actors, and visual artists under the YUGA Student Union.",
    fullOverview:
      "From classical Mohiniyattam and Bharatanatyam recitals to electric fusion band nights and street plays addressing medical ethics, Praanah is dedicated to nurturing cultural excellence alongside rigorous medical education. Praanah spearheads the college's teams at the Kerala University of Health Sciences (KUHAS) Inter-Collegiate Arts Festival.",
    logo: "/clubs/praanah.jpg",
    accent: "#d97706",
    accentLight: "#fffbeb",
    gradient: "from-amber-600 via-yellow-600 to-orange-700",
    heroBg: "bg-gradient-to-br from-amber-950 via-slate-900 to-stone-950",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Palette,
    mission:
      "To foster artistic expression, aesthetic appreciation, and cultural diversity among medical scholars, proving medicine and arts breathe as one.",
    vision:
      "To position GMC Kozhikode as Kerala's premier medical institution for fine arts and cultural productions.",
    stats: [
      { label: "Active Artists", value: "240+" },
      { label: "KUHAS Medals", value: "18 Gold" },
      { label: "Annual Productions", value: "12+" },
      { label: "Fest Participants", value: "800+" },
    ],
    initiatives: [
      {
        title: "Annual YUGA Arts Fest",
        desc: "A 5-day multi-stage carnival featuring over 45 competitive events across music, choreography, drama, and literature.",
      },
      {
        title: "Symphony: The Medicos Band League",
        desc: "Acoustic jamming sessions and rock band showcases featuring medicos and house surgeons.",
      },
      {
        title: "Natyarangam Classical Wing",
        desc: "Workshops and recitals in Kuchipudi, Kathakali, and classical vocal traditions by eminent masters.",
      },
      {
        title: "Chithrashala Visual Arts Expo",
        desc: "Annual painting, medical illustration, and photography gallery exhibited at the historic college portico.",
      },
    ],
    achievements: [
      "Overall Champions — KUHAS North Zone Arts Festival 2024",
      "First Prize in Western Group Music & Mime at All-Kerala Inter-Medics Meet",
      "Short film 'Stethoscope' selected for National Medical Students Film Conclave",
      "Over 40 alumni currently active in mainstream Malayalam playback music and cinema",
    ],
    team: [
      {
        role: "Fine Arts Secretary",
        name: "Arathi Krishna",
        batch: "Phase 2 MBBS",
        phone: "+91 94472 34501",
      },
      {
        role: "Music Convenor",
        name: "Devanand K.",
        batch: "Final MBBS Part 1",
        phone: "+91 94472 34502",
      },
      {
        role: "Choreography Lead",
        name: "Sreelakshmi P.",
        batch: "Phase 2 MBBS",
        phone: "+91 94472 34503",
      },
      {
        role: "Visual Arts In-Charge",
        name: "Kiran Joseph",
        batch: "Phase 1 MBBS",
        phone: "+91 94472 34504",
      },
    ],
    subcommitteeSlug: "arts",
  },
  godha: {
    id: "godha",
    name: "Godha",
    malayalamName: "ഗോദ",
    tagline: "Sports & Athletics Council",
    category: "Athletics & Physical Fitness",
    description:
      "Godha — the wrestling ring and athletic battleground of GMC Kozhikode — drives fitness, grit, and championship sportsmanship under YUGA.",
    fullOverview:
      "Operating the sprawling historic college sports ground, indoor badminton courts, gymnasium, and basketball arena, Godha organizes the legendary Calicut Medicos Premier League (CMPL), inter-batch football tournaments, women's throwball, and track-and-field meets. Godha trains university squads representing GMC Kozhikode across South India.",
    logo: "/clubs/godha.png",
    accent: "#059669",
    accentLight: "#ecfdf5",
    gradient: "from-emerald-600 via-teal-600 to-green-700",
    heroBg: "bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: Trophy,
    mission:
      "To cultivate physical endurance, mental resilience, and lifelong athletic fitness amidst the rigorous academic schedules of medical training.",
    vision:
      "An inclusive sporting culture where every medico actively participates in competitive and recreational athletics.",
    stats: [
      { label: "CMPL Teams", value: "16 Batches" },
      { label: "Active Athletes", value: "450+" },
      { label: "University Trophies", value: "24 Titles" },
      { label: "Tournaments / Yr", value: "14 Meets" },
    ],
    initiatives: [
      {
        title: "Calicut Medicos Premier League (CMPL)",
        desc: "The flagship floodlit cricket championship uniting students, alumni, and doctors in high-stakes competition.",
      },
      {
        title: "Inter-Batch Football Cup",
        desc: "Intense 9-a-side and 11-a-side football tournament played on the GMC Olympic-dimension turf.",
      },
      {
        title: "Smash: Open Badminton Championship",
        desc: "Annual men's and women's singles and doubles tournament held at the indoor wooden court complex.",
      },
      {
        title: "Medicos Marathon & Health Run",
        desc: "10K awareness marathon through Kozhikode city advocating cardiovascular health and lifestyle discipline.",
      },
    ],
    achievements: [
      "Champions — All-Kerala Inter-Medical Football Tournament 2024",
      "KUHAS University Athletics Overall Champions (2022, 2023, 2024)",
      "State-record holding sprinters in men's 100m and 4x100m relay",
      "Successfully hosted the 14th National Medicos Basketball Conclave",
    ],
    team: [
      {
        role: "Sports Secretary",
        name: "Naveen Thomas",
        batch: "Final MBBS Part 1",
        phone: "+91 94473 45601",
      },
      {
        role: "Football Captain",
        name: "Arun Babu",
        batch: "Final MBBS Part 2",
        phone: "+91 94473 45602",
      },
      {
        role: "Cricket Captain",
        name: "Faisal P. K.",
        batch: "House Surgeon",
        phone: "+91 94473 45603",
      },
      {
        role: "Athletics Convenor",
        name: "Devika Menon",
        batch: "Phase 2 MBBS",
        phone: "+91 94473 45604",
      },
    ],
    subcommitteeSlug: "sports",
  },
  ocha: {
    id: "ocha",
    name: "Ocha",
    malayalamName: "ഒച്ച",
    tagline: "Literary, Quizzing & Debating Forum",
    category: "Debate, Quiz & Literature",
    description:
      "Ocha — meaning Voice and Resonance in Malayalam — is the cerebral forum of YUGA, dedicated to free speech, parliamentary debate, medical quizzing, and literary journalism.",
    fullOverview:
      "Founded on the principle that doctors must be compassionate communicators and sharp critical thinkers, Ocha organizes Asian Parliamentary debates, the prestigious Calicut Medical Quiz, Malayalam and English elocution championships, and publishes the official union magazine, campus gazette, and research critique journal.",
    logo: "/clubs/ocha.png",
    accent: "#7c3aed",
    accentLight: "#f5f3ff",
    gradient: "from-violet-600 via-purple-600 to-indigo-800",
    heroBg: "bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950",
    badgeBg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    icon: BookOpen,
    mission:
      "To foster incisive debate, ethical reflection, and intellectual curiosity across biomedical, philosophical, and social arenas.",
    vision:
      "To elevate GMC Kozhikode as a premier hub for collegiate debate, investigative campus journalism, and national-tier quizzing.",
    stats: [
      { label: "Debate Titles", value: "32 Wins" },
      { label: "Quiz Leagues", value: "8 Editions" },
      { label: "Journal Issues", value: "15 Printed" },
      { label: "Active Members", value: "180+" },
    ],
    initiatives: [
      {
        title: "Calicut Medicos Parliamentary Debate (CMPD)",
        desc: "Kerala's flagship parliamentary debate tournament drawing teams from national law universities and medical colleges.",
      },
      {
        title: "The Grand Hippocratic Quiz League",
        desc: "Multi-round medical trivia, general knowledge, pop-culture, and bioethics quizzing circuit.",
      },
      {
        title: "Vak: Malayalam Literary & Poetry Circle",
        desc: "Monthly evenings of Malayalam contemporary poetry, book reviews, and creative prose discussions.",
      },
      {
        title: "YUGA Union Journal & Gazette",
        desc: "Editorial desk overseeing investigative essays, student poetry, campus satire, and faculty interviews.",
      },
    ],
    achievements: [
      "National Winners — AIIMS Pulse National Medical Quiz (New Delhi, 2024)",
      "Champions — All-Kerala Inter-Collegiate English Debate Championship 2024",
      "Kerala Sahitya Akademi Youth Mention for Student Literary Anthology 2023",
      "Over 12 student delegates represented at National Youth Parliament Festival",
    ],
    team: [
      {
        role: "Literary Secretary",
        name: "Meera Chandran",
        batch: "Phase 2 MBBS",
        phone: "+91 94474 56701",
      },
      {
        role: "Debate Captain",
        name: "Akshay Suresh",
        batch: "Final MBBS Part 1",
        phone: "+91 94474 56702",
      },
      {
        role: "Quiz Master & Lead",
        name: "Dr. Rohith K.",
        batch: "House Surgeon",
        phone: "+91 94474 56703",
      },
      {
        role: "Chief Magazine Editor",
        name: "Sreya Rajan",
        batch: "Phase 2 MBBS",
        phone: "+91 94474 56704",
      },
    ],
    subcommitteeSlug: "literary",
  },
};

export async function generateStaticParams() {
  return [
    { slug: "jeevanam" },
    { slug: "praanah" },
    { slug: "godha" },
    { slug: "ocha" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const club = CLUBS_DATA[slug as ClubSlug];
  if (!club) {
    return {
      title: "Club Not Found · YUGA Calicut Medical College",
    };
  }

  return {
    title: `${club.name} (${club.malayalamName}) — ${club.tagline} | YUGA`,
    description: club.description,
  };
}

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = CLUBS_DATA[slug as ClubSlug];

  if (!club) {
    notFound();
  }

  const Icon = club.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Dramatic Hero Section */}
      <section className={`relative pt-32 pb-24 overflow-hidden text-white ${club.heroBg}`}>
        {/* Ambient atmospheric backdrop */}
        <div
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: club.accent }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: club.accent }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8">
            <Link
              href="/"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link
              href="/subcommittees"
              className="hover:text-white transition-colors"
            >
              Sub-Committees
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{club.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand & Logo */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div
                className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-3xl p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center transition-transform hover:scale-105 duration-300"
                style={{
                  boxShadow: `0 20px 50px -10px ${club.accent}40`,
                }}
              >
                <div className="relative h-full w-full bg-white rounded-2xl p-3 flex items-center justify-center overflow-hidden shadow-inner">
                  <Image
                    src={club.logo}
                    alt={`${club.name} Official Emblem`}
                    fill
                    className="object-contain p-2"
                    sizes="208px"
                    priority
                  />
                </div>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
                style={{
                  color: club.accent,
                  borderColor: `${club.accent}55`,
                  backgroundColor: `${club.accent}15`,
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>YUGA Official Wing</span>
              </div>
            </div>

            {/* Right Column: Title, Malayalam Script & Pitch */}
            <div className="lg:col-span-8 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                <span className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
                  {club.category}
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-2xl font-bold text-slate-300 font-serif">
                  {club.malayalamName}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white mb-4">
                {club.name}
              </h1>

              <p className="text-xl sm:text-2xl font-medium text-slate-200 mb-6 font-display">
                {club.tagline}
              </p>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mb-8">
                {club.fullOverview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href={`tel:${club.team[0]?.phone || "+919447123401"}`}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 duration-200"
                  style={{ backgroundColor: club.accent }}
                >
                  <Phone className="h-4 w-4" />
                  <span>Contact Office Bearers</span>
                </a>

                <Link
                  href={`/subcommittees/${club.subcommitteeSlug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span>Parent Committee Page</span>
                </Link>

                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-5 py-3.5 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Club Events</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {club.stats.map((st, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xs p-5 text-center lg:text-left"
              >
                <div
                  className="text-3xl sm:text-4xl font-display font-black tracking-tight mb-1"
                  style={{ color: club.accent }}
                >
                  {st.value}
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision Bento */}
      <section className="py-16 sm:py-20 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="rounded-3xl border p-8 sm:p-10 transition-all hover:shadow-md"
              style={{
                backgroundColor: club.accentLight,
                borderColor: `${club.accent}33`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold"
                  style={{ backgroundColor: club.accent }}
                >
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3
                  className="text-xl font-display font-bold tracking-tight"
                  style={{ color: club.accent }}
                >
                  Core Mission
                </h3>
              </div>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                {club.mission}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-8 sm:p-10 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-display font-bold tracking-tight text-slate-900">
                  Long-Term Vision
                </h3>
              </div>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                {club.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Flagship Initiatives */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: club.accent }}
            >
              What We Do
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Flagship Programs &amp; Initiatives
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Key operational programs maintained throughout the academic year by {club.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {club.initiatives.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display font-bold text-white text-base shadow-xs group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: club.accent }}
                  >
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Honors & Achievements */}
      <section className="py-20 sm:py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: club.accent }}
            >
              Hall of Honors
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Milestones &amp; State Recognitions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {club.achievements.map((ach, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-2xs hover:bg-white hover:border-slate-300 transition-all"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5"
                  style={{
                    backgroundColor: `${club.accent}20`,
                    color: club.accent,
                  }}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                  {ach}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Executive Office Bearers */}
      <section className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: club.accent }}
            >
              Leadership
            </p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Executive Committee Bearers
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Get in touch with student convenors and wing representatives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {club.team.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl font-display font-bold text-lg text-white shadow-xs"
                      style={{ backgroundColor: club.accent }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                      style={{
                        color: club.accent,
                        borderColor: `${club.accent}40`,
                        backgroundColor: `${club.accent}10`,
                      }}
                    >
                      {member.role}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {member.batch}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {member.phone ? (
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{member.phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Via Union Desk</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Other Clubs Bar & Navigation */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Explore Other YUGA Student Clubs
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Discover arts, sports, literary, and emergency service wings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {(["jeevanam", "praanah", "godha", "ocha"] as ClubSlug[])
                .filter((s) => s !== club.id)
                .map((otherSlug) => {
                  const other = CLUBS_DATA[otherSlug];
                  return (
                    <Link
                      key={otherSlug}
                      href={`/clubs/${otherSlug}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:shadow-xs transition-all"
                    >
                      <div className="relative h-5 w-5 rounded-md overflow-hidden bg-white shrink-0">
                        <Image
                          src={other.logo}
                          alt={other.name}
                          fill
                          className="object-contain"
                          sizes="20px"
                        />
                      </div>
                      <span>{other.name}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
