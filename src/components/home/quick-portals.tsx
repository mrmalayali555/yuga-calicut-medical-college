"use client";

import Link from "next/link";
import {
  CalendarDays,
  Sparkles,
  Trophy,
  FileText,
  Users,
  MessageSquareWarning,
  Siren,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const PORTALS = [
  {
    title: "Circulars & Notices",
    desc: "Academic directives, KUHS exam timetables, and union communications.",
    href: "/notifications",
    icon: FileText,
    span: "sm:col-span-2",
  },
  {
    title: "Emergency Registry",
    desc: "24/7 direct casualty triage, ambulance lines, and blood donor matching.",
    href: "/emergency",
    icon: Siren,
    span: "",
    danger: true,
  },
  {
    title: "Fests & Cultural Nights",
    desc: "Annual YUGA arts fests, music concerts, and stage registrations.",
    href: "/events",
    icon: Sparkles,
    span: "",
  },
  {
    title: "Academic Hub",
    desc: "KUHS exam timetables, clinical posting rotations, and assessment dates.",
    href: "/calendar",
    icon: CalendarDays,
    span: "",
  },
  {
    title: "Laurels & Hall of Fame",
    desc: "State championship shields, research grants, and athletic gold.",
    href: "/achievements",
    icon: Trophy,
    span: "",
  },
  {
    title: "Student Grievance Desk",
    desc: "Confidential feedback loop and representation to Union Executive Council.",
    href: "/complaints",
    icon: MessageSquareWarning,
    span: "sm:col-span-2",
  },
  {
    title: "Subcommittees & Wings",
    desc: "16 active student councils across fine arts, sports, literary, and social aid.",
    href: "/subcommittees",
    icon: Users,
    span: "",
  },
];

export function QuickPortals() {
  return (
    <section className="py-24 sm:py-32 bg-[#f8faf8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
            Campus Portals
          </p>
          <h2 className="text-3xl sm:text-4xl font-display text-slate-900 font-normal">
            Everything in one place.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Direct navigation across medical student welfare, academics, and culture.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.055 } },
          }}
          className="grid sm:grid-cols-3 gap-4"
        >
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
                whileTap={{ scale: 0.98 }}
                className={portal.span}
              >
                <Link
                  href={portal.href}
                  className={`group flex flex-col justify-between h-full rounded-2xl border p-6 transition-[border-color,background,box-shadow] duration-200 ${
                    portal.danger
                      ? "border-red-200 bg-red-50/40 hover:bg-red-50/80 hover:border-red-300 shadow-xs hover:shadow-md"
                      : "border-slate-200/90 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 shadow-xs hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 group-hover:scale-105 ${
                          portal.danger
                            ? "bg-red-100 border-red-200 text-red-600 group-hover:bg-red-200/80"
                            : "bg-emerald-50 border-emerald-200/80 text-emerald-700 group-hover:bg-emerald-100 group-hover:border-emerald-300"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <ArrowUpRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          portal.danger
                            ? "text-red-400 group-hover:text-red-600 group-hover:translate-x-1 group-hover:-translate-y-1"
                            : "text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 group-hover:-translate-y-1"
                        }`}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-emerald-800 transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {portal.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
