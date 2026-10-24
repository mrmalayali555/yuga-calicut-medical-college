"use client";

import Link from "next/link";
import {
  Palette,
  Trophy,
  Microscope,
  BookOpen,
  Film,
  HeartHandshake,
  Home,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const WINGS = [
  {
    slug: "arts",
    name: "Fine Arts & Cultural Wing",
    category: "Culture",
    icon: Palette,
    convenor: "Arathi Krishna (Phase 2)",
    description: "Curating music bands, classical dance troupes, street plays, and the annual YUGA arts festival.",
  },
  {
    slug: "sports",
    name: "Sports & Athletics Council",
    category: "Sports",
    icon: Trophy,
    convenor: "Naveen Thomas (Final Part 1)",
    description: "Managing inter-batch cricket (CMPL), football, basketball, badminton, and state athletic meets.",
  },
  {
    slug: "academic",
    name: "Calicut Medicos Research Society",
    category: "Academic",
    icon: Microscope,
    convenor: "Dr. Rohith K. (Final Part 2)",
    description: "Mentoring undergrads in ICMR STS grant drafting, clinical audits, and research conclaves.",
  },
  {
    slug: "literary",
    name: "Literary & Debating Forum",
    category: "Literary",
    icon: BookOpen,
    convenor: "Meera Chandran (Phase 2)",
    description: "Parliamentary debates, medical quiz leagues, creative writing, and the union journal.",
  },
  {
    slug: "media",
    name: "Cine & Visual Media Club",
    category: "Media",
    icon: Film,
    convenor: "Jithin Raj (Phase 2)",
    description: "Festival teasers, documentary shorts, event photography, and live audio-visual setups.",
  },
  {
    slug: "social-service",
    name: "Community Health & Blood Wing",
    category: "Social",
    icon: HeartHandshake,
    convenor: "Muhammed Shafi (Final Part 1)",
    description: "Blood donor matching, disaster medical relief camps, and rural health awareness drives.",
  },
  {
    slug: "welfare",
    name: "Hostel & Mess Welfare Committee",
    category: "Welfare",
    icon: Home,
    convenor: "Adarsh M. (MH Secretary)",
    description: "Monitoring dining quality, room maintenance, 24/7 library amenities, and facilities.",
  },
  {
    slug: "eco",
    name: "Nature & Green Campus Forum",
    category: "Eco",
    icon: Leaf,
    convenor: "Sneha V. (Phase 1)",
    description: "Preserving botanical gardens, waste recycling, and campus tree-planting initiatives.",
  },
];

export default function SubcommitteesPage() {
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
          <p className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-3">
            Student Wings
          </p>
          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)]">
            Clubs & Subcommittees
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
            Specialized student wings driving creative arts, athletic mastery,
            scientific research, and campus welfare under YUGA.
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
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {WINGS.map((wing) => {
            const Icon = wing.icon;
            return (
              <motion.div
                key={wing.name}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 120, damping: 20 },
                  },
                }}
                className="card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {wing.category}
                    </span>
                  </div>

                  <Link href={`/subcommittees/${wing.slug}`} className="block group/link">
                    <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug group-hover/link:text-emerald-700 transition-colors">
                      {wing.name}
                    </h3>
                  </Link>

                  <p className="mt-1 text-xs text-emerald-700 font-semibold">
                    Lead: {wing.convenor}
                  </p>

                  <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-primary)] pt-3">
                    {wing.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-primary)] flex items-center justify-between text-xs">
                  <Link
                    href={`/subcommittees/${wing.slug}`}
                    className="font-semibold text-emerald-800 hover:underline"
                  >
                    View Wing & Events →
                  </Link>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Active
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mt-16 card p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/30"
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
