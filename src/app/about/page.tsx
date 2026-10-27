import { Metadata } from "next";
import { AboutView } from "@/components/about/about-view";
import { COLLEGE, SITE, YUGA } from "@/lib/site";
import { LEADERSHIP } from "@/lib/data";

export const metadata: Metadata = {
  title: "Heritage, Charter & Executive Council Leadership",
  description: `Established in 1957, Government Medical College Kozhikode is the premier medical institution in Northern Kerala. Meet the elected YUGA College Union 2026-2027 leadership team.`,
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
        url: `${SITE.url}/api/og?title=Heritage,%20Charter%20%26%20Executive%20Council&badge=ABOUT%20YUGA`,
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
    images: [`${SITE.url}/api/og?title=Heritage,%20Charter%20%26%20Executive%20Council&badge=ABOUT%20YUGA`],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: `${COLLEGE.name} — YUGA College Union`,
    alternateName: ["YUGA Union CMC Kozhikode", "Calicut Medical College Union 2026-2027", "യുഗ — കോഴിക്കോട് മെഡിക്കൽ കോളേജ് യൂണിയൻ"],
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is YUGA at Government Medical College Kozhikode?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "YUGA is the official, democratically elected student union for the 2026–27 academic tenure at Government Medical College Kozhikode (Calicut Medical College), representing over 3,000 MBBS undergraduates, house surgeons, and PG medical residents.",
        },
      },
      {
        "@type": "Question",
        name: "When was Government Medical College Kozhikode established?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Government Medical College Kozhikode was established in 1957. It is the premier tertiary healthcare and medical education institution in Northern Kerala, affiliated with the Kerala University of Health Sciences (KUHS).",
        },
      },
      {
        "@type": "Question",
        name: "Who are the office bearers of YUGA College Union 2026–27?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The YUGA executive council includes the Chairperson, Vice Chairperson, General Secretary, Joint Secretary, Arts Club Secretary, Sports Secretary, Magazine Editor, and University Union Councilors (UUCs) representing KUHS.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the YUGA Union office located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The YUGA College Union office is located inside the Government Medical College Campus, Medical College Junction, 17, Kozhikode, Kerala 673008, India.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, faqJsonLd]) }}
      />
      <AboutView />
    </>
  );
}
