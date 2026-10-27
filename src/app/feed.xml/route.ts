import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { getEvents, getNotifications, getInterventions } from "@/lib/queries";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string) {
  return (unsafe || "").replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const [events, notifications, interventions] = await Promise.all([
    getEvents({ take: 20 }).catch(() => []),
    getNotifications(20).catch(() => []),
    getInterventions(20).catch(() => []),
  ]);

  const allItems: Array<{
    title: string;
    link: string;
    description: string;
    pubDate: string;
    guid: string;
    category: string;
  }> = [];

  for (const n of notifications as any[]) {
    if (n && n.title) {
      allItems.push({
        title: n.title,
        link: `${SITE.url}/notifications/${n.slug || ""}`,
        description: n.description || n.title,
        pubDate: new Date(n.date || Date.now()).toUTCString(),
        guid: `${SITE.url}/notifications/${n.slug || n.id || Math.random()}`,
        category: "Circular",
      });
    }
  }

  for (const e of events as any[]) {
    if (e && e.title) {
      allItems.push({
        title: e.title,
        link: `${SITE.url}/events/${e.slug || ""}`,
        description: e.description || e.title,
        pubDate: new Date(e.date || Date.now()).toUTCString(),
        guid: `${SITE.url}/events/${e.slug || e.id || Math.random()}`,
        category: "Event",
      });
    }
  }

  for (const i of interventions as any[]) {
    if (i && i.title) {
      allItems.push({
        title: i.title,
        link: `${SITE.url}/interventions/${i.slug || ""}`,
        description: i.description || i.title,
        pubDate: new Date(i.date || Date.now()).toUTCString(),
        guid: `${SITE.url}/interventions/${i.slug || i.id || Math.random()}`,
        category: "Intervention",
      });
    }
  }

  // Sort newest first
  allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>YUGA — GMC Kozhikode Union Announcements &amp; Events</title>
    <link>${SITE.url}</link>
    <description>Official updates, campus interventions, KUHS notifications, and events from YUGA, Government Medical College Kozhikode 2026–27.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${allItems
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(item.description)}</description>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
