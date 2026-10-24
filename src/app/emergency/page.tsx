"use client";

import { Phone, Clock, AlertCircle } from "lucide-react";
import { EMERGENCY_CONTACTS } from "@/lib/data";
import { COLLEGE } from "@/lib/site";
import { motion } from "framer-motion";

export default function EmergencyPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="max-w-2xl mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse-soft" />
            <span className="text-xs font-bold tracking-wider uppercase text-red-700">
              24/7 Critical Support
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)]">
            Emergency Hotlines
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            Direct telephone numbers for casualty triage, blood bank,
            ambulance, and campus security at {COLLEGE.name}.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {EMERGENCY_CONTACTS.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 120, damping: 20 },
                },
              }}
              className={`card p-6 flex flex-col justify-between ${
                item.primary
                  ? "border-red-200 bg-red-50/40 shadow-sm"
                  : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {item.department}
                  </span>
                  {item.primary && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse-soft" />
                      Priority
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-display text-[var(--text-primary)] leading-snug">
                  {item.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Clock className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                  <span>{item.available}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--border-primary)] flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-slate-500 font-medium uppercase tracking-wider">Direct line</span>
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {item.phone}
                  </span>
                </div>
                <a
                  href={`tel:${item.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm active:scale-95"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  Call
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Protocol */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mt-14 card p-7 sm:p-8 border-red-200 bg-red-50/40"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-[var(--text-primary)]">
                Casualty Triage Protocol
              </h4>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                For life-threatening trauma, acute respiratory distress, or stroke
                on campus, proceed immediately to the GMC Casualty Resuscitation Bay.
                For student-specific emergencies, notify the Union emergency secretary.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
