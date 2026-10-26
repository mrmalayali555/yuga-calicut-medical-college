"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { EMERGENCY_CONTACTS } from "@/lib/data";
import { motion } from "framer-motion";

export function EmergencyStrip() {
  const primaryContacts = EMERGENCY_CONTACTS.filter((c) => c.primary);

  return (
    <section className="py-16 sm:py-20 border-t border-[var(--border-primary)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 xs:p-6 sm:p-8 lg:p-10 shadow-sm backdrop-blur-xs overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
            <div className="max-w-md">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
                </span>
                <span className="text-xs font-bold tracking-wider text-red-600 uppercase">
                  24/7 Casualty & Triage Hotlines
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display text-[var(--text-primary)]">
                Hospital & Casualty Hotlines
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Emergency resuscitation, trauma admissions, blood bank donors,
                and campus security at GMC Kozhikode.
              </p>
            </div>

            <Link href="/emergency" className="btn-secondary text-sm shrink-0 group">
              Full Directory
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {primaryContacts.map((contact, i) => (
              <motion.a
                key={contact.id}
                href={`tel:${contact.phone}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center justify-between rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 hover:border-red-500/40 hover:shadow-md transition-[border-color,box-shadow]"
              >
                <div className="min-w-0">
                  <div className="text-xs text-[var(--text-secondary)] mb-0.5 truncate font-medium">
                    {contact.department}
                  </div>
                  <div className="text-sm font-bold text-[var(--text-primary)] font-mono group-hover:text-red-500 transition-colors">
                    {contact.phone}
                  </div>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white transition-all ml-3">
                  <Phone className="h-4 w-4 transition-transform duration-200 group-hover:rotate-[15deg] group-hover:scale-110" aria-hidden="true" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
