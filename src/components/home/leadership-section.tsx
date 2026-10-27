"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LEADERSHIP } from "@/lib/data";
import { motion } from "framer-motion";

export function LeadershipSection() {
  const leaders = LEADERSHIP.slice(0, 6);

  return (
    <section className="py-24 sm:py-32 border-t border-[var(--border-primary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)] mb-3">
            Union Governance
          </p>
          <h2 className="text-3xl sm:text-4xl font-display text-[var(--text-primary)]">
            Executive Council 2026–27
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
            Student office bearers representing Calicut Medicos at the KUHS Senate
            and Directorate of Medical Education.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {leaders.map((leader) => {
            const initials = leader.name
              .replace("Dr. ", "")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <motion.div
                key={`${leader.role}-${leader.name}`}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 100, damping: 20 },
                  },
                }}
                className="card p-6 hover:border-[var(--accent)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20 font-bold text-sm">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                      {leader.name}
                    </h3>
                    <p className="text-xs text-[var(--accent)] font-semibold">
                      {leader.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-primary)] font-medium mb-1">
                  {leader.portfolio}
                </p>
                <div className="text-[11px] text-[var(--text-faint)] font-mono font-medium">
                  {leader.batch}
                </div>
              </motion.div>
            );
          })}
        </motion.div>


        {/* View all */}
        <div className="mt-10 text-center">
          <Link href="/about" className="btn-secondary text-sm group">
            Full Leadership Charter
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
