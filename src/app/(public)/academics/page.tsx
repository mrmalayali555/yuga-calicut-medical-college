import { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, BookOpen, Award, FileCheck, Users, School } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { COLLEGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Academics & Courses | Govt Medical College Kozhikode",
  description:
    "Explore undergraduate (MBBS), postgraduate (MD/MS), and super-specialty (DM/MCh) courses at Calicut Medical College.",
};

const COURSES = [
  {
    category: "Undergraduate (UG)",
    title: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
    duration: "4.5 Years + 1 Year CRMI Internship",
    intake: "250 Seats Annually",
    affiliation: "KUHS / National Medical Commission (NMC)",
    description:
      "Prestigious MBBS program following the NMC Competency Based Medical Education (CBME) curriculum with bedside clinical exposure across Calicut Medical College Hospital and IMCH.",
  },
  {
    category: "Postgraduate (PG)",
    title: "Doctor of Medicine (MD) & Master of Surgery (MS)",
    duration: "3 Years Residency",
    intake: "200+ Seats across 24 Specialties",
    affiliation: "KUHS / NMC Recognized",
    description:
      "Comprehensive residency training in General Medicine, Surgery, Pediatrics, Orthopedics, OBG, Anesthesiology, Radiology, Pathology, and more with high clinical patient volume.",
  },
  {
    category: "Super Specialty",
    title: "Doctorate of Medicine (DM) & Magister Chirurgiae (MCh)",
    duration: "3 Years Advanced Fellowship",
    intake: "40+ Seats across 12 Departments",
    affiliation: "KUHS / NMC Super-specialty Board",
    description:
      "Subspecialty surgical and medical training in Cardiology, Neurology, Gastroenterology, Nephrology, Neurosurgery, Urology, and Plastic Surgery.",
  },
  {
    category: "Nursing & Allied Health",
    title: "B.Sc Nursing, B.Pharm, DMLT & Allied Sciences",
    duration: "2 to 4 Years",
    intake: "Multiple Programs",
    affiliation: "Kerala University of Health Sciences",
    description:
      "Technical clinical degree training providing practical clinical rotations in critical care units, diagnostic labs, and operation theatres.",
  },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Excellence in Medical Education"
        title="Academics & Curricula"
        description="Pioneering medical education in Kerala with undergraduate, postgraduate, and doctoral super-specialty programs."
        breadcrumb={[{ label: "Academics" }]}
      />

      <section className="py-14 sm:py-20 bg-slate-50/50">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {COURSES.map((c) => (
              <div
                key={c.title}
                className="rounded-3xl border border-ink-100 bg-white p-7 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {c.category}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-ink-900">{c.title}</h3>
                  <p className="mt-3 text-sm text-ink-600 leading-relaxed">{c.description}</p>

                  <div className="mt-6 space-y-2 border-t border-ink-100 pt-4 text-xs text-ink-700">
                    <div>
                      <strong className="text-ink-900">Duration:</strong> {c.duration}
                    </div>
                    <div>
                      <strong className="text-ink-900">Annual Intake:</strong> {c.intake}
                    </div>
                    <div>
                      <strong className="text-ink-900">Accreditation:</strong> {c.affiliation}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink-100 flex items-center justify-between">
                  <Link
                    href="/calendar"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Academic Calendar →
                  </Link>
                  <span className="text-xs font-medium text-ink-400">KUHS Affiliated</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
