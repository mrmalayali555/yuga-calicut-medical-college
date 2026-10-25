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
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/30 via-white to-white">
      <EventsView initialEvents={events as any} />
    </div>
  );
}
