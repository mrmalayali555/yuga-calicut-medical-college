import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og*"],
        disallow: [
          "/api/",
          "/admin/",
          "/search?",
          "/search/",
        ],
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "DuckDuckBot",
          "YandexBot",
        ],
        allow: ["/", "/api/og*"],
        disallow: [
          "/api/",
          "/admin/",
          "/search?",
        ],
      },
      // Allow Generative Engine Optimization (GEO) agents for public citations
      {
        userAgent: [
          "OAI-SearchBot",
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
        ],
        allow: ["/", "/api/og*"],
        disallow: [
          "/api/",
          "/admin/",
          "/search?",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
