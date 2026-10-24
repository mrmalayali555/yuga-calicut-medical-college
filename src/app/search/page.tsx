import { Metadata } from "next";
import Link from "next/link";
import {
  Search as SearchIcon,
  CalendarDays,
  Bell,
  Trophy,
  HeartHandshake,
  Phone,
  Users,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { searchAll } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Site-Wide Search · YUGA",
  description:
    "Search across events, academic circulars, laurels, student interventions, and 24/7 hospital emergency contacts at GMC Kozhikode.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchAll(q) : null;

  const total = results
    ? results.pages.length +
      results.events.length +
      results.notifications.length +
      results.achievements.length +
      results.interventions.length +
      results.emergencyContacts.length +
      results.subcommittees.length
    : 0;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/20 via-white to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 mb-4 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Campus Intelligence
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
            Search Portal
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Find events, academic circulars, laurels, hotlines, and union initiatives.
          </p>
        </div>

        {/* Search Bar Form */}
        <form method="GET" action="/search" className="mb-10">
          <div className="relative flex items-center shadow-sm rounded-2xl overflow-hidden border border-slate-200 bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20">
            <SearchIcon className="absolute left-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by keywords, event name, batch, hotline, or committee..."
              autoFocus
              className="w-full pl-12 pr-28 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results Count */}
        {q && (
          <div className="mb-6 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
            <span>
              Found <strong className="text-slate-900">{total}</strong> match
              {total === 1 ? "" : "es"} for &ldquo;{q}&rdquo;
            </span>
            <Link
              href="/search"
              className="text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              Clear search
            </Link>
          </div>
        )}

        {/* Empty State / Initial Prompt */}
        {!q && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <SearchIcon className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">Start typing to search</h3>
            <p className="mt-1 text-xs text-slate-500">
              Popular searches: <Link href="/search?q=kuhs" className="text-emerald-700 font-semibold hover:underline">KUHS Exam</Link>,{" "}
              <Link href="/search?q=cmpl" className="text-emerald-700 font-semibold hover:underline">CMPL Cricket</Link>,{" "}
              <Link href="/search?q=casualty" className="text-emerald-700 font-semibold hover:underline">Casualty</Link>,{" "}
              <Link href="/search?q=blood" className="text-emerald-700 font-semibold hover:underline">Blood Bank</Link>
            </p>
          </div>
        )}

        {/* Zero Results State */}
        {results && total === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <h3 className="text-base font-bold text-slate-800">No matching results</h3>
            <p className="mt-1 text-xs text-slate-500">
              We couldn&apos;t find anything matching &ldquo;{q}&rdquo;. Try another term or check the navigation links.
            </p>
          </div>
        )}

        {/* Results List Grouped by Kind */}
        {results && total > 0 && (
          <div className="space-y-3">
            {/* Pages */}
            {results.pages.map((p) => (
              <ResultCard
                key={p.href}
                href={p.href}
                icon={<Globe className="h-4 w-4" />}
                type="Page"
                title={p.title}
                description={p.description}
              />
            ))}

            {/* Events */}
            {results.events.map((e) => (
              <ResultCard
                key={e.id}
                href={`/events/${e.slug}`}
                icon={<CalendarDays className="h-4 w-4" />}
                type="Event"
                title={e.title}
                description={formatDate(new Date(e.date))}
              />
            ))}

            {/* Notifications */}
            {results.notifications.map((n) => (
              <ResultCard
                key={n.id}
                href={`/notifications/${n.slug}`}
                icon={<Bell className="h-4 w-4" />}
                type="Circular"
                title={n.title}
                description={formatDate(new Date(n.date))}
              />
            ))}

            {/* Achievements */}
            {results.achievements.map((a) => (
              <ResultCard
                key={a.id}
                href={`/achievements/${a.slug}`}
                icon={<Trophy className="h-4 w-4" />}
                type="Laurel"
                title={a.title}
                description={formatDate(new Date(a.date))}
              />
            ))}

            {/* Interventions */}
            {results.interventions.map((i) => (
              <ResultCard
                key={i.id}
                href={`/interventions/${i.slug}`}
                icon={<HeartHandshake className="h-4 w-4" />}
                type="Intervention"
                title={i.title}
                description={formatDate(new Date(i.date))}
              />
            ))}

            {/* Emergency Contacts */}
            {results.emergencyContacts.map((c) => (
              <ResultCard
                key={c.id}
                href="/emergency"
                icon={<Phone className="h-4 w-4" />}
                type="Emergency"
                title={c.name}
                description={`${c.category} · Tap to call ${c.phone}`}
              />
            ))}

            {/* Subcommittees */}
            {results.subcommittees.map((s) => (
              <ResultCard
                key={s.id}
                href={`/subcommittees/${s.slug}`}
                icon={<Users className="h-4 w-4" />}
                type="Club"
                title={s.name}
                description={s.description || "Union subcommittee"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({
  href,
  icon,
  type,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  type: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md">
              {type}
            </span>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 truncate">
              {title}
            </h4>
          </div>
          <p className="mt-1 text-xs text-slate-500 truncate">{description}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
