"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Heart,
  Palette,
  Trophy,
  BookOpen,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Activity,
  Flame,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
} from "lucide-react";
import { JeevanamHero } from "./jeevanam-hero";

export type ClubSlug = "jeevanam" | "praanah" | "godha" | "ocha";

interface ClubConfig {
  id: ClubSlug;
  name: string;
  malayalam: string;
  tagline: string;
  category: string;
  founded: string;
  logo: string;
  accent: string;
  accentRgb: string;
  heroGradient: string;
  mission: string;
  vision: string;
  heroDescription: string;
  stats: { label: string; value: string; hint: string }[];
  initiatives: {
    title: string;
    description: string;
    category: string;
    status: string;
  }[];
  achievements: { title: string; year: string; awarder: string }[];
  team: {
    role: string;
    name: string;
    batch: string;
    phone: string;
    email: string;
  }[];
}

const CLUBS_CONFIG: Record<ClubSlug, ClubConfig> = {
  jeevanam: {
    id: "jeevanam",
    name: "Jeevanam",
    malayalam: "ജീവനം",
    tagline: "Voluntary Blood Donation & Emergency Wing",
    category: "Emergency & Social Service",
    founded: "Est. 2008",
    logo: "/clubs/jeevanam-gold.png",
    accent: "#dc2626",
    accentRgb: "220, 38, 38",
    heroGradient: "from-red-950 via-slate-900 to-rose-950",
    mission:
      "To ensure zero patient mortality due to donor delays across GMC Kozhikode, IMCH, and the Malabar region by deploying rapid, voluntary peer-to-peer blood matching within 15 minutes.",
    vision:
      "A self-sufficient clinical community where ethical, voluntary donation eliminates commercial donor reliance throughout Northern Kerala.",
    heroDescription:
      "The dedicated lifeline of Calicut Medical College. Jeevanam coordinates 24/7 urgent blood mobilization, single-donor platelet (SDP) apheresis for oncology & dengue crises, and rare blood group registry support across all GMC ICUs and casualty triage.",
    stats: [
      { label: "Active Donors", value: "1,850+", hint: "Verified medicos & alumni" },
      { label: "Units Mobilized", value: "3,400+", hint: "Past 3 academic years" },
      { label: "Avg Response Time", value: "14 Mins", hint: "From request to triage" },
      { label: "Emergency Drives", value: "52", hint: "Disease & seasonal camps" },
    ],
    initiatives: [
      {
        title: "24/7 Casualty & ICU Live Blood Dispatch",
        description:
          "Instant automated matching connecting casualty medical officers with standby student donors across hostels.",
        category: "Emergency",
        status: "Live 24/7",
      },
      {
        title: "Single-Donor Platelet (SDP) Apheresis Panel",
        description:
          "Dedicated roster of 120+ pre-screened medicos ready for rapid apheresis donation in pediatric oncology and dengue emergencies.",
        category: "Clinical",
        status: "Active",
      },
      {
        title: "Rare Blood Group Directory",
        description:
          "Statewide catalog of Bombay phenotype, Rh-null, and AB-negative student donors for inter-hospital emergencies.",
        category: "Registry",
        status: "Continuous",
      },
      {
        title: "World Blood Donor Day Mega Drive",
        description:
          "Annual flagship multi-batch donation festival collecting 250+ units in a single day in association with Kerala State Blood Transfusion Council.",
        category: "Camp",
        status: "Annual",
      },
    ],
    achievements: [
      {
        title: "Kerala State Government Excellence Award for Youth Blood Donation",
        year: "2024",
        awarder: "Department of Health & Family Welfare",
      },
      {
        title: "100% Emergency Obstetric Donor Fulfilment Award",
        year: "2023–2024",
        awarder: "Institute of Maternal & Child Health (IMCH)",
      },
      {
        title: "Nipah Crisis Disaster Standby Citation",
        year: "2023",
        awarder: "GMC Kozhikode Hospital Development Committee",
      },
      {
        title: "Indian Red Cross Society Gold Seal of Commendation",
        year: "2022",
        awarder: "Red Cross Kozhikode Chapter",
      },
    ],
    team: [
      {
        role: "Convenor",
        name: "Muhammed Shafi",
        batch: "Final MBBS Part 1",
        phone: "+91 94471 23401",
        email: "jeevanam.convenor@yuga.local",
      },
      {
        role: "Casualty Emergency Coordinator",
        name: "Dr. Ananya Pillai",
        batch: "House Surgeon",
        phone: "+91 94471 23402",
        email: "triage.blood@yuga.local",
      },
      {
        role: "Donor Registry In-Charge",
        name: "Rohan M. Varghese",
        batch: "Phase 2 MBBS",
        phone: "+91 94471 23403",
        email: "registry@yuga.local",
      },
      {
        role: "Public Health Liaison",
        name: "Fathima Noor",
        batch: "Phase 1 MBBS",
        phone: "+91 94471 23404",
        email: "outreach.jeevanam@yuga.local",
      },
    ],
  },

  praanah: {
    id: "praanah",
    name: "Praanah",
    malayalam: "പ്രാണഃ",
    tagline: "Fine Arts, Music & Cultural Society",
    category: "Creative & Performing Arts",
    founded: "Est. 1974",
    logo: "/clubs/praanah.jpg",
    accent: "#d97706",
    accentRgb: "217, 119, 6",
    heroGradient: "from-amber-950 via-slate-900 to-orange-950",
    mission:
      "To celebrate the artistic soul of medicine, providing an inspiring creative sanctuary where musical virtuosity, classical dance, theatrical craft, and visual design thrive hand-in-hand with clinical rigor.",
    vision:
      "To be South India's premier medical cultural collective, producing national-standard music, theatre, and films that illuminate the human condition.",
    heroDescription:
      "The creative heartbeat of Calicut Medical College. Praanah oversees 6 specialized cultural wings, represents GMC at university festivals (KUHAS), curates the annual YUGA Arts Carnival, and nurtures artistic talents that have launched celebrated playback artists, choreographers, and directors.",
    stats: [
      { label: "Active Artists", value: "320+", hint: "Singers, dancers & actors" },
      { label: "KUHAS Gold Medals", value: "24 Titles", hint: "State university meets" },
      { label: "Annual Productions", value: "16 Shows", hint: "Stage plays & concerts" },
      { label: "Festival Footfall", value: "4,000+", hint: "Annual arts carnival" },
    ],
    initiatives: [
      {
        title: "Annual YUGA Arts Carnival",
        description:
          "5 days of high-voltage inter-batch competitions across 48 onstage and offstage cultural categories.",
        category: "Festival",
        status: "Main Event",
      },
      {
        title: "Symphony — The Medicos Band & Choir",
        description:
          "Acoustic jam sessions, orchestral ensembles, and rock band competitions with dedicated sound production studio access.",
        category: "Music",
        status: "Active",
      },
      {
        title: "Natyarangam Classical Dance Academy",
        description:
          "Masterclasses in Bharatanatyam, Mohiniyattam, and Kuchipudi conducted by distinguished classical exponents.",
        category: "Dance",
        status: "Bi-Weekly",
      },
      {
        title: "Chithrashala Medical Illustration & Art Expo",
        description:
          "Public exhibition of anatomical drawings, canvas oil paintings, and digital art celebrating the beauty of biological sciences.",
        category: "Visual Arts",
        status: "Exhibition",
      },
    ],
    achievements: [
      {
        title: "Overall Champions — KUHAS Inter-Collegiate Arts Festival",
        year: "2024",
        awarder: "Kerala University of Health Sciences",
      },
      {
        title: "Best Short Film Trophy for 'Stethoscope & Silence'",
        year: "2024",
        awarder: "National Medical Students Film Conclave",
      },
      {
        title: "First Prize in Classical Group Dance & Mime",
        year: "2023",
        awarder: "All-Kerala Inter-Medics Meet",
      },
      {
        title: "State Cultural Excellence Banner",
        year: "2022",
        awarder: "Kerala Sangeetha Nataka Akademi",
      },
    ],
    team: [
      {
        role: "Fine Arts Secretary",
        name: "Arathi Krishna",
        batch: "Phase 2 MBBS",
        phone: "+91 94472 34501",
        email: "arts.secretary@yuga.local",
      },
      {
        role: "Band & Symphony Lead",
        name: "Devanand K.",
        batch: "Final MBBS Part 1",
        phone: "+91 94472 34502",
        email: "music@yuga.local",
      },
      {
        role: "Choreography Coordinator",
        name: "Sreelakshmi P.",
        batch: "Phase 2 MBBS",
        phone: "+91 94472 34503",
        email: "dance@yuga.local",
      },
      {
        role: "Dramatics & Stage In-Charge",
        name: "Kiran Joseph",
        batch: "Phase 1 MBBS",
        phone: "+91 94472 34504",
        email: "theatre@yuga.local",
      },
    ],
  },

  godha: {
    id: "godha",
    name: "Godha",
    malayalam: "ഗോദ",
    tagline: "Sports, Athletics & Fitness Council",
    category: "Athletics & Physical Fitness",
    founded: "Est. 1962",
    logo: "/clubs/godha.png",
    accent: "#059669",
    accentRgb: "5, 150, 105",
    heroGradient: "from-emerald-950 via-slate-900 to-teal-950",
    mission:
      "To build physical endurance, grit, and unwavering sportsmanship among medical scholars through world-class tournament organization, training regimens, and accessible campus athletic facilities.",
    vision:
      "A healthy, energized medical campus where athletic discipline is embraced as a fundamental pillar of clinical and personal balance.",
    heroDescription:
      "The athletic battleground and fitness powerhouse of GMC Kozhikode. Godha manages the historic college sports grounds, multi-gym, synthetic indoor badminton arena, and basketball courts, while organizing the world-famous Calicut Medicos Premier League (CMPL).",
    stats: [
      { label: "Active Medico Athletes", value: "480+", hint: "Across 8 disciplines" },
      { label: "CMPL Franchise Teams", value: "16 Batches", hint: "Cricket & Football" },
      { label: "University Cups", value: "28 Trophies", hint: "KUHAS & Inter-Collegiate" },
      { label: "Annual Meets", value: "18 Meets", hint: "Intra & State tournaments" },
    ],
    initiatives: [
      {
        title: "Calicut Medicos Premier League (CMPL)",
        description:
          "The biggest floodlit student cricket league in South India with official player auctions, digital live-streams, and 800+ spectator attendance.",
        category: "Cricket",
        status: "Season Live",
      },
      {
        title: "Inter-Batch Football Championship",
        description:
          "Grueling 11-a-side football tournament played on the GMC full-dimension grass turf under floodlights.",
        category: "Football",
        status: "Active",
      },
      {
        title: "Smash Open Badminton Circuit",
        description:
          "Men's & Women's singles and doubles indoor wooden-court tournaments featuring medicos, faculty, and resident doctors.",
        category: "Badminton",
        status: "Quarterly",
      },
      {
        title: "10K Kozhikode Medicos Health Run",
        description:
          "Annual city marathon promoting cardiovascular fitness, cardiopulmonary health, and metabolic lifestyle awareness.",
        category: "Athletics",
        status: "Annual",
      },
    ],
    achievements: [
      {
        title: "Overall Champions — All-Kerala Inter-Medical Football Conclave",
        year: "2024",
        awarder: "Kerala Medical Sports Association",
      },
      {
        title: "KUHAS Athletics Championship Overall Winners (Hat-trick)",
        year: "2022, 2023, 2024",
        awarder: "KUHAS Sports Board",
      },
      {
        title: "State Medical Basketball Tournament Gold Medal",
        year: "2023",
        awarder: "Inter-Collegiate Health Games",
      },
      {
        title: "Best Maintained College Sports Infrastructure Citation",
        year: "2023",
        awarder: "District Sports Council Kozhikode",
      },
    ],
    team: [
      {
        role: "Sports Secretary",
        name: "Naveen Thomas",
        batch: "Final MBBS Part 1",
        phone: "+91 94473 45601",
        email: "sports.sec@yuga.local",
      },
      {
        role: "Football Captain",
        name: "Arun Babu",
        batch: "Final MBBS Part 2",
        phone: "+91 94473 45602",
        email: "football@yuga.local",
      },
      {
        role: "Cricket Captain",
        name: "Faisal P. K.",
        batch: "House Surgeon",
        phone: "+91 94473 45603",
        email: "cricket@yuga.local",
      },
      {
        role: "Women's Sports Representative",
        name: "Devika Menon",
        batch: "Phase 2 MBBS",
        phone: "+91 94473 45604",
        email: "womensports@yuga.local",
      },
    ],
  },

  ocha: {
    id: "ocha",
    name: "Ocha",
    malayalam: "ഒച്ച",
    tagline: "Literary, Quizzing & Debating Society",
    category: "Debate, Quiz & Literature",
    founded: "Est. 1982",
    logo: "/clubs/ocha.png",
    accent: "#7c3aed",
    accentRgb: "124, 58, 237",
    heroGradient: "from-violet-950 via-slate-900 to-indigo-950",
    mission:
      "To champion the power of the spoken and written word, cultivating articulate, empathetic, and intellectually fearless medical professionals equipped to debate bioethics, question dogma, and articulate truth.",
    vision:
      "To be the intellectual nucleus of GMC Kozhikode, renowned nationwide for competitive debate, premier biomedical quizzing, and impactful campus journalism.",
    heroDescription:
      "The literary forum and debating society of Calicut Medical College. Ocha trains students in Asian Parliamentary debate, conducts the prestigious Calicut Medical Quiz, publishes the peer-reviewed union journal & annual magazine, and curates Malayalam poetry circles.",
    stats: [
      { label: "Debate Trophies", value: "36 Wins", hint: "National & State circuits" },
      { label: "Quiz Leagues", value: "10 Editions", hint: "Hippocratic Quiz Circuit" },
      { label: "Journal Issues", value: "16 Printed", hint: "YUGA Literary Gazette" },
      { label: "Active Debaters", value: "190+", hint: "Trained student speakers" },
    ],
    initiatives: [
      {
        title: "Calicut Medicos Parliamentary Debate (CMPD)",
        description:
          "Premier national collegiate 3v3 parliamentary debate tournament welcoming law, medical, and engineering universities across India.",
        category: "Debate",
        status: "National Tier",
      },
      {
        title: "The Hippocratic Medical Quiz Circuit",
        description:
          "High-octane clinical diagnosis, medical history, pharmacological trivia, and pop-culture quiz league held each semester.",
        category: "Quizzing",
        status: "Active",
      },
      {
        title: "Vak — Malayalam Sahithya Vedhi",
        description:
          "Intimate monthly evenings dedicated to Malayalam literature, contemporary poetry readings, book critiques, and author interactions.",
        category: "Malayalam",
        status: "Monthly",
      },
      {
        title: "YUGA Union Journal & College Magazine",
        description:
          "Official student editorial board commissioning investigative medical essays, student memoirs, satirical comics, and research digests.",
        category: "Publishing",
        status: "Print & Digital",
      },
    ],
    achievements: [
      {
        title: "National Champions — AIIMS Pulse National Medical Quiz",
        year: "2024",
        awarder: "AIIMS New Delhi",
      },
      {
        title: "First Prize in Inter-Collegiate English Parliamentary Debate",
        year: "2024",
        awarder: "Kerala State Youth Commission",
      },
      {
        title: "State Best College Magazine Gold Award",
        year: "2023",
        awarder: "Kerala University of Health Sciences (KUHAS)",
      },
      {
        title: "National Youth Parliament Festival Finalist Delegation",
        year: "2023",
        awarder: "Ministry of Youth Affairs and Sports, Govt of India",
      },
    ],
    team: [
      {
        role: "Literary Secretary",
        name: "Meera Chandran",
        batch: "Phase 2 MBBS",
        phone: "+91 94474 56701",
        email: "literary.sec@yuga.local",
      },
      {
        role: "Debate Team Captain",
        name: "Akshay Suresh",
        batch: "Final MBBS Part 1",
        phone: "+91 94474 56702",
        email: "debate@yuga.local",
      },
      {
        role: "Quiz Master & League In-Charge",
        name: "Dr. Rohith K.",
        batch: "House Surgeon",
        phone: "+91 94474 56703",
        email: "quiz@yuga.local",
      },
      {
        role: "Editor-in-Chief, YUGA Magazine",
        name: "Sreya Rajan",
        batch: "Phase 2 MBBS",
        phone: "+91 94474 56704",
        email: "magazine.editor@yuga.local",
      },
    ],
  },
};

// Interactive Blood Group Selector for Jeevanam
const BLOOD_GROUPS = [
  { group: "O+", status: "High Demand", units: "24 Standby" },
  { group: "O-", status: "Critical Need", units: "6 Standby" },
  { group: "A+", status: "Stable", units: "32 Standby" },
  { group: "A-", status: "Rare", units: "8 Standby" },
  { group: "B+", status: "Stable", units: "28 Standby" },
  { group: "B-", status: "High Demand", units: "5 Standby" },
  { group: "AB+", status: "Universal Recipient", units: "14 Standby" },
  { group: "AB-", status: "Ultra Rare", units: "3 Standby" },
];

export function ClubPortalView({ slug }: { slug: ClubSlug }) {
  const club = CLUBS_CONFIG[slug] || CLUBS_CONFIG.jeevanam;
  const [activeTab, setActiveTab] = useState<"overview" | "engine" | "honors" | "leadership">("overview");
  const [selectedBlood, setSelectedBlood] = useState<string>("O+");
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  const copyNumber = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedContact(num);
    setTimeout(() => setCopiedContact(null), 2000);
  };

  const otherClubs = (["jeevanam", "praanah", "godha", "ocha"] as ClubSlug[]).filter(
    (s) => s !== club.id
  );

  const isJeevanam = club.id === "jeevanam";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isJeevanam
          ? "bg-[#07080a] text-slate-100 selection:bg-red-600 selection:text-white"
          : "bg-[#FDFBF7] text-slate-900 selection:bg-slate-900 selection:text-white"
      }`}
    >
      {/* 1. CINEMATIC HERO SECTION */}
      {isJeevanam ? (
        <JeevanamHero
          convenorPhone={club.team[0]?.phone}
          onOpenEmergencyDesk={() => {
            setActiveTab("engine");
            setTimeout(() => {
              document.getElementById("blood-dispatch")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        />
      ) : (
        <section className={`relative pt-32 pb-24 overflow-hidden ${club.heroGradient} text-white`}>
          {/* Ambient radial mesh gradient orbs */}
          <div
            className="absolute -top-48 -right-48 h-[650px] w-[650px] rounded-full blur-[140px] opacity-40 pointer-events-none"
            style={{ background: club.accent }}
          />
          <div
            className="absolute -bottom-48 -left-48 h-[550px] w-[550px] rounded-full blur-[120px] opacity-25 pointer-events-none"
            style={{ background: club.accent }}
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb with Apple Fluid Touch */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-10"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-md"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>GMC Home</span>
              </Link>
              <span className="text-white/40">/</span>
              <Link
                href="/subcommittees"
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-md"
              >
                Student Wings
              </Link>
              <span className="text-white/40">/</span>
              <span className="text-white font-bold px-2">{club.name} Portal</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left: The Machined Double-Bezel Emblem */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                {/* Outer Shell (Doppelrand hardware enclosure) */}
                <div
                  className="relative p-2 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl ring-1 ring-white/20 shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                  style={{
                    boxShadow: `0 25px 60px -15px rgba(${club.accentRgb}, 0.35)`,
                  }}
                >
                  {/* Inner Core container */}
                  <div className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-[calc(2.5rem-0.5rem)] bg-white p-4 flex items-center justify-center overflow-hidden shadow-inner">
                    <Image
                      src={club.logo}
                      alt={`${club.name} Official Emblem`}
                      fill
                      className="object-contain p-3"
                      sizes="224px"
                      priority
                    />
                  </div>
                </div>

                {/* Eyebrow Pill */}
                <div
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md ring-1"
                  style={{
                    color: club.accent,
                    backgroundColor: `rgba(${club.accentRgb}, 0.15)`,
                    borderColor: `rgba(${club.accentRgb}, 0.3)`,
                  }}
                >
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>{club.founded} · Official Wing</span>
                </div>
              </motion.div>

              {/* Right: Typography, Malayalam Identity & Hero Statement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                className="lg:col-span-8 text-center lg:text-left"
              >
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                    {club.category}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-3xl font-bold font-serif text-white/90">
                    {club.malayalam}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white mb-3 leading-[1.05]">
                  {club.name}
                </h1>

                <p className="text-lg sm:text-2xl font-medium text-slate-200 mb-6 font-display">
                  {club.tagline}
                </p>

                <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-3xl mb-8 font-normal">
                  {club.heroDescription}
                </p>

                {/* Action Island: Nested Button-in-Button Architecture */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <a
                    href={`tel:${club.team[0]?.phone}`}
                    className="group relative inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-bold text-white shadow-xl transition-all duration-300 active:scale-[0.97]"
                    style={{ backgroundColor: club.accent }}
                  >
                    <span>Connect with Convenor</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white transition-transform duration-300 group-hover:translate-x-0.5">
                      <Phone className="h-4 w-4" />
                    </span>
                  </a>

                  {club.id === "jeevanam" && (
                    <a
                      href="#blood-dispatch"
                      className="group relative inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-bold text-slate-900 bg-white shadow-xl transition-all duration-300 hover:bg-slate-100 active:scale-[0.97]"
                    >
                      <span>Emergency Blood Desk</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600 transition-transform duration-300 group-hover:translate-x-0.5">
                        <Flame className="h-4 w-4 animate-bounce" />
                      </span>
                    </a>
                  )}

                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition-all duration-200"
                  >
                    <Calendar className="h-4 w-4 text-white/70" />
                    <span>Wing Calendar</span>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Metric Hardware Strip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="mt-16 pt-10 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {club.stats.map((st, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-5 text-center lg:text-left transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                >
                  <div
                    className="text-3xl sm:text-4xl font-display font-black tracking-tight mb-1"
                    style={{ color: club.accent }}
                  >
                    {st.value}
                  </div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">
                    {st.label}
                  </div>
                  <div className="text-[11px] text-white/50">{st.hint}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 2. EMIL KOWALSKI SLIDING TABS CONTROLLER */}
      <section
        className={`sticky top-16 sm:top-20 z-30 py-3 shadow-xs transition-colors duration-200 ${
          isJeevanam
            ? "bg-[#07080a]/90 backdrop-blur-xl border-b border-white/10"
            : "bg-white/80 backdrop-blur-xl border-b border-slate-200"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto py-1 no-scrollbar">
            {[
              { id: "overview", label: "Overview & Mission", icon: ShieldCheck },
              {
                id: "engine",
                label:
                  club.id === "jeevanam"
                    ? "Live Blood Roster"
                    : club.id === "praanah"
                    ? "Cultural Wings"
                    : club.id === "godha"
                    ? "CMPL & Arena"
                    : "Debate & Quizzing",
                icon: Activity,
              },
              { id: "honors", label: "State Honors & Record", icon: Trophy },
              { id: "leadership", label: "Executive Council", icon: Users },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 active:scale-[0.98] ${
                    isActive
                      ? "text-white shadow-md"
                      : isJeevanam
                      ? "text-zinc-400 hover:text-white hover:bg-white/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  style={{
                    backgroundColor: isActive ? club.accent : "transparent",
                  }}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-club-tab"
                      className="absolute inset-0 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC TAB CONTENT CHOREOGRAPHY */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW & PHILOSOPHY */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="space-y-16"
            >
              {/* Mission / Vision Asymmetrical Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mission Card with Double Bezel */}
                <div
                  className={`p-1 rounded-[2rem] ring-1 transition-all duration-300 hover:shadow-lg ${
                    isJeevanam ? "ring-red-500/20 bg-red-950/20" : ""
                  }`}
                  style={isJeevanam ? undefined : {
                    backgroundColor: `rgba(${club.accentRgb}, 0.04)`,
                    borderColor: `rgba(${club.accentRgb}, 0.2)`,
                  }}
                >
                  <div className={`p-8 sm:p-10 rounded-[calc(2rem-0.25rem)] h-full flex flex-col justify-between ${
                    isJeevanam ? "bg-[#0c0d12] border border-white/10 text-white" : "bg-white text-slate-900"
                  }`}>
                    <div>
                      <div
                        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4"
                        style={{
                          color: club.accent,
                          backgroundColor: `rgba(${club.accentRgb}, ${isJeevanam ? 0.2 : 0.08})`,
                        }}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Core Mandate</span>
                      </div>
                      <h3
                        className={`text-2xl font-display font-bold tracking-tight mb-4 ${
                          isJeevanam ? "text-white" : ""
                        }`}
                        style={isJeevanam ? undefined : { color: club.accent }}
                      >
                        Our Mission
                      </h3>
                      <p className={`text-base sm:text-lg leading-relaxed font-normal ${
                        isJeevanam ? "text-slate-300" : "text-slate-700"
                      }`}>
                        {club.mission}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="p-1 rounded-[2rem] bg-slate-900 ring-1 ring-slate-800 transition-all duration-300 hover:shadow-lg text-white">
                  <div className="p-8 sm:p-10 rounded-[calc(2rem-0.25rem)] bg-slate-950 h-full flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 mb-4">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span>Horizon 2030</span>
                      </div>
                      <h3 className="text-2xl font-display font-bold tracking-tight text-white mb-4">
                        Long-Term Vision
                      </h3>
                      <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                        {club.vision}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Programs Bento Grid */}
              <div>
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <p
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                    style={{ color: club.accent }}
                  >
                    Annual Ecosystem
                  </p>
                  <h2 className={`text-3xl sm:text-4xl font-display font-bold tracking-tight ${
                    isJeevanam ? "text-white" : "text-slate-900"
                  }`}>
                    Flagship Operations &amp; Initiatives
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {club.initiatives.map((item, idx) => (
                    <div
                      key={idx}
                      className={`group relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                        isJeevanam
                          ? "bg-[#0c0d12] border border-white/10 hover:border-red-500/40 hover:shadow-xl text-white"
                          : "border border-slate-200/80 bg-white shadow-xs hover:border-slate-300 hover:shadow-xl"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                            style={{
                              color: club.accent,
                              backgroundColor: `rgba(${club.accentRgb}, ${isJeevanam ? 0.2 : 0.08})`,
                            }}
                          >
                            {item.category}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            isJeevanam ? "text-zinc-400" : "text-slate-500"
                          }`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {item.status}
                          </span>
                        </div>
                        <h4 className={`text-xl font-bold mb-2 leading-snug transition-colors ${
                          isJeevanam ? "text-white group-hover:text-red-400" : "text-slate-900 group-hover:text-slate-800"
                        }`}>
                          {item.title}
                        </h4>
                        <p className={`text-sm leading-relaxed ${
                          isJeevanam ? "text-zinc-400" : "text-slate-600"
                        }`}>
                          {item.description}
                        </p>
                      </div>

                      <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-bold ${
                        isJeevanam ? "border-white/10 text-zinc-500" : "border-slate-100 text-slate-500"
                      }`}>
                        <span>Initiative 0{idx + 1}</span>
                        <span
                          className="group-hover:translate-x-1 transition-transform"
                          style={{ color: club.accent }}
                        >
                          Official Program →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SPECIALIZED INTERACTIVE ENGINE */}
          {activeTab === "engine" && (
            <motion.div
              key="engine"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="space-y-12"
            >
              {/* JEEVANAM: LIVE BLOOD DISPATCH DESK */}
              {club.id === "jeevanam" && (
                <div id="blood-dispatch" className="space-y-8">
                  <div className={`rounded-3xl border p-8 sm:p-10 shadow-2xl ${
                    isJeevanam
                      ? "border-red-500/25 bg-gradient-to-br from-[#12090b] via-[#0c0d12] to-[#08090d]"
                      : "border-red-200 bg-gradient-to-br from-red-50/60 via-white to-red-50/30 shadow-xs"
                  }`}>
                    <div className="max-w-2xl mb-8">
                      <div className="inline-flex items-center gap-2 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                        <Flame className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                        <span>Live Casualty Dispatch Desk</span>
                      </div>
                      <h3 className={`text-2xl sm:text-3xl font-display font-bold ${
                        isJeevanam ? "text-white" : "text-slate-900"
                      }`}>
                        Emergency Blood Group Standby Registry
                      </h3>
                      <p className={`text-sm mt-2 ${
                        isJeevanam ? "text-zinc-400" : "text-slate-600"
                      }`}>
                        Real-time student donor standby counts across hostels. Click any blood group to connect instantly with the emergency coordinator.
                      </p>
                    </div>

                    {/* Blood group grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {BLOOD_GROUPS.map((bg) => {
                        const isSelected = selectedBlood === bg.group;
                        return (
                          <button
                            key={bg.group}
                            onClick={() => setSelectedBlood(bg.group)}
                            className={`p-5 rounded-2xl border text-left transition-all duration-300 active:scale-[0.98] ${
                              isSelected
                                ? "bg-gradient-to-br from-red-600 to-rose-700 text-white border-red-500 shadow-[0_8px_20px_rgba(225,29,72,0.4)] -translate-y-1"
                                : isJeevanam
                                ? "bg-[#111318] text-white border-white/10 hover:border-red-500/40 hover:bg-[#161820]"
                                : "bg-white text-slate-900 border-slate-200 hover:border-red-300 hover:shadow-xs"
                            }`}
                          >
                            <div className="text-3xl font-display font-black tracking-tight">
                              {bg.group}
                            </div>
                            <div
                              className={`text-xs font-bold mt-1 ${
                                isSelected ? "text-red-100" : "text-red-400"
                              }`}
                            >
                              {bg.status}
                            </div>
                            <div
                              className={`text-[11px] mt-0.5 ${
                                isSelected ? "text-white/80" : isJeevanam ? "text-zinc-400" : "text-slate-500"
                              }`}
                            >
                              {bg.units}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Blood Emergency Call Box */}
                    <div className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl ${
                      isJeevanam
                        ? "border-white/10 bg-[#12131a] border border-white/5"
                        : "border-red-200/80 bg-white/80"
                    }`}>
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          isJeevanam ? "text-zinc-400" : "text-slate-500"
                        }`}>
                          Requesting Group:
                        </span>
                        <div className="text-xl font-bold text-red-500">
                          {selectedBlood} Emergency Triage Assistance
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href="tel:+919447123402"
                          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30 transition-all active:scale-[0.98]"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Dispatch Hotline (+91 94471 23402)</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRAANAH: CULTURAL WINGS SPOTLIGHT */}
              {club.id === "praanah" && (
                <div className="space-y-8">
                  <div className="text-center max-w-2xl mx-auto mb-6">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                      6 Performing Wings of Praanah
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Specialized societies driving cultural productions, band recordings, and festival showcases.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        name: "Symphony Band & Western Music",
                        lead: "Devanand K.",
                        specs: "Electric guitars, keyboard, drum kit, live audio mastering",
                      },
                      {
                        name: "Natyarangam Classical Dance",
                        lead: "Sreelakshmi P.",
                        specs: "Bharatanatyam, Mohiniyattam, Kathakali, stage choreography",
                      },
                      {
                        name: "Rangabhoomi Theatre Society",
                        lead: "Kiran Joseph",
                        specs: "Street plays, satirical mime, Malayalam drama, voice acting",
                      },
                      {
                        name: "Chithrashala Visual Arts",
                        lead: "Anirudh S.",
                        specs: "Live canvas painting, anatomical illustration, graffiti",
                      },
                      {
                        name: "CineGMC Short Film Crew",
                        lead: "Arun Joy",
                        specs: "Cinematography, 4K color grading, documentary shorts",
                      },
                      {
                        name: "Dhwani Folk & Acoustic Circle",
                        lead: "Meenakshi R.",
                        specs: "Traditional Nadan Pattu, acoustic unplugged sessions",
                      },
                    ].map((wing, i) => (
                      <div
                        key={i}
                        className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/40 via-white to-white p-6 shadow-xs hover:shadow-lg transition-all"
                      >
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                          Wing 0{i + 1}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                          {wing.name}
                        </h4>
                        <p className="text-xs text-slate-500 mb-4">{wing.specs}</p>
                        <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700">
                          Lead: <span className="text-amber-800">{wing.lead}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GODHA: CMPL LEAGUE ARENA */}
              {club.id === "godha" && (
                <div className="space-y-8">
                  <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-white p-8 sm:p-10 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                          Flagship Championship
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                          CMPL — Calicut Medicos Premier League
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3.5 py-1 text-xs font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
                        Season 8 Registrations Open
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <div className="text-xs font-bold text-emerald-700 uppercase">
                          Tournament Format
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                          16 Batch Franchises
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          T20 floodlit cricket matches with live DRS, leather balls, and student player auctions held in the central college auditorium.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <div className="text-xs font-bold text-emerald-700 uppercase">
                          Arena Grounds
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                          GMC Olympic Stadium
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Full-sized boundary turf, floodlit 4-tower lighting, and digital scoreboard operated by the sports council technical wing.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <div className="text-xs font-bold text-emerald-700 uppercase">
                          Reigning Champions
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                          Batch of 2021 (The Vikings)
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Defended their title with a thrilling final against House Surgeons XI before 900+ cheering supporters.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OCHA: LITERARY FORUM & QUIZZING */}
              {club.id === "ocha" && (
                <div className="space-y-8">
                  <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50/60 via-white to-white p-8 sm:p-10 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-violet-700">
                          Official Publications
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                          YUGA Literary Journal &amp; Campus Gazette
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 text-violet-800 px-3.5 py-1 text-xs font-bold">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Volume 16 In Circulation</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                          Bi-Monthly
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                          The Hippocratic Inquirer Gazette
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Print and digital student broadsheet covering campus governance investigations, medical ethics columns, and faculty spotlights.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                          Annual Anthology
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                          Aksharam Malayalam Sahithya Edition
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Curated collection of short stories, poetry, and reflective memoirs written by students across MBBS, BDS, and Nursing batches.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: STATE HONORS & ACHIEVEMENTS */}
          {activeTab === "honors" && (
            <motion.div
              key="honors"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto mb-8">
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                  style={{ color: club.accent }}
                >
                  Hall of Laurels
                </p>
                <h2 className={`text-3xl sm:text-4xl font-display font-bold tracking-tight ${
                  isJeevanam ? "text-white" : "text-slate-900"
                }`}>
                  State &amp; National Commendations
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {club.achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-3xl p-7 transition-all duration-300 ${
                      isJeevanam
                        ? "bg-[#0c0d12] border border-white/10 hover:border-red-500/40 text-white"
                        : "border border-slate-200/90 bg-white shadow-xs hover:shadow-xl"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-2xl font-black font-display"
                        style={{ color: club.accent }}
                      >
                        {ach.year}
                      </span>
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `rgba(${club.accentRgb}, 0.1)`,
                          color: club.accent,
                        }}
                      >
                        <Trophy className="h-4 w-4" />
                      </span>
                    </div>

                    <h4 className={`text-base sm:text-lg font-bold mb-2 leading-snug ${
                      isJeevanam ? "text-white" : "text-slate-900"
                    }`}>
                      {ach.title}
                    </h4>
                    <p className={`text-xs font-medium ${
                      isJeevanam ? "text-zinc-400" : "text-slate-500"
                    }`}>
                      Conferred by {ach.awarder}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: EXECUTIVE COUNCIL & CONTACT */}
          {activeTab === "leadership" && (
            <motion.div
              key="leadership"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="space-y-12"
            >
              <div className="text-center max-w-2xl mx-auto mb-8">
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                  style={{ color: club.accent }}
                >
                  Student Office Bearers
                </p>
                <h2 className={`text-3xl sm:text-4xl font-display font-bold tracking-tight ${
                  isJeevanam ? "text-white" : "text-slate-900"
                }`}>
                  Executive Committee (2026–2027)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {club.team.map((member, idx) => (
                  <div
                    key={idx}
                    className={`group rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                      isJeevanam
                        ? "bg-[#0c0d12] border border-white/10 hover:border-red-500/40 hover:shadow-xl text-white"
                        : "border border-slate-200/80 bg-white shadow-xs hover:border-slate-300 hover:shadow-xl"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl font-display font-black text-xl text-white shadow-xs"
                          style={{ backgroundColor: club.accent }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                          style={{
                            color: club.accent,
                            backgroundColor: `rgba(${club.accentRgb}, ${isJeevanam ? 0.2 : 0.1})`,
                          }}
                        >
                          {member.role}
                        </span>
                      </div>

                      <h4 className={`text-base font-bold leading-snug ${
                        isJeevanam ? "text-white" : "text-slate-900"
                      }`}>
                        {member.name}
                      </h4>
                      <p className={`text-xs font-medium mt-1 ${
                        isJeevanam ? "text-zinc-400" : "text-slate-500"
                      }`}>
                        {member.batch}
                      </p>
                    </div>

                    <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
                      isJeevanam ? "border-white/10" : "border-slate-100"
                    }`}>
                      <a
                        href={`tel:${member.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
                        style={{ color: club.accent }}
                        title="Call officer"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>{member.phone}</span>
                      </a>

                      <button
                        onClick={() => copyNumber(member.phone)}
                        className={`text-[10px] font-bold transition-colors ${
                          isJeevanam ? "text-zinc-500 hover:text-white" : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {copiedContact === member.phone ? (
                          <span className="text-emerald-500 flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> Copied
                          </span>
                        ) : (
                          "Copy"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. EXPLORE OTHER CLUBS (CROSS-PORTAL SWITCHER) */}
      <section className={`py-20 border-t ${
        isJeevanam ? "border-white/10 bg-[#07080a]" : "border-slate-200 bg-white"
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${
                isJeevanam ? "text-zinc-500" : "text-slate-400"
              }`}>
                YUGA Ecosystem
              </p>
              <h3 className={`text-2xl font-display font-bold ${
                isJeevanam ? "text-white" : "text-slate-900"
              }`}>
                Explore Other Student Sub-Committee Portals
              </h3>
            </div>
            <Link
              href="/subcommittees"
              className={`inline-flex items-center gap-1 text-sm font-bold transition-colors ${
                isJeevanam ? "text-zinc-300 hover:text-white" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <span>View All 8 Council Wings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otherClubs.map((otherSlug) => {
              const other = CLUBS_CONFIG[otherSlug];
              return (
                <Link
                  key={otherSlug}
                  href={`/clubs/${otherSlug}`}
                  className={`group relative flex items-center gap-4 rounded-3xl border p-5 transition-all duration-300 ${
                    isJeevanam
                      ? "border-white/10 bg-[#0c0d12] hover:border-red-500/40 hover:shadow-xl hover:-translate-y-1 text-white"
                      : "border-slate-200/80 bg-[#FDFBF7] shadow-xs hover:border-slate-300 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-white shadow-xs p-1.5 shrink-0 border border-slate-100">
                    <Image
                      src={other.logo}
                      alt={other.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        isJeevanam ? "text-zinc-400" : "text-slate-400"
                      }`}>
                        {other.category}
                      </span>
                      <ArrowUpRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        isJeevanam ? "text-zinc-400" : "text-slate-400"
                      }`} />
                    </div>
                    <h4 className={`text-lg font-bold transition-colors truncate ${
                      isJeevanam ? "text-white group-hover:text-red-400" : "text-slate-900 group-hover:text-slate-800"
                    }`}>
                      {other.name}
                    </h4>
                    <p className={`text-xs font-serif ${
                      isJeevanam ? "text-zinc-400" : "text-slate-500"
                    }`}>
                      {other.malayalam} · {other.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ClubPortalView;
