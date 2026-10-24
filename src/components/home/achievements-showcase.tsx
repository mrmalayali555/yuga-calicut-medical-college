"use client";

import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/data";
import { motion } from "framer-motion";

export function AchievementsShowcase() {
  const spotlight = ACHIEVEMENTS.slice(0, 3);

  return (
    <section className="py-24 sm:py-32 border-t border-[var(--border-primary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-3">
              Hall of Fame
            </p>
            <h2 className="text-3xl sm:text-4xl font-display text-[var(--text-primary)]">
              Honors & Laurels
            </h2>
          </div>

          <Link href="/achievements" className="btn-secondary text-sm group">
            All Achievements
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.075 } },
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {spotlight.map((item) => (
            <motion.div
              key={item.id}
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
              className="card-interactive group p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 group-hover:border-amber-300 group-hover:bg-amber-100/70 transition-colors">
                    <Trophy className="h-3.5 w-3.5 text-amber-600 transition-transform group-hover:scale-110" aria-hidden="true" />
                    {item.medal}
                  </span>
                  <span className="text-[11px] text-[var(--text-faint)] font-mono font-medium">
                    {item.date}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug group-hover:text-emerald-800 transition-colors">
                  {item.title}
                </h3>

                <div className="mt-2">
                  <span className="text-sm font-semibold text-emerald-800">
                    {item.recipient}
                  </span>
                  <span className="text-xs text-[var(--text-faint)] ml-2">
                    {item.batch}
                  </span>
                </div>

                <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-primary)] text-xs text-slate-600 font-medium">
                {item.event}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
