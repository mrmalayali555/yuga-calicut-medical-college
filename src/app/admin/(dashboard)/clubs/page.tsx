import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/require-admin";
import { db } from "@/lib/db";

const CLUBS = [
  {
    slug: "jeevanam",
    name: "Jeevanam",
    malayalam: "ജീവനം",
    tagline: "Voluntary Blood Donation & Emergency Wing",
    color: "#dc2626",
    defaultLogo: "/clubs/jeevanam-gold.png",
  },
  {
    slug: "praanah",
    name: "Praanah",
    malayalam: "പ്രാണഃ",
    tagline: "Fine Arts, Music & Cultural Society",
    color: "#d97706",
    defaultLogo: "/clubs/praanah.jpg",
  },
  {
    slug: "godha",
    name: "Godha",
    malayalam: "ഗോദ",
    tagline: "Sports, Athletics & Fitness Council",
    color: "#059669",
    defaultLogo: "/clubs/godha-logo.png",
  },
  {
    slug: "ocha",
    name: "Ocha",
    malayalam: "ഒച്ച",
    tagline: "Literary, Quizzing & Debating Society",
    color: "#7c3aed",
    defaultLogo: "/clubs/ocha.png",
  },
] as const;

export default async function AdminClubsPage() {
  await requireAdmin();

  // Load persisted settings for each club
  const settingsRows = await db.setting.findMany({
    where: { key: { in: CLUBS.map((c) => `club:${c.slug}`) } },
  }).catch(() => []);
  const settingsMap = Object.fromEntries(
    settingsRows.map((r) => [r.key.replace("club:", ""), JSON.parse(r.value)])
  );

  return (
    <>
      <AdminHeader
        title="Club Portal Management"
        description="Edit each club's content, branding, mission, stats, initiatives, team, and logo."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {CLUBS.map((club) => {
          const saved = settingsMap[club.slug] ?? {};
          const logoSrc = saved.logo ?? club.defaultLogo;
          const hasOverrides = !!settingsMap[club.slug];

          return (
            <AdminCard key={club.slug} className="flex flex-col gap-0 p-0 overflow-hidden">
              {/* Color header strip */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: saved.accent ?? club.color }}
              />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start gap-4 mb-4">
                  {/* Logo */}
                  <div className="relative h-16 w-16 shrink-0 rounded-2xl border border-[var(--border-primary)] bg-white overflow-hidden shadow-sm">
                    <Image
                      src={logoSrc}
                      alt={club.name}
                      fill
                      className="object-contain p-1.5"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">{club.name}</h3>
                      <span className="text-base text-[var(--text-muted)] font-serif">{club.malayalam}</span>
                      {hasOverrides && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Customised
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">{saved.tagline ?? club.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-2">
                  <Link
                    href={`/admin/clubs/${club.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Edit Portal
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={`/clubs/${club.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    View Live
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </>
  );
}
