import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SITE, COLLEGE, YUGA } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${YUGA.name} · ${COLLEGE.name} — College Union 2026-2027`,
    template: `%s · ${YUGA.name} — GMC Kozhikode`,
  },
  description: YUGA.description,
  applicationName: YUGA.name,
  keywords: [
    "YUGA",
    "YUGA GMC Kozhikode",
    "Calicut Medical College Union",
    "Government Medical College Kozhikode",
    "Calicut Medicos",
    "YUGA Fest",
    "KUHS Examination Calendar",
    "CMC Kozhikode Student Union",
    "Medical College Union Kerala",
  ],
  authors: [{ name: YUGA.name, url: SITE.url }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: `${YUGA.name} — ${COLLEGE.shortName}`,
    title: `${YUGA.name} · College Union — ${COLLEGE.name}`,
    description: YUGA.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${YUGA.name} · ${COLLEGE.shortName}`,
    description: YUGA.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollegeOrUniversity",
        "@id": `${SITE.url}/#college`,
        "name": COLLEGE.name,
        "alternateName": "Calicut Medical College / GMC Kozhikode",
        "url": SITE.url,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Medical College Junction",
          "addressLocality": "Kozhikode",
          "addressRegion": "Kerala",
          "postalCode": "673008",
          "addressCountry": "IN"
        }
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        "name": `${YUGA.name} College Union`,
        "alternateName": "YUGA — Calicut Medical College Union 2026-2027",
        "url": SITE.url,
        "parentOrganization": {
          "@id": `${SITE.url}/#college`
        },
        "description": YUGA.description
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-root)] text-[var(--text-primary)] flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
