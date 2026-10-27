import { Metadata } from "next";
import { SubcommitteesView } from "@/components/subcommittees/subcommittees-view";
import { SITE, COLLEGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clubs & Specialized Subcommittees",
  description: `Explore the specialized student wings and clubs under YUGA Union at Government Medical College, Kozhikode — Jeevanam (Blood Donation), Praanah (Arts), Godha (Sports), and Ocha (Literary).`,
  keywords: [
    "CMC Kozhikode Student Clubs",
    "Jeevanam Blood Bank GMC Kozhikode",
    "Praanah Arts Club GMC",
    "Godha Sports Arena Calicut Medicos",
    "Ocha Literary Society Kozhikode",
    "YUGA Subcommittees",
  ],
  alternates: {
    canonical: "/subcommittees",
  },
  openGraph: {
    title: "Clubs & Subcommittees · YUGA — GMC Kozhikode",
    description: `Specialized student wings driving creative arts, athletic mastery, and blood donation at ${COLLEGE.name}.`,
    url: `${SITE.url}/subcommittees`,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `Clubs & Subcommittees — ${COLLEGE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clubs & Subcommittees · YUGA — GMC Kozhikode",
    description: `Student societies and subcommittees at ${COLLEGE.name}.`,
    images: ["/og.png"],
  },
};

export default function SubcommitteesPage() {
  return <SubcommitteesView />;
}
