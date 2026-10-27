import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-ui";
import { ClubAdminEditor } from "@/components/admin/club-admin-editor";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";
import type { ClubSlug, ClubSettings } from "@/lib/actions/clubs";

// Static defaults — same data that club-portal-view uses internally
const DEFAULTS: Record<ClubSlug, ClubSettings> = {
  jeevanam: {
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
    ],
  },
  praanah: {
    name: "Praanah",
    malayalam: "പ്രാണഃ",
    tagline: "Fine Arts, Music & Cultural Society",
    category: "Arts & Culture",
    founded: "Est. 2010",
    logo: "/clubs/praanah.png",
    accent: "#d97706",
    accentRgb: "217, 119, 6",
    heroGradient: "from-amber-950 via-slate-900 to-orange-950",
    mission:
      "To cultivate and celebrate the creative spirit of Calicut Medical College through world-class performances, classical arts, and an inclusive cultural calendar.",
    vision:
      "A GMC that leads Kerala's collegiate arts scene — where every medico finds a stage, a canvas, or a note to call their own.",
    heroDescription:
      "The creative heartbeat of Calicut Medical College. Praanah houses the Symphony Band, Natyarangam Classical Dance troupe, Rangabhoomi Theatre ensemble, and organises the annual arts festival.",
    stats: [
      { label: "Active Artists", value: "320+", hint: "Across all disciplines" },
      { label: "Annual Performances", value: "40+", hint: "On and off campus" },
      { label: "Art Forms", value: "12+", hint: "Classical to contemporary" },
      { label: "Festival Editions", value: "14", hint: "Annual arts fest" },
    ],
    initiatives: [
      {
        title: "Symphony Band",
        description: "70-piece collegiate orchestra representing GMC at state and national inter-medical festivals.",
        category: "Music",
        status: "Active",
      },
      {
        title: "Natyarangam Classical Dance",
        description: "Bharatanatyam, Mohiniyattam, and Kuchipudi troupe with award-winning choreography.",
        category: "Dance",
        status: "Active",
      },
      {
        title: "Rangabhoomi Theatre",
        description: "Annual Malayalam & English drama productions and competitive street theatre.",
        category: "Theatre",
        status: "Active",
      },
      {
        title: "Annual Arts Festival",
        description: "4-day inter-collegiate cultural extravaganza hosted by GMC Kozhikode each academic year.",
        category: "Festival",
        status: "Annual",
      },
    ],
    achievements: [
      {
        title: "Best Cultural Club — Kerala Inter-Medical Arts Fest",
        year: "2024",
        awarder: "Kerala University of Health Sciences",
      },
    ],
    team: [
      {
        role: "Convenor",
        name: "Arya Krishnan",
        batch: "Phase 2 MBBS",
        phone: "+91 94471 55001",
        email: "praanah.convenor@yuga.local",
      },
    ],
  },
  godha: {
    name: "Godha",
    malayalam: "ഗോദ",
    tagline: "Sports, Athletics & Fitness Council",
    category: "Sports & Athletics",
    founded: "Est. 2006",
    logo: "/clubs/godha-logo.png",
    accent: "#059669",
    accentRgb: "5, 150, 105",
    heroGradient: "from-emerald-950 via-slate-900 to-teal-950",
    mission:
      "To build athletic excellence and sports culture at GMC Kozhikode — producing university-level champions and fostering holistic fitness for every medico.",
    vision:
      "A GMC that competes at the national inter-medical level across all major sports, with world-class training infrastructure and coaching support.",
    heroDescription:
      "Athletic powerhouse of GMC Kozhikode. Godha organises the Calicut Medicos Premier League (CMPL), inter-batch football tournaments, and university sports representation.",
    stats: [
      { label: "Sports Disciplines", value: "18+", hint: "Competitive & recreational" },
      { label: "CMPL Teams", value: "12", hint: "Annual cricket league" },
      { label: "University Champions", value: "23+", hint: "Since inception" },
      { label: "Active Athletes", value: "500+", hint: "Across all batches" },
    ],
    initiatives: [
      {
        title: "Calicut Medicos Premier League (CMPL)",
        description: "Annual inter-batch T20 cricket tournament with 12 teams and live streaming.",
        category: "Cricket",
        status: "Annual",
      },
      {
        title: "GMC Inter-Batch Football Cup",
        description: "Month-long football knockout tournament across all MBBS batches and house surgeon teams.",
        category: "Football",
        status: "Annual",
      },
      {
        title: "University Sports Representation",
        description: "Training and logistics support for GMC athletes representing KUHS at state and national meets.",
        category: "Athletics",
        status: "Ongoing",
      },
      {
        title: "Morning Fitness Programme",
        description: "Daily 5:30 AM structured fitness sessions at the GMC stadium — open to all batches.",
        category: "Fitness",
        status: "Daily",
      },
    ],
    achievements: [
      {
        title: "KUHS Inter-Medical Football Champions",
        year: "2024",
        awarder: "Kerala University of Health Sciences",
      },
    ],
    team: [
      {
        role: "Convenor",
        name: "Roshan Nair",
        batch: "Final MBBS Part 2",
        phone: "+91 94471 66001",
        email: "godha.convenor@yuga.local",
      },
    ],
  },
  ocha: {
    name: "Ocha",
    malayalam: "ഒച്ച",
    tagline: "Literary, Quizzing & Debating Society",
    category: "Literary & Debate",
    founded: "Est. 2012",
    logo: "/clubs/ocha.png",
    accent: "#7c3aed",
    accentRgb: "124, 58, 237",
    heroGradient: "from-violet-950 via-slate-900 to-purple-950",
    mission:
      "To champion rigorous intellectual discourse, literary expression, and debating excellence at GMC Kozhikode — building articulate, critical thinkers in medicine.",
    vision:
      "A GMC where every student's voice is heard — through debate, writing, and the pursuit of knowledge beyond the curriculum.",
    heroDescription:
      "Literary forum and debating society of Calicut Medical College. Ocha hosts parliamentary debates, Hippocratic medical quizzes, and publishes the union's annual journal.",
    stats: [
      { label: "Active Members", value: "280+", hint: "Writers, debaters, quizzers" },
      { label: "Debate Tournaments", value: "8+", hint: "Hosted annually" },
      { label: "Journal Editions", value: "10", hint: "Annual literary journal" },
      { label: "Quiz Events", value: "15+", hint: "Medical & general" },
    ],
    initiatives: [
      {
        title: "Parliamentary Debate Championship",
        description: "Annual British Parliamentary debate tournament open to all medical colleges in Kerala.",
        category: "Debate",
        status: "Annual",
      },
      {
        title: "Hippocratic Medical Quiz",
        description: "Kerala's premier inter-medical college medical knowledge quiz competition.",
        category: "Quiz",
        status: "Annual",
      },
      {
        title: "YUGA Literary Journal",
        description: "Annual peer-reviewed student journal covering medicine, humanities, and policy.",
        category: "Publication",
        status: "Annual",
      },
      {
        title: "Weekly Write-Up Club",
        description: "Weekly creative writing and essay workshop sessions for all interested medicos.",
        category: "Writing",
        status: "Weekly",
      },
    ],
    achievements: [
      {
        title: "Best Debating Society — Kerala Medical Students' Forum",
        year: "2024",
        awarder: "Kerala Medical Students' Forum",
      },
    ],
    team: [
      {
        role: "Convenor",
        name: "Devika Nambiar",
        batch: "Phase 2 MBBS",
        phone: "+91 94471 77001",
        email: "ocha.convenor@yuga.local",
      },
    ],
  },
};

const VALID_SLUGS: ClubSlug[] = ["jeevanam", "praanah", "godha", "ocha"];

export const dynamic = "force-dynamic";

const CLUB_META: Record<ClubSlug, { color: string; emoji: string }> = {
  jeevanam: { color: "#dc2626", emoji: "🩸" },
  praanah: { color: "#d97706", emoji: "🎭" },
  godha: { color: "#059669", emoji: "🏆" },
  ocha: { color: "#7c3aed", emoji: "📚" },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminClubDetailPage({ params }: Props) {
  await requireAdmin();
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug as ClubSlug)) {
    notFound();
  }

  const clubSlug = slug as ClubSlug;
  const defaults = DEFAULTS[clubSlug];
  const meta = CLUB_META[clubSlug];

  // Load saved overrides
  const saved = await db.setting
    .findUnique({ where: { key: `club:${clubSlug}` } })
    .then((r) => (r ? (JSON.parse(r.value) as ClubSettings) : null))
    .catch(() => null);

  const displayName = saved?.name ?? defaults.name ?? clubSlug;
  const displayLogo = saved?.logo ?? defaults.logo ?? "";

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link
          href="/admin/clubs"
          className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Clubs
        </Link>
        <span className="text-[var(--text-muted)]">/</span>
        <span className="font-semibold text-[var(--text-primary)]">{displayName}</span>
      </div>

      <AdminHeader
        title={`${meta.emoji} ${displayName} Portal Editor`}
        description={`Customise content, branding, stats, initiatives, team, and logo for the ${displayName} club portal.`}
      />

      {/* Live Preview Link */}
      <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-elevated)]">
        <div
          className="h-12 w-12 rounded-xl shrink-0 overflow-hidden border border-[var(--border-primary)] bg-white flex items-center justify-center"
          style={{ borderColor: meta.color + "33" }}
        >
          {displayLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayLogo} alt={displayName} className="h-10 w-10 object-contain p-0.5" />
          ) : (
            <span className="text-2xl">{meta.emoji}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)]">{displayName} Club Portal</p>
          <p className="text-xs text-[var(--text-muted)] truncate">
            {saved ? "✅ Custom overrides active" : "⚡ Using default content — no changes saved yet"}
          </p>
        </div>
        <a
          href={`/clubs/${clubSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-primary)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors shrink-0"
        >
          Preview
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <ClubAdminEditor slug={clubSlug} defaults={defaults} saved={saved} />
    </>
  );
}
