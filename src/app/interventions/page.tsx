"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, FileText, ArrowRight, ShieldCheck, Building2 } from "lucide-react";
import { INTERVENTIONS } from "@/lib/data";
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

const INTERVENTION_IMAGES: Record<string, string> = {
  "inv-reading-rooms":
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80", // 24/7 Library & Reading Rooms
  "inv-opd-ramp":
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80", // Hospital OPD Block
  "inv-stipend-timely":
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", // Doctors Welfare
  "inv-canteen-night":
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80", // Night Canteen
};

const CATEGORIES = [
  { id: "all", label: "All Interventions" },
  { id: "Hostel & Living", label: "Hostel & Living" },
  { id: "Hospital & Clinical", label: "Hospital & Clinical" },
  { id: "Welfare", label: "Student Welfare" },
];

export default function InterventionsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const filtered =
    selectedCategory === "all"
      ? INTERVENTIONS
      : INTERVENTIONS.filter((i) => i.category === selectedCategory);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/30 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1 mb-4 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Advocacy & Student Rights
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
            Union Interventions
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
            Official petitions, policy memorandums, and student welfare
            representations submitted by YUGA to DME Kerala, KUHS, and
            Hospital Administration.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-slate-200/80">
          {CATEGORIES.map((tab) => {
            const isActive = selectedCategory === tab.id;
            const count =
              tab.id === "all"
                ? INTERVENTIONS.length
                : INTERVENTIONS.filter((i) => i.category === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-white bg-emerald-700 shadow-sm"
                    : "text-emerald-950 border border-emerald-200/80 bg-white hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "text-emerald-100 bg-emerald-800/50"
                      : "text-slate-600 bg-slate-100"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cutout Cards Grid */}
        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const imageSrc =
                INTERVENTION_IMAGES[item.id] || "/hero-building.jpg";
              const isResolved = item.status.toLowerCase() === "resolved";

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
                      {/* Media container with signature Cutout Corner accents */}
                      <CutoutCardMedia className="h-64 sm:h-72">
                        <CutoutCardImage
                          alt={item.title}
                          src={imageSrc}
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                        <CutoutCardOverlay />

                        {/* Inset Label — bottom-left cutout */}
                        <CutoutCardInsetLabel className="bg-white bottom-0 left-0 rounded-tr-[20px] px-4 py-2.5 shadow-2xs">
                          <span className="text-emerald-800 text-[11px] font-bold tracking-wider uppercase">
                            {item.category}
                          </span>
                          <CutoutCorner className="text-white absolute -right-[31px] -bottom-px rotate-90" />
                          <CutoutCorner className="text-white absolute -top-[31px] -left-px rotate-90" />
                        </CutoutCardInsetLabel>

                        {/* Pin Badge — top-right cutout */}
                        <CutoutCardPin
                          className={`top-0 right-0 rounded-bl-[16px] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm ring-1 ${
                            isResolved
                              ? "bg-emerald-600 text-white ring-emerald-700/30"
                              : "bg-amber-500 text-white ring-amber-600/30"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {isResolved ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Clock className="h-3.5 w-3.5" />
                            )}
                            {item.status}
                          </span>
                          <CutoutCorner
                            className={`absolute top-0 -left-[23px] -rotate-90 ${
                              isResolved ? "text-emerald-600" : "text-amber-500"
                            }`}
                            size={24}
                          />
                          <CutoutCorner
                            className={`absolute right-0 -bottom-[23px] -rotate-90 ${
                              isResolved ? "text-emerald-600" : "text-amber-500"
                            }`}
                            size={24}
                          />
                        </CutoutCardPin>
                      </CutoutCardMedia>

                      {/* Content Section */}
                      <CutoutCardContent className="p-6 sm:p-7">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                            <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                            To: {item.authority}
                          </span>
                          <span className="font-mono">{item.date}</span>
                        </div>

                        <Link href={`/interventions/${item.id}`} className="group/link block">
                          <h2 className="text-xl sm:text-2xl font-display text-slate-900 leading-snug group-hover/link:text-emerald-700 transition-colors">
                            {item.title}
                          </h2>
                        </Link>

                        <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                          {item.description}
                        </p>

                        {item.outcome && (
                          <div className="mt-5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 p-3.5 text-xs text-emerald-900 leading-relaxed font-medium flex items-start gap-2.5">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                            <div>
                              <strong className="font-semibold text-emerald-800">
                                Impact Outcome:{" "}
                              </strong>
                              {item.outcome}
                            </div>
                          </div>
                        )}
                      </CutoutCardContent>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-2">
                      <CutoutCardFooter className="border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                          <span>Official DME/KUHS Docket</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-800">
                          {item.authority.split(" ")[0]}
                        </span>
                      </CutoutCardFooter>
                    </div>

                    {/* Hover Action */}
                    <CutoutCardAction className="right-6 bottom-6">
                      <Link
                        href={`/interventions/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                      >
                        <span>Read Petition</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </CutoutCardAction>
                  </CutoutCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

