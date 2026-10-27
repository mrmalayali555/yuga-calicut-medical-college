import { Metadata } from "next";
import { ComplaintsView } from "@/components/complaints/complaints-view";
import { SITE, COLLEGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Student Grievance Desk & Confidential Representation",
  description: `Confidential grievance submission portal for MBBS students, interns, and PG residents at Government Medical College, Kozhikode. Direct, encrypted pipeline to the YUGA Student Union Council.`,
  keywords: [
    "Calicut Medicos Grievance Portal",
    "CMC Kozhikode Student Complaints",
    "GMC Kozhikode Hostel Issues",
    "YUGA Union Student Representation",
    "KUHS Student Welfare Kozhikode",
  ],
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
        url: "/og.png",
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
    images: ["/og.png"],
  },
};

export default function ComplaintsPage() {
  return <ComplaintsView />;
}
