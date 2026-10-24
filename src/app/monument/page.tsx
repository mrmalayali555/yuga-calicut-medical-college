import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Layers,
  Sparkles,
  Shield,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Architectural Growth Study · 3D Heritage Monument | YUGA College Union",
  description:
    "Interactive 3D procedural tenshu construction study for YUGA College Union at Government Medical College, Kozhikode. An architectural exploration of collective endurance and structural integrity.",
};

export default function MonumentPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-root)] text-[var(--text-primary)] pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Return to Union Portal</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Compass className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
              <span>Three.js Procedural WebGL</span>
            </span>
            <a
              href="/towers.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:border-emerald-300 transition-colors shadow-sm"
            >
              <span>Raw Canvas</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Title Block */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-wider uppercase text-emerald-700 mb-2">
            Campus Heritage & Interactive Visualisation
          </p>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-slate-900">
            The Union Monument:{" "}
            <span className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
              Tenshu Growth Study
            </span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-normal">
            A procedural construction study depicting how foundational stone, interlocking timber framework, and protective eaves assemble sequentially into an enduring civic edifice.
          </p>
        </div>

        {/* 3D Main Stage Window */}
        <div className="relative rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-lg">
          {/* Top Bar with Status */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-3 font-mono text-xs text-slate-600 font-semibold">
                Towers / 365 Frames / Calicut Medicos Memorial
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse-soft" />
              <span>Interactive Controls Live</span>
            </div>
          </div>

          {/* Interactive WebGL Iframe */}
          <div className="relative w-full h-[620px] sm:h-[720px] bg-[#ecdcbc]">
            <iframe
              src="/towers.html"
              title="Interactive 3D Tenshu Growth Study Monument"
              className="w-full h-full border-0 select-none"
              allow="autoplay"
            />
          </div>

          {/* Bottom Architectural Legend Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-t border-slate-200 bg-white p-6 sm:p-8 text-xs text-slate-600">
            <div className="pr-4 space-y-1 pb-4 md:pb-0">
              <div className="flex items-center gap-1.5 font-bold text-sm text-amber-800">
                <Layers className="h-4 w-4 text-amber-600" />
                <span>1. The Ishigaki Bedrock (1957)</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Represents our 68-year collegiate foundation — rigorous preclinical study, anatomy dissections, and medical ethics that ground every physician.
              </p>
            </div>

            <div className="px-0 md:px-5 space-y-1 py-4 md:py-0">
              <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-800">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>2. The Interlocking Frame</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Represents democratic representation — 16 student subcommittees, casualty duty rosters, and collegiate solidarity interlocking under pressure.
              </p>
            </div>

            <div className="pl-0 md:pl-5 space-y-1 pt-4 md:pt-0">
              <div className="flex items-center gap-1.5 font-bold text-sm text-teal-800">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span>3. The Ascending Pinnacle</span>
              </div>
              <p className="leading-relaxed text-slate-600">
                Represents the healing oath and public service — sheltering millions of patients across Kerala through round-the-clock emergency care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
