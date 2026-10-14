import { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, AlertCircle, FileText, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ACADEMIC_BATCHES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Academic Calendar | Govt Medical College Kozhikode",
  description:
    "Official academic calendar, KUHS examination dates, clinical postings, and internal assessments for MBBS & PG batches at GMC Kozhikode.",
};

const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "KUHS Final Professional MBBS Part II Regular Examination",
    batch: "mbbs-3-2",
    batchLabel: "MBBS Final Part 2",
    eventType: "exam",
    date: "Nov 16, 2026 – Nov 28, 2026",
    status: "Upcoming",
    description: "Theory examinations for Medicine, Surgery, Pediatrics, and Obstetrics & Gynecology.",
    venue: "Main Examination Hall, Academic Block",
  },
  {
    id: "2",
    title: "Phase II MBBS Clinical Postings — Block 3 Rotation",
    batch: "mbbs-2",
    batchLabel: "MBBS Phase 2",
    eventType: "posting",
    date: "Nov 02, 2026 – Dec 15, 2026",
    status: "Ongoing",
    description: "Clinical postings across General Surgery, OBG, and Community Medicine.",
    venue: "Medical College Hospital & IMCH",
  },
  {
    id: "3",
    title: "1st Year MBBS 2nd Internal Assessment (Anatomy, Physio, Biochem)",
    batch: "mbbs-1",
    batchLabel: "MBBS Phase 1",
    eventType: "internal",
    date: "Dec 05, 2026 – Dec 12, 2026",
    status: "Upcoming",
    description: "Theory and practical assessment series covering semester modules 1 to 3.",
    venue: "Lecture Theatre 1 & 2",
  },
  {
    id: "4",
    title: "CRMI (Compulsory Rotatory Internship) Casualty Night Duty Roster Handover",
    batch: "interns",
    batchLabel: "House Surgeons (CRMI)",
    eventType: "posting",
    date: "Every 15 Days",
    status: "Active",
    description: "Casualty and ICU rotation changeover list for 2025-2026 house surgeons.",
    venue: "Superintendent Office / Casualty",
  },
  {
    id: "5",
    title: "Postgraduate MD/MS Dissertation Final Submission Deadline",
    batch: "pg",
    batchLabel: "Postgraduates",
    eventType: "exam",
    date: "Dec 20, 2026",
    status: "Strict Deadline",
    description: "Submission of four hard copies and soft copy of dissertation to the Principal's Office for KUHS evaluation.",
    venue: "Academic Cell",
  },
];

export default async function AcademicCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  const { batch = "all" } = await searchParams;

  const filteredEvents = SAMPLE_EVENTS.filter(
    (ev) => batch === "all" || ev.batch === batch
  );

  return (
    <>
      <PageHeader
        eyebrow="GMC Kozhikode & KUHS"
        title="Academic Calendar"
        description="Comprehensive schedule of examinations, clinical rotations, internal assessments, and university deadlines."
        breadcrumb={[{ label: "Academic Calendar" }]}
      />

      <section className="py-12 sm:py-16 bg-white">
        <Container>
          {/* Batch Selector Filter */}
          <Reveal>
            <div className="flex flex-wrap gap-2 pb-4 border-b border-ink-100">
              {ACADEMIC_BATCHES.map((b) => {
                const active = (batch || "all") === b.id;
                return (
                  <Link
                    key={b.id}
                    href={b.id === "all" ? "/calendar" : `/calendar?batch=${b.id}`}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-50 text-ink-700 border border-ink-200 hover:bg-slate-100"
                    }`}
                  >
                    {b.label}
                  </Link>
                );
              })}
            </div>
          </Reveal>

          {/* Schedule List */}
          <div className="mt-8 space-y-4">
            {filteredEvents.map((ev) => {
              const isExam = ev.eventType === "exam";
              const isInternal = ev.eventType === "internal";
              return (
                <div
                  key={ev.id}
                  className="rounded-2xl border border-ink-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          isExam
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : isInternal
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        <CalendarDays className="h-3.5 w-3.5" /> {ev.eventType}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700">
                        {ev.batchLabel}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600">
                        ● {ev.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-ink-900">
                      {ev.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-600">{ev.description}</p>
                    <p className="text-xs text-ink-400">Venue: {ev.venue}</p>
                  </div>

                  <div className="md:text-right shrink-0">
                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-semibold text-ink-800 border border-ink-200">
                      <Clock className="h-4 w-4 text-slate-500" />
                      {ev.date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
