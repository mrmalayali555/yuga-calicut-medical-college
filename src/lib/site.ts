/**
 * YUGA — Official College Union Portal (2026-2027)
 * Government Medical College, Kozhikode (Calicut Medical College)
 */

export const COLLEGE = {
  name: "Government Medical College, Kozhikode",
  shortName: "GMC Kozhikode / Calicut Medical College",
  nameMalayalam: "കോഴിക്കോട് മെഡിക്കൽ കോളേജ്",
  established: 1957,
  address: "Medical College Junction, 17, Kozhikode, Kerala 673008",
  phone: "+91 495 235 0216",
  emergencyPhone: "+91 495 235 0217",
  casualtyPhone: "+91 495 235 0200",
  bloodBankPhone: "+91 495 235 0220",
  email: "principal@cmc.kerala.gov.in",
  affiliation: "Kerala University of Health Sciences (KUHS)",
  beds: 3000,
  dailyOP: "7000+",
  departmentsCount: "40+",
} as const;

export const YUGA = {
  name: "YUGA",
  nameMalayalam: "യുഗ",
  year: "2026-2027",
  tagline: "Official College Union — Govt. Medical College Kozhikode",
  description:
    "Official portal for YUGA College Union 2026-2027 at Government Medical College, Kozhikode. The unified platform for campus fests, academic schedules, student representations, achievements, and emergency services.",
  email: "union.yuga@cmc.kerala.gov.in",
  socials: {
    instagram: "https://instagram.com/yuga_calicutmedicos",
    youtube: "https://youtube.com/@yugacalicut",
    whatsapp: "https://chat.whatsapp.com/",
    telegram: "https://t.me/yugacmc",
  },
} as const;

export const SITE = {
  name: "YUGA",
  fullName: "YUGA College Union — GMC Kozhikode",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yugacmc.in",
  college: COLLEGE.name,
  address: COLLEGE.address,
  phone: COLLEGE.phone,
  email: YUGA.email,
  description: YUGA.description,
  socials: YUGA.socials,
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Notifications", href: "/notifications" },
  { label: "Calendar", href: "/calendar" },
  { label: "Interventions", href: "/interventions" },
  { label: "Achievements", href: "/achievements" },
  { label: "Clubs", href: "/subcommittees" },
  { label: "Finance", href: "/finance" },
  { label: "Emergency", href: "/emergency" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
] as const;

export const ACADEMIC_BATCHES = [
  { id: "all", label: "All Batches" },
  { id: "mbbs-1", label: "MBBS Phase 1 (1st Year)" },
  { id: "mbbs-2", label: "MBBS Phase 2 (2nd Year)" },
  { id: "mbbs-3-1", label: "MBBS Final Part 1" },
  { id: "mbbs-3-2", label: "MBBS Final Part 2" },
  { id: "interns", label: "House Surgeons (CRMI)" },
  { id: "pg", label: "PG Residents (MD / MS / Super-specialty)" },
] as const;

export const ACHIEVEMENT_CATEGORIES = [
  { id: "all", label: "All Laurels" },
  { id: "arts", label: "Arts & Cultural" },
  { id: "sports", label: "Sports & Athletics" },
  { id: "academics", label: "Research & Academics" },
  { id: "social", label: "Social & Community Service" },
] as const;
