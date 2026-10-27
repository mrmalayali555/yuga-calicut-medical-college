import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { db } from "@/lib/db";

const CLUB_SLUGS = ["jeevanam", "praanah", "godha", "ocha"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.url.replace(/\/$/, "");

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/emergency`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/notifications`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/calendar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/interventions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/subcommittees`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/finance`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/complaints`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Dedicated Club Hubs
    ...CLUB_SLUGS.map((slug) => ({
      url: `${baseUrl}/clubs/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  try {
    const [events, notifications, achievements, interventions, subcommittees] =
      await Promise.all([
        db.event.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        db.notification.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        db.achievement.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        db.intervention.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        db.committee.findMany({ select: { slug: true, createdAt: true } }),
      ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...events.map((e) => ({
        url: `${baseUrl}/events/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
      ...notifications.map((n) => ({
        url: `${baseUrl}/notifications/${n.slug}`,
        lastModified: n.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...achievements.map((a) => ({
        url: `${baseUrl}/achievements/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
      ...interventions.map((i) => ({
        url: `${baseUrl}/interventions/${i.slug}`,
        lastModified: i.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
      ...subcommittees.map((s) => ({
        url: `${baseUrl}/subcommittees/${s.slug}`,
        lastModified: s.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
