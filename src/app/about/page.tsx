import { Metadata } from "next";
import { AboutView } from "@/components/about/about-view";
import { COLLEGE, SITE, YUGA } from "@/lib/site";
import { LEADERSHIP } from "@/lib/data";

export const metadata: Metadata = {
  title: "Heritage, Charter & Executive Council Leadership",
  description: `Established in 1957, Government Medical College Kozhikode is the premier medical institution in Northern Kerala. Meet the elected YUGA College Union 2026-2027 leadership team.`,
  keywords: [
    "About YUGA Union",
    "Calicut Medical College Union Leadership",
    "Government Medical College Kozhikode History",
    "CMC Kozhikode Executive Council",
    "Calicut Medicos Union Charter",
    "KUHS Student Representatives Kozhikode",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About YUGA Union · GMC Kozhikode",
    description: `Representing 3,000+ medical students and doctors at ${COLLEGE.name}. Heritage, charter, and executive leadership.`,
    url: `${SITE.url}/about`,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `About YUGA — ${COLLEGE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About YUGA Union · GMC Kozhikode",
    description: `Heritage, charter, and executive leadership of YUGA College Union 2026-2027 at ${COLLEGE.name}.`,
    images: ["/og.png"],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: `${COLLEGE.name} — YUGA College Union`,
    alternateName: ["YUGA Union CMC Kozhikode", "Calicut Medical College Union 2026-2027"],
    url: `${SITE.url}/about`,
    foundingDate: "1957",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: COLLEGE.name,
      url: SITE.url,
    },
    member: LEADERSHIP.map((leader) => ({
      "@type": "Person",
      name: leader.name,
      jobTitle: leader.role,
      description: `${leader.portfolio} — ${leader.batch}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutView />
    </>
  );
}
