import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClubPortalView, type ClubSlug } from "@/components/clubs/club-portal-view";

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
    jeevanam: "Jeevanam (ജീവനം) — Voluntary Blood Donation Club | YUGA",
    praanah: "Praanah (പ്രാണഃ) — Fine Arts, Music & Cultural Society | YUGA",
    godha: "Godha (ഗോദ) — Sports, Athletics & CMPL Arena | YUGA",
    ocha: "Ocha (ഒച്ച) — Literary, Quizzing & Debating Society | YUGA",
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

  return {
    title: titles[slug as ClubSlug],
    description: descriptions[slug as ClubSlug],
  };
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

  return <ClubPortalView slug={slug as ClubSlug} />;
}
