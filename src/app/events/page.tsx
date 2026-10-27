import { Metadata } from "next";
import { getEvents, getGridLayoutSettings } from "@/lib/queries";
import { ensureInitialEvents } from "@/lib/initial-sync";
import { EventsView } from "@/components/events/events-view";

export const metadata: Metadata = {
  title: "Campus Events, Fests & Stage Passes",
  description:
    "Explore upcoming campus stages, reserve entry passes, and view photo memories from completed fests at Government Medical College, Kozhikode.",
  alternates: {
    canonical: "/events",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage() {
  await ensureInitialEvents();
  const [events, gridLayout] = await Promise.all([
    getEvents(),
    getGridLayoutSettings(),
  ]);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative z-10">
        <EventsView
          initialEvents={events as any}
          columns={gridLayout.eventsColumns}
          mobileColumns={gridLayout.eventsMobileColumns}
        />
      </div>
    </div>
  );
}
