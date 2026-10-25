"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Phone,
  ChevronDown,
  User,
  Bell,
  Users,
  ShieldAlert,
  Landmark,
  HelpCircle,
  Info,
  PhoneCall,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "./command-palette";
import { useTheme } from "@/components/theme/theme-context";

const PRIMARY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Achievements", href: "/achievements" },
];

const MORE_LINKS = [
  {
    label: "Notifications",
    href: "/notifications",
    description: "Official circulars, orders & announcements",
    icon: Bell,
  },
  {
    label: "Subcommittees & Wings",
    href: "/subcommittees",
    description: "Arts, sports, magazine, library & health wings",
    icon: Users,
  },
  {
    label: "Union Interventions",
    href: "/interventions",
    description: "Student rights, charters & delegations",
    icon: ShieldAlert,
  },
  {
    label: "Transparency & Ledger",
    href: "/finance",
    description: "Audited union accounts & public finance",
    icon: Landmark,
  },
  {
    label: "Student Grievance Desk",
    href: "/complaints",
    description: "Confidential complaints, queries & redressal",
    icon: HelpCircle,
  },
  {
    label: "About GMC & YUGA",
    href: "/about",
    description: "Institution heritage, history & union legacy",
    icon: Info,
  },
  {
    label: "Contact & Directory",
    href: "/contact",
    description: "Union office bearers & department direct lines",
    icon: PhoneCall,
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";

  // Hide the public navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isMoreActive = MORE_LINKS.some(
    (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setMoreOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
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

  const handleMouseEnter = () => {
    if (moreTimeoutRef.current) {
      clearTimeout(moreTimeoutRef.current);
      moreTimeoutRef.current = null;
    }
    setMoreOpen(true);
  };

  const handleMouseLeave = () => {
    moreTimeoutRef.current = setTimeout(() => {
      setMoreOpen(false);
    }, 150);
  };

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-xl"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isObsidian
            ? scrolled
              ? "bg-[#07080a]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
              : "bg-[#07080a]/80 backdrop-blur-md border-b border-white/5"
            : scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-emerald-100/90 shadow-[0_2px_12px_rgba(16,40,25,0.04)]"
            : "bg-white/80 backdrop-blur-xs border-b border-slate-100/60"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Primary Navigation"
            className="flex items-center justify-between h-16 sm:h-20"
          >
            {/* Left: Logo & YUGA Only */}
            <div className="flex items-center">
              {isObsidian ? (
                <Link
                  href="/"
                  aria-label="YUGA Home"
                  className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden"
                >
                  <Image
                    src="/yuga-logo-crimson.png"
                    alt="YUGA Logo"
                    width={40}
                    height={40}
                    className="h-8.5 sm:h-9.5 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_14px_rgba(225,29,72,0.45)]"
                    priority
                  />
                  <span className="font-extrabold text-xl sm:text-[22px] tracking-[0.16em] uppercase text-[#fffaf9] group-hover:text-[#ff2e56] transition-colors select-none font-['Plus_Jakarta_Sans',sans-serif]">
                    YUGA
                  </span>
                </Link>
              ) : (
                <Link
                  href="/"
                  aria-label="YUGA Home"
                  className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden"
                >
                  <Image
                    src="/yuga-logo-emerald.png"
                    alt="YUGA Logo"
                    width={40}
                    height={40}
                    className="h-8.5 sm:h-9.5 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                  <span className="font-extrabold text-xl sm:text-[22px] tracking-[0.16em] uppercase text-slate-900 group-hover:text-emerald-700 transition-colors select-none">
                    YUGA
                  </span>
                </Link>
              )}
            </div>

            {/* Center: Clean Minimal Desktop Nav (Home, Events, Achievements, More) */}
            <div className="hidden lg:flex items-center gap-1.5">
              {PRIMARY_LINKS.map((link) => {
                const isActive = pathname === link.href;
                if (isObsidian) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-4 py-2 text-[13.5px] transition-all duration-200 rounded-lg select-none ${
                        isActive
                          ? "bg-white/10 text-[#fffaf9] font-bold shadow-[0_0_14px_rgba(225,29,72,0.18)] border border-white/15"
                          : "text-white/70 hover:text-[#fffaf9] hover:bg-white/[0.06] font-medium"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-[13.5px] transition-all duration-200 rounded-lg select-none ${
                      isActive
                        ? "text-emerald-800 bg-emerald-50 border border-emerald-200/80 font-bold shadow-xs"
                        : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* More Dropdown (Hover + Click) */}
              <div
                ref={moreRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setMoreOpen((prev) => !prev)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1.5 px-4 py-2 text-[13.5px] rounded-lg transition-all duration-200 select-none ${
                    isObsidian
                      ? moreOpen || isMoreActive
                        ? "bg-white/10 text-[#fffaf9] font-bold border border-white/15 shadow-[0_0_14px_rgba(225,29,72,0.18)]"
                        : "text-white/70 hover:text-[#fffaf9] hover:bg-white/[0.06] font-medium"
                      : moreOpen || isMoreActive
                      ? "text-emerald-800 bg-emerald-50 border border-emerald-200/80 font-bold shadow-xs"
                      : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium"
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      moreOpen ? "rotate-180 text-[#e11d48]" : "opacity-70"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] rounded-2xl p-2 z-50 transition-all ${
                        isObsidian
                          ? "bg-[#0e1017]/98 backdrop-blur-2xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_24px_rgba(225,29,72,0.12)]"
                          : "bg-white/98 backdrop-blur-xl border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-1.5">
                        {MORE_LINKS.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMoreOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 group border ${
                                isObsidian
                                  ? isActive
                                    ? "bg-white/10 border-white/15 text-white"
                                    : "border-transparent hover:border-white/10 hover:bg-white/[0.06] text-white/80"
                                  : isActive
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                  : "border-transparent hover:border-slate-200/80 hover:bg-emerald-50/50 text-slate-700"
                              }`}
                            >
                              <div
                                className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                                  isObsidian
                                    ? isActive
                                      ? "bg-[#e11d48] text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]"
                                      : "bg-white/[0.05] text-white/70 group-hover:bg-[#e11d48]/20 group-hover:text-[#ff2e56]"
                                    : isActive
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={`text-[13px] font-semibold transition-colors truncate ${
                                  isObsidian
                                    ? "text-white/90 group-hover:text-white"
                                    : "text-slate-800 group-hover:text-emerald-800"
                                }`}
                              >
                                {item.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Icon-only Search + User/Admin + Emergency SOS + Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Icon-only Search */}
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                aria-label="Search site (⌘K)"
                title="Search site (⌘K)"
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 active:scale-95 ${
                  isObsidian
                    ? "border-white/10 text-white/80 hover:text-white hover:border-[#e11d48]/50 hover:bg-white/[0.06] shadow-xs"
                    : "border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/70 shadow-xs"
                }`}
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className={`lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                  isObsidian
                    ? "border-white/10 text-white hover:bg-white/[0.06]"
                    : "border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300"
                }`}
              >
                {isOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className={`fixed inset-x-0 top-16 sm:top-20 bottom-0 z-40 lg:hidden overflow-y-auto backdrop-blur-2xl border-b shadow-2xl transition-colors ${
              isObsidian
                ? "bg-[#07080a]/98 border-white/10 text-white"
                : "bg-white/98 border-emerald-100 text-slate-900"
            }`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col gap-4">
              {/* Mobile Quick Search Button */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className={`flex items-center justify-between w-full rounded-xl px-4 py-3 text-sm transition-all border ${
                  isObsidian
                    ? "border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-emerald-50/50 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Search className={`h-4 w-4 ${isObsidian ? "text-[#e11d48]" : "text-emerald-600"}`} />
                  <span className="font-medium">Search campus portals, events, circulars...</span>
                </div>
                <kbd className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                  isObsidian ? "bg-white/10 text-white/60" : "bg-slate-200 text-slate-600"
                }`}>
                  ⌘K
                </kbd>
              </button>

              {/* Primary Links */}
              <div className="flex flex-col gap-1">
                <span className={`text-[11px] font-bold tracking-wider uppercase px-2 mb-1 ${
                  isObsidian ? "text-white/40" : "text-slate-400"
                }`}>
                  Main Navigation
                </span>
                {PRIMARY_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between ${
                        isObsidian
                          ? isActive
                            ? "bg-[#e11d48]/20 text-white border border-[#e11d48]/40"
                            : "text-white/80 hover:bg-white/[0.05] hover:text-white"
                          : isActive
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                          : "text-slate-700 hover:bg-emerald-50/60 hover:text-emerald-800"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className={`h-1.5 w-1.5 rounded-full ${isObsidian ? "bg-[#e11d48]" : "bg-emerald-600"}`} />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* More Portals & Services */}
              <div className="flex flex-col gap-1 pt-2 border-t border-white/5">
                <span className={`text-[11px] font-bold tracking-wider uppercase px-2 mb-1 ${
                  isObsidian ? "text-white/40" : "text-slate-400"
                }`}>
                  All Services & Portals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {MORE_LINKS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors border ${
                          isObsidian
                            ? isActive
                              ? "bg-white/10 text-white border-white/15"
                              : "border-transparent text-white/70 hover:bg-white/[0.04] hover:text-white"
                            : isActive
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "border-transparent text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-800"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isObsidian ? "text-[#e11d48]" : "text-emerald-600"}`} />
                        <span className="font-medium text-[13px]">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}
