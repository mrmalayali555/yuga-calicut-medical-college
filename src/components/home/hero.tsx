"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { COLLEGE } from "@/lib/site";
import { EVENTS } from "@/lib/data";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/home/animated-counter";

const STATS = [
  { value: 3000, suffix: "+", label: "Medicos", isStatic: false },
  { value: 68, suffix: "", label: "Years of Legacy", isStatic: false },
  { value: 16, suffix: "", label: "Subcommittees", isStatic: false },
  { raw: "24/7", label: "Casualty Care", isStatic: true },
];

export function Hero() {
  const featuredEvent = EVENTS[0];

  return (
    <section className="relative min-h-[92dvh] flex items-end pb-16 sm:pb-24 pt-32 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white">
      {/* Soft Ambient Radial Light with subtle continuous breath */}
      <motion.div
        aria-hidden="true"
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.18),transparent_70%)] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          {/* Left: Headline & Actions */}
          <div className="lg:col-span-7">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 mb-6 shadow-2xs"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse-soft" />
              <span className="text-xs font-semibold tracking-wide text-emerald-800">
                Official College Union · 2026–2027
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.75rem,6.2vw,5.2rem)] font-display leading-[0.98] tracking-[-0.03em] text-slate-900 font-normal"
            >
              The Epoch of
              <br />
              <span className="italic font-normal text-emerald-600">Renewal & Care</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
            >
              Democratically elected union representing every medical student,
              intern doctor, and postgraduate resident at {COLLEGE.name}.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center gap-3.5"
            >
              <Link href="/events" className="btn-primary group">
                <span>Explore Events & Fests</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              <Link href="/complaints" className="btn-secondary">
                Student Grievance Desk
              </Link>
            </motion.div>
          </div>

          {/* Right: Featured Event Card + Stats */}
          <div className="lg:col-span-5">
            {/* Featured Event Card */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
            >
              <Link
                href="/events"
                className="group block card p-6 sm:p-8 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="tag">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse-soft" />
                    Upcoming Conclave
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  {featuredEvent.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {featuredEvent.subtitle}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="font-semibold text-emerald-800">{featuredEvent.date}</span>
                  <span>{featuredEvent.venue}</span>
                </div>
              </Link>
            </motion.div>

            {/* Stats strip with live numeric countup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                    {stat.isStatic ? (
                      stat.raw
                    ) : (
                      <AnimatedCounter value={stat.value!} suffix={stat.suffix} />
                    )}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
