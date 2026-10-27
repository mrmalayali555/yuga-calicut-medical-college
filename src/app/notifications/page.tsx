import { Metadata } from "next";
import { getNotifications, getGridLayoutSettings } from "@/lib/queries";
import { NotificationsView } from "@/components/notifications/notifications-view";

export const metadata: Metadata = {
  title: "Official Circulars, KUHS Notices & Directives",
  description:
    "Authenticated communications from the College Union, Dean of Academics, KUHS Senate, and Hostel Wardens at Government Medical College, Kozhikode.",
  alternates: {
    canonical: "/notifications",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NotificationsPage() {
  const [notifications, gridLayout] = await Promise.all([
    getNotifications(),
    getGridLayoutSettings(),
  ]);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative z-10">
        <NotificationsView
          initialNotifications={notifications as any}
          columns={gridLayout.notificationsColumns}
        />
      </div>
    </div>
  );
}

