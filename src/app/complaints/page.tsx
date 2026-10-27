import { Metadata } from "next";
import { ComplaintsView } from "@/components/complaints/complaints-view";
import { SITE, COLLEGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Student Grievance Desk & Confidential Representation",
  description: `Confidential grievance submission portal for MBBS students, interns, and PG residents at Government Medical College, Kozhikode. Direct, encrypted pipeline to the YUGA Student Union Council.`,
  alternates: {
    canonical: "/complaints",
  },
  openGraph: {
    title: "Student Grievance Desk · YUGA — GMC Kozhikode",
    description: `Confidential channel to the YUGA Student Union Council at ${COLLEGE.name}. Drop hostel issues, academic feedback, or proposals.`,
    url: `${SITE.url}/complaints`,
    type: "website",
    images: [
      {
        url: `${SITE.url}/api/og?title=Student%20Grievance%20Desk%20%26%20Representation&badge=GRIEVANCE%20CELL`,
        width: 1200,
        height: 630,
        alt: `Student Grievance Desk — ${COLLEGE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Grievance Desk · YUGA — GMC Kozhikode",
    description: `Confidential channel to the YUGA Student Union Council at ${COLLEGE.name}.`,
    images: [`${SITE.url}/api/og?title=Student%20Grievance%20Desk%20%26%20Representation&badge=GRIEVANCE%20CELL`],
  },
};

export default function ComplaintsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can students submit grievances to the YUGA Student Union?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Medical students, house surgeons, and PG residents at Government Medical College Kozhikode can submit grievances, hostel maintenance requests, and academic feedback online through the official YUGA Grievance Desk at yugacollegeunion.co.in/complaints.",
        },
      },
      {
        "@type": "Question",
        name: "Are student grievances submitted to YUGA kept confidential?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All submissions are treated with strict confidentiality. Students can choose to submit representations anonymously or request that their personal details remain restricted to the executive union leadership.",
        },
      },
      {
        "@type": "Question",
        name: "What categories of issues can be raised through the grievance desk?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Students can raise issues regarding hostel amenities and mess food, library timings, clinical posting schedules, sports equipment requirements, campus lighting, and academic administrative concerns.",
        },
      },
      {
        "@type": "Question",
        name: "How quickly does the YUGA executive council follow up on complaints?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Grievances are reviewed weekly by the student welfare committee, and urgent campus or hostel concerns are presented directly to the Principal, Vice Principal, and Chief Warden during scheduled administrative representations.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ComplaintsView />
    </>
  );
}
