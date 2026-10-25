"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { EditableText } from "@/components/admin/inline/editable-text";

export function CampusVoiceCTA() {
  return (
    <section className="py-24 sm:py-32 border-t border-[var(--border-primary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-8 sm:p-14 shadow-sm hover:shadow-md transition-shadow"
        >
          <EditableText
            blockId="cta-label"
            defaultContent="Campus Voice"
            pageId="home"
            label="CTA Section Label"
            as="p"
            className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)] mb-3"
          />

          <EditableText
            blockId="cta-title"
            defaultContent="Have a concern or a campus idea?"
            pageId="home"
            label="CTA Title"
            as="h2"
            className="text-3xl sm:text-5xl font-display text-[var(--text-primary)]"
          />

          <EditableText
            blockId="cta-description"
            defaultContent="The YUGA Union Council is built on transparency and swift redressal. Submit your concerns anonymously or with your batch identity."
            pageId="home"
            label="CTA Description"
            as="p"
            className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto"
            multiline
          />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/complaints" className="btn-primary group">
              <span>Launch Grievance Desk</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>

            <Link href="/about" className="btn-secondary">
              Contact Council
            </Link>
          </div>

          <div className="mt-8 inline-flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-primary)] bg-[var(--accent-subtle)] border border-[var(--border-primary)] px-3.5 py-1.5 rounded-full hover:bg-[var(--accent-muted)] transition-colors">
            <Lock className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
            <span>Protected by official union confidentiality charter</span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
