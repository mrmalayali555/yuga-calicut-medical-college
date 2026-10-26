"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Calendar,
  Users,
  Trophy,
  Award,
  Sparkles,
} from "lucide-react";

interface GodhaHeroProps {
  convenorPhone?: string;
}

export function GodhaHero({
  convenorPhone = "+919447345601",
}: GodhaHeroProps) {
  return (
    <section className="relative pt-24 sm:pt-32 pb-14 sm:pb-24 bg-[#030905] text-white overflow-hidden select-none">
      {/* =========================================================================
          BACKGROUND ARTWORK: Godha Sports Stadium Background + Atmospheric Aurora
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden">
        <Image
          src="/clubs/godha-sports-bg.jpg"
          alt="Godha Sports Stadium & Athletics Background"
          fill
          priority
          className="object-cover object-center lg:object-[center_top] opacity-90"
        />
        {/* Soft edge blend gradients for readability and contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030905]/95 via-[#030905]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030905] via-transparent to-[#030905]/50" />
      </div>

      {/* Ambient Radial Glows */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.06) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 right-10 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(4, 120, 87, 0.04) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* =========================================================================
          FAR-LEFT VERTICAL BRAND MANIFESTO (Large Screens)
          ========================================================================= */}
      <div className="hidden 2xl:flex flex-col items-center gap-6 absolute left-6 top-1/2 -translate-y-1/2 -z-10 pointer-events-none">
        <div className="h-16 w-px bg-emerald-500/30" />
        <div className="text-[10px] uppercase font-bold tracking-[0.35em] text-emerald-400/40 [writing-mode:vertical-rl] rotate-180 flex items-center gap-4">
          <span>PLAY</span>
          <span>•</span>
          <span>TRAIN</span>
          <span>•</span>
          <span>COMPETE</span>
          <span>•</span>
          <span>GROW</span>
          <span>•</span>
          <span>TOGETHER</span>
        </div>
        <div className="h-16 w-px bg-emerald-500/30" />
      </div>

      {/* =========================================================================
          MAIN CONTAINER
          ========================================================================= */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-1.5 text-xs font-semibold text-slate-300 shadow-md">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-3 w-3 text-emerald-400" />
              <span>GMC Home</span>
            </Link>
            <span className="text-white/30">/</span>
            <Link
              href="/subcommittees"
              className="hover:text-white transition-colors duration-200"
            >
              Student Wings
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-emerald-400 font-bold tracking-wide">
              Godha Portal
            </span>
          </div>
        </motion.div>

        {/* Hero 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* ===================================================================
              LEFT SIDE: Godha Emblem Panel & Recognition Badge
              =================================================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-start"
          >
            <div className="relative group w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center">
              {/* Subtle outer green ambient glow */}
              <div className="absolute -inset-1 rounded-[2.6rem] bg-gradient-to-br from-emerald-500/30 via-teal-500/15 to-transparent blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Refined Dark Framed Panel */}
              <div className="relative w-full rounded-[2.2rem] bg-[#07140c]/85 backdrop-blur-2xl border border-emerald-500/30 p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center overflow-hidden transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_24px_70px_rgba(16,185,129,0.25)]">
                {/* Inner Bezel Ring */}
                <div className="absolute inset-2.5 rounded-[1.85rem] border border-white/[0.06] pointer-events-none" />

                {/* Subtle emerald lighting gradient highlight */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-emerald-500/20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-emerald-500/[0.04] pointer-events-none" />

                {/* Godha Official Logo (Original Gold-Wood Sports Club Artwork) */}
                <div className="relative w-full aspect-[2.3/1] max-w-[300px] flex items-center justify-center">
                  <Image
                    src="/clubs/godha-logo.png"
                    alt="Official Godha Sports Club Emblem"
                    fill
                    className="object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-[1.03]"
                    priority
                  />
                </div>
              </div>

              {/* Pill Badge Beneath Panel: EST. 1962 · OFFICIAL WING */}
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#07160d]/80 px-4 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-emerald-300 uppercase shadow-md backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span>EST. 1962 · OFFICIAL WING</span>
              </div>
            </div>
          </motion.div>

          {/* ===================================================================
              RIGHT SIDE: Typography, Headings & Action Buttons
              =================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-7 xl:col-span-7 relative text-center lg:text-left"
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-3.5">
              <span className="h-[2px] w-6 bg-emerald-500 rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                ATHLETICS &amp; PHYSICAL FITNESS
              </span>
              <span className="h-[2px] w-6 bg-emerald-500 rounded-full lg:hidden" />
            </div>

            {/* Malayalam Name Title */}
            <div className="text-3xl sm:text-4xl font-serif font-bold text-white/90 mb-1">
              ഗോദ
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-[5.2rem] font-display text-white tracking-tight leading-[1] mb-3">
              Godha<span className="text-emerald-500">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-200 font-normal mb-5 tracking-tight font-sans">
              Sports, Athletics &amp; Fitness Council
            </p>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl xl:max-w-2xl mb-8 sm:mb-9 font-sans mx-auto lg:mx-0">
              The athletic battleground and fitness powerhouse of GMC Kozhikode, Godha
              manages the historic college sports grounds, multi-gym, synthetic indoor
              badminton arena, and basketball courts, while organizing the world-famous
              Calicut Medicos Premier League (CMPL).
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href={`tel:${convenorPhone}`}
                className="group relative inline-flex items-center gap-3 rounded-full bg-emerald-600 hover:bg-emerald-500 px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/60 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Users className="h-4 w-4" />
                <span>Connect with Convenor</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>

              <Link
                href="/events"
                className="group inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 hover:bg-white/15 px-6 sm:px-7 py-3 sm:py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span>Wing Calendar</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            STATISTICS STRIP: 480+ Medicos, 16 Batches, 28 Trophies, 18 Meets
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="mt-12 sm:mt-16 rounded-[2rem] bg-[#07150d]/90 backdrop-blur-2xl border border-emerald-500/25 p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {/* Stat 1 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black tracking-tight text-emerald-400">
                  480+
                </div>
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  ACTIVE MEDICO ATHLETES
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400">
                  Across 8 disciplines
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black tracking-tight text-emerald-400">
                  16 Batches
                </div>
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  CMPL FRANCHISE TEAMS
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400">
                  Cricket &amp; Football
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black tracking-tight text-emerald-400">
                  28 Trophies
                </div>
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  UNIVERSITY CUP WINS
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400">
                  KUHS &amp; Inter-Collegiate
                </div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:pl-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-black tracking-tight text-emerald-400">
                  18 Meets
                </div>
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">
                  ANNUAL MEETS
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400">
                  Intra &amp; State tournaments
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
