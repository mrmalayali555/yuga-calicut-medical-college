"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users, BookOpen, Headphones, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/home/animated-counter";
import { useTheme } from "@/components/theme/theme-context";
import { EditableText } from "@/components/admin/inline/editable-text";
import { useAdminEdit } from "@/components/admin/inline/admin-edit-context";

export interface HeroCardConfig {
  visible?: boolean;
  cardStyle?: "white" | "dark";
  tag?: string;
  date?: string;
  category?: string;
  title?: string;
  description?: string;
  venue?: string;
  btnText?: string;
  btnLink?: string;
  image?: string;
}

export function Hero({ heroCard }: { heroCard?: HeroCardConfig | null }) {
  const { theme } = useTheme();
  const { isAdmin, editMode } = useAdminEdit();
  const isObsidian = theme === "obsidian-crimson";

  const isCardVisible = heroCard?.visible !== false;

  const cardTag = heroCard?.tag || "FEATURED EVENT";
  const cardDate = heroCard?.date || "MARCH 27 – 29, 2026";
  const cardCategory = heroCard?.category || "ANNUAL INTERCOLLEGIATE MEDICAL COLLOQUIUM";
  const cardTitle = heroCard?.title || "PULSE 2026";
  const cardDesc =
    heroCard?.description ||
    "Featuring clinical hackathons, state surgical simulation leagues, national med-law panels, and a landmark cultural gala.";
  const cardVenue = heroCard?.venue || "Silver Jubilee Auditorium, GMC";
  const cardBtnText = heroCard?.btnText || "Explore event →";
  const cardBtnLink = heroCard?.btnLink || "/events";
  const cardImage = heroCard?.image || "/pulse-stage.jpg";

  return (
    <section className="relative min-h-[96dvh] lg:min-h-screen flex flex-col justify-between pt-24 sm:pt-32 pb-8 sm:pb-14 overflow-hidden bg-[#07080a] text-white">
      {/* 1. Real Golden-Hour GMC Clocktower Campus Photographs (Desktop Landscape & Mobile Portrait) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Desktop & Tablet Background: Landscape Golden-Hour Clocktower */}
        <div className="hidden sm:block absolute inset-0 overflow-hidden">
          <Image
            src="/hero-clocktower.png"
            alt="Government Medical College Kozhikode Clocktower during Golden Hour Sunset"
            fill
            priority
            quality={95}
            className="object-cover object-[78%_38%] sm:object-[80%_40%] lg:object-[82%_42%] transition-transform duration-1000 scale-[1.01]"
          />
        </div>

        {/* Mobile-Only Background: Portrait Golden-Hour Clocktower */}
        <div className="block sm:hidden absolute inset-0 overflow-hidden">
          <Image
            src="/hero-clocktower-mobile.png"
            alt="Government Medical College Kozhikode Clocktower during Golden Hour Sunset - Mobile Portrait"
            fill
            priority
            quality={95}
            className="object-cover object-[50%_35%] transition-transform duration-1000 scale-[1.01]"
          />
        </div>

        {/* Cinematic Vignette & Deep Contrast Gradient Overlays */}
        {/* Base dark wash */}
        <div className="absolute inset-0 bg-[#07080a]/50 sm:bg-[#07080a]/45" />

        {/* Directional left-to-right wash ensuring pristine headline & copy legibility on desktop */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#07080a] via-[#07080a]/92 to-transparent lg:w-[62%]" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-[#07080a] via-[#07080a]/65 to-[#07080a]/15" />

        {/* Mobile-specific top-to-bottom wash keeping tower prominent in lower center */}
        <div className="block sm:hidden absolute inset-0 bg-gradient-to-b from-[#07080a]/92 via-[#07080a]/60 to-[#07080a]/75" />

        {/* Top-down fade for navbar integration */}
        <div className="absolute inset-x-0 top-0 h-40 sm:h-44 bg-gradient-to-b from-[#07080a]/98 via-[#07080a]/60 to-transparent" />

        {/* Bottom fade for seamless transition to subsequent sections */}
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-48 bg-gradient-to-t from-[#07080a] via-[#07080a]/85 to-transparent" />

        {/* Subtle Ambient Crimson Glows matching YUGA identity */}
        <div className="absolute top-1/4 left-1/4 w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] bg-[#e11d48]/12 rounded-full blur-[120px] sm:blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-[#ff2e56]/15 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      </div>

      {/* 2. Main Hero Content Matrix */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full my-auto py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Typographic Identity */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow: College Union Identity */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 sm:gap-2.5 mb-3.5 sm:mb-5 select-none"
            >
              <span className="h-1 w-5 sm:w-7 bg-[#ff2e56] rounded-full inline-block shadow-[0_0_10px_rgba(255,46,86,0.8)]" />
              <EditableText
                blockId="hero-eyebrow"
                defaultContent="CALICUT MEDICAL COLLEGE UNION"
                pageId="home"
                label="Hero Eyebrow Text"
                as="span"
                className="text-[11px] sm:text-[13px] font-bold tracking-[0.2em] sm:tracking-[0.22em] text-white/85 uppercase font-['Plus_Jakarta_Sans',sans-serif]"
              />
            </motion.div>

            {/* Dominant Headline */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-0.5 sm:space-y-1 mb-4 sm:mb-6"
            >
              <h1 className="text-[32px] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-black text-white leading-[1.06] sm:leading-[1.03] tracking-tight uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                <EditableText
                  blockId="hero-title-main"
                  defaultContent="A VOICE FOR CHANGE."
                  pageId="home"
                  label="Hero Main Headline"
                  as="span"
                  className="block drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
                />
                <span className="sr-only"> — YUGA College Union 2026-2027, Government Medical College Kozhikode</span>
              </h1>

              <div className="text-[32px] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-serif italic leading-[1.12] sm:leading-[1.1] pt-0.5 sm:pt-1">
                <EditableText
                  blockId="hero-title-sub"
                  defaultContent="Built by students."
                  pageId="home"
                  label="Hero Cursive Subheadline"
                  as="span"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2e56] via-[#ff4d6d] to-[#ff758f] drop-shadow-[0_0_35px_rgba(255,46,86,0.45)] inline-block"
                />
              </div>
            </motion.div>

            {/* Narrative Supporting Paragraph */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 sm:mb-8 max-w-xl"
            >
              <EditableText
                blockId="hero-description"
                defaultContent="Student representation, a vibrant campus life, and a stronger community — working together for a better tomorrow at Calicut Medical College."
                pageId="home"
                label="Hero Supporting Paragraph"
                as="p"
                className="text-sm sm:text-lg text-white/80 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
                multiline
              />
            </motion.div>

            {/* Call to Action Buttons — row on tablet+, stacked only on very small mobile */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center sm:items-center gap-3 w-full sm:w-auto"
            >
              {/* Primary Action — crimson pill with glow */}
              <Link
                href="/events"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#e11d48] via-[#f02050] to-[#ff2e56] text-white px-7 py-3.5 text-sm font-bold tracking-wide shadow-[0_0_28px_rgba(225,29,72,0.55),0_4px_16px_rgba(225,29,72,0.3)] hover:shadow-[0_0_40px_rgba(255,46,86,0.8),0_6px_20px_rgba(225,29,72,0.45)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 select-none text-center"
              >
                <span>Explore Campus</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>

              {/* Secondary Action — dark pill with subtle glass */}
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-[#0d0e14]/80 hover:bg-[#0d0e14] hover:border-white/30 text-white px-7 py-3.5 text-sm font-semibold backdrop-blur-md active:scale-[0.97] transition-all duration-200 select-none shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-center"
              >
                <span>Discover YUGA</span>
              </Link>
            </motion.div>

            {/* Mobile-Only Compact Featured Event Teaser */}
            {isCardVisible && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.26 }}
                className="relative block lg:hidden mt-6 w-full rounded-2xl border border-white/15 bg-[#090b11]/85 backdrop-blur-xl p-4 shadow-xl"
              >
                {/* Admin Mode Badge on Mobile */}
                {isAdmin && editMode && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-black/85 border border-white/20 rounded-md px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Hero Card</span>
                    <Link
                      href="/admin/settings"
                      className="ml-1 text-rose-400 hover:text-rose-300 underline inline-flex items-center gap-0.5"
                    >
                      <span>Settings</span>
                      <ArrowUpRight className="h-2 w-2" />
                    </Link>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/10">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-white uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff2e56] animate-pulse" />
                    {cardTag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ff4d6d]">
                    <Calendar className="h-3 w-3" />
                    {cardDate}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/15 shrink-0 bg-black/50">
                    <Image
                      src={cardImage}
                      alt={cardTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">
                      {cardTitle}
                    </h4>
                    <p className="text-[11px] text-white/60 truncate">
                      {cardCategory}
                    </p>
                    <Link
                      href={cardBtnLink}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#ff2e56] hover:text-[#ff4d6d] pt-1 transition-colors"
                    >
                      <span>{cardBtnText}</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column (Desktop & Tablet): Floating Glassmorphic Featured Event Card */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center">
            {isCardVisible ? (
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-2xl border border-white/15 bg-[#090b11]/85 backdrop-blur-xl p-6 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(225,29,72,0.15)] overflow-hidden"
              >
                {/* Admin Mode Badge */}
                {isAdmin && editMode && (
                  <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-black/85 border border-white/20 rounded-md px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Hero Card</span>
                    <Link
                      href="/admin/settings"
                      className="ml-1 text-rose-400 hover:text-rose-300 underline inline-flex items-center gap-0.5"
                    >
                      <span>Settings</span>
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                )}

                {/* Card Top Row: Badge & Date */}
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase select-none">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff2e56] animate-pulse" />
                    <EditableText
                      blockId="hero-card-tag"
                      defaultContent={cardTag}
                      pageId="home"
                      label="Featured Card Tag"
                      as="span"
                    />
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff4d6d] tracking-wide uppercase">
                    <Calendar className="h-3.5 w-3.5" />
                    <EditableText
                      blockId="hero-card-date"
                      defaultContent={cardDate}
                      pageId="home"
                      label="Featured Card Date"
                      as="span"
                    />
                  </div>
                </div>

                {/* Card Main Section: Text Info + Stage Photo Thumbnail */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="min-w-0 flex-1 space-y-1">
                    <EditableText
                      blockId="hero-card-title"
                      defaultContent={cardTitle}
                      pageId="home"
                      label="Featured Card Title"
                      as="h3"
                      className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase leading-none"
                    />

                    <EditableText
                      blockId="hero-card-category"
                      defaultContent={cardCategory}
                      pageId="home"
                      label="Featured Card Category"
                      as="p"
                      className="text-[11px] font-bold tracking-wider text-white/60 uppercase pt-1"
                    />

                    <EditableText
                      blockId="hero-card-description"
                      defaultContent={cardDesc}
                      pageId="home"
                      label="Featured Card Description"
                      as="p"
                      className="text-xs sm:text-sm text-white/70 leading-relaxed pt-2 line-clamp-3"
                      multiline
                    />
                  </div>

                  {/* Stage Image Thumbnail (PULSE 2026 Auditorium Stage) */}
                  <div className="relative w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden border border-white/15 shadow-md shrink-0 bg-black/40">
                    <Image
                      src={cardImage}
                      alt={cardTitle}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Card Footer: Venue & Action Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-white/85 text-xs font-medium truncate">
                    <MapPin className="h-4 w-4 text-[#ff2e56] shrink-0" />
                    <EditableText
                      blockId="hero-card-venue"
                      defaultContent={cardVenue}
                      pageId="home"
                      label="Featured Card Venue"
                      as="span"
                      className="truncate"
                    />
                  </div>

                  <Link
                    href={cardBtnLink}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#ff2e56] text-white px-5 py-2 text-xs font-bold shadow-[0_0_16px_rgba(225,29,72,0.4)] hover:brightness-110 active:scale-95 transition-all select-none"
                  >
                    <span>{cardBtnText}</span>
                  </Link>
                </div>
              </motion.div>
            ) : isAdmin && editMode ? (
              <div className="rounded-2xl border-2 border-dashed border-rose-500/40 bg-rose-500/5 p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Featured Conclave Card Hidden
                </p>
                <Link
                  href="/admin/settings"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 underline"
                >
                  Configure in Admin Settings →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 3. Hero Bottom Statistics Strip (Responsive Layout) */}
      <div data-no-override="true" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full mt-2 sm:mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/10 bg-[#090b11]/80 backdrop-blur-xl px-4 sm:px-12 py-3.5 sm:py-5 shadow-2xl"
        >
          {/* Desktop & Tablet Stats View (sm:grid) */}
          <div className="hidden sm:grid grid-cols-3 gap-6 sm:gap-8 divide-x divide-white/10 items-center">
            {/* Metric 1 */}
            <div className="flex items-center gap-4 sm:justify-start">
              <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-[#ff2e56]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  2,000+
                </div>
                <div className="text-xs sm:text-[13px] text-white/60 font-medium">
                  Students &amp; residents
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="flex items-center gap-4 pl-6 sm:pl-8 sm:justify-start">
              <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6 text-[#ff2e56]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  <AnimatedCounter value={69} suffix="" />
                </div>
                <div className="text-xs sm:text-[13px] text-white/60 font-medium">
                  Years of student legacy
                </div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="flex items-center gap-4 pl-6 sm:pl-8 sm:justify-start">
              <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                <Headphones className="h-6 w-6 text-[#ff2e56]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  24/7
                </div>
                <div className="text-xs sm:text-[13px] text-white/60 font-medium">
                  Student support
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-Only Compact Stats View */}
          <div className="grid sm:hidden grid-cols-3 divide-x divide-white/10 text-center items-center">
            {/* Mobile Metric 1 */}
            <div className="px-1.5 flex flex-col items-center">
              <span className="text-lg xs:text-xl font-black text-white tracking-tight">
                2,000+
              </span>
              <span className="text-[10px] text-white/65 font-medium leading-tight mt-0.5 truncate w-full">
                Students
              </span>
            </div>

            {/* Mobile Metric 2 */}
            <div className="px-1.5 flex flex-col items-center">
              <span className="text-lg xs:text-xl font-black text-white tracking-tight">
                <AnimatedCounter value={69} suffix="" />
              </span>
              <span className="text-[10px] text-white/65 font-medium leading-tight mt-0.5 truncate w-full">
                Years Legacy
              </span>
            </div>

            {/* Mobile Metric 3 */}
            <div className="px-1.5 flex flex-col items-center">
              <span className="text-lg xs:text-xl font-black text-white tracking-tight">
                24/7
              </span>
              <span className="text-[10px] text-white/65 font-medium leading-tight mt-0.5 truncate w-full">
                Support
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
