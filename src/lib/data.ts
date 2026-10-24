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
  status: "Resolved" | "In Review" | "Submitted";
  authority: string;
  category: "Hostel & Living" | "Academic" | "Hospital & Clinical" | "Welfare";
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

export const CIRCULARS: CircularItem[] = [
  {
    id: "kuhs-nov-exams-2026",
    title: "KUHS Final Professional MBBS Part II Regular Exam Timetable Despatch",
    category: "KUHS",
    date: "Oct 15, 2026",
    priority: "high",
    fileSize: "420 KB",
    summary: "Theory examinations for Medicine, Surgery, Pediatrics, and OBG begin Nov 16, 2026.",
  },
  {
    id: "hostel-wifi-reading-room",
    title: "24/7 Air-Conditioned Central Reading Room Operational Hours for Exam Term",
    category: "Hostel",
    date: "Oct 12, 2026",
    priority: "high",
    fileSize: "185 KB",
    summary: "Reading rooms in Men's and Women's hostels remain open 24 hours with dedicated high-speed Wi-Fi.",
  },
  {
    id: "yuga-volunteers-call",
    title: "Call for Organizing Committee Volunteers for YUGA '26 Cultural Fest",
    category: "Union",
    date: "Oct 09, 2026",
    priority: "normal",
    fileSize: "310 KB",
    summary: "UG & PG students interested in stage management, hospitality, and media coverage can apply.",
  },
  {
    id: "stipend-disbursal-notice",
    title: "Monthly Stipend Disbursal Schedule for House Surgeons & PG Resident Doctors",
    category: "Academic",
    date: "Oct 04, 2026",
    priority: "normal",
    fileSize: "240 KB",
    summary: "Directorate of Medical Education credit confirmation for the month of September.",
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
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
    name: "Dr. Arjun S. Nair",
    role: "Chairperson",
    batch: "Final MBBS Part II",
    portfolio: "Executive Governance & University Council",
    quote: "Ensuring an inclusive, vibrant, and transparent campus where every medico's voice leads administrative action.",
    phone: "+91 94471 20000",
  },
  {
    name: "Aparna M. Varma",
    role: "General Secretary",
    batch: "Final MBBS Part I",
    portfolio: "Secretariat & Administrative Coordination",
    quote: "Bridging clinical departments, hostel councils, and the student body with proactive welfare interventions.",
    phone: "+91 94471 20001",
  },
  {
    name: "Farhan K. P.",
    role: "Arts Club Secretary",
    batch: "MBBS Phase 2",
    portfolio: "Cultural Affairs & KUHS Conclaves",
    quote: "Revitalizing our amphitheatre stages with creative expression, music leagues, and historic festival triumphs.",
    phone: "+91 94471 20002",
  },
  {
    name: "Siddharth Menon",
    role: "Sports Secretary",
    batch: "Final MBBS Part I",
    portfolio: "Athletics & Inter-Collegiate Tournaments",
    quote: "Cultivating athletic discipline and hosting premier sports leagues for doctors across all clinical rotations.",
    phone: "+91 94471 20003",
  },
  {
    name: "Ananya R. Nair",
    role: "Magazine Editor",
    batch: "MBBS Phase 2",
    portfolio: "Union Editorial & Literary Forum",
    quote: "Documenting the literary, artistic, and philosophical heartbeat of Calicut Medicos.",
    phone: "+91 94471 20004",
  },
  {
    name: "Vishnu Prasad",
    role: "University Union Councillor (UUC)",
    batch: "Final MBBS Part II",
    portfolio: "KUHS Senate & State Representation",
    quote: "Vigorously representing Kozhikode Medicos at the KUHS University Council and Senate.",
    phone: "+91 94471 20005",
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
    id: "inv-reading-rooms",
    title: "Petition for 24/7 Air-Conditioned Central Reading Rooms in Men's & Women's Hostels",
    date: "October 10, 2026",
    status: "Resolved",
    authority: "Principal & DME Kerala",
    category: "Hostel & Living",
    description: "Secured sanction for high-speed Wi-Fi, ergonomic seating, and air-conditioning in both hostel reading halls before regular exams.",
    outcome: "Order passed; facilities active since Oct 14.",
  },
  {
    id: "inv-opd-ramp",
    title: "Urgent Memorandum on Elevator Repair & Wheelchair Access in New OPD Block",
    date: "September 28, 2026",
    status: "Resolved",
    authority: "Medical Superintendent",
    category: "Hospital & Clinical",
    description: "Highlighted difficulties faced by elderly patients and clinical students due to elevator outages in the multi-tier OPD block.",
    outcome: "Repairs completed by PWD Electrical wing.",
  },
  {
    id: "inv-stipend-timely",
    title: "Representation on Predictable Monthly Credit Schedule for House Surgeons & PGs",
    date: "September 15, 2026",
    status: "Resolved",
    authority: "Directorate of Medical Education",
    category: "Welfare",
    description: "Ensured recurring automatic credit of monthly stipends on or before the 5th of every calendar month.",
    outcome: "Direct treasury credit pipeline streamlined.",
  },
  {
    id: "inv-canteen-night",
    title: "Proposal for Extended Night Canteen Hours Near Casualty for On-Call Doctors",
    date: "October 02, 2026",
    status: "In Review",
    authority: "Hospital Development Society (HDS)",
    category: "Hostel & Living",
    description: "Requested hot meals and clean beverage availability past 11:00 PM for night-shift medicos, interns, and patient bystanders.",
    outcome: "Under active review by HDS executive committee.",
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
