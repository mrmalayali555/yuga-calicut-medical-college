"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageCircle,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { COLLEGE, YUGA } from "@/lib/site";

const NAV_COLS = [
  {
    heading: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Events & Fests", href: "/events" },
      { label: "Achievements", href: "/achievements" },
      { label: "Notifications", href: "/notifications" },
    ],
  },
  {
    heading: "Union",
    links: [
      { label: "Interventions", href: "/interventions" },
      { label: "Subcommittees", href: "/subcommittees" },
      { label: "Union Accounts", href: "/finance" },
      { label: "About YUGA", href: "/about" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Drop a Suggestion", href: "/complaints" },
      { label: "Emergency Directory", href: "/emergency" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    abbr: "IG",
    href: YUGA.socials.instagram,
    icon: null,
  },
  {
    label: "YouTube",
    abbr: "YT",
    href: YUGA.socials.youtube,
    icon: null,
  },
  {
    label: "Telegram",
    abbr: null,
    href: YUGA.socials.telegram,
    icon: Send,
  },
  {
    label: "WhatsApp",
    abbr: null,
    href: YUGA.socials.whatsapp,
    icon: MessageCircle,
  },
];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative w-full bg-[#07080a] border-t border-white/[0.07] overflow-hidden">
      {/* Subtle crimson glow top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 w-[500px] h-[300px] rounded-full bg-[#e11d48]/5 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 pt-16 sm:pt-20 pb-8">
        {/* ── Main grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-10 lg:gap-8 pb-12 border-b border-white/[0.07]">

          {/* ── Brand column ── */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/yuga-logo-crimson.png"
                  alt="YUGA Logo"
                  fill
                  className="object-contain drop-shadow-[0_0_10px_rgba(225,29,72,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(225,29,72,0.65)] transition-all duration-300"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-[0.16em] text-white uppercase">YUGA</span>
                <span className="text-[9px] font-semibold tracking-[0.12em] text-white/40 uppercase mt-0.5">
                  GMC Kozhikode · 2026–27
                </span>
              </div>
            </Link>

            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              Official student union of Government Medical College, Kozhikode — representing every medico across academics, culture, sport, and advocacy.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5 pt-1">
              <a
                href={`tel:${COLLEGE.phone}`}
                className="flex items-center gap-2.5 text-sm text-white/45 hover:text-white/80 transition-colors group"
              >
                <Phone className="h-3.5 w-3.5 text-[#e11d48]/60 shrink-0" />
                <span>{COLLEGE.phone}</span>
              </a>
              <a
                href={`mailto:${YUGA.email}`}
                className="flex items-center gap-2.5 text-sm text-white/45 hover:text-white/80 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-[#e11d48]/60 shrink-0" />
                <span className="truncate">{YUGA.email}</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/40">
                <MapPin className="h-3.5 w-3.5 text-[#e11d48]/60 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{COLLEGE.address}</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`YUGA on ${s.label}`}
                    className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white hover:border-[#e11d48]/50 hover:bg-[#e11d48]/10 transition-all duration-200 active:scale-95 text-[10px] font-bold"
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <span>{s.abbr}</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Nav columns ── */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e11d48] mb-5">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-white/45 hover:text-white/90 transition-colors duration-150"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-60 -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-150" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs text-white/25">
          <span>
            © {new Date().getFullYear()} YUGA College Union · Government Medical College, Kozhikode
          </span>
          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/interventions" className="hover:text-white/60 transition-colors">Rights Charter</Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
