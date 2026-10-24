import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Phone,
  Mail,
  CalendarDays,
  Ticket,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { getCommittee, getCommitteeEvents } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { COLLEGE, YUGA } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const committee = await getCommittee(slug);
  if (!committee) return { title: "Club Not Found · YUGA" };

  return {
    title: `${committee.name} · YUGA Student Wings & Clubs`,
    description: committee.description || "Official union subcommittee at GMC Kozhikode.",
  };
}

export default async function SubcommitteeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const committee = await getCommittee(slug);
  if (!committee) notFound();

  const events = await getCommitteeEvents(committee.id);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/20 via-white to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/subcommittees"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to all student wings</span>
        </Link>

        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Users className="h-3.5 w-3.5 text-emerald-700" />
            <span>Official Union Club / Wing</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          {committee.name}
        </h1>

        {/* Overview */}
        {committee.description && (
          <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
            {committee.description}
          </p>
        )}

        {/* Executive Committee Members */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Executive Office Bearers
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {committee.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs text-emerald-700 font-medium">
                      {member.position || "Convenor"}
                    </p>
                  </div>
                </div>

                {member.contact && (
                  <a
                    href={`tel:${member.contact}`}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    title={`Call ${member.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Associated Events Organized by this Club */}
        <div className="mt-14 pt-10 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">
            Initiatives & Events Organized ({events.length})
          </h2>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
              No public events currently scheduled under this club. Check back soon!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map((ev) => (
                <Link
                  key={ev.id}
                  href={`/events/${ev.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {ev.status}
                    </span>
                    <h4 className="mt-2 text-base font-bold text-slate-900 group-hover:text-emerald-800 leading-snug transition-colors">
                      {ev.title}
                    </h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-emerald-700" />
                      {formatDate(ev.date)}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
