"use client";

import Link from "next/link";
import {
  Megaphone,
  Bell,
  CalendarDays,
  Trophy,
  MessageSquareDot,
  Siren,
  Users2,
  Phone,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const QUICK_CARDS = [
  {
    label: "Interventions",
    href: "/interventions",
    icon: Megaphone,
    featured: true, // crimson highlight
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    featured: false,
  },
  {
    label: "Events",
    href: "/events",
    icon: CalendarDays,
    featured: false,
  },
  {
    label: "Achievements",
    href: "/achievements",
    icon: Trophy,
    featured: false,
  },
  {
    label: "Drop a Suggestion",
    href: "/complaints",
    icon: MessageSquareDot,
    featured: false,
  },
  {
    label: "Emergency",
    href: "/emergency",
    icon: Siren,
    featured: false,
  },
  {
    label: "Subcommittee",
    href: "/subcommittees",
    icon: Users2,
    featured: false,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Phone,
    featured: false,
  },
  {
    label: "Union Accounts",
    href: "/finance",
    icon: Wallet,
    featured: false,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: any = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.055,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function QuickPortals() {
  return (
    <section className="relative bg-[#07080a] border-t border-white/[0.07] overflow-hidden">
      {/* Subtle dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── MOBILE / SMALL TABLET LAYOUT (< lg) ─────────────────────────── */}
      <div className="lg:hidden relative px-4 sm:px-6 pt-10 pb-0">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="h-px w-5 bg-[#e11d48]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e11d48]">
              Campus Portals
            </p>
          </div>
          <h2 className="text-[2.4rem] font-black leading-[1.05] tracking-tight text-white">
            Quick Access
          </h2>
        </motion.div>

        {/* 2-column grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 gap-3 relative z-10"
        >
          {QUICK_CARDS.map((card, i) => {
            const Icon = card.icon;
            const isSingle = i === QUICK_CARDS.length - 1 && QUICK_CARDS.length % 2 !== 0;
            return (
              <motion.div
                key={card.href}
                custom={i}
                variants={cardVariants}
                whileHover={{ y: -3, transition: { duration: 0.18, ease: "easeOut" } }}
                whileTap={{ scale: 0.97 }}
                className={isSingle ? "col-span-1" : ""}
              >
                <Link
                  href={card.href}
                  className={`
                    group relative flex flex-col justify-between
                    rounded-[18px] p-4 h-[130px]
                    border transition-all duration-200
                    ${
                      card.featured
                        ? "bg-[#1a0509] border-[#e11d48]/50 shadow-[inset_0_0_32px_rgba(225,29,72,0.08),0_4px_24px_rgba(225,29,72,0.15)]"
                        : "bg-[#111215] border-white/[0.07] hover:border-[#e11d48]/30 hover:bg-[#14080b]"
                    }
                  `}
                >
                  {/* Arrow top-right */}
                  <ArrowUpRight
                    aria-hidden="true"
                    className={`absolute top-3.5 right-3.5 h-3.5 w-3.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      card.featured ? "text-[#e11d48]/70" : "text-white/25 group-hover:text-[#e11d48]/60"
                    }`}
                  />

                  {/* Icon circle */}
                  <div
                    className={`h-11 w-11 rounded-full flex items-center justify-center ${
                      card.featured
                        ? "bg-[#e11d48]/20"
                        : "bg-[#e11d48]/10 group-hover:bg-[#e11d48]/15"
                    } transition-colors duration-200`}
                  >
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.5}
                      className={`h-5 w-5 ${
                        card.featured ? "text-[#e11d48]" : "text-[#e11d48]/80 group-hover:text-[#e11d48]"
                      } transition-colors duration-200`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm font-semibold leading-tight ${
                      card.featured ? "text-white" : "text-white/85 group-hover:text-white"
                    } transition-colors duration-200`}
                  >
                    {card.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom crimson wave SVG */}
        <div aria-hidden="true" className="relative w-full overflow-hidden mt-6 h-28 pointer-events-none select-none">
          <svg
            viewBox="0 0 390 112"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4a0311" stopOpacity="0.5" />
                <stop offset="45%" stopColor="#7f0920" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2a020c" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e11d48" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#9f1239" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#4a0311" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            {/* Back wave – deep burgundy */}
            <path
              d="M0 80 C60 48, 130 95, 200 70 C270 45, 330 85, 390 55 L390 112 L0 112 Z"
              fill="url(#waveGrad1)"
            />
            {/* Front wave – brighter crimson */}
            <path
              d="M0 92 C55 62, 140 104, 220 80 C285 60, 350 96, 390 72 L390 112 L0 112 Z"
              fill="url(#waveGrad2)"
            />
          </svg>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (>= lg) ────────────────────────────────────────── */}
      <div className="hidden lg:block py-24 xl:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mb-12"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-5 bg-[#e11d48]" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e11d48]">
                Campus Portals
              </p>
            </div>
            <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.06]">
              Quick Access
            </h2>
            <p className="mt-3 text-base text-white/50 leading-relaxed">
              Direct navigation across all student welfare, campus life, and union services.
            </p>
          </motion.div>

          {/* 3-col grid on desktop */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-3 gap-4"
          >
            {QUICK_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.href}
                  custom={i}
                  variants={cardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={card.href}
                    className={`
                      group relative flex flex-col justify-between
                      rounded-2xl p-5 h-[140px]
                      border transition-all duration-200
                      ${
                        card.featured
                          ? "bg-[#1a0509] border-[#e11d48]/50 shadow-[inset_0_0_40px_rgba(225,29,72,0.08),0_4px_28px_rgba(225,29,72,0.18)]"
                          : "bg-[#111215] border-white/[0.07] hover:border-[#e11d48]/30 hover:bg-[#14080b]"
                      }
                    `}
                  >
                    <ArrowUpRight
                      aria-hidden="true"
                      className={`absolute top-4 right-4 h-4 w-4 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        card.featured ? "text-[#e11d48]/60" : "text-white/20 group-hover:text-[#e11d48]/60"
                      }`}
                    />
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        card.featured ? "bg-[#e11d48]/20" : "bg-[#e11d48]/10 group-hover:bg-[#e11d48]/15"
                      } transition-colors duration-200`}
                    >
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className={`h-5.5 w-5.5 ${
                          card.featured ? "text-[#e11d48]" : "text-[#e11d48]/80 group-hover:text-[#e11d48]"
                        } transition-colors duration-200`}
                      />
                    </div>
                    <span
                      className={`text-[15px] font-semibold leading-tight ${
                        card.featured ? "text-white" : "text-white/85 group-hover:text-white"
                      } transition-colors duration-200`}
                    >
                      {card.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
