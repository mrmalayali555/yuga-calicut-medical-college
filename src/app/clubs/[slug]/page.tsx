import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ClubPortalView,
  type ClubSlug,
  type ClubConfig,
  CLUBS_CONFIG,
} from "@/components/clubs/club-portal-view";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const VALID_SLUGS: ClubSlug[] = ["jeevanam", "praanah", "godha", "ocha"];

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug as ClubSlug)) {
    return { title: "Club Not Found · YUGA Student Union" };
  }

  const titles: Record<ClubSlug, string> = {
    jeevanam: "Jeevanam (ജീവനം) — Voluntary Blood Donation Club",
    praanah: "Praanah (പ്രാണഃ) — Fine Arts, Music & Cultural Society",
    godha: "Godha (ഗോദ) — Sports, Athletics & CMPL Arena",
    ocha: "Ocha (ഒച്ച) — Literary, Quizzing & Debating Society",
  };

  const descriptions: Record<ClubSlug, string> = {
    jeevanam:
      "Official 24/7 Voluntary Blood Donor matching, Platelet Apheresis registry, and casualty triage assistance at GMC Kozhikode.",
    praanah:
      "The creative heartbeat of Calicut Medical College. Symphony Band, Natyarangam Classical Dance, Rangabhoomi Theatre, and annual arts festival.",
    godha:
      "Athletic powerhouse of GMC Kozhikode. Organizers of the Calicut Medicos Premier League (CMPL), football tournaments, and university sports.",
    ocha:
      "Literary forum and debating society of Calicut Medical College. Parliamentary debate, Hippocratic medical quizzes, and union journals.",
  };

  const currentTitle = titles[slug as ClubSlug];
  const currentDesc = descriptions[slug as ClubSlug];

  return {
    title: currentTitle,
    description: currentDesc,
    alternates: {
      canonical: `/clubs/${slug}`,
    },
    openGraph: {
      title: currentTitle,
      description: currentDesc,
      url: `/clubs/${slug}`,
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: currentTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentTitle,
      description: currentDesc,
      images: ["/og.png"],
    },
  };
}

async function getClubData(slug: ClubSlug): Promise<ClubConfig> {
  const baseClub = CLUBS_CONFIG[slug] || CLUBS_CONFIG.jeevanam;
  try {
    const row = await db.setting.findUnique({ where: { key: `club:${slug}` } });
    if (!row) return baseClub;
    const dbOverrides = JSON.parse(row.value) as Partial<ClubConfig>;
    return {
      ...baseClub,
      name: dbOverrides.name ?? baseClub.name,
      malayalam: dbOverrides.malayalam ?? baseClub.malayalam,
      tagline: dbOverrides.tagline ?? baseClub.tagline,
      category: dbOverrides.category ?? baseClub.category,
      founded: dbOverrides.founded ?? baseClub.founded,
      logo: dbOverrides.logo ?? baseClub.logo,
      accent: dbOverrides.accent ?? baseClub.accent,
      accentRgb: dbOverrides.accentRgb ?? baseClub.accentRgb,
      heroGradient: dbOverrides.heroGradient ?? baseClub.heroGradient,
      mission: dbOverrides.mission ?? baseClub.mission,
      vision: dbOverrides.vision ?? baseClub.vision,
      heroDescription: dbOverrides.heroDescription ?? baseClub.heroDescription,
      stats: [],
      initiatives:
        slug === "godha"
          ? []
          : (dbOverrides.initiatives ?? baseClub.initiatives),
      achievements: dbOverrides.achievements ?? baseClub.achievements,
      team: dbOverrides.team ?? baseClub.team,
    };
  } catch {
    return baseClub;
  }
}

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug as ClubSlug)) {
    notFound();
  }

  const initialClub = await getClubData(slug as ClubSlug);

  return <ClubPortalView slug={slug as ClubSlug} initialClub={initialClub} />;
}

