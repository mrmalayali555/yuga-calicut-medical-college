import { Metadata } from "next";
import { getAchievements } from "@/lib/queries";
import { AchievementsView } from "@/components/achievements/achievements-view";

export const metadata: Metadata = {
  title: "Honors & Achievements · YUGA — GMC Kozhikode",
  description:
    "Commemorating championships, KUHS Arts festival triumphs, ICMR grants, and sports gold won by Calicut Medicos.",
};

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative z-10">
        <AchievementsView initialAchievements={achievements as any} />
      </div>
    </div>
  );
}
