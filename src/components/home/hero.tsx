"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { COLLEGE } from "@/lib/site";
import { EVENTS } from "@/lib/data";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/home/animated-counter";
import { useTheme } from "@/components/theme/theme-context";
import { EditableText } from "@/components/admin/inline/editable-text";

const STATS = [
  { value: 3000, suffix: "+", label: "Medicos", isStatic: false },
  { value: 68, suffix: "", label: "Years of Legacy", isStatic: false },
  { value: 16, suffix: "", label: "Subcommittees", isStatic: false },
  { raw: "24/7", label: "Casualty Care", isStatic: true },
];

export function Hero() {
  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";
  const featuredEvent = EVENTS[0];

  if (isObsidian) {
    return (
      <section className="relative overflow-hidden bg-[#07080a] text-on-surface pt-24 sm:pt-28 pb-16 lg:pb-24">
        {/* Architectural Red Coordinate Vector Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full stroke-primary-container" fill="none" strokeWidth="0.75" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="64" id="medical-grid" patternUnits="userSpaceOnUse" width="64">
                <path d="M 64 0 L 0 0 0 64" />
                <circle className="fill-primary-container" cx="64" cy="64" r="1.5" />
              </pattern>
            </defs>
            <rect fill="url(#medical-grid)" height="100%" width="100%" />
          </svg>
        </div>

        {/* Ambient Focal Radiance */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-container/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-tertiary-container/15 rounded-full blur-[160px] pointer-events-none" />

        {/* Primary Bento Matrix Container */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-margin-sm md:px-margin lg:px-margin-lg py-space-lg lg:py-space-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-center">
            {/* Left Column: Manifesto & Command Console */}
            <div className="lg:col-span-7 flex flex-col items-start gap-space-lg">
              {/* Status Pill with Pulsing Core */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-space-sm bg-inverse-surface text-inverse-on-surface px-space-md py-space-xs rounded-full shadow-[0_0_24px_rgba(255,255,255,0.15)]"
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
                </span>
                <EditableText
                  blockId="hero-status-pill"
                  defaultContent="LIVE TENURE 2026–2027 &nbsp;|&nbsp; GMC KOZHIKODE"
                  pageId="home"
                  label="Status Pill Text"
                  as="span"
                  className="font-label-sm text-label-sm tracking-widest uppercase font-extrabold text-[#090a0f]"
                />
              </motion.div>

              {/* Dominant Typographic Anchor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-space-xs"
              >
                <EditableText
                  blockId="hero-title-line1"
                  defaultContent="THE EPOCH OF"
                  pageId="home"
                  label="Hero Title Line 1"
                  as="h1"
                  className="font-headline-xl text-headline-xl text-on-primary-container tracking-tight uppercase"
                />
                <div className="font-headline-xl text-headline-xl tracking-tighter italic font-serif">
                  <EditableText
                    blockId="hero-title-line2"
                    defaultContent="Renewal &amp; Care"
                    pageId="home"
                    label="Hero Title Line 2"
                    as="span"
                    className="bg-gradient-to-r from-[#ff2e56] via-primary-container to-tertiary-container bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(225,29,72,0.4)]"
                  />
                </div>
              </motion.div>

              {/* Collegiate Union Manifesto */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                <EditableText
                  blockId="hero-manifesto"
                  defaultContent="The sovereign collective voice of Calicut Medical College medicos, house surgeons, and clinical residents. Forged in sixty-eight years of militant solidarity, clinical supremacy, and uncompromising public health stewardship."
                  pageId="home"
                  label="Hero Manifesto Paragraph"
                  as="p"
                  className="font-body-lg text-body-lg text-on-surface/90 max-w-2xl leading-relaxed"
                  multiline
                />
              </motion.div>

              {/* Command Dual Action Array */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto"
              >
                {/* Button 1: Stark White High-Contrast */}
                <Link
                  href="/events"
                  className="group relative inline-flex items-center justify-center gap-space-sm bg-on-primary-container text-[#07080a] font-label-lg text-label-lg px-space-xl py-space-md rounded transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <span className="tracking-wide uppercase font-bold">Explore Events &amp; Fests</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>

                {/* Button 2: Deep Obsidian with Arterial Crimson Resonance */}
                <Link
                  href="/complaints"
                  className="inline-flex items-center justify-center gap-space-sm bg-surface-container-lowest text-primary font-label-lg text-label-lg px-space-lg py-space-md rounded shadow-[0_0_20px_rgba(225,29,72,0.18)] hover:bg-surface-container-low hover:text-on-primary-container transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-primary-container text-[20px]">
                    shield_person
                  </span>
                  <span className="tracking-wider uppercase font-semibold">Student Grievance Desk</span>
                </Link>
              </motion.div>

              {/* Supplementary Institutional Telemetry Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="flex items-center gap-space-lg pt-space-sm text-secondary-fixed-dim"
              >
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <span className="font-label-md text-label-md uppercase tracking-wider font-medium">Democratically Ratified</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-surface-variant" />
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary-container text-[18px]">local_hospital</span>
                  <span className="font-label-md text-label-md uppercase tracking-wider font-medium">Apex Medical Campus</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Bento Architectural Composition */}
            <div className="lg:col-span-5 flex flex-col gap-space-md mt-space-md lg:mt-0">
              {/* Stark White Primary Event Conclave Card */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-inverse-surface text-inverse-on-surface rounded p-space-lg shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(255,255,255,0.08)] overflow-hidden"
              >
                {/* Subtle Structural Header Bar */}
                <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-black/10">
                  <span className="inline-flex items-center gap-1.5 bg-[#090a0f] text-on-primary-container px-space-sm py-0.5 rounded font-label-sm text-label-sm tracking-widest font-black uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                    ALL-KERALA CONCLAVE
                  </span>
                  <div className="flex items-center gap-1 font-label-sm text-label-sm font-bold text-primary-container uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span>MARCH 27–29, 2026</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="space-y-space-xs">
                  <EditableText
                    blockId="hero-card-category"
                    defaultContent="Annual Intercollegiate Medical Colloquium"
                    pageId="home"
                    label="Featured Card Category"
                    as="span"
                    className="font-label-sm text-label-sm tracking-widest uppercase text-black/60 font-bold"
                  />
                  <EditableText
                    blockId="hero-card-title"
                    defaultContent="PULSE 2026: The Sovereign Vanguard"
                    pageId="home"
                    label="Featured Card Title"
                    as="h3"
                    className="font-headline-md text-headline-md font-extrabold text-[#090a0f] tracking-tight leading-tight"
                  />
                  <EditableText
                    blockId="hero-card-description"
                    defaultContent="Featuring 42 clinical hackathons, state surgical simulation leagues, national med-law panels, and Calicut&apos;s landmark cultural gala."
                    pageId="home"
                    label="Featured Card Description"
                    as="p"
                    className="font-body-md text-body-md text-black/75 pt-space-xs"
                    multiline
                  />
                </div>

                {/* Venue & Direct RSVP Action Ribbon */}
                <div className="mt-space-md pt-space-md border-t border-black/10 flex items-center justify-between">
                  <div className="flex items-center gap-space-xs text-black/90">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">location_on</span>
                    <span className="font-label-md text-label-md font-bold uppercase tracking-tight">Silver Jubilee Auditorium, GMC</span>
                  </div>
                  <Link
                    href="/events"
                    className="bg-primary-container text-on-primary-container px-space-md py-space-xs rounded font-label-md text-label-md font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(225,29,72,0.4)] hover:bg-tertiary-container transition-colors"
                  >
                    Delegate Pass →
                  </Link>
                </div>
              </motion.div>

              {/* Metrics Bento Panel: High-Impact Glass Obsidian */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface-container-low/95 rounded p-space-md shadow-xl backdrop-blur-md"
              >
                <div className="grid grid-cols-2 gap-space-sm">
                  {/* Metric 1: Medicos */}
                  <div className="bg-surface-container-lowest/80 p-space-md rounded flex flex-col justify-between">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="font-label-sm text-label-sm tracking-wider uppercase">Active Caucus</span>
                      <span className="material-symbols-outlined text-[16px]">groups</span>
                    </div>
                    <div className="pt-space-xs">
                      <div className="font-headline-lg text-headline-lg font-extrabold text-on-primary-container tracking-tight">
                        <AnimatedCounter value={3000} suffix="+" />
                      </div>
                      <div className="font-label-sm text-label-sm text-primary tracking-wider uppercase font-semibold">Undergrads &amp; Residents</div>
                    </div>
                  </div>

                  {/* Metric 2: Legacy */}
                  <div className="bg-surface-container-lowest/80 p-space-md rounded flex flex-col justify-between">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="font-label-sm text-label-sm tracking-wider uppercase">Heritage</span>
                      <span className="material-symbols-outlined text-[16px]">history_edu</span>
                    </div>
                    <div className="pt-space-xs">
                      <div className="font-headline-lg text-headline-lg font-extrabold text-primary-container tracking-tight drop-shadow-[0_0_14px_rgba(225,29,72,0.35)]">
                        <AnimatedCounter value={68} suffix="" />
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">Years of Supremacy</div>
                    </div>
                  </div>

                  {/* Metric 3: Subcommittees */}
                  <div className="bg-surface-container-lowest/80 p-space-md rounded flex flex-col justify-between">
                    <div className="flex items-center justify-between text-secondary">
                      <span className="font-label-sm text-label-sm tracking-wider uppercase">Operational</span>
                      <span className="material-symbols-outlined text-[16px]">account_tree</span>
                    </div>
                    <div className="pt-space-xs">
                      <div className="font-headline-lg text-headline-lg font-extrabold text-on-primary-container tracking-tight">
                        <AnimatedCounter value={16} suffix="" />
                      </div>
                      <div className="font-label-sm text-label-sm text-secondary-fixed-dim tracking-wider uppercase font-semibold">Active Subcommittees</div>
                    </div>
                  </div>

                  {/* Metric 4: Rapid Response */}
                  <div className="bg-surface-container-lowest/80 p-space-md rounded flex flex-col justify-between">
                    <div className="flex items-center justify-between text-primary">
                      <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold text-primary">SOS Net</span>
                      <span className="material-symbols-outlined text-[16px] text-primary-container animate-pulse">crisis_alert</span>
                    </div>
                    <div className="pt-space-xs">
                      <div className="font-headline-lg text-headline-lg font-extrabold text-primary-container tracking-tight drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]">
                        24/7
                      </div>
                      <div className="font-label-sm text-label-sm text-primary tracking-wider uppercase font-bold">Emergency Duty Net</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Union Credentials Ticker Footer within Bento Stack */}
              <div className="bg-surface-container-high px-space-md py-space-xs rounded flex items-center justify-between text-secondary">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                  <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest font-semibold">YUGA Executive Senate Council</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary uppercase font-mono tracking-wider">AFFILIATED: KUHS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // DEFAULT / ORIGINAL CLINICAL EMERALD HERO
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
              <span className="italic font-normal text-emerald-600">Renewal &amp; Care</span>
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
                <span>Explore Events &amp; Fests</span>
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
