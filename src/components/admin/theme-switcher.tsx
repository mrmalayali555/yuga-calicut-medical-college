"use client";

import React, { useState, useTransition } from "react";
import { Check, Sparkles, Shield, Palette, Eye } from "lucide-react";
import type { SiteTheme } from "@/lib/queries";
import { setSiteThemeAction } from "@/lib/actions/content";

interface ThemeSwitcherProps {
  initialTheme: SiteTheme;
}

export function ThemeSwitcher({ initialTheme }: ThemeSwitcherProps) {
  const [activeTheme, setActiveTheme] = useState<SiteTheme>(initialTheme);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSelect = (selected: SiteTheme) => {
    setActiveTheme(selected);
    setStatusMsg(`Activating ${selected === "obsidian-crimson" ? "Obsidian Crimson" : "Clinical Emerald"}...`);

    // Client-side instant sync
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", selected);
      if (selected === "obsidian-crimson") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      document.cookie = `yuga_theme=${selected};path=/;max-age=31536000;SameSite=Lax`;
      try {
        localStorage.setItem("yuga_theme", selected);
      } catch {}
    }

    // Server-side database persistence
    startTransition(async () => {
      try {
        await setSiteThemeAction(selected);
        setStatusMsg(
          `Theme successfully updated to ${
            selected === "obsidian-crimson" ? "Obsidian Crimson" : "Clinical Emerald"
          } across the site!`
        );
        setTimeout(() => setStatusMsg(null), 4000);
      } catch (err) {
        console.error("Theme update error:", err);
        setStatusMsg("Failed to persist theme to database. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="active_theme" value={activeTheme} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Public Website Aesthetic Architecture
          </p>
          <p className="text-sm text-slate-600">
            Switch the active visual design system across the entire YUGA portal. Changes apply live to all students and visitors.
          </p>
        </div>

        {statusMsg && (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 animate-fade-in-up">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            {statusMsg}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* OPTION 1: CLINICAL EMERALD */}
        <div
          onClick={() => handleSelect("emerald")}
          className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${
            activeTheme === "emerald"
              ? "border-emerald-600 bg-white shadow-lg ring-4 ring-emerald-500/10"
              : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
          }`}
        >
          {activeTheme === "emerald" && (
            <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-bold shadow-sm">
              <Check className="h-3.5 w-3.5" />
              <span>ACTIVE</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Clinical Emerald
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                  Default
                </span>
              </h4>
              <p className="text-xs text-slate-500">Pristine white canvas · Medical emerald · Crisp editorial</p>
            </div>
          </div>

          {/* Mini Interactive Visual Card Preview */}
          <div className="rounded-xl border border-slate-200 bg-[#f8faf8] p-4 space-y-3 pointer-events-none select-none">
            {/* Header Mock */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded bg-emerald-600" />
                <span className="text-[11px] font-bold tracking-wider text-slate-900">YUGA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-8 rounded bg-slate-200" />
                <span className="h-2 w-8 rounded bg-slate-200" />
                <span className="h-4 px-2 rounded-full bg-red-100 text-[9px] font-bold text-red-600 flex items-center">
                  SOS
                </span>
              </div>
            </div>

            {/* Hero Mock */}
            <div className="rounded-lg bg-white p-3 border border-slate-100 shadow-2xs">
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Live Tenure 2026–2027
              </div>
              <div className="text-xs font-bold text-slate-900">The Epoch of <span className="italic text-emerald-600 font-serif">Renewal & Care</span></div>
              <div className="mt-2 flex gap-2">
                <div className="h-5 px-2.5 rounded bg-emerald-600 text-[9px] font-semibold text-white flex items-center">
                  Explore Events
                </div>
                <div className="h-5 px-2 rounded bg-white border border-slate-200 text-[9px] font-medium text-slate-700 flex items-center">
                  Grievance Desk
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">100% WCAG AAA Legibility</span>
            <button
              type="button"
              disabled={isPending || activeTheme === "emerald"}
              className={`rounded-lg px-3 py-1.5 font-semibold text-xs transition-colors ${
                activeTheme === "emerald"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {activeTheme === "emerald" ? "Currently Active" : "Activate Emerald"}
            </button>
          </div>
        </div>

        {/* OPTION 2: OBSIDIAN CRIMSON */}
        <div
          onClick={() => handleSelect("obsidian-crimson")}
          className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${
            activeTheme === "obsidian-crimson"
              ? "border-[#e11d48] bg-[#121318] text-white shadow-xl shadow-rose-950/20 ring-4 ring-rose-500/20"
              : "border-slate-800 bg-[#0d0e13] text-white hover:border-rose-900/60"
          }`}
        >
          {activeTheme === "obsidian-crimson" && (
            <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-[#e11d48] text-white px-2.5 py-0.5 text-xs font-bold shadow-[0_0_12px_rgba(225,29,72,0.6)]">
              <Check className="h-3.5 w-3.5" />
              <span>ACTIVE</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e11d48]/20 text-[#ffb3b6] border border-[#e11d48]/40 shadow-[0_0_12px_rgba(225,29,72,0.3)]">
              <Shield className="h-5 w-5 text-[#e11d48]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Obsidian Crimson
                <span className="rounded bg-[#e11d48]/30 border border-[#e11d48]/50 px-1.5 py-0.5 text-[10px] font-semibold text-[#ffb3b6] uppercase tracking-wide">
                  Sovereign Vanguard
                </span>
              </h4>
              <p className="text-xs text-[#c6c6c7]">Obsidian #07080a · Coordinate red grid · Arterial crimson #e11d48</p>
            </div>
          </div>

          {/* Mini Interactive Visual Card Preview */}
          <div className="rounded-xl border border-white/10 bg-[#07080a] p-4 space-y-3 pointer-events-none select-none relative overflow-hidden">
            {/* Ambient mock glow */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#e11d48]/20 blur-xl" />

            {/* Header Mock */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
              <div className="flex items-center gap-1.5">
                <div className="h-4 px-1.5 rounded bg-[#e11d48] text-[9px] font-bold text-white flex items-center shadow-[0_0_8px_rgba(225,29,72,0.4)]">
                  YUGA
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tight text-white/90">Medical Union</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 px-2 rounded-full bg-[#e11d48] text-[9px] font-bold text-white flex items-center shadow-[0_0_8px_rgba(225,29,72,0.4)]">
                  SOS
                </span>
              </div>
            </div>

            {/* Hero Mock */}
            <div className="grid grid-cols-2 gap-2 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 rounded-full bg-white text-black px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e11d48]" />
                  TENURE 26–27
                </div>
                <div className="text-[11px] font-extrabold uppercase text-white leading-tight">
                  THE EPOCH OF <span className="text-[#ff2e56] italic font-serif">Renewal</span>
                </div>
                <div className="h-4 px-2 rounded bg-white text-black text-[8px] font-bold flex items-center shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  EXPLORE EVENTS →
                </div>
              </div>

              {/* Conclave Mock Card */}
              <div className="rounded bg-white p-2 text-black space-y-1 shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between text-[7px] font-bold text-[#e11d48]">
                  <span>CONCLAVE</span>
                  <span>MARCH 27</span>
                </div>
                <div className="text-[9px] font-extrabold leading-tight text-black line-clamp-1">
                  PULSE 2026: Sovereign
                </div>
                <div className="h-3.5 px-1.5 rounded bg-[#e11d48] text-white text-[7px] font-bold flex items-center justify-center">
                  Pass →
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#ffb3b6] font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Red Coordinate Grid & Bento
            </span>
            <button
              type="button"
              disabled={isPending || activeTheme === "obsidian-crimson"}
              className={`rounded-lg px-3 py-1.5 font-semibold text-xs transition-all ${
                activeTheme === "obsidian-crimson"
                  ? "bg-[#e11d48]/20 text-[#ffb3b6] border border-[#e11d48]/40 cursor-default"
                  : "bg-[#e11d48] text-white hover:bg-[#be0037] shadow-[0_0_12px_rgba(225,29,72,0.4)]"
              }`}
            >
              {activeTheme === "obsidian-crimson" ? "Currently Active" : "Activate Obsidian Crimson"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
