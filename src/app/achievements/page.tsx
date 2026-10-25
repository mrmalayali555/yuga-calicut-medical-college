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
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/30 via-white to-white">
      <AchievementsView initialAchievements={achievements as any} />
    </div>
  );
}
