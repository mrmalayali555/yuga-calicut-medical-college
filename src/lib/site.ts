/**
 * Site Configuration for Government Medical College, Kozhikode (Calicut Medical College)
 * and YUGA Student Union (2026-2027).
 *
 * Powers the 3-in-1 Web Ecosystem:
 * 1. GMC Kozhikode Official Institutional Portal
 * 2. YUGA Student Union & Clubs Portal
 * 3. Unified Admin Control Center
 */

export const COLLEGE = {
  name: "Government Medical College, Kozhikode",
  shortName: "GMC Kozhikode / Calicut Medical College",
  nameMalayalam: "കോഴിക്കോട് മെഡിക്കൽ കോളേജ്",
  tagline: "Excellence in Medical Education & Healthcare Since 1957",
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
  superSpecialtyBlocks: 4,
} as const;

export const YUGA = {
  name: "YUGA",
  nameMalayalam: "യുഗ",
  year: "2026-2027",
  tagline: "Official College Union — Govt. Medical College Kozhikode",
  description:
    "Official portal for YUGA College Union 2026-2027 at Government Medical College, Kozhikode. Access student notifications, event registrations, achievements, and union representations.",
  email: "yuga.union@cmc.kerala.gov.in",
  socials: {
    instagram: "https://instagram.com/yuga_calicutmedicos",
    youtube: "https://youtube.com/@yugacalicut",
    whatsapp: "https://chat.whatsapp.com/",
    facebook: "https://facebook.com/",
  },
} as const;

export const SITE = {
  name: "YUGA",
  nameMalayalam: "യുഗ",
  tagline: "Official Student Union Website - Govt Medical College Kozhikode",
  description: YUGA.description,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://yugacmc.in",
  college: COLLEGE.name,
  email: YUGA.email,
  phone: COLLEGE.phone,
  address: COLLEGE.address,
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.8!2d75.837!3d11.272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65bc931f67f67%3A0x6b1cfb69e4ce1174!2sGovernment%20Medical%20College%2C%20Kozhikode!5e0!3m2!1sen!2sin!4v1700000000000",
  socials: YUGA.socials,
} as const;

/** Primary public navigation for the site */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Doctors & OP", href: "/doctors" },
  { label: "Academics", href: "/academics" },
  { label: "Academic Calendar", href: "/calendar" },
  { label: "Achievements", href: "/achievements" },
  { label: "YUGA Events", href: "/events" },
  { label: "Interventions", href: "/interventions" },
  { label: "Union & Clubs", href: "/subcommittee" },
  { label: "Emergency", href: "/emergency" },
  { label: "Contact", href: "/contact" },
] as const;

/** Quick-link tiles on the homepage */
export const QUICK_LINKS = [
  { label: "Doctors & OP", href: "/doctors", icon: "Stethoscope" },
  { label: "Academic Calendar", href: "/calendar", icon: "CalendarCheck" },
  { label: "Achievements", href: "/achievements", icon: "Trophy" },
  { label: "YUGA Events", href: "/events", icon: "CalendarDays" },
  { label: "Union Interventions", href: "/interventions", icon: "FileText" },
  { label: "Emergency & Casualty", href: "/emergency", icon: "Siren" },
  { label: "Drop Suggestion", href: "/complaints", icon: "MessageSquareWarning" },
  { label: "Union & Clubs", href: "/subcommittee", icon: "Users" },
] as const;

/** Achievement Categories — 4 pillars required by client */
export const ACHIEVEMENT_CATEGORIES = [
  { id: "all", label: "All Achievements" },
  { id: "arts", label: "Arts & Cultural" },
  { id: "sports", label: "Sports & Games" },
  { id: "academics", label: "Academics & Research" },
  { id: "general", label: "General & Social Interventions" },
] as const;

/** Academic Calendar Batch Filters */
export const ACADEMIC_BATCHES = [
  { id: "all", label: "All Batches" },
  { id: "mbbs-1", label: "MBBS Phase 1 (1st Year)" },
  { id: "mbbs-2", label: "MBBS Phase 2 (2nd Year)" },
  { id: "mbbs-3-1", label: "MBBS Final Part 1" },
  { id: "mbbs-3-2", label: "MBBS Final Part 2" },
  { id: "interns", label: "House Surgeons (CRMI)" },
  { id: "pg", label: "Postgraduates (MD / MS / Super-specialty)" },
] as const;
