"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FEATURED_CLUBS = [
  {
    slug: "jeevanam",
    name: "Jeevanam",
    tagline: "Blood Donation Club",
    logo: "/clubs/jeevanam-gold.png",
    accent: "#dc2626",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  {
    slug: "praanah",
    name: "Praanah",
    tagline: "Arts Club",
    logo: "/clubs/praanah.png",
    accent: "#d97706",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    slug: "godha",
    name: "Godha",
    tagline: "Sports Club",
    logo: "/clubs/godha-logo.png",
    accent: "#059669",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    slug: "ocha",
    name: "Ocha",
    tagline: "Literary Club",
    logo: "/clubs/ocha.png",
    accent: "#7c3aed",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
  },
];

export function SubcommitteesView() {
  const [clubOverrides, setClubOverrides] = useState<Record<string, { logo?: string; name?: string; tagline?: string }>>({});

  useEffect(() => {
    fetch("/api/clubs")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data === "object") {
          setClubOverrides(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="max-w-2xl mb-10"
        >
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)] mb-3">
            Student Wings
          </p>
          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)]">
            Clubs &amp; Subcommittees
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            Specialized student wings driving creative arts, athletic mastery,
            scientific research, and campus welfare under YUGA.
          </p>
        </motion.div>

        {/* Featured 4 Clubs Banner */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Featured Sub-Committee Clubs
            </h2>
            <span className="text-xs text-[var(--text-faint)]">Click to visit dedicated portal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_CLUBS.map((club) => {
              const override = clubOverrides[club.slug];
              const logo = override?.logo || club.logo;
              const name = override?.name || club.name;
              const tagline = override?.tagline || club.tagline;

              return (
                <Link
                  key={club.slug}
                  href={`/clubs/${club.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-xs hover:shadow-md hover:border-[var(--accent)] transition-all"
                >
                  <div
                    className={`relative h-14 w-14 rounded-xl overflow-hidden shadow-inner border shrink-0 ${
                      club.slug === "praanah"
                        ? "bg-[#18110b] border-amber-500/30"
                        : club.slug === "ocha"
                        ? "bg-[#140b22] border-violet-500/30"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    <Image
                      src={logo}
                      alt={name}
                      fill
                      className="object-contain p-1.5"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider border ${club.badge} mb-0.5`}
                    >
                      {tagline}
                    </span>
                    <h3
                      className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate"
                    >
                      {name}
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)]">Dedicated Portal →</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mt-16 card p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-[var(--border-primary)] bg-[var(--bg-card)]"
        >
          <div>
            <h3 className="text-xl font-display text-[var(--text-primary)]">
              Want to volunteer or propose an initiative?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Reach out to any convenor or submit your proposal to the union.
            </p>
          </div>
          <Link href="/complaints" className="btn-primary shrink-0">
            Submit Proposal
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
