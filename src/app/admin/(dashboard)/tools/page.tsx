import { Metadata } from "next";
import { db } from "@/lib/db";
import { getShortLinks } from "@/lib/actions/tools";
import { AdminToolsView } from "@/components/admin/admin-tools-view";

export const metadata: Metadata = {
  title: "Admin Tools · Short Links & QR Studio · YUGA",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminToolsPage() {
  const [links, events, forms] = await Promise.all([
    getShortLinks(),
    db.event.findMany({
      select: { id: true, title: true, slug: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
    db.registrationForm.findMany({
      select: { id: true, title: true, slug: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <AdminToolsView
        initialLinks={links}
        events={events}
        forms={forms}
      />
    </div>
  );
}
