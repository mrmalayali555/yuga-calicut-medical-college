"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Trophy,
  CalendarDays,
  Bell,
  MessageSquareWarning,
  Siren,
  Users,
  FileText,
  Megaphone,
  Images,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ClipboardList,
  Wallet,
  Settings,
  BookOpen,
  History,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  {
    section: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Content",
    items: [
      { href: "/admin/interventions", label: "Interventions", icon: FileText },
      { href: "/admin/events", label: "Events", icon: CalendarDays },
      { href: "/admin/forms", label: "Registration Forms", icon: ClipboardList },
      { href: "/admin/achievements", label: "Achievements", icon: Trophy },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/marquee", label: "Marquee", icon: Megaphone },
    ],
  },
  {
    section: "Modules",
    items: [
      { href: "/admin/emergency", label: "Emergency", icon: Siren },
      { href: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
      { href: "/admin/committees", label: "Subcommittees", icon: Users },
      { href: "/admin/pages", label: "Custom Pages", icon: BookOpen },
      { href: "/admin/finance", label: "Union Accounts", icon: Wallet },
    ],
  },
  {
    section: "Site",
    items: [
      { href: "/admin/media", label: "Media Library", icon: Images },
      { href: "/admin/changes", label: "Changes History", icon: History },
      { href: "/admin/sessions", label: "Active Sessions", icon: Users },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ admin }: { admin: { name: string; email: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <div className="flex h-full flex-col bg-[var(--bg-surface)] border-r border-[var(--border-primary)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--border-primary)]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] p-1.5 shadow-sm shadow-[var(--accent)]/30">
          <Image
            src="/yuga-logo-white.png"
            alt="YUGA"
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="leading-none">
          <div className="text-sm font-bold tracking-[0.15em] text-[var(--text-primary)]">YUGA</div>
          <div className="text-[10px] font-medium tracking-wide text-[var(--text-muted)]">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
              {group.section}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-[42px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-[var(--accent-muted)] text-[var(--accent-light)] border border-[var(--border-accent)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border-primary)] p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
            {admin.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-[var(--text-primary)]">{admin.name}</div>
            <div className="truncate text-xs text-[var(--text-muted)]">{admin.email}</div>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex min-h-[42px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)]"
        >
          <ExternalLink className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          View site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex min-h-[42px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-surface)]/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-white font-bold text-xs">
            Y
          </div>
          <span className="text-sm font-bold tracking-[0.15em] text-[var(--text-primary)]">
            YUGA Admin
          </span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{nav}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">{nav}</aside>
        </div>
      )}
    </>
  );
}
