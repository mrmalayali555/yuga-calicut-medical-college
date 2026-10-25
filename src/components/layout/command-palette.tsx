"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Trophy,
  Bell,
  Siren,
  MessageSquareWarning,
  FileText,
  Users,
  X,
  ArrowRight,
  Command,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme/theme-context";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Emergency" | "Campus Life" | "Academic";
  href: string;
  icon: typeof Search;
  badge?: string;
}

const COMMANDS: CommandItem[] = [
  {
    id: "monument-3d",
    title: "3D Heritage Monument · Tenshu Growth Study",
    subtitle: "Interactive Three.js procedural architectural assembly",
    category: "Campus Life",
    href: "/monument",
    icon: Compass,
    badge: "Interactive 3D",
  },
  {
    id: "emergency-casualty",
    title: "Casualty Room Direct Hotline",
    subtitle: "24/7 Emergency Triage · 0495-2350212",
    category: "Emergency",
    href: "/emergency",
    icon: Siren,
    badge: "24/7 Hotline",
  },
  {
    id: "emergency-blood",
    title: "Blood Bank & Donor Helpline",
    subtitle: "Voluntary donor registry · 0495-2350244",
    category: "Emergency",
    href: "/emergency",
    icon: Siren,
  },
  {
    id: "events-yuga",
    title: "YUGA 2026 Inter-Collegiate Arts Fest",
    subtitle: "Cultural stages, concert nights & registration",
    category: "Campus Life",
    href: "/events?category=fest",
    icon: Sparkles,
    badge: "Featured Fest",
  },
  {
    id: "events-sports",
    title: "Calicut Medicos Premier League (CMPL)",
    subtitle: "Inter-batch cricket & football tournament",
    category: "Campus Life",
    href: "/events?category=sports",
    icon: Trophy,
  },
  {
    id: "circulars-notices",
    title: "Official Circulars & Notices",
    subtitle: "KUHS exam dates, hall tickets & union circulars",
    category: "Academic",
    href: "/notifications",
    icon: Bell,
    badge: "Official",
  },
  {
    id: "achievements-hall",
    title: "Medicos Hall of Fame & Laurels",
    subtitle: "Inter-medical trophies, research grants & gold medals",
    category: "Campus Life",
    href: "/achievements",
    icon: Trophy,
  },
  {
    id: "student-complaints",
    title: "Student Grievance & Idea Desk",
    subtitle: "Confidential feedback to Union Council with docket ID",
    category: "Navigation",
    href: "/complaints",
    icon: MessageSquareWarning,
    badge: "Confidential",
  },
  {
    id: "union-about",
    title: "About YUGA Union Charter & Leadership",
    subtitle: "Executive council, chairperson address & mission",
    category: "Navigation",
    href: "/about",
    icon: Users,
  },
  {
    id: "subcommittees-wings",
    title: "Subcommittees & Student Councils",
    subtitle: "16 active student wings: Arts, Sports, CMRS Research, Media",
    category: "Navigation",
    href: "/subcommittees",
    icon: Users,
  },
  {
    id: "interventions-advocacy",
    title: "Union Interventions & Petitions",
    subtitle: "Official representations to DME Kerala, KUHS Senate & Dean",
    category: "Navigation",
    href: "/interventions",
    icon: FileText,
  },
];

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";

  const filtered = COMMANDS.filter((cmd) => {
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex].href);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, handleSelect]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command search palette"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className={`fixed inset-0 backdrop-blur-md ${
              isObsidian ? "bg-black/75" : "bg-slate-900/40"
            }`}
          />

          {/* Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={`relative z-10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border transition-colors ${
              isObsidian
                ? "bg-[#0d0e14]/98 border-white/15 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(225,29,72,0.18)]"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            {/* Search Input Bar */}
            <div
              className={`flex items-center gap-3 border-b px-4 py-3.5 ${
                isObsidian
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-slate-200 bg-slate-50/80"
              }`}
            >
              <Search
                className={`h-5 w-5 shrink-0 ${
                  isObsidian ? "text-[#e11d48]" : "text-emerald-600"
                }`}
                aria-hidden="true"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, festival, notice, or casualty hotline…"
                spellCheck={false}
                autoFocus
                className={`w-full bg-transparent text-sm focus:outline-none font-medium ${
                  isObsidian
                    ? "text-white placeholder-white/40"
                    : "text-slate-900 placeholder-slate-400"
                }`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search input"
                  className={`rounded p-1 transition-colors ${
                    isObsidian
                      ? "text-white/40 hover:text-white"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <kbd
                className={`hidden sm:inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 font-mono text-[11px] ${
                  isObsidian
                    ? "border-white/15 bg-white/10 text-white/60"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin">
              {filtered.length === 0 ? (
                <div
                  className={`py-12 text-center text-sm ${
                    isObsidian ? "text-white/40" : "text-slate-500"
                  }`}
                >
                  No matching commands or resources found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all ${
                          isObsidian
                            ? isSelected
                              ? "bg-white/10 border border-[#e11d48]/50 text-white shadow-sm"
                              : "border border-transparent text-white/80 hover:bg-white/[0.05] hover:text-white"
                            : isSelected
                            ? "bg-emerald-50 border border-emerald-200/90 text-emerald-950 shadow-2xs"
                            : "border border-transparent text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                              isObsidian
                                ? isSelected
                                  ? "bg-[#e11d48] border-[#ff2e56] text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]"
                                  : "bg-white/[0.06] border-white/10 text-white/70"
                                : isSelected
                                ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                                : "bg-slate-100 border-slate-200 text-slate-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`truncate text-sm font-semibold ${
                                  isObsidian ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {item.title}
                              </span>
                              {item.badge && (
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    isObsidian
                                      ? "bg-[#e11d48]/20 border-[#e11d48]/40 text-[#ff2e56]"
                                      : "bg-emerald-100 border-emerald-200 text-emerald-800"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div
                              className={`truncate text-xs mt-0.5 font-normal ${
                                isObsidian ? "text-white/55" : "text-slate-600"
                              }`}
                            >
                              {item.subtitle}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`shrink-0 flex items-center gap-2 text-xs ${
                            isObsidian ? "text-white/40" : "text-slate-500"
                          }`}
                        >
                          <span className="text-[11px] font-mono uppercase tracking-wider hidden sm:inline">
                            {item.category}
                          </span>
                          <ArrowRight
                            className={`h-4 w-4 transition-transform ${
                              isSelected
                                ? isObsidian
                                  ? "text-[#ff2e56] translate-x-0.5 opacity-100"
                                  : "text-emerald-700 translate-x-0.5 opacity-100"
                                : "opacity-0"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div
              className={`flex items-center justify-between border-t px-4 py-2.5 text-[11px] ${
                isObsidian
                  ? "border-white/10 bg-white/[0.02] text-white/50"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd
                    className={`rounded border px-1 py-0.5 font-mono shadow-2xs ${
                      isObsidian
                        ? "border-white/15 bg-white/10 text-white/70"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    ↑
                  </kbd>
                  <kbd
                    className={`rounded border px-1 py-0.5 font-mono shadow-2xs ${
                      isObsidian
                        ? "border-white/15 bg-white/10 text-white/70"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    ↓
                  </kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd
                    className={`rounded border px-1.5 py-0.5 font-mono shadow-2xs ${
                      isObsidian
                        ? "border-white/15 bg-white/10 text-white/70"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    ↵
                  </kbd>
                  to select
                </span>
              </div>
              <div
                className={`flex items-center gap-1 font-mono text-[10px] font-semibold ${
                  isObsidian ? "text-[#ff2e56]" : "text-emerald-800"
                }`}
              >
                <Command className="h-3 w-3" aria-hidden="true" />
                <span>YUGA Command Hub</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
