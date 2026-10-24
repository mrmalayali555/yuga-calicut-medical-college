import Link from "next/link";
import { type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="w-full sm:w-auto min-w-0">
        <h1 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl lg:text-3xl break-words">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)] break-words">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> {action.label}
        </Link>
      )}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 sm:p-6 min-w-0 max-w-full overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--border-accent)] min-w-0 max-w-full">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)]">
          {icon}
        </div>
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-bold text-[var(--text-primary)] break-words">
        {value}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-[var(--text-muted)] break-words line-clamp-2">
        {label}
      </div>
    </div>
  );
  return href ? <Link href={href} className="min-w-0 max-w-full">{inner}</Link> : inner;
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-surface)] px-6 py-12 text-center text-sm text-[var(--text-muted)]">
      {children}
    </div>
  );
}

const statusClasses: Record<string, string> = {
  new: "bg-[var(--accent-muted)] text-[var(--accent-light)]",
  read: "bg-blue-500/15 text-blue-400",
  resolved: "bg-green-500/15 text-green-400",
  upcoming: "bg-blue-500/15 text-blue-400",
  completed: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
  sports: "bg-blue-500/15 text-blue-400",
  arts: "bg-[var(--accent-muted)] text-[var(--accent-light)]",
  academics: "bg-green-500/15 text-green-400",
  general: "bg-orange-500/15 text-orange-400",
  published: "bg-green-500/15 text-green-400",
  draft: "bg-amber-500/15 text-amber-400",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        statusClasses[status] ?? "bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
      )}
    >
      {status}
    </span>
  );
}
