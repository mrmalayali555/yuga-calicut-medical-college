"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Phone } from "lucide-react";
import { Logo } from "./logo";
import { NAV_LINKS } from "@/lib/site";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "./command-palette";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const pathname = usePathname();

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
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsOpen(false);
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
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-emerald-100/90 shadow-[0_2px_12px_rgba(16,40,25,0.04)]"
            : "bg-white/80 backdrop-blur-xs border-b border-slate-100/60"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Primary Navigation"
            className="flex items-center justify-between h-16"
          >
            {/* Left: Logo */}
            <Link href="/" aria-label="YUGA Home">
              <Logo />
            </Link>

            {/* Center: Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.filter(l => l.label !== "Home").map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 text-[13px] transition-all duration-200 rounded-lg ${
                      isActive
                        ? "text-emerald-800 bg-emerald-50 border border-emerald-200/80 font-semibold shadow-xs"
                        : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                aria-label="Search"
                className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-600 hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors"
              >
                <Search className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                <span className="font-medium">Search</span>
                <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                  ⌘K
                </kbd>
              </button>

              {/* Emergency */}
              <Link
                href="/emergency"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200/80 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
              >
                <Phone className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">Emergency</span>
                <span className="sm:hidden">SOS</span>
              </Link>

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-white/98 backdrop-blur-xl border-b border-emerald-100 shadow-xl"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col gap-1">
              {/* Mobile search */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 mb-2 hover:bg-emerald-50/50 hover:border-emerald-200"
              >
                <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <span className="font-medium">Search…</span>
              </button>

              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold"
                        : "text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
