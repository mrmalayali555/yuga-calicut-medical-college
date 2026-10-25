import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SITE, COLLEGE, YUGA } from "@/lib/site";
import { getActiveTheme } from "@/lib/queries";
import { ThemeProvider } from "@/components/theme/theme-context";
import { AdminEditProvider } from "@/components/admin/inline/admin-edit-context";
import { AdminToolbar } from "@/components/admin/inline/admin-toolbar";

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
  icons: {
    icon: "/yuga-logo.png",
    shortcut: "/yuga-logo.png",
    apple: "/yuga-logo.png",
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
        "@type": "CollegeOrUniversity",
        "@id": `${SITE.url}/#college`,
        name: COLLEGE.name,
        alternateName: "Calicut Medical College / GMC Kozhikode",
        url: SITE.url,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Medical College Junction",
          addressLocality: "Kozhikode",
          addressRegion: "Kerala",
          postalCode: "673008",
          addressCountry: "IN",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: `${YUGA.name} College Union`,
        alternateName: "YUGA — Calicut Medical College Union 2026-2027",
        url: SITE.url,
        parentOrganization: {
          "@id": `${SITE.url}/#college`,
        },
        description: YUGA.description,
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
            <Footer />
            <AdminToolbar />
          </AdminEditProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
