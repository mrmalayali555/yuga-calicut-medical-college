import { Metadata } from "next";
import { getInterventions, getGridLayoutSettings } from "@/lib/queries";
import { ensureInitialInterventions } from "@/lib/initial-sync";
import { InterventionsView } from "@/components/interventions/interventions-view";

export const metadata: Metadata = {
  title: "Student Welfare Interventions & Policy Petitions",
  description:
    "Official petitions, policy memorandums, and student welfare representations submitted by YUGA to DME Kerala, KUHS, and Hospital Administration.",
  alternates: {
    canonical: "/interventions",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InterventionsPage() {
  await ensureInitialInterventions();
  const [interventions, gridLayout] = await Promise.all([
    getInterventions(),
    getGridLayoutSettings(),
  ]);

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-16 sm:pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative z-10">
        <InterventionsView
          initialInterventions={interventions as any}
          columns={gridLayout.interventionsColumns}
          mobileColumns={gridLayout.interventionsMobileColumns}
        />
      </div>
    </div>
  );
}
