"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Loader2,
  Check,
  Upload,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import type { ClubSlug, ClubSettings, ClubStat, ClubInitiative, ClubAchievement, ClubTeamMember } from "@/lib/actions/clubs";

// ─── Input Primitives ─────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <p className="mt-1 text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${inputCls} resize-y min-h-[80px]`}
      />
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

// ─── Logo Uploader ────────────────────────────────────────────────────────────

function LogoUploader({
  slug,
  currentLogo,
  onLogoChange,
}: {
  slug: ClubSlug;
  currentLogo: string;
  onLogoChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setUploaded(false);

    const fd = new FormData();
    fd.append("logo", file);
    fd.append("slug", slug);

    try {
      const res = await fetch("/api/admin/club-logo", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload failed.");
      } else {
        onLogoChange(data.url);
        setUploaded(true);
        setTimeout(() => setUploaded(false), 3000);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Club Logo
      </label>
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className={`relative h-20 w-20 rounded-2xl border-2 border-[var(--border-primary)] overflow-hidden shadow-sm shrink-0 ${
          slug === "praanah" ? "bg-[#18110b]" : slug === "ocha" ? "bg-[#140b22]" : "bg-white"
        }`}>
          {currentLogo ? (
            <Image src={currentLogo} alt="Club Logo" fill className="object-contain p-1.5" sizes="80px" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {/* Upload Button */}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[var(--accent)]" />
            ) : uploaded ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{uploading ? "Uploading…" : uploaded ? "Uploaded!" : "Upload New Logo"}</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>

          {/* Or paste URL */}
          <input
            type="url"
            value={currentLogo}
            onChange={(e) => onLogoChange(e.target.value)}
            placeholder="Or paste an image URL…"
            className={`${inputCls} text-xs`}
          />
          <p className="text-[11px] text-[var(--text-muted)]">PNG, JPEG, WebP or SVG. Max 8 MB.</p>
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Stats Editor ─────────────────────────────────────────────────────────────

function StatsEditor({
  stats,
  onChange,
}: {
  stats: ClubStat[];
  onChange: (s: ClubStat[]) => void;
}) {
  const update = (idx: number, field: keyof ClubStat, val: string) => {
    onChange(stats.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };
  const remove = (idx: number) => onChange(stats.filter((_, i) => i !== idx));
  const add = () => onChange([...stats, { label: "", value: "", hint: "" }]);

  return (
    <div className="space-y-3">
      {stats.map((s, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end p-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)]"
        >
          <input
            value={s.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Label (e.g. Active Donors)"
            className={inputCls}
          />
          <input
            value={s.value}
            onChange={(e) => update(i, "value", e.target.value)}
            placeholder="Value (e.g. 1,850+)"
            className={inputCls}
          />
          <div className="flex gap-2">
            <input
              value={s.hint}
              onChange={(e) => update(i, "hint", e.target.value)}
              placeholder="Hint (small caption)"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
              title="Remove stat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[var(--border-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Stat
      </button>
    </div>
  );
}

// ─── Initiatives Editor ───────────────────────────────────────────────────────

function InitiativesEditor({
  items,
  onChange,
}: {
  items: ClubInitiative[];
  onChange: (v: ClubInitiative[]) => void;
}) {
  const update = (idx: number, field: keyof ClubInitiative, val: string) => {
    onChange(items.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () =>
    onChange([...items, { title: "", description: "", category: "", status: "Active" }]);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Initiative {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <input
            value={item.title}
            onChange={(e) => update(i, "title", e.target.value)}
            placeholder="Initiative Title"
            className={inputCls}
          />
          <textarea
            value={item.description}
            onChange={(e) => update(i, "description", e.target.value)}
            placeholder="Brief description…"
            rows={2}
            className={`${inputCls} resize-y`}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={item.category}
              onChange={(e) => update(i, "category", e.target.value)}
              placeholder="Category (e.g. Emergency)"
              className={inputCls}
            />
            <input
              value={item.status}
              onChange={(e) => update(i, "status", e.target.value)}
              placeholder="Status (e.g. Live 24/7)"
              className={inputCls}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[var(--border-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Initiative
      </button>
    </div>
  );
}

// ─── Achievements Editor ──────────────────────────────────────────────────────

function AchievementsEditor({
  items,
  onChange,
}: {
  items: ClubAchievement[];
  onChange: (v: ClubAchievement[]) => void;
}) {
  const update = (idx: number, field: keyof ClubAchievement, val: string) => {
    onChange(items.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const add = () => onChange([...items, { title: "", year: "", awarder: "" }]);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end p-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)]"
        >
          <input
            value={item.title}
            onChange={(e) => update(i, "title", e.target.value)}
            placeholder="Award / Achievement Title"
            className={`${inputCls} sm:col-span-3`}
          />
          <input
            value={item.year}
            onChange={(e) => update(i, "year", e.target.value)}
            placeholder="Year (e.g. 2024)"
            className={inputCls}
          />
          <div className="sm:col-span-2 flex gap-2">
            <input
              value={item.awarder}
              onChange={(e) => update(i, "awarder", e.target.value)}
              placeholder="Awarding Body"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[var(--border-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Achievement
      </button>
    </div>
  );
}

// ─── Team Editor ──────────────────────────────────────────────────────────────

function TeamEditor({
  members,
  onChange,
}: {
  members: ClubTeamMember[];
  onChange: (v: ClubTeamMember[]) => void;
}) {
  const update = (idx: number, field: keyof ClubTeamMember, val: string) => {
    onChange(members.map((m, i) => (i === idx ? { ...m, [field]: val } : m)));
  };
  const remove = (idx: number) => onChange(members.filter((_, i) => i !== idx));
  const add = () =>
    onChange([...members, { role: "", name: "", batch: "", phone: "", email: "" }]);

  return (
    <div className="space-y-3">
      {members.map((m, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Member {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={m.role}
              onChange={(e) => update(i, "role", e.target.value)}
              placeholder="Role (e.g. Convenor)"
              className={inputCls}
            />
            <input
              value={m.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Full Name"
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              value={m.batch}
              onChange={(e) => update(i, "batch", e.target.value)}
              placeholder="Batch / Year"
              className={inputCls}
            />
            <input
              value={m.phone}
              onChange={(e) => update(i, "phone", e.target.value)}
              placeholder="Phone"
              className={inputCls}
            />
            <input
              value={m.email}
              onChange={(e) => update(i, "email", e.target.value)}
              placeholder="Email"
              type="email"
              className={inputCls}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[var(--border-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Team Member
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  slug: ClubSlug;
  defaults: ClubSettings;
  saved: ClubSettings | null;
}

export function ClubAdminEditor({ slug, defaults, saved }: Props) {
  const initial: ClubSettings = {
    name: saved?.name ?? defaults.name ?? "",
    malayalam: saved?.malayalam ?? defaults.malayalam ?? "",
    tagline: saved?.tagline ?? defaults.tagline ?? "",
    category: saved?.category ?? defaults.category ?? "",
    founded: saved?.founded ?? defaults.founded ?? "",
    logo: saved?.logo ?? defaults.logo ?? "",
    accent: saved?.accent ?? defaults.accent ?? "",
    accentRgb: saved?.accentRgb ?? defaults.accentRgb ?? "",
    heroGradient: saved?.heroGradient ?? defaults.heroGradient ?? "",
    mission: saved?.mission ?? defaults.mission ?? "",
    vision: saved?.vision ?? defaults.vision ?? "",
    heroDescription: saved?.heroDescription ?? defaults.heroDescription ?? "",
    stats: saved?.stats ?? defaults.stats ?? [],
    initiatives: saved?.initiatives ?? defaults.initiatives ?? [],
    achievements: saved?.achievements ?? defaults.achievements ?? [],
    team: saved?.team ?? defaults.team ?? [],
  };

  const [settings, setSettings] = useState<ClubSettings>(initial);
  const [isPending, startTransition] = useTransition();
  const [saved2, setSaved2] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof ClubSettings, val: unknown) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const handleReset = () => {
    setSettings(initial);
    setSaved2(false);
    setError(null);
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/club-settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, settings }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d.error ?? "Failed to save. Try again.");
          return;
        }
        setSaved2(true);
        setTimeout(() => setSaved2(false), 3000);
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-[var(--text-muted)]">
            Changes here override the default portal content.{" "}
            <a
              href={`/clubs/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline font-semibold"
            >
              Preview live <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg shadow-[var(--accent)]/25"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved2 ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isPending ? "Saving…" : saved2 ? "Saved!" : "Save All Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 1. Logo */}
      <Section title="🖼️ Club Logo">
        <LogoUploader
          slug={slug}
          currentLogo={settings.logo ?? ""}
          onLogoChange={(url) => set("logo", url)}
        />
      </Section>

      {/* 2. Identity */}
      <Section title="🏷️ Identity & Branding">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Club Name (English)" value={settings.name ?? ""} onChange={(v) => set("name", v)} placeholder="Jeevanam" />
          <Field label="Malayalam Name" value={settings.malayalam ?? ""} onChange={(v) => set("malayalam", v)} placeholder="ജീവനം" />
          <Field label="Tagline" value={settings.tagline ?? ""} onChange={(v) => set("tagline", v)} placeholder="Voluntary Blood Donation & Emergency Wing" />
          <Field label="Category" value={settings.category ?? ""} onChange={(v) => set("category", v)} placeholder="Emergency & Social Service" />
          <Field label="Founded / Est." value={settings.founded ?? ""} onChange={(v) => set("founded", v)} placeholder="Est. 2008" />
          <Field label="Accent Colour (hex)" value={settings.accent ?? ""} onChange={(v) => set("accent", v)} placeholder="#dc2626" type="color" />
        </div>
        <Field
          label="Accent RGB (for CSS rgba)"
          value={settings.accentRgb ?? ""}
          onChange={(v) => set("accentRgb", v)}
          placeholder="220, 38, 38"
          hint="Used in gradient overlays — copy the R, G, B numbers separated by commas"
        />
        <Field
          label="Hero Gradient (Tailwind classes)"
          value={settings.heroGradient ?? ""}
          onChange={(v) => set("heroGradient", v)}
          placeholder="from-red-950 via-slate-900 to-rose-950"
          hint="Only applies to Praanah and Ocha (Jeevanam and Godha use custom hero components)"
        />
      </Section>

      {/* 3. Content */}
      <Section title="📝 Portal Content">
        <TextArea
          label="Hero Description"
          value={settings.heroDescription ?? ""}
          onChange={(v) => set("heroDescription", v)}
          placeholder="Short compelling description shown on the hero section…"
          rows={3}
        />
        <TextArea
          label="Mission"
          value={settings.mission ?? ""}
          onChange={(v) => set("mission", v)}
          placeholder="Our Mission statement…"
          rows={3}
        />
        <TextArea
          label="Long-Term Vision"
          value={settings.vision ?? ""}
          onChange={(v) => set("vision", v)}
          placeholder="Our Vision for the future…"
          rows={3}
        />
      </Section>

      {/* 4. Stats */}
      <Section title="📊 Statistics Strip" defaultOpen={false}>
        <StatsEditor
          stats={settings.stats ?? []}
          onChange={(s) => set("stats", s)}
        />
      </Section>

      {/* 5. Initiatives */}
      <Section title="🚀 Flagship Initiatives" defaultOpen={false}>
        <InitiativesEditor
          items={settings.initiatives ?? []}
          onChange={(v) => set("initiatives", v)}
        />
      </Section>

      {/* 6. Achievements */}
      <Section title="🏆 Honors & Achievements" defaultOpen={false}>
        <AchievementsEditor
          items={settings.achievements ?? []}
          onChange={(v) => set("achievements", v)}
        />
      </Section>

      {/* 7. Team */}
      <Section title="👥 Executive Council / Team" defaultOpen={false}>
        <TeamEditor
          members={settings.team ?? []}
          onChange={(v) => set("team", v)}
        />
      </Section>

      {/* Save Footer */}
      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60 shadow-xl shadow-[var(--accent)]/30 ring-2 ring-white/20"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved2 ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Saving…" : saved2 ? "All Changes Saved!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
