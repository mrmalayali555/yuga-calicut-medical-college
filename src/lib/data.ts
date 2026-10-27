/**
 * Mock & Seed Data for YUGA (GMC Kozhikode Union 2026-2027)
 */

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  category: "fest" | "sports" | "academic" | "social";
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "live" | "completed";
  highlight?: boolean;
  registrationOpen?: boolean;
  registrationUrl?: string;
}

export interface CircularItem {
  id: string;
  title: string;
  category: "Academic" | "Union" | "Hostel" | "KUHS";
  date: string;
  priority: "high" | "normal";
  fileSize?: string;
  summary: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  recipient: string;
  batch: string;
  category: "arts" | "sports" | "academics" | "social";
  event: string;
  date: string;
  medal: "Gold" | "First Prize" | "National Honor" | "Championship";
  description: string;
}

export interface LeaderItem {
  name: string;
  role: string;
  batch: string;
  portfolio: string;
  quote: string;
  phone?: string;
}

export interface CalendarEvent {
  id: string;
  batch: string;
  batchLabel: string;
  title: string;
  type: "exam" | "posting" | "vacation" | "academic";
  dateRange: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  location: string;
}

export interface InterventionItem {
  id: string;
  title: string;
  date: string;
  status: string;
  authority: string;
  category: string;
  description: string;
  outcome?: string;
}

export interface EmergencyNumber {
  id: string;
  title: string;
  department: string;
  phone: string;
  available: string;
  primary?: boolean;
}

export const EVENTS: EventItem[] = [
  {
    id: "yuga-fest-2026",
    title: "YUGA '26 — All-Kerala Inter-Collegiate Medical Cultural Fest",
    subtitle: "The Flagship 4-Day Cultural Extravaganza of Calicut Medicos",
    category: "fest",
    date: "November 19 – 22, 2026",
    time: "5:00 PM onwards",
    venue: "Main Open Air Auditorium, GMC Kozhikode",
    status: "upcoming",
    highlight: true,
    registrationOpen: true,
    registrationUrl: "#register",
  },
  {
    id: "calicut-medex-conclave",
    title: "MedEx '26 — National Undergraduate Research & Clinical Conclave",
    subtitle: "Paper presentations, clinical case simulations & expert workshops",
    category: "academic",
    date: "December 5 – 7, 2026",
    time: "9:00 AM – 4:30 PM",
    venue: "Platinum Jubilee Academic Complex",
    status: "upcoming",
    highlight: true,
    registrationOpen: true,
  },
  {
    id: "cmpl-sports-2026",
    title: "Calicut Medicos Premier League (CMPL) — Season 14",
    subtitle: "Inter-batch cricket championship with 16 competing squads",
    category: "sports",
    date: "October 28 – November 6, 2026",
    time: "3:30 PM",
    venue: "Medical College Stadium Ground",
    status: "live",
  },
  {
    id: "caduceus-music-night",
    title: "Caduceus Acoustic Night & Unplugged Jam",
    subtitle: "Soulful musical journey curated by the GMC Fine Arts Club",
    category: "fest",
    date: "November 12, 2026",
    time: "6:30 PM",
    venue: "OAT Amphitheatre",
    status: "upcoming",
  },
  {
    id: "blood-donation-camp",
    title: "Mega Voluntary Blood Donation Drive",
    subtitle: "Organised in association with CMC Blood Bank & Red Cross",
    category: "social",
    date: "October 14, 2026",
    time: "9:00 AM – 1:00 PM",
    venue: "OPD Complex Ground Floor",
    status: "completed",
  },
];

export const CIRCULARS: CircularItem[] = [];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "inter-medical-football-2026",
    title: "Inter-Medical Football Championship 2026",
    recipient: "CMC Kozhikode Football Team",
    batch: "UG & PG Combined",
    category: "sports",
    event: "All-Kerala Inter-Medicos Tournament",
    date: "October 2026",
    medal: "Gold",
    description: "Our team lifted the state inter-medical football trophy after a thrilling final, defeating the hosts 2–1 in extra time.",
  },
  {
    id: "state-youth-festival-music",
    title: "First Prize — State Youth Festival (Music)",
    recipient: "YUGA Cultural Troupe",
    batch: "All Batches Contingent",
    category: "arts",
    event: "KUHS State Youth Festival",
    date: "September 2026",
    medal: "First Prize",
    description: "YUGA's music troupe secured first place in the group song category at the state medical youth festival.",
  },
  {
    id: "best-research-paper-med-conclave",
    title: "Best Research Paper — National Med Conclave",
    recipient: "Undergraduate Research Scholar",
    batch: "Final MBBS Part 1",
    category: "academics",
    event: "National Medical Students' Conclave",
    date: "October 2026",
    medal: "National Honor",
    description: "A final-year student's research on rural healthcare access won best paper at the national medical students' conclave.",
  },
  {
    id: "gold-inter-college-athletics",
    title: "Gold in Inter-College Athletics Meet",
    recipient: "Calicut Medicos Athletics Squad",
    batch: "All Batches",
    category: "sports",
    event: "University Athletics Meet",
    date: "August 2026",
    medal: "Gold",
    description: "Three golds and a new meet record in the 4x100m relay at the university athletics meet.",
  },
  {
    id: "kuhs-arts-champions",
    title: "Overall Champions — KUHS Inter-Zone Arts Festival 2026",
    recipient: "Calicut Medicos Arts Contingent",
    batch: "All Batches Contingent",
    category: "arts",
    event: "KUHS State Youth Festival",
    date: "September 2026",
    medal: "Championship",
    description: "Lifted the prestigious Ever-Rolling Golden Trophy for the 4th consecutive year with 18 first prizes.",
  },
  {
    id: "intermed-football-trophy",
    title: "State Inter-Medical Football Championship Winners",
    recipient: "CMC Kozhikode Football Team",
    batch: "UG & PG Combined",
    category: "sports",
    event: "All-Kerala Inter-Medicos Tournament",
    date: "August 2026",
    medal: "Gold",
    description: "Defeated the tournament hosts 3-1 in a nail-biting final under floodlights.",
  },
  {
    id: "icmr-sts-grants",
    title: "14 ICMR Short-Term Studentship (STS) Research Awards",
    recipient: "Undergraduate Scholars",
    batch: "MBBS Phase 2 & 3",
    category: "academics",
    event: "Indian Council of Medical Research (ICMR)",
    date: "July 2026",
    medal: "National Honor",
    description: "Highest number of ICMR research grants bagged by any single medical institution in Kerala.",
  },
  {
    id: "national-quiz-gold",
    title: "First Prize — National Pharmacology Conclave Quiz",
    recipient: "Dr. Rohith Krishna & Dr. Sneha Paul",
    batch: "Final MBBS Part 1",
    category: "academics",
    event: "PharmCon National Summit",
    date: "June 2026",
    medal: "First Prize",
    description: "Outperformed 140 medical teams across India to secure the championship trophy and cash citation.",
  },
];

export const LEADERSHIP: LeaderItem[] = [
  {
    name: "Nayan Menon",
    role: "Chairperson",
    batch: "Final MBBS Part 1",
    portfolio: "Executive Governance & University Council",
    quote: "Leading with purpose for every Calicut Medico.",
    phone: "+91 94471 20000",
  },
  {
    name: "Benjamin Thomas",
    role: "Vice Chairperson",
    batch: "Final MBBS Part 1",
    portfolio: "Administrative Coordination & Policy",
    quote: "Committed to a transparent and inclusive union.",
    phone: "+91 94471 20001",
  },
  {
    name: "Nidha Rasheed",
    role: "Lady Vice Chairperson",
    batch: "Final MBBS Part 1",
    portfolio: "Women's Welfare & Hostel Council",
    quote: "Championing equality and welfare on campus.",
    phone: "+91 94471 20002",
  },
  {
    name: "Mohammed Salim",
    role: "General Secretary",
    batch: "Final MBBS Part 1",
    portfolio: "Secretariat & Administrative Coordination",
    quote: "Bridging every student voice to administrative action.",
    phone: "+91 94471 20003",
  },
  {
    name: "Anaya E S",
    role: "Joint Secretary",
    batch: "Final MBBS Part 1",
    portfolio: "Inter-Department Liaison & Documentation",
    quote: "Every detail matters when it comes to student welfare.",
    phone: "+91 94471 20004",
  },
  {
    name: "Sreelakshmi M S",
    role: "Fine Arts Secretary",
    batch: "Third Professional MBBS Year",
    portfolio: "Cultural Affairs & KUHS Conclaves",
    quote: "Celebrating the artistic soul of medicine.",
    phone: "+91 94471 20005",
  },
  {
    name: "Ansaf Yaseen N",
    role: "Sports Secretary",
    batch: "Third Professional MBBS Year",
    portfolio: "Athletics & Inter-Collegiate Tournaments",
    quote: "Training minds and bodies for excellence.",
    phone: "+91 94471 20006",
  },
  {
    name: "Sarath A R",
    role: "Magazine Editor",
    batch: "Third Professional MBBS Year",
    portfolio: "Union Editorial & Literary Forum",
    quote: "Documenting the heartbeat of Calicut Medicos.",
    phone: "+91 94471 20007",
  },
  {
    name: "Yadhukrishnan C",
    role: "UUC-UG",
    batch: "Final MBBS Part 2",
    portfolio: "KUHS University Union Council (UG)",
    quote: "Representing our voice at the university level.",
    phone: "+91 94471 20008",
  },
  {
    name: "Sumayya Beegum K T",
    role: "UUC-PG",
    batch: "Medicine JR-2",
    portfolio: "KUHS University Union Council (PG)",
    quote: "Advocating for every postgraduate resident.",
    phone: "+91 94471 20009",
  },
];


export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "cal-1",
    batch: "mbbs-3-2",
    batchLabel: "MBBS Final Part 2",
    title: "KUHS Final Professional MBBS Part II Regular Examination",
    type: "exam",
    dateRange: "Nov 16, 2026 – Nov 28, 2026",
    status: "Upcoming",
    location: "Main Academic Block Examination Hall",
  },
  {
    id: "cal-2",
    batch: "mbbs-2",
    batchLabel: "MBBS Phase 2",
    title: "Phase II Clinical Rotations — Block 3 Posting (Surgery, OBG, Comm Med)",
    type: "posting",
    dateRange: "Nov 02, 2026 – Dec 15, 2026",
    status: "Ongoing",
    location: "Medical College Hospital & IMCH",
  },
  {
    id: "cal-3",
    batch: "mbbs-1",
    batchLabel: "MBBS Phase 1",
    title: "2nd Internal Assessment Theory Exams (Anatomy, Physio, Biochem)",
    type: "exam",
    dateRange: "Nov 24, 2026 – Nov 29, 2026",
    status: "Upcoming",
    location: "Lecture Theatre 1 & 2",
  },
  {
    id: "cal-4",
    batch: "interns",
    batchLabel: "House Surgeons (CRMI)",
    title: "Casualty & Emergency Medicine Mandatory Rotation Batch Shift",
    type: "posting",
    dateRange: "Dec 01, 2026 – Dec 31, 2026",
    status: "Upcoming",
    location: "Emergency & Trauma Block, Level 1",
  },
  {
    id: "cal-5",
    batch: "pg",
    batchLabel: "PG Residents",
    title: "KUHS MD/MS Final Year Dissertation Submission Deadline",
    type: "academic",
    dateRange: "Nov 30, 2026",
    status: "Upcoming",
    location: "Dean of Academics Office",
  },
];

export const INTERVENTIONS: InterventionItem[] = [
  {
    id: "representation-regarding-early-publication-of-final-year-mbbs-results",
    title: "Representation regarding early publication of Final-year MBBS results",
    date: "September 08, 2026",
    status: "Resolved",
    authority: "KUHS & DME Kerala",
    category: "Academic & Welfare",
    description: "The College Union ’26, has submitted representations to KUHS and the Directorate of Medical Education seeking early evaluation and publication of the Final-Year MBBS results to facilitate timely registration and internship formalities.\n\nThe Union has also requested early commencement of House Surgency and interim deployment of NAJRs to ensure adequate resident manpower and a smooth transition between the outgoing and incoming batches.",
    outcome: "Representation actively under review by KUHS controller of examinations.",
  },
  {
    id: "representation-regarding-the-delay-in-e-grantz-scholarship",
    title: "Representation regarding the delay in E Grantz Scholarship",
    date: "September 08, 2026",
    status: "Resolved",
    authority: "Principal & SC/ST/OBC Welfare",
    category: "Scholarships & Welfare",
    description: "The Union has informed the Principal of the issue of delay in E Grantz Scholarship regarding mess refund for SC/ST students and Tuition fee refund for OBC students. Following the Representation, the Principal has given the assurance to take the needed measures.",
    outcome: "Principal assured immediate sanction and disbursement.",
  },
  {
    id: "representation-regarding-the-proposed-increase-in-working-hours-of-jrs-under-the-drp",
    title: "Representation regarding the proposed increase in working hours of JRs under the DRP",
    date: "August 31, 2026",
    status: "Resolved",
    authority: "Deputy Superintendent, GGH Kozhikode",
    category: "Resident Welfare",
    description: "The College Union submitted a representation to the Deputy Superintendent, GGH Kozhikode, highlighting concerns regarding the proposed increase in working hours of Junior Residents under the DRP, requesting reconsideration considering resident workload.",
    outcome: "Meeting convened to review duty schedules and alleviate fatigue.",
  },
  {
    id: "representation-hostel-library-247-study-room",
    title: "Representation regarding Hostel Library & 24/7 Study Room Facility",
    date: "October 22, 2026",
    status: "Resolved",
    authority: "Principal, GMC Kozhikode",
    category: "Infrastructure",
    description: "The Union submitted a formal representation to the Principal requesting the installation of air conditioning and 24/7 lighting/Wi-Fi access in the Men's and Women's hostel reading rooms prior to university exams.",
    outcome: "Order passed and reading rooms equipped with 24/7 power & Wi-Fi.",
  },
  {
    id: "request-opd-elevator-ramp-repair",
    title: "Request for Immediate Repair of OPD Block Elevator & Ramp Access",
    date: "October 14, 2026",
    status: "Resolved",
    authority: "Medical Superintendent",
    category: "Campus Safety",
    description: "Official letter submitted to the Medical Superintendent highlighting difficulties faced by wheelchair-bound patients and clinical postings students due to non-functioning elevators.",
    outcome: "Repairs expedited by Hospital Engineering Wing.",
  },
  {
    id: "memorandum-stipend-disbursal-schedule",
    title: "Memorandum on Stipend Disbursal Schedule for PG Residents & House Surgeons",
    date: "October 01, 2026",
    status: "In Progress",
    authority: "Directorate of Medical Education",
    category: "Academic & Welfare",
    description: "Official petition addressed to the Directorate of Medical Education (DME) ensuring timely monthly credit of stipends for senior and junior resident doctors.",
    outcome: "Direct treasury credit schedule streamlined.",
  },
];

export const EMERGENCY_CONTACTS: EmergencyNumber[] = [
  {
    id: "casualty",
    title: "Hospital Casualty & Trauma Room",
    department: "GMC Kozhikode Main Casualty",
    phone: "+91 495 235 0200",
    available: "24 Hours / 365 Days",
    primary: true,
  },
  {
    id: "superintendent",
    title: "Medical Superintendent Office",
    department: "Hospital Administration",
    phone: "+91 495 235 0216",
    available: "9:00 AM – 5:00 PM",
  },
  {
    id: "blood-bank",
    title: "Central Blood Bank & Transfusion",
    department: "GMC Kozhikode Blood Centre",
    phone: "+91 495 235 0220",
    available: "24 Hours Round the Clock",
    primary: true,
  },
  {
    id: "imch-emergency",
    title: "IMCH Casualty & Labor Room",
    department: "Institute of Maternal & Child Health",
    phone: "+91 495 235 6531",
    available: "24 Hours Dedicated Line",
    primary: true,
  },
  {
    id: "ambulance-call",
    title: "Campus Emergency Ambulance Desk",
    department: "Emergency Response Fleet",
    phone: "+91 495 235 0217",
    available: "Instant Radio Despatch",
    primary: true,
  },
  {
    id: "police-aid-post",
    title: "Medical College Police Station / Aid Post",
    department: "Kerala Police Campus Aid Post",
    phone: "0495 235 6280",
    available: "24 Hours Campus Patrol",
  },
  {
    id: "security-sergeant",
    title: "Chief Campus Security Sergeant",
    department: "Campus Security Wing",
    phone: "+91 94471 88040",
    available: "24 Hours Support",
  },
  {
    id: "women-safety",
    title: "Women's Safety & Anti-Ragging Cell",
    department: "Institutional Grievance Cell",
    phone: "1800 180 5522",
    available: "Toll-Free 24x7",
  },
];
