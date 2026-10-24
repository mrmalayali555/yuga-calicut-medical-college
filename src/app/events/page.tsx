"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowUpRight,
  Ticket,
  Sparkles,
} from "lucide-react";
import { EVENTS } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
} from "@/components/ui/cutout-card";

const EVENT_IMAGES: Record<string, string> = {
  "yuga-arts-fest":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80", // Stage concert / lights
  "calicut-medicos-premier-league":
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80", // Cricket stadium / night match
  "caduceus-music-night":
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80", // Acoustic night
  "blood-donation-camp":
    "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80", // Blood donation drive
};

const CATEGORIES = [
  { id: "all", label: "All Events" },
  { id: "fest", label: "Cultural" },
  { id: "sports", label: "Sports" },
  { id: "academic", label: "Academic" },
  { id: "social", label: "Social" },
];

const STATUS_TABS = [
  { id: "all", label: "All Events" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed (Memories)" },
  { id: "cancelled", label: "Cancelled" },
];

export default function EventsPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = EVENTS.filter((e) => {
    if (selectedStatus !== "all" && e.status !== selectedStatus) return false;
    if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/30 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1 mb-4 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Campus Conclaves & Fests
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
            Events & Fests
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
            From the historic inter-collegiate arts fest to the Calicut Medicos
            Premier League — explore upcoming campus stages, photo memories from completed fests, and reserve entry passes.
          </p>
        </motion.div>

        {/* Primary Status Tabs (Upcoming, Completed, Cancelled) */}
        <div className="flex flex-wrap items-center gap-2 pb-4 mb-4">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.id;
            const count =
              tab.id === "all"
                ? EVENTS.length
                : EVENTS.filter((e) => e.status === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "text-white bg-slate-900 shadow-sm"
                    : "text-slate-600 border border-slate-200 bg-white hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "text-slate-200 bg-slate-700" : "text-slate-500 bg-slate-100"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-slate-200/80">
          {CATEGORIES.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-emerald-800 bg-emerald-100 border border-emerald-300"
                    : "text-slate-600 border border-slate-200/80 bg-white hover:text-emerald-800 hover:bg-emerald-50/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Cutout Events Grid */}
        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const imageSrc = EVENT_IMAGES[item.id] || "/hero-building.jpg";
              const isOpen = item.registrationOpen;

              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CutoutCard className="h-full flex flex-col justify-between border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div>
                      {/* Media Header with signature Cutout Corners */}
                      <CutoutCardMedia className="h-60 sm:h-64">
                        <CutoutCardImage
                          alt={item.title}
                          src={imageSrc}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <CutoutCardOverlay />

                        {/* Inset Label — bottom-left cutout */}
                        <CutoutCardInsetLabel className="bg-white bottom-0 left-0 rounded-tr-[20px] px-4 py-2 shadow-2xs">
                          <span className="text-emerald-800 text-[11px] font-bold tracking-wider uppercase">
                            {item.category}
                          </span>
                          <CutoutCorner className="text-white absolute -right-[31px] -bottom-px rotate-90" />
                          <CutoutCorner className="text-white absolute -top-[31px] -left-px rotate-90" />
                        </CutoutCardInsetLabel>

                        {/* Pin Badge — top-right cutout */}
                        <CutoutCardPin
                          className={`top-0 right-0 rounded-bl-[16px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 ${
                            isOpen
                              ? "bg-emerald-600 text-white ring-emerald-700/30"
                              : "bg-slate-800 text-white ring-slate-900/30"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {isOpen ? (
                              <>
                                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                Registration Open
                              </>
                            ) : (
                              "Upcoming"
                            )}
                          </span>
                          <CutoutCorner
                            className={`absolute top-0 -left-[23px] -rotate-90 ${
                              isOpen ? "text-emerald-600" : "text-slate-800"
                            }`}
                            size={24}
                          />
                          <CutoutCorner
                            className={`absolute right-0 -bottom-[23px] -rotate-90 ${
                              isOpen ? "text-emerald-600" : "text-slate-800"
                            }`}
                            size={24}
                          />
                        </CutoutCardPin>
                      </CutoutCardMedia>

                      {/* Content Section */}
                      <CutoutCardContent className="p-6">
                        <Link href={`/events/${item.id}`} className="group/link block">
                          <h3 className="text-xl font-display font-bold text-slate-900 leading-snug group-hover/link:text-emerald-700 transition-colors">
                            {item.title}
                          </h3>
                        </Link>

                        <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal line-clamp-2">
                          {item.subtitle}
                        </p>

                        {/* Meta Schedule details */}
                        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                            <span className="font-semibold text-slate-800">{item.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                            <span className="font-medium text-slate-700">{item.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                            <span className="truncate font-medium text-slate-700">{item.venue}</span>
                          </div>
                        </div>
                      </CutoutCardContent>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-1">
                      <CutoutCardFooter className="border-t border-slate-100 pt-3.5">
                        <span className="text-[11px] font-mono font-medium text-slate-500">
                          {item.status.toUpperCase()}
                        </span>
                        <Link
                          href={`/events/${item.id}`}
                          className="text-xs font-semibold text-emerald-800 hover:underline"
                        >
                          View Details →
                        </Link>
                      </CutoutCardFooter>
                    </div>

                    {/* Hover Action */}
                    <CutoutCardAction className="right-5 bottom-5">
                      <Link
                        href={isOpen ? `/events/${item.id}/register` : `/events/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                      >
                        <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {isOpen
                            ? "Register Pass"
                            : item.status === "completed"
                            ? "View Gallery"
                            : "Event Details"}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </CutoutCardAction>
                  </CutoutCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-xs mt-8">
            <Calendar className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No events at the moment
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Please check back soon or explore other categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

