"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import LogoCarousel from "@/components/ui/logo-carousel";
import { motion } from "framer-motion";

export function ClubsShowcase() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-[var(--border-primary)] bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-emerald-100/40 via-teal-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Header section matching user demo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span>Official Student Wings &amp; Sub-Committees</span>
          </div>

          <div>
            <GradientHeading variant="secondary" size="md" className="block mb-1">
              The best are already here
            </GradientHeading>
            <Link href="/subcommittees" className="group inline-block">
              <GradientHeading
                size="xxl"
                className="group-hover:opacity-90 transition-opacity"
              >
                YUGA Student Clubs
              </GradientHeading>
            </Link>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-normal">
            Click on any club logo below to explore dedicated initiatives, executive
            councils, registration drives, and upcoming events.
          </p>
        </motion.div>

        {/* Logo Carousel with 3 dynamic columns */}
        <div className="w-full">
          <LogoCarousel columnCount={3} />
        </div>

        {/* Quick direct badge bar for all 4 clubs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full flex flex-wrap items-center justify-center gap-3 pt-4"
        >
          <span className="text-xs font-semibold text-slate-500 mr-1">
            Direct Club Pages:
          </span>
          <Link
            href="/clubs/jeevanam"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 hover:shadow-xs transition-all"
          >
            <span className="h-2 w-2 rounded-full bg-red-600" />
            Jeevanam (Blood Donation)
          </Link>
          <Link
            href="/clubs/praanah"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:shadow-xs transition-all"
          >
            <span className="h-2 w-2 rounded-full bg-amber-600" />
            Praanah (Arts Club)
          </Link>
          <Link
            href="/clubs/godha"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:shadow-xs transition-all"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Godha (Sports Club)
          </Link>
          <Link
            href="/clubs/ocha"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 hover:shadow-xs transition-all"
          >
            <span className="h-2 w-2 rounded-full bg-violet-600" />
            Ocha (Literary Club)
          </Link>
        </motion.div>

        {/* View all subcommittees footer link */}
        <div className="pt-2">
          <Link
            href="/subcommittees"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>Explore all 8 subcommittees &amp; council wings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Export default alias as LogoCarouselDemo to match user snippet
export default ClubsShowcase;
