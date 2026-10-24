import { AdminHeader } from "@/components/admin/admin-ui";
import { AchievementForm } from "@/components/admin/achievement-form";
import { createAchievement } from "@/lib/actions/achievements";

export default function NewAchievementPage() {
  return (
    <>
      <AdminHeader title="New achievement" description="Celebrate student and college union laurels." />
      <AchievementForm action={createAchievement} />
    </>
  );
}
