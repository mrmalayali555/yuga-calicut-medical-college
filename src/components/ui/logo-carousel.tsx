"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LogoItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  src: string;
  href: string;
  accent: string;
  bgLight: string;
  borderColor: string;
}

export const DEFAULT_CLUBS: LogoItem[] = [
  {
    id: "jeevanam",
    name: "Jeevanam",
    tagline: "Voluntary Blood Donation Club",
    category: "Health & Social Service",
    src: "/clubs/jeevanam.jpg",
    href: "/clubs/jeevanam",
    accent: "#dc2626",
    bgLight: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  {
    id: "praanah",
    name: "Praanah",
    tagline: "Fine Arts & Cultural Wing",
    category: "Arts & Culture",
    src: "/clubs/praanah.jpg",
    href: "/clubs/praanah",
    accent: "#d97706",
    bgLight: "rgba(217, 119, 6, 0.08)",
    borderColor: "rgba(217, 119, 6, 0.25)",
  },
  {
    id: "godha",
    name: "Godha",
    tagline: "Sports & Athletics Council",
    category: "Sports & Athletics",
    src: "/clubs/godha.png",
    href: "/clubs/godha",
    accent: "#059669",
    bgLight: "rgba(5, 150, 105, 0.08)",
    borderColor: "rgba(5, 150, 105, 0.25)",
  },
  {
    id: "ocha",
    name: "Ocha",
    tagline: "Literary, Quizzing & Debating Forum",
    category: "Literary & Debate",
    src: "/clubs/ocha.png",
    href: "/clubs/ocha",
    accent: "#7c3aed",
    bgLight: "rgba(124, 58, 237, 0.08)",
    borderColor: "rgba(124, 58, 237, 0.25)",
  },
];

interface LogoCarouselProps {
  columnCount?: number;
  logos?: LogoItem[];
  className?: string;
  autoPlayInterval?: number;
}

// Sub-component for individual animated column
function LogoColumn({
  items,
  columnIndex,
  autoPlayInterval = 3200,
}: {
  items: LogoItem[];
  columnIndex: number;
  autoPlayInterval?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    // Stagger column start times so they don't change in lockstep
    const staggerTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }, columnIndex * 600);

    return () => clearTimeout(staggerTimeout);
  }, [items.length, isPaused, columnIndex, autoPlayInterval]);

  const activeItem = items[currentIndex];
  if (!activeItem) return null;

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.id}
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.95 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <Link
            href={activeItem.href}
            className="group relative flex flex-col items-center justify-between rounded-2xl border bg-white/90 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden w-full min-h-[260px]"
            style={{
              borderColor: activeItem.borderColor,
            }}
          >
            {/* Ambient background glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 20%, ${activeItem.bgLight}, transparent 70%)`,
              }}
            />

            {/* Top pill with Category */}
            <div className="w-full flex items-center justify-between mb-3 z-10">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-colors"
                style={{
                  color: activeItem.accent,
                  borderColor: activeItem.borderColor,
                  backgroundColor: activeItem.bgLight,
                }}
              >
                {activeItem.category}
              </span>
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>

            {/* Logo Image in elevated rounded frame */}
            <div className="relative my-auto flex items-center justify-center z-10 py-2">
              <div
                className="relative h-28 w-28 rounded-2xl p-2.5 flex items-center justify-center bg-white shadow-md border transition-transform duration-300 group-hover:scale-105"
                style={{ borderColor: activeItem.borderColor }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={activeItem.src}
                    alt={`${activeItem.name} logo`}
                    fill
                    className="object-contain"
                    sizes="112px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Club Name & Tagline */}
            <div className="w-full text-center mt-3 z-10">
              <h4
                className="font-display text-lg font-bold transition-colors"
                style={{ color: activeItem.accent }}
              >
                {activeItem.name}
              </h4>
              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                {activeItem.tagline}
              </p>
            </div>

            {/* Hover indication bar at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 opacity-60 group-hover:opacity-100"
              style={{ backgroundColor: activeItem.accent }}
            />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots for this column */}
      {items.length > 1 && (
        <div className="flex items-center gap-1.5 mt-3">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentIndex === idx
                  ? "w-5 bg-slate-800"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400"
              )}
              aria-label={`Show ${item.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LogoCarousel({
  columnCount = 3,
  logos = DEFAULT_CLUBS,
  className,
  autoPlayInterval = 3200,
}: LogoCarouselProps) {
  // Distribute logos into columnCount columns
  // If logos <= columnCount, repeat or rotate so all columns have active cycling cards
  const columns: LogoItem[][] = Array.from({ length: columnCount }, () => []);

  if (logos.length <= columnCount) {
    // With 4 items and 3 columns, distribute with staggered offset so each column shows different items
    for (let c = 0; c < columnCount; c++) {
      for (let i = 0; i < logos.length; i++) {
        const offsetIndex = (i + c) % logos.length;
        columns[c].push(logos[offsetIndex]);
      }
    }
  } else {
    logos.forEach((logo, idx) => {
      columns[idx % columnCount].push(logo);
    });
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "grid gap-5 sm:gap-6",
          columnCount === 1 && "grid-cols-1 max-w-sm mx-auto",
          columnCount === 2 && "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto",
          columnCount === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto",
          columnCount >= 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
        )}
      >
        {columns.map((columnItems, colIndex) => (
          <LogoColumn
            key={colIndex}
            items={columnItems}
            columnIndex={colIndex}
            autoPlayInterval={autoPlayInterval}
          />
        ))}
      </div>
    </div>
  );
}
