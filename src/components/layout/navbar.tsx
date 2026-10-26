"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Home,
  Calendar,
  Trophy,
  Megaphone,
  Users,
  Contact2,
  Info,
  Phone,
  Pencil,
  Bell,
  ShieldAlert,
  Landmark,
  HelpCircle,
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

const MOBILE_NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Interventions", href: "/interventions", icon: Megaphone },
  { label: "Subcommittee", href: "/subcommittees", icon: Users },
  { label: "Union Accounts", href: "/finance", icon: Contact2 },
  { label: "About GMC & YUGA", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
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
  const isJeevanam = pathname?.startsWith("/clubs/jeevanam");
  const isObsidian = theme === "obsidian-crimson" || isJeevanam;

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

  // Lock body scroll cleanly without layout shift or white strip when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
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
              {isJeevanam ? (
                <Link
                  href="/"
                  aria-label="Jeevanam Portal — GMC Kozhikode"
                  className="flex items-center gap-2 group focus:outline-hidden"
                >
                  <Image
                    src="/clubs/jeevanam-transparent.png"
                    alt="Jeevanam Logo"
                    width={44}
                    height={44}
                    className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(225,29,72,0.4)]"
                    priority
                  />
                </Link>
              ) : isObsidian ? (
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
            <div className="hidden lg:flex items-center">
              {isObsidian ? (
                <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#07080d]/65 backdrop-blur-md p-1 shadow-lg">
                  {PRIMARY_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`relative px-5 py-1.5 text-xs transition-all duration-200 rounded-full select-none ${
                          isActive
                            ? "bg-gradient-to-r from-[#e11d48]/25 to-[#ff2e56]/25 text-[#fffaf9] font-bold shadow-[0_0_12px_rgba(225,29,72,0.3)] border border-[#e11d48]/40"
                            : "text-white/70 hover:text-[#fffaf9] hover:bg-white/[0.06] font-medium"
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
                      className={`flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full transition-all duration-200 select-none ${
                        moreOpen || isMoreActive
                          ? "bg-gradient-to-r from-[#e11d48]/25 to-[#ff2e56]/25 text-[#fffaf9] font-bold border border-[#e11d48]/40 shadow-[0_0_12px_rgba(225,29,72,0.3)]"
                          : "text-white/70 hover:text-[#fffaf9] hover:bg-white/[0.06] font-medium"
                      }`}
                    >
                      <span>More</span>
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${
                          moreOpen ? "rotate-180 text-[#ff2e56]" : "opacity-70"
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
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] rounded-2xl p-2 z-50 bg-[#0e1017]/98 backdrop-blur-2xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_24px_rgba(225,29,72,0.12)]"
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
                                    isActive
                                      ? "bg-white/10 border-white/15 text-white"
                                      : "border-transparent hover:border-white/10 hover:bg-white/[0.06] text-white/80"
                                  }`}
                                >
                                  <div
                                    className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                                      isActive
                                        ? "bg-[#e11d48] text-white shadow-[0_0_12px_rgba(225,29,72,0.5)]"
                                        : "bg-white/[0.05] text-white/70 group-hover:bg-[#e11d48]/20 group-hover:text-[#ff2e56]"
                                    }`}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <span className="text-[13px] font-semibold text-white/90 group-hover:text-white truncate">
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
              ) : (
                <div className="flex items-center gap-1.5">
                  {PRIMARY_LINKS.map((link) => {
                    const isActive = pathname === link.href;
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

                  {/* More Dropdown (Emerald) */}
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
                        moreOpen || isMoreActive
                          ? "text-emerald-800 bg-emerald-50 border border-emerald-200/80 font-bold shadow-xs"
                          : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium"
                      }`}
                    >
                      <span>More</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          moreOpen ? "rotate-180 text-emerald-600" : "opacity-70"
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
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] rounded-2xl p-2 z-50 bg-white/98 backdrop-blur-xl border border-slate-200 shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
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
                                    isActive
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                                      : "border-transparent hover:border-slate-200/80 hover:bg-emerald-50/50 text-slate-700"
                                  }`}
                                >
                                  <div
                                    className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                                      isActive
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                                    }`}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <span className="text-[13px] font-semibold text-slate-800 group-hover:text-emerald-800 truncate">
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
              )}
            </div>

            {/* Right: Circular Search + Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Circular Search Button */}
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                aria-label="Search site (⌘K)"
                title="Search site (⌘K)"
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 active:scale-95 ${
                  isObsidian
                    ? "border-white/15 bg-white/[0.04] text-white/85 hover:text-white hover:border-[#ff2e56]/50 hover:bg-white/[0.08] shadow-[0_0_12px_rgba(255,46,86,0.15)]"
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
                className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 ${
                  isObsidian
                    ? "border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]"
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

      {/* Mobile Navigation Sidebar & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dark Semi-Transparent Backdrop (covers the entire viewport behind the drawer) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 w-full h-full bg-black/75 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Left Sliding Minimal Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[84vw] max-w-[320px] bg-[#0c0d12] border-r border-white/10 rounded-r-[2rem] flex flex-col p-5 shadow-[24px_0_60px_rgba(0,0,0,0.85)] z-10 overflow-hidden overscroll-contain select-none"
              aria-label="Mobile Navigation Menu"
            >
              {/* Header inside the drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
                {/* Logo and Union Brand */}
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 focus:outline-hidden group"
                  aria-label="YUGA Home"
                >
                  <Image
                    src="/yuga-logo-crimson.png"
                    alt="YUGA Logo"
                    width={38}
                    height={38}
                    className="h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(225,29,72,0.4)]"
                  />
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold tracking-wider text-white leading-none">
                      YUGA
                    </span>
                    <span className="text-[8.5px] font-bold tracking-[0.16em] uppercase text-white/50 block mt-1 leading-none">
                      GMC KOZHIKODE
                    </span>
                    <span className="text-[8.5px] font-bold tracking-[0.16em] uppercase text-white/50 block mt-0.5 leading-none">
                      COLLEGE UNION
                    </span>
                  </div>
                </Link>

                {/* Header Action Buttons: Search & Close */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setCommandPaletteOpen(true);
                    }}
                    aria-label="Search site"
                    title="Search site (⌘K)"
                    className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation menu"
                    className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Navigation Items (The exact 8 items in exact order) */}
              <nav className="flex-1 overflow-y-auto py-3 space-y-1 pr-1 scrollbar-none">
                {MOBILE_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname?.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm transition-all ${
                        isActive
                          ? "bg-[#ff2e56]/15 border border-[#ff2e56]/40 text-white font-medium shadow-sm"
                          : "text-white/70 hover:text-white hover:bg-white/[0.04] font-medium border border-transparent"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? "text-[#ff2e56]" : "text-white/60"
                        } ${isActive && item.label === "Home" ? "fill-current" : ""}`}
                        aria-hidden="true"
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Prominent Action: Drop a Suggestion */}
              <div className="pt-3 border-t border-white/[0.08] shrink-0">
                <Link
                  href="/complaints"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-[#8c182c] hover:bg-[#a61c34] active:scale-[0.98] border border-[#ff2e56]/30 text-white font-medium text-sm py-3 px-5 rounded-full flex items-center justify-center gap-2.5 shadow-lg shadow-[#8c182c]/20 transition-all cursor-pointer"
                >
                  <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Drop a Suggestion</span>
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}
