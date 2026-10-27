import { Metadata } from "next";
import { EmergencyView } from "@/components/emergency/emergency-view";
import { COLLEGE, SITE, YUGA } from "@/lib/site";
import { EMERGENCY_CONTACTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "24/7 Hospital Emergency Hotlines & Casualty Contacts",
  description: `Instant, direct phone numbers for Casualty Triage (${COLLEGE.casualtyPhone}), Blood Bank (${COLLEGE.bloodBankPhone}), Ambulance, and Campus Security at ${COLLEGE.name}. 24/7 immediate support.`,
  alternates: {
    canonical: "/emergency",
  },
  openGraph: {
    title: "24/7 Emergency Hotlines · GMC Kozhikode",
    description: `Direct dial Casualty (${COLLEGE.casualtyPhone}), Blood Bank (${COLLEGE.bloodBankPhone}), and Ambulance numbers at ${COLLEGE.name}.`,
    url: `${SITE.url}/emergency`,
    type: "website",
    images: [
      {
        url: `${SITE.url}/api/og?title=24%2F7%20Emergency%20Hotlines%20%26%20Casualty&badge=EMERGENCY%20DESK`,
        width: 1200,
        height: 630,
        alt: `Emergency Hotlines — ${COLLEGE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "24/7 Emergency Hotlines · GMC Kozhikode",
    description: `Direct dial Casualty (${COLLEGE.casualtyPhone}), Blood Bank (${COLLEGE.bloodBankPhone}), and Ambulance numbers at ${COLLEGE.name}.`,
    images: [`${SITE.url}/api/og?title=24%2F7%20Emergency%20Hotlines%20%26%20Casualty&badge=EMERGENCY%20DESK`],
  },
};

export default function EmergencyPage() {
  const hospitalJsonLd = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: `${COLLEGE.name} — Hospital Emergency & Casualty`,
    alternateName: ["Calicut Medical College Hospital Casualty", "GMC Kozhikode Emergency", "കോഴിക്കോട് മെഡിക്കൽ കോളേജ് കാഷ്വാലിറ്റി"],
    url: `${SITE.url}/emergency`,
    telephone: COLLEGE.casualtyPhone,
    emergencyTelephone: COLLEGE.emergencyPhone,
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    department: EMERGENCY_CONTACTS.map((item) => ({
      "@type": item.title.toLowerCase().includes("blood")
        ? "MedicalOrganization"
        : "EmergencyService",
      name: item.title,
      description: item.department,
      telephone: item.phone,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the emergency casualty phone number for Calicut Medical College?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The 24/7 direct Casualty and Triage phone number for Government Medical College Kozhikode is ${COLLEGE.casualtyPhone}. Emergency medical services and ambulance control are reachable at ${COLLEGE.emergencyPhone}.`,
        },
      },
      {
        "@type": "Question",
        name: "How can I contact the GMC Kozhikode Blood Bank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `The Government Medical College Kozhikode Blood Bank operates 24 hours daily and can be contacted directly at ${COLLEGE.bloodBankPhone}.`,
        },
      },
      {
        "@type": "Question",
        name: "Are emergency services available 24/7 at Calicut Medical College Hospital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, the Emergency Department, Casualty Triage, Blood Bank, and intensive trauma teams operate continuously 24 hours a day, 365 days a year.",
        },
      },
      {
        "@type": "Question",
        name: "Who should GMC Kozhikode students contact for campus security emergencies?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `For campus security or hostel emergencies, students can contact the 24/7 Security Office, the Medical College Police Outpost, or reach out directly to the YUGA Student Union emergency desk.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([hospitalJsonLd, faqJsonLd]) }}
      />
      <EmergencyView />
    </>
  );
}
