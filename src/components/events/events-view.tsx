"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
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
import { formatDate } from "@/lib/utils";

const FALLBACK_EVENT_IMAGES: Record<string, string> = {
  "yuga-arts-fest":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  "calicut-medicos-premier-league":
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
  "caduceus-music-night":
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
  "blood-donation-camp":
    "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80",
};

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "fest", label: "Cultural" },
  { id: "sports", label: "Sports" },
  { id: "academic", label: "Academic" },
  { id: "social", label: "Social" },
];

const STATUS_TABS = [
  { id: "all", label: "All Events" },
  { id: "upcoming", label: "Upcoming" },
  { id: "live", label: "Live Now" },
  { id: "completed", label: "Completed (Memories)" },
  { id: "cancelled", label: "Cancelled" },
];

export interface DynamicEventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: Date | string;
  time?: string | null;
  venue?: string | null;
  poster?: string | null;
  status: string;
  category?: string;
  registrationForm?: {
    id: string;
    published: boolean;
  } | null;
}

export function EventsView({
  initialEvents,
}: {
  initialEvents: DynamicEventItem[];
}) {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = initialEvents.filter((e) => {
    if (selectedStatus !== "all" && e.status !== selectedStatus) return false;
    if (selectedCategory !== "all") {
      const cat = (e.category || "").toLowerCase();
      const desc = e.description.toLowerCase();
      const title = e.title.toLowerCase();
      if (
        cat !== selectedCategory &&
        !desc.includes(selectedCategory) &&
        !title.includes(selectedCategory)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mb-12"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--accent-subtle)] px-3.5 py-1 mb-4 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
            Campus Conclaves & Fests
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
          Events & Fests
        </h1>
        <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed font-normal">
          From the historic inter-collegiate arts fest to the Calicut Medicos
          Premier League — explore campus stages, reserve entry passes, and view
          photo memories.
        </p>
      </motion.div>

      {/* Primary Status Tabs (Upcoming, Completed, Cancelled) */}
      <div className="flex flex-wrap items-center gap-2 pb-4 mb-4">
        {STATUS_TABS.map((tab) => {
          const isActive = selectedStatus === tab.id;
          const count =
            tab.id === "all"
              ? initialEvents.length
              : initialEvents.filter((e) => e.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-white bg-[var(--accent)] shadow-sm"
                  : "text-[var(--text-secondary)] border border-[var(--border-primary)] bg-[var(--bg-card)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "text-white/90 bg-white/20" : "text-[var(--text-muted)] bg-[var(--bg-surface)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Category Filters */}
      <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-[var(--border-primary)]">
        {CATEGORIES.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--border-accent)]"
                  : "text-[var(--text-secondary)] border border-[var(--border-primary)] bg-[var(--bg-card)] hover:text-[var(--accent)] hover:border-[var(--border-hover)]"
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
            const itemKey = item.slug || item.id;
            const imageSrc =
              item.poster ||
              FALLBACK_EVENT_IMAGES[itemKey] ||
              FALLBACK_EVENT_IMAGES[item.id] ||
              "/hero-building.jpg";

            const isOpen =
              item.registrationForm?.published ||
              item.status === "live" ||
              item.status === "upcoming";

            const dateStr =
              typeof item.date === "string"
                ? item.date
                : formatDate(new Date(item.date));

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <CutoutCard className="h-full flex flex-col justify-between border-[var(--border-primary)] bg-[var(--bg-card)] shadow-sm hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300">
                  <div>
                    {/* Media Header with signature Cutout Corners */}
                    <CutoutCardMedia className="h-60 sm:h-64 relative">
                      <CutoutCardImage
                        alt={item.title}
                        src={imageSrc}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <CutoutCardOverlay />

                      {/* Inset Label — bottom-left cutout */}
                      <CutoutCardInsetLabel className="bg-[var(--bg-card)] bottom-0 left-0 rounded-tr-[20px] px-4 py-2 shadow-2xs">
                        <span className="text-[var(--accent)] text-[11px] font-bold tracking-wider uppercase">
                          {item.category || item.status.toUpperCase()}
                        </span>
                        <CutoutCorner className="text-[var(--bg-card)] absolute -right-[31px] -bottom-px rotate-90" />
                        <CutoutCorner className="text-[var(--bg-card)] absolute -top-[31px] -left-px rotate-90" />
                      </CutoutCardInsetLabel>

                      {/* Pin Badge — top-right cutout */}
                      <CutoutCardPin
                        className={`top-0 right-0 rounded-bl-[16px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 ${
                          isOpen
                            ? "bg-[var(--accent)] text-white ring-[var(--accent)]/30"
                            : "bg-[var(--bg-surface)] text-[var(--text-secondary)] ring-[var(--border-primary)]"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {isOpen ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                              Registration Open
                            </>
                          ) : (
                            item.status.toUpperCase()
                          )}
                        </span>
                        <CutoutCorner
                          className={`absolute top-0 -left-[23px] -rotate-90 ${
                            isOpen ? "text-[var(--accent)]" : "text-[var(--bg-surface)]"
                          }`}
                          size={24}
                        />
                        <CutoutCorner
                          className={`absolute right-0 -bottom-[23px] -rotate-90 ${
                            isOpen ? "text-[var(--accent)]" : "text-[var(--bg-surface)]"
                          }`}
                          size={24}
                        />
                      </CutoutCardPin>
                    </CutoutCardMedia>

                    {/* Content Section */}
                    <CutoutCardContent className="p-6">
                      <Link href={`/events/${itemKey}`} className="group/link block">
                        <h3 className="text-xl font-display font-bold text-[var(--text-primary)] leading-snug group-hover/link:text-[var(--accent)] transition-colors">
                          {item.title}
                        </h3>
                      </Link>

                      <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed font-normal line-clamp-2">
                        {item.description}
                      </p>

                      {/* Meta Schedule details */}
                      <div className="mt-5 pt-4 border-t border-[var(--border-primary)] space-y-2 text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
                          <span className="font-semibold text-[var(--text-primary)]">{dateStr}</span>
                        </div>
                        {item.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
                            <span className="font-medium text-[var(--text-secondary)]">{item.time}</span>
                          </div>
                        )}
                        {item.venue && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" aria-hidden="true" />
                            <span className="truncate font-medium text-[var(--text-secondary)]">{item.venue}</span>
                          </div>
                        )}
                      </div>
                    </CutoutCardContent>
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6 pt-1">
                    <CutoutCardFooter className="border-t border-[var(--border-primary)] pt-3.5">
                      <span className="text-[11px] font-mono font-medium text-[var(--text-muted)]">
                        {item.status.toUpperCase()}
                      </span>
                      <Link
                        href={`/events/${itemKey}`}
                        className="text-xs font-semibold text-[var(--accent)] hover:underline"
                      >
                        View Details →
                      </Link>
                    </CutoutCardFooter>
                  </div>

                  {/* Hover Action */}
                  <CutoutCardAction className="right-5 bottom-5">
                    <Link
                      href={`/events/${itemKey}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[var(--accent-dark)] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Explore</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </CutoutCardAction>
                </CutoutCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
