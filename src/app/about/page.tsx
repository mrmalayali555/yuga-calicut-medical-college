"use client";

import Link from "next/link";
import {
  History,
  Target,
  Eye,
  Quote,
  ArrowRight,
  Building2,
  Stethoscope,
} from "lucide-react";
import { COLLEGE } from "@/lib/site";
import { LEADERSHIP } from "@/lib/data";
import { motion } from "framer-motion";

const STATS = [
  { value: "1957", label: "Founded", sub: "68+ years of service" },
  { value: "3,000+", label: "Beds", sub: "Largest campus in Kerala" },
  { value: "250+", label: "MBBS intake / year", sub: "Top NEET rankers" },
  { value: "16", label: "Subcommittees", sub: "Culture, sports, research" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-3">
            Heritage & Charter
          </p>
          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)]">
            About YUGA Union
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            Representing 3,000+ medical students, interns, and postgraduate
            residents at {COLLEGE.name} — the epoch of renewal, fearless
            advocacy, and compassionate medicine.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="card p-6"
            >
              <div className="text-3xl font-semibold text-[var(--text-primary)] tabular-nums">
                {s.value}
              </div>
              <div className="mt-2 text-sm font-semibold text-emerald-800">
                {s.label}
              </div>
              <div className="mt-1 text-[11px] text-[var(--text-faint)] font-medium">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Story + Quote */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="lg:col-span-7 card p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 mb-5">
                <History className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-display text-[var(--text-primary)]">
                Our Heritage
              </h2>
              <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                Established in 1957, Government Medical College Kozhikode stands
                as the cradle of modern healthcare in Northern Kerala. Spanning
                over 270 acres with IMCH, Super Specialty Block, and regional
                cancer centers, CMC trains thousands of the country&apos;s
                finest clinicians.
              </p>
              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                <strong className="text-[var(--text-primary)]">YUGA (യുഗ)</strong>{" "}
                signifies the dawn of an empowered era. As the democratically
                elected college union for 2026–2027, our mandate extends from
                academic representation at KUHS to inter-collegiate festivals,
                sports meets, and student grievance resolutions.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-[var(--border-primary)] flex flex-wrap items-center gap-5 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span className="font-medium text-slate-700">Affiliated to KUHS, Thrissur</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span className="font-medium text-slate-700">NMC Recognised</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.08 }}
            className="lg:col-span-5 card p-8 sm:p-10 flex flex-col justify-between border-emerald-200 bg-emerald-50/40"
          >
            <div>
              <Quote className="h-8 w-8 text-emerald-700 opacity-40 mb-5" aria-hidden="true" />
              <blockquote className="text-base font-display italic leading-relaxed text-[var(--text-primary)]">
                &ldquo;Calicut Medicos have consistently proven that rigorous
                clinical training and vibrant cultural, sporting, and societal
                excellence are not contradictory — they fuel each other.&rdquo;
              </blockquote>
            </div>
            <div className="mt-6 pt-5 border-t border-emerald-200 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-sm">
                AN
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Dr. Arjun S. Nair
                </p>
                <p className="text-xs text-emerald-700 font-semibold">
                  Chairperson, YUGA 2026–27
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-5 sm:grid-cols-2 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="card p-8"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 mb-5">
              <Target className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-display text-[var(--text-primary)]">
              Our Mission
            </h3>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              To cultivate an inclusive environment that balances demanding
              medical curricula with artistic expression, athletic glory, and
              fearless student advocacy across all batches.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.06 }}
            className="card p-8"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-800 border border-sky-200 mb-5">
              <Eye className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-display text-[var(--text-primary)]">
              Our Vision
            </h3>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              Fostering compassionate healthcare leaders who excel as
              clinicians, researchers, and socially conscious citizens who
              uplift public healthcare.
            </p>
          </motion.div>
        </div>

        {/* Leadership Grid */}
        <div className="mb-20">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-3">
              Elected Representatives
            </p>
            <h2 className="text-3xl sm:text-4xl font-display text-[var(--text-primary)]">
              Executive Council
            </h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {LEADERSHIP.map((leader) => {
              const initials = leader.name
                .replace("Dr. ", "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);
              return (
                <motion.div
                  key={leader.role}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 100, damping: 20 },
                    },
                  }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-sm">
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">
                        {leader.name}
                      </h3>
                      <p className="text-xs text-emerald-700 font-semibold">
                        {leader.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {leader.portfolio}
                  </p>
                  <blockquote className="text-sm text-[var(--text-secondary)] italic leading-relaxed border-l-2 border-emerald-500 pl-3">
                    &ldquo;{leader.quote}&rdquo;
                  </blockquote>
                  <div className="mt-3 text-[11px] text-[var(--text-faint)] font-mono font-medium">
                    {leader.batch}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="card p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/30"
        >
          <div>
            <h3 className="text-xl font-display text-[var(--text-primary)]">
              Explore student wings and clubs
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Find convenors and details for 16 specialized subcommittees.
            </p>
          </div>
          <Link href="/subcommittees" className="btn-primary shrink-0">
            View Subcommittees
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
