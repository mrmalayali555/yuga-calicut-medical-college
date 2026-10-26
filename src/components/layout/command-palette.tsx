"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
  keywords: string;
}

// Flat searchable page list — no categories, no badges, no subtitles
const PAGES: NavItem[] = [
  { label: "Home",             href: "/",             keywords: "home main" },
  { label: "Events & Fests",   href: "/events",        keywords: "events fest cultural sports" },
  { label: "Achievements",     href: "/achievements",  keywords: "achievements laurels trophy awards" },
  { label: "Notifications",    href: "/notifications", keywords: "notifications circulars notices" },
  { label: "Interventions",    href: "/interventions", keywords: "interventions advocacy petitions" },
  { label: "Subcommittees",    href: "/subcommittees", keywords: "subcommittees wings councils" },
  { label: "Union Accounts",   href: "/finance",       keywords: "finance accounts union" },
  { label: "Emergency",        href: "/emergency",     keywords: "emergency casualty blood hotline 24/7" },
  { label: "Drop a Suggestion",href: "/complaints",    keywords: "suggestion grievance complaint feedback" },
  { label: "Contact",          href: "/contact",       keywords: "contact reach us" },
  { label: "About YUGA",       href: "/about",         keywords: "about yuga union leadership" },
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
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter only when user has typed something
  const filtered = query.trim()
    ? PAGES.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.label.toLowerCase().includes(q) ||
          p.keywords.toLowerCase().includes(q)
        );
      }).slice(0, 5)
    : [];

  const handleSelect = useCallback(
    (href: string) => {
      onClose();
      setQuery("");
      router.push(href);
    },
    [onClose, router]
  );

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex].href);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, handleClose, handleSelect]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site search"
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="relative z-10 w-full max-w-lg"
          >
            {/* Input row */}
            <div className="flex items-center gap-3 bg-[#0f1014] border border-white/12 rounded-2xl px-4 py-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)]">
              <Search
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-[#e11d48]"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, events, contacts…"
                spellCheck={false}
                autoComplete="off"
                className="flex-1 bg-transparent text-sm text-white placeholder-white/35 focus:outline-none font-medium caret-[#e11d48]"
                aria-label="Search"
              />
              {/* Close / clear button — always visible */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close search"
                className="h-7 w-7 shrink-0 rounded-full border border-white/10 bg-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-150 active:scale-90"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Results dropdown — only when there's a query */}
            <AnimatePresence>
              {filtered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14 }}
                  className="mt-2 bg-[#0f1014] border border-white/10 rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.8)]"
                >
                  {filtered.map((item, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`group flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-100 ${
                          isSelected
                            ? "bg-[#e11d48]/12 text-white"
                            : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                        } ${i !== 0 ? "border-t border-white/[0.05]" : ""}`}
                      >
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 shrink-0 transition-all duration-150 ${
                            isSelected
                              ? "text-[#e11d48] translate-x-0.5 -translate-y-0.5"
                              : "text-white/20 group-hover:text-white/50"
                          }`}
                        />
                      </button>
                    );
                  })}
                </motion.div>
              )}

              {/* No results */}
              {query.trim() && filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 bg-[#0f1014] border border-white/10 rounded-2xl px-4 py-5 text-center text-sm text-white/35 shadow-[0_16px_48px_rgba(0,0,0,0.8)]"
                >
                  No pages found for &ldquo;{query}&rdquo;
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
