"use client";

import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import { motion } from "framer-motion";

export function HeritageMonument3D() {
  return (
    <section className="py-24 sm:py-32 border-t border-[var(--border-primary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)] mb-3">
              Interactive Heritage
            </p>
            <h2 className="text-3xl sm:text-4xl font-display text-[var(--text-primary)]">
              Tenshu Growth Study
            </h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              An interactive Three.js architectural visualization exploring
              traditional tower construction through progressive growth stages.
              Drag to orbit. Scrub the footer to advance stages.
            </p>
            <div className="mt-6">
              <Link
                href="/monument"
                className="btn-primary group"
              >
                <Compass className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
                <span>Explore Fullscreen</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* 3D Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
            className="relative rounded-2xl overflow-hidden border border-slate-200 bg-[#ecdcbc] aspect-[4/3] shadow-md hover:shadow-xl transition-shadow"
          >
            <iframe
              src="/towers.html"
              title="Interactive 3D Tenshu Growth Study Monument"
              className="w-full h-full border-0 select-none"
              allow="autoplay"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
