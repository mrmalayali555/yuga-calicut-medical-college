import { Metadata } from "next";
import { getEvents } from "@/lib/queries";
import { ensureInitialEvents } from "@/lib/initial-sync";
import { EventsView } from "@/components/events/events-view";

export const metadata: Metadata = {
  title: "Events & Fests · YUGA — GMC Kozhikode",
  description:
    "Explore upcoming campus stages, reserve entry passes, and view photo memories from completed fests at Government Medical College, Kozhikode.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage() {
  await ensureInitialEvents();
  const events = await getEvents();

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative z-10">
        <EventsView initialEvents={events as any} />
      </div>
    </div>
  );
}
