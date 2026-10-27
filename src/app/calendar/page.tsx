import { Metadata } from "next";
import { CalendarView } from "@/components/calendar/calendar-view";
import { SITE, COLLEGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Academic Calendar, KUHS Exams & Postings",
  description: `Official academic calendar, Kerala University of Health Sciences (KUHS) MBBS exam timetables, internal assessments, and clinical postings at Government Medical College, Kozhikode.`,
  keywords: [
    "KUHS Exam Timetable Kozhikode",
    "Calicut Medical College Academic Calendar",
    "GMC Kozhikode Clinical Postings",
    "MBBS Internal Assessment Schedule Kerala",
    "KUHS Results & Timetables CMC",
  ],
  alternates: {
    canonical: "/calendar",
  },
  openGraph: {
    title: "Academic Calendar & KUHS Schedules · GMC Kozhikode",
    description: `Official exam timetables, clinical rotations, and academic schedule for Calicut Medicos at ${COLLEGE.name}.`,
    url: `${SITE.url}/calendar`,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `Academic Calendar — ${COLLEGE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academic Calendar & KUHS Schedules · GMC Kozhikode",
    description: `KUHS examinations, clinical postings, and assessment dates for students at ${COLLEGE.name}.`,
    images: ["/og.png"],
  },
};

export default function CalendarPage() {
  return <CalendarView />;
}
