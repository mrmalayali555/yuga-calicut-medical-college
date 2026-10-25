"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./logo";
import { COLLEGE, YUGA, NAV_LINKS } from "@/lib/site";
import { useTheme } from "@/components/theme/theme-context";

const SOCIAL_LINKS = [
  { label: "Instagram", href: YUGA.socials.instagram },
  { label: "Telegram", href: YUGA.socials.telegram },
  { label: "WhatsApp", href: YUGA.socials.whatsapp },
  { label: "YouTube", href: YUGA.socials.youtube },
];

export function Footer() {
  const { theme } = useTheme();
  const isObsidian = theme === "obsidian-crimson";

  if (isObsidian) {
    return (
      <footer className="w-full bg-surface-container-lowest py-space-xl mt-auto border-t border-white/10 text-on-surface">
        <div className="max-w-[1440px] mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter-lg pb-space-lg mb-space-lg border-b border-white/10">
            {/* Col 1: Brand & Union Authority */}
            <div className="space-y-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="bg-primary-container text-on-primary-container font-headline-sm text-sm px-2.5 py-1 rounded font-bold shadow-[0_0_12px_rgba(225,29,72,0.4)]">
                  YUGA
                </span>
                <span className="font-headline-sm text-base text-on-surface uppercase font-bold tracking-tight">
                  Union
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
                Autonomous Collegiate Union representing medical residents, clinical scholars, and healthcare fellows with clinical mastery and institutional authority at Government Medical College Kozhikode.
              </p>
            </div>

            {/* Col 2: Governance */}
            <div>
              <div className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-space-md">
                Governance
              </div>
              <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                <li>
                  <Link className="hover:text-on-surface transition-colors" href="/calendar">
                    Academic Senate &amp; KUHS
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-on-surface transition-colors" href="/about">
                    Union Executive Council
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-on-surface transition-colors" href="/interventions">
                    Bylaws &amp; Charters
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-on-surface transition-colors" href="/emergency">
                    Rapid Response Protocols
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Union Portals */}
            <div>
              <div className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-space-md">
                Union Portals
              </div>
              <ul className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                <li>
                  <Link className="hover:text-on-surface transition-colors" href="/calendar">
                    Duty Hours Telemetry
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-on-surface transition-colors" href="/achievements">
                    Credential Repository
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-on-surface transition-colors" href="/finance">
                    Transparent Defense Fund
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-on-surface transition-colors" href="/complaints">
                    Ethics &amp; Whistleblower
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Emergency Dispatch */}
            <div>
              <div className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-space-md">
                Emergency Dispatch
              </div>
              <div className="bg-surface-container-low p-space-md rounded border border-white/5">
                <div className="font-label-sm text-label-sm text-primary uppercase tracking-wider mb-space-xs font-bold">
                  Trauma &amp; Urgent Representation
                </div>
                <div className="font-headline-sm text-lg font-bold text-on-surface mb-space-xs font-mono">
                  {COLLEGE.casualtyPhone || "1-800-YUGA-MED"}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Immediate executive intervention for clinical staff on duty 24/7/365.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-md font-body-sm text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-space-xs">
              <span>© {new Date().getFullYear()} YUGA Medical College Union. Collegiate Executive Authority.</span>
            </div>
            <div className="flex items-center gap-space-lg">
              <Link className="hover:text-on-surface transition-colors" href="/about">
                Privacy Framework
              </Link>
              <Link className="hover:text-on-surface transition-colors" href="/interventions">
                Union Rights Charter
              </Link>
              <Link className="hover:text-on-surface transition-colors" href="/contact">
                Institutional Compliance
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // DEFAULT CLINICAL EMERALD FOOTER
  return (
    <footer className="border-t border-slate-200 bg-[#f8faf8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo showTagline={false} />
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs font-normal">
              Official student union portal for Government Medical College,
              Kozhikode — academic epoch 2026–2027.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs"
                  aria-label={`YUGA on ${social.label}`}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-800 mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-emerald-800 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-800 mb-5">
              Resources &amp; Hotlines
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/complaints" className="text-sm text-slate-600 hover:text-emerald-800 font-medium transition-colors">
                  Campus Voice Grievance
                </Link>
              </li>
              <li>
                <Link href="/interventions" className="text-sm text-slate-600 hover:text-emerald-800 font-medium transition-colors">
                  Union Interventions
                </Link>
              </li>
              <li>
                <Link href="/finance" className="text-sm text-slate-600 hover:text-emerald-800 font-medium transition-colors">
                  Union Accounts &amp; Finance
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="text-sm text-slate-600 hover:text-emerald-800 font-medium transition-colors">
                  Official Notifications &amp; Circulars
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                  Emergency Directory (24/7)
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-sm text-slate-600 hover:text-emerald-800 font-medium transition-colors">
                  KUHS Examination Schedules
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-emerald-800 font-medium transition-colors">
                  Official Contact Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-emerald-800 mb-5">
              Campus Contact
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
                <span>{COLLEGE.address}</span>
              </div>
              <div className="flex gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
                <a href={`tel:${COLLEGE.phone}`} className="hover:text-emerald-800 font-medium transition-colors">
                  {COLLEGE.phone}
                </a>
              </div>
              <div className="flex gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
                <a href={`mailto:${YUGA.email}`} className="hover:text-emerald-800 font-medium transition-colors">
                  {YUGA.email}
                </a>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-500 mb-1">Casualty Triage (24/7)</div>
                <div className="text-sm font-bold text-red-600 font-mono">{COLLEGE.casualtyPhone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} {YUGA.name} · {COLLEGE.name}
          </span>
          <span className="font-mono text-[11px] text-emerald-800 font-medium">
            Calicut Medical College Union
          </span>
        </div>
      </div>
    </footer>
  );
}
