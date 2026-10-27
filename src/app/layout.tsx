import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { SITE, COLLEGE, YUGA } from "@/lib/site";
import { getActiveTheme } from "@/lib/queries";
import { ThemeProvider } from "@/components/theme/theme-context";
import { AdminEditProvider } from "@/components/admin/inline/admin-edit-context";
import { AdminToolbar } from "@/components/admin/inline/admin-toolbar";
import { UniversalInlineEditor } from "@/components/admin/inline/universal-editor";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "YUGA | GMC Kozhikode Union 2026–27",
    template: "%s | YUGA — GMC Kozhikode Union 2026–27",
  },
  description:
    "Discover YUGA, the GMC Kozhikode Union for 2026–27. Explore union initiatives, interventions, events, achievements, student services and official updates.",
  applicationName: "YUGA — GMC Kozhikode Union",
  category: "education",
  authors: [{ name: "YUGA — GMC Kozhikode Union 2026–27", url: SITE.url }],
  creator: "YUGA Union Executive Council",
  publisher: COLLEGE.name,
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: "YUGA — GMC Kozhikode Union 2026–27",
    title: "YUGA | GMC Kozhikode Union 2026–27",
    description:
      "Discover YUGA, the GMC Kozhikode Union for 2026–27. Explore union initiatives, interventions, events, achievements, student services and official updates.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "YUGA — GMC Kozhikode Union 2026–27",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YUGA | GMC Kozhikode Union 2026–27",
    description:
      "Discover YUGA, the GMC Kozhikode Union for 2026–27. Explore union initiatives, interventions, events, achievements, student services and official updates.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/yuga-logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Read active theme from DB and Cookies
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("yuga_theme")?.value;
  const dbTheme = await getActiveTheme();
  const activeTheme =
    cookieTheme === "obsidian-crimson" || (!cookieTheme && dbTheme === "obsidian-crimson")
      ? "obsidian-crimson"
      : "emerald";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: "YUGA — GMC Kozhikode Union 2026–27",
        description:
          "Official website of YUGA, the student union of Government Medical College Kozhikode (Calicut Medical College) for 2026–27.",
        publisher: {
          "@id": `${SITE.url}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE.url}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "CollegeOrUniversity",
        "@id": `${SITE.url}/#college`,
        name: COLLEGE.name,
        alternateName: [
          "Calicut Medical College",
          "GMC Kozhikode",
          "കോഴിക്കോട് മെഡിക്കൽ കോളേജ്",
        ],
        url: "https://govtmedicalcollegekozhikode.ac.in",
        foundingDate: "1957",
        logo: `${SITE.url}/yuga-logo.png`,
        telephone: COLLEGE.casualtyPhone,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Medical College Junction, 17",
          addressLocality: "Kozhikode",
          addressRegion: "Kerala",
          postalCode: "673008",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "11.2723",
          longitude: "75.8369",
        },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE.url}/#organization`,
        name: "YUGA — GMC Kozhikode Union 2026–27",
        alternateName: [
          "YUGA",
          "YUGA College Union",
          "GMC Kozhikode Student Union",
          "Calicut Medical College Union",
          "യുഗ — കോഴിക്കോട് മെഡിക്കൽ കോളേജ് യൂണിയൻ",
        ],
        url: SITE.url,
        logo: `${SITE.url}/yuga-logo.png`,
        image: `${SITE.url}/og.png`,
        description:
          "Official student union for 3,000+ medical students, house surgeons, and PG residents at Government Medical College, Kozhikode.",
        parentOrganization: {
          "@id": `${SITE.url}/#college`,
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Medical College Junction, 17",
          addressLocality: "Kozhikode",
          addressRegion: "Kerala",
          postalCode: "673008",
          addressCountry: "IN",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: COLLEGE.casualtyPhone,
            contactType: "emergency",
            areaServed: "IN",
            availableLanguage: ["English", "Malayalam"],
          },
          {
            "@type": "ContactPoint",
            telephone: COLLEGE.phone,
            contactType: "administrative",
            areaServed: "IN",
          },
        ],
        sameAs: [
          "https://instagram.com/yuga_calicutmedicos",
          "https://youtube.com/@yugacalicut",
          "https://t.me/yugacmc",
        ],
      },
    ],
  };

  return (
    <html
      lang="en"
      data-theme={activeTheme}
      className={`scroll-smooth antialiased ${activeTheme === "obsidian-crimson" ? "dark" : ""}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        {/* Anti-FOUC Theme Init Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookieMatch = document.cookie.match(/(?:^|; )yuga_theme=([^;]*)/);
                  var cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
                  var localTheme = localStorage.getItem('yuga_theme');
                  var theme = cookieTheme || localTheme || '${activeTheme}';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'obsidian-crimson') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-root)] text-[var(--text-primary)] flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
        <ThemeProvider initialTheme={activeTheme}>
          <AdminEditProvider>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <FooterWrapper />
            <AdminToolbar />
            <UniversalInlineEditor />
          </AdminEditProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
