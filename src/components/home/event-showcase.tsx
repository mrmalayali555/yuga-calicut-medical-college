"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Ticket,
} from "lucide-react";
import { EVENTS } from "@/lib/data";
import { motion } from "framer-motion";
import { EventTicket } from "@/components/ovio/event-ticket/event-ticket";

interface EventShowcaseProps {
  dbFeaturedEvent?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    date: string;
    time?: string | null;
    venue?: string | null;
    fieldsCount?: number;
  } | null;
}

export function EventShowcase({ dbFeaturedEvent }: EventShowcaseProps) {
  // Use DB event if available, otherwise fallback to first event in mock
  const fallback = EVENTS[0];
  const featured = dbFeaturedEvent || {
    id: fallback.id,
    title: fallback.title,
    slug: fallback.id,
    description: fallback.subtitle,
    date: fallback.date,
    time: fallback.time,
    venue: fallback.venue,
    fieldsCount: 5, // Triggers Google-Form 2-step registration
  };

  const rest = EVENTS.slice(1, 4);

  return (
    <section className="py-24 sm:py-32 border-t border-slate-200 bg-white relative overflow-hidden">
      {/* Decorative subtle medical mesh backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/90 text-emerald-800 border border-emerald-200">
                <Ticket className="h-3.5 w-3.5 text-emerald-600" />
                Live Spot Pass & Conclave
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display text-slate-900 font-bold tracking-tight">
              Featured Event & Entry Pass
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Reserve your spot instantly with our interactive pass. Flip for your encrypted gate QR code or tear the stub to check in.
            </p>
          </div>

          <Link
            href="/events"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shrink-0 shadow-sm"
          >
            All Campus Events
            <ArrowRight className="h-3.5 w-3.5 text-emerald-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* 1. Main Interactive Ovio Event Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-14"
        >
          {/* Subtle luminous ambient backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)] blur-2xl"
          />

          <div className="relative z-10">
            <EventTicket
              variant="minimal"
              layout="horizontal"
              event={{
                name: featured.title,
                title: featured.title,
                date: featured.date,
                venue: featured.venue || "College Auditorium",
                description: featured.description,
                tier: "STUDENT DELEGATE",
                slug: featured.slug,
                fieldsCount: featured.fieldsCount,
                schedule: [
                  "09:00 AM — Inaugural Keynote & Union Address",
                  "11:30 AM — Inter-Collegiate Arts & Cultural Stage",
                  "04:00 PM — Clinical Quiz & Case Presentations",
                  "07:30 PM — Star Night Musical Concert",
                ],
              }}
            />
          </div>
        </motion.div>

        {/* 2. Upcoming Conclaves Grid */}
        <div className="pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Other Upcoming Events & Competitions
            </h3>
            <span className="text-xs font-mono text-slate-400">
              GMCK Union 2026-27
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.07,
                }}
                whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/events/${event.id}/register`}
                  className="group block p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-[border-color,box-shadow] duration-[180ms] h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {event.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono font-medium">
                        {event.date}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {event.title}
                    </h4>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {event.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {event.venue}
                    </span>

                    <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Register
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
