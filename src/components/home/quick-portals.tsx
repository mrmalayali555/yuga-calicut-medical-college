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
import { EditableText } from "@/components/admin/inline/editable-text";

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
    <section className="py-24 sm:py-32 bg-[var(--bg-surface)] border-t border-[var(--border-primary)] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mb-12"
        >
          <EditableText
            blockId="portals-label"
            defaultContent="Campus Portals"
            pageId="home"
            label="Portals Section Label"
            as="p"
            className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3"
          />
          <EditableText
            blockId="portals-title"
            defaultContent="Everything in one place."
            pageId="home"
            label="Portals Section Title"
            as="h2"
            className="text-3xl sm:text-4xl font-display text-[var(--text-primary)] font-normal"
          />
          <EditableText
            blockId="portals-subtitle"
            defaultContent="Direct navigation across medical student welfare, academics, and culture."
            pageId="home"
            label="Portals Section Subtitle"
            as="p"
            className="mt-2 text-sm text-[var(--text-secondary)]"
          />
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
                      ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/15 hover:border-red-500/50 shadow-xs hover:shadow-md"
                      : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:bg-[var(--bg-card-hover)] shadow-xs hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 group-hover:scale-105 ${
                          portal.danger
                            ? "bg-red-500/20 border-red-500/30 text-red-500"
                            : "bg-[var(--accent-subtle)] border-[var(--border-primary)] text-[var(--accent)] group-hover:border-[var(--accent)]"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <ArrowUpRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          portal.danger
                            ? "text-red-400 group-hover:text-red-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                            : "text-[var(--text-faint)] group-hover:text-[var(--accent)] group-hover:translate-x-1 group-hover:-translate-y-1"
                        }`}
                        aria-hidden="true"
                      />
                    </div>

                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5 group-hover:text-[var(--accent)] transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
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

