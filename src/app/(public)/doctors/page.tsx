import { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, Clock, MapPin, Phone, Search, Building2, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { COLLEGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Doctors & OP Schedule | Govt Medical College Kozhikode",
  description:
    "Find doctors, specialists, outpatient (OP) timings and clinical department locations at Government Medical College, Kozhikode.",
};

// Default sample departments and doctors for GMC Kozhikode
const DEPARTMENTS = [
  "All Departments",
  "General Medicine",
  "General Surgery",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Obstetrics & Gynecology",
  "Pulmonology",
  "Dermatology",
  "Ophthalmology",
  "ENT",
  "Nephrology",
];

const DOCTORS = [
  {
    id: "1",
    name: "Dr. K. G. Sajeeth Kumar",
    designation: "Professor & Head of Department",
    qualifications: "MBBS, MD (General Medicine)",
    department: "General Medicine",
    opDays: "Monday & Thursday",
    time: "9:00 AM – 1:00 PM",
    room: "OP Block Room 102",
    unit: "Unit I",
  },
  {
    id: "2",
    name: "Dr. P. K. Sasidharan",
    designation: "Senior Professor & Consultant",
    qualifications: "MBBS, MD, FICP",
    department: "General Medicine",
    opDays: "Tuesday & Friday",
    time: "9:00 AM – 1:00 PM",
    room: "OP Block Room 104",
    unit: "Unit II",
  },
  {
    id: "3",
    name: "Dr. Haridasan V.",
    designation: "Professor & HOD",
    qualifications: "MBBS, MD, DM (Cardiology)",
    department: "Cardiology",
    opDays: "Monday, Wednesday & Friday",
    time: "9:00 AM – 2:00 PM",
    room: "Super Specialty Block 2, Room 210",
    unit: "Cardiology OP",
  },
  {
    id: "4",
    name: "Dr. James Jose",
    designation: "Professor & HOD",
    qualifications: "MBBS, MD, DM (Neurology)",
    department: "Neurology",
    opDays: "Tuesday & Saturday",
    time: "9:00 AM – 1:00 PM",
    room: "Super Specialty Block 1, Room 305",
    unit: "Neurology Unit",
  },
  {
    id: "5",
    name: "Dr. Shaji Thomas",
    designation: "Professor & HOD",
    qualifications: "MBBS, MS (Orthopedics), MCh",
    department: "Orthopedics",
    opDays: "Wednesday & Saturday",
    time: "9:00 AM – 1:00 PM",
    room: "Main Surgical Block, Room 15",
    unit: "Trauma & Joint Unit",
  },
  {
    id: "6",
    name: "Dr. Beena George",
    designation: "Professor & HOD",
    qualifications: "MBBS, DCH, MD (Pediatrics)",
    department: "Pediatrics",
    opDays: "Monday to Friday",
    time: "9:00 AM – 1:00 PM",
    room: "IMCH (Maternal & Child Hospital) Room 4",
    unit: "Pediatrics Unit I",
  },
];

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ dept?: string; q?: string }>;
}) {
  const { dept = "All Departments", q = "" } = await searchParams;

  const filteredDoctors = DOCTORS.filter((doc) => {
    const matchesDept =
      dept === "All Departments" || doc.department.toLowerCase() === dept.toLowerCase();
    const matchesQuery =
      !q ||
      doc.name.toLowerCase().includes(q.toLowerCase()) ||
      doc.department.toLowerCase().includes(q.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(q.toLowerCase());
    return matchesDept && matchesQuery;
  });

  return (
    <>
      <PageHeader
        eyebrow="Government Medical College Kozhikode"
        title="Doctors & OP Schedule"
        description="Search clinical faculty, specialist consultants, outpatient timings, and department consultation rooms."
        breadcrumb={[{ label: "Doctors & OP" }]}
      />

      <section className="py-12 sm:py-16 bg-slate-50/60 border-b border-ink-100">
        <Container>
          {/* Quick OP Helpline Banner */}
          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink-900">Hospital OP Enquiry & Casualty</h3>
                <p className="text-xs sm:text-sm text-ink-600">
                  Casualty Desk: <strong className="text-blue-700">{COLLEGE.casualtyPhone}</strong> | Blood Bank: <strong className="text-blue-700">{COLLEGE.bloodBankPhone}</strong>
                </p>
              </div>
            </div>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-red-700 transition"
            >
              <Phone className="h-4 w-4" /> 24x7 Emergency Numbers
            </Link>
          </div>

          {/* Department Filter Pills */}
          <Reveal>
            <div className="flex flex-wrap gap-2 pb-2">
              {DEPARTMENTS.map((d) => {
                const active = (dept || "All Departments").toLowerCase() === d.toLowerCase();
                return (
                  <Link
                    key={d}
                    href={d === "All Departments" ? "/doctors" : `/doctors?dept=${encodeURIComponent(d)}`}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-ink-700 border border-ink-200 hover:border-blue-300 hover:text-blue-700"
                    }`}
                  >
                    {d}
                  </Link>
                );
              })}
            </div>
          </Reveal>

          {/* Doctors Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-blue-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                      <Building2 className="h-3 w-3" /> {doc.department}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-ink-400">
                      {doc.unit}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-ink-900 group-hover:text-blue-700 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-medium text-ink-600">{doc.designation}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{doc.qualifications}</p>

                  <div className="mt-4 space-y-2 border-t border-ink-100 pt-3 text-xs text-ink-700">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>
                        <strong>OP Days:</strong> {doc.opDays} ({doc.time})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Location:</strong> {doc.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <UserCheck className="h-3.5 w-3.5" /> Consultation Active
                  </span>
                  <a
                    href={`tel:${COLLEGE.phone}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Hospital Desk
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
