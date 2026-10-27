"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Droplets,
  Calendar,
  Users,
  Truck,
  Zap,
  HeartPulse,
  Activity,
} from "lucide-react";

interface JeevanamHeroProps {
  convenorPhone?: string;
  onOpenEmergencyDesk?: () => void;
  stats?: { label: string; value: string; hint: string }[];
}

export function JeevanamHero({
  convenorPhone = "+919447123401",
  onOpenEmergencyDesk,
}: JeevanamHeroProps) {
  return (
    <section className="relative pt-24 sm:pt-32 pb-14 sm:pb-20 bg-[#07080a] text-white overflow-hidden select-none">
      {/* =========================================================================
          BACKGROUND ARTWORK: Crimson Wave Background, Ambient Red Glows, Silk Ribbons
          ========================================================================= */}
      {/* Background Hero Image: Crimson Wave Abstract Hero Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden">
        <Image
          src="/clubs/crimson-wave-bg.png"
          alt="Crimson Wave Abstract Hero Background"
          fill
          priority
          className="object-cover object-center opacity-95"
        />
        {/* Soft edge blend gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080a]/85 via-[#07080a]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-transparent to-[#07080a]/50" />
      </div>

      {/* 1. Ambient radial lighting behind left panel */}
      <div
        className="absolute top-1/3 left-[22%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(225, 29, 72, 0.22) 0%, rgba(190, 18, 60, 0.08) 45%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* 2. Ambient lighting towards right background */}
      <div
        className="absolute top-1/2 -right-10 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(225, 29, 72, 0.14) 0%, rgba(136, 19, 55, 0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* 3. Subtle abstract concentric rings on the right */}
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-red-500/10 pointer-events-none -z-10" />
      <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-red-500/[0.04] pointer-events-none -z-10" />

      {/* 4. Full-canvas Smooth flowing crimson silk curves & wave ribbons (SVG) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <svg
          className="w-full h-full min-w-[1200px]"
          viewBox="0 0 1440 680"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="silkGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#be123c" stopOpacity="0.28" />
              <stop offset="30%" stopColor="#e11d48" stopOpacity="0.2" />
              <stop offset="65%" stopColor="#9f1239" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#881337" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="silkGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.18" />
              <stop offset="45%" stopColor="#be123c" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="ribbonGlowLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.2" />
              <stop offset="15%" stopColor="#ff4d6d" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#e11d48" stopOpacity="0.8" />
              <stop offset="75%" stopColor="#ff4d6d" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#be123c" stopOpacity="0.1" />
            </linearGradient>

            <filter id="crimsonFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left sweeping silk curve behind card */}
          <path
            d="M-50,420 C120,240 280,300 460,420 C640,540 880,560 1120,490 C1320,430 1420,380 1500,320 L1500,680 L-50,680 Z"
            fill="url(#silkGradient1)"
          />

          {/* Secondary lower wave fill */}
          <path
            d="M-50,540 C220,420 460,520 780,480 C1100,440 1340,560 1500,500 L1500,680 L-50,680 Z"
            fill="url(#silkGradient2)"
          />

          {/* Upper Glowing Silk Ribbon that swoops up behind the card */}
          <path
            d="M-50,380 C110,220 280,280 470,390 C660,500 900,530 1140,460 C1330,400 1440,350 1500,290"
            stroke="url(#ribbonGlowLine)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            filter="url(#crimsonFilter)"
          />

          {/* Secondary Lower Glowing Contour Line */}
          <path
            d="M-50,510 C200,400 440,495 760,460 C1080,425 1320,530 1500,470"
            stroke="url(#ribbonGlowLine)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Subtle dash-dot accent thread */}
          <path
            d="M-50,410 C140,260 300,320 490,420 C680,520 920,545 1160,480 C1340,425 1450,370 1500,310"
            stroke="#ff758f"
            strokeWidth="1"
            strokeDasharray="4 8"
            strokeOpacity="0.4"
            fill="none"
          />
        </svg>
      </div>

      {/* =========================================================================
          MAIN CONTAINER
          ========================================================================= */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="flex items-center gap-3 text-xs mb-8 sm:mb-12"
        >
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
            aria-label="Go back"
            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-2 text-white/60 font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              GMC Home
            </Link>
            <span className="text-white/30 font-light">/</span>
            <Link href="/subcommittees" className="hover:text-white transition-colors">
              Student Wings
            </Link>
            <span className="text-white/30 font-light">/</span>
            <span className="text-red-500 font-semibold tracking-wide">
              Jeevanam Portal
            </span>
          </div>
        </motion.div>

        {/* Hero 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          {/* ===================================================================
              LEFT SIDE: Official Jeevanam Floating Logo & Identification
              =================================================================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-5 xl:col-span-4 flex flex-col items-center lg:items-start"
          >
            <div className="relative group w-full max-w-[320px] sm:max-w-[340px] flex flex-col items-center">
              {/* Soft Ambient Glow Flowing Behind Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-red-600/25 blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100" />

              {/* Floating Jeevanam Official Logo (Directly on background flow, no extra card box) */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                <Image
                  src="/clubs/jeevanam-gold.png"
                  alt="Official Jeevanam Emblem"
                  width={280}
                  height={280}
                  className="w-full h-full object-contain filter drop-shadow-[0_12px_32px_rgba(225,29,72,0.4)] transition-transform duration-500 group-hover:scale-[1.04]"
                  priority
                />
              </div>

              {/* Caption Beneath Logo: EST. 2008 · OFFICIAL WING */}
              <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3 w-full">
                <span className="h-px w-10 sm:w-14 bg-white/20" />
                <div className="text-center">
                  <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-white/50 uppercase">
                    EST. 2008
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-white/70 uppercase">
                    OFFICIAL WING
                  </div>
                </div>
                <span className="h-px w-10 sm:w-14 bg-white/20" />
              </div>
            </div>
          </motion.div>

          {/* ===================================================================
              RIGHT SIDE: Main Hero Content, Headings & Action Buttons
              =================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-7 xl:col-span-8 relative"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="h-[2px] w-6 bg-red-500 rounded-full" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                EMERGENCY & SOCIAL SERVICE
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-[5.4rem] font-display text-white tracking-tight leading-[1] mb-3">
              Jeevanam<span className="text-red-500">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-200 font-normal mb-5 tracking-tight font-sans">
              Voluntary Blood Donation & Emergency Wing
            </p>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl xl:max-w-2xl mb-8 sm:mb-9 font-sans">
              The dedicated lifeline of Calicut Medical College. Jeevanam coordinates 24/7 urgent
              blood mobilization, single-donor platelet (SDP) apheresis for oncology & dengue
              crises, and rare blood group registry support across all GMC ICUs and casualty triage.
            </p>

            {/* Action Buttons Row (Single Row on Desktop) */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 sm:gap-3.5">
              {/* 1. Connect with Convenor (Primary Crimson Button) */}
              <a
                href={`tel:${convenorPhone}`}
                className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 px-5 sm:px-6 py-3.5 text-xs sm:text-[13px] font-semibold text-white shadow-[0_8px_25px_-4px_rgba(225,29,72,0.5)] hover:shadow-[0_12px_32px_-4px_rgba(225,29,72,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap group shrink-0"
              >
                <Phone className="h-4 w-4 fill-white" />
                <span>Connect with Convenor</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/20 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-3 w-3" />
                </span>
              </a>

              {/* 2. Emergency Blood Desk (Secondary Dark Outlined Button) */}
              <button
                type="button"
                onClick={onOpenEmergencyDesk}
                className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full bg-[#0d0e14]/85 hover:bg-red-950/30 border border-red-500/35 hover:border-red-500/70 px-5 sm:px-6 py-3.5 text-xs sm:text-[13px] font-semibold text-white shadow-lg backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap group shrink-0"
              >
                <Droplets className="h-4 w-4 text-red-500 fill-red-500" />
                <span>Emergency Blood Desk</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-3 w-3 text-white/70" />
                </span>
              </button>

              {/* 3. Wing Calendar (Secondary Dark Outlined Button) */}
              <Link
                href="/events"
                className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full bg-[#0d0e14]/85 hover:bg-red-950/30 border border-red-500/35 hover:border-red-500/70 px-5 sm:px-6 py-3.5 text-xs sm:text-[13px] font-semibold text-white shadow-lg backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap group shrink-0"
              >
                <Calendar className="h-4 w-4 text-red-500" />
                <span>Wing Calendar</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="h-3 w-3 text-white/70" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Far Right Atmospheric Cluster (Droplet Watermark & Vertical Tracked Text) */}
        <div className="hidden 2xl:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 pointer-events-none select-none -z-10">
          <div className="opacity-[0.08]">
            <Image
              src="/clubs/jeevanam-drop.png"
              alt=""
              width={140}
              height={140}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-[9.5px] tracking-[0.38em] text-white/35 font-semibold uppercase">
            <span>PEOPLE</span>
            <span>CARE</span>
            <span>SAVE</span>
            <span>TOGETHER</span>
          </div>
        </div>

      </div>
    </section>
  );
}
