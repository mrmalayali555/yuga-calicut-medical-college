import { Metadata } from "next";
import { EmergencyView } from "@/components/emergency/emergency-view";
import { COLLEGE, SITE, YUGA } from "@/lib/site";
import { EMERGENCY_CONTACTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "24/7 Hospital Emergency Hotlines & Casualty Contacts",
  description: `Instant, direct phone numbers for Casualty Triage (${COLLEGE.casualtyPhone}), Blood Bank (${COLLEGE.bloodBankPhone}), Ambulance, and Campus Security at ${COLLEGE.name}. 24/7 immediate support.`,
  keywords: [
    "Calicut Medical College Emergency Contact",
    "GMC Kozhikode Casualty Phone Number",
    "Calicut Medical College Blood Bank Number",
    "GMC Kozhikode Ambulance Hotline",
    "CMC Kozhikode Hospital Reception",
    "Medical Emergency Kozhikode",
    "YUGA Union Emergency Helpdesk",
  ],
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
        url: "/og.png",
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
    images: ["/og.png"],
  },
};

export default function EmergencyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: `${COLLEGE.name} — Hospital Emergency & Casualty`,
    alternateName: ["Calicut Medical College Hospital Casualty", "GMC Kozhikode Emergency"],
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EmergencyView />
    </>
  );
}
