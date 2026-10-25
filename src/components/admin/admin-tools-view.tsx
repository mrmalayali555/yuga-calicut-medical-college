"use client";

import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import {
  Link2,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Sparkles,
  Download,
  Printer,
  MousePointerClick,
  Layers,
  ArrowRight,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { createShortLink, deleteShortLink, ShortLink } from "@/lib/actions/tools";

interface AdminToolsViewProps {
  initialLinks: ShortLink[];
  events: { id: string; title: string; slug: string }[];
  forms: { id: string; title: string; slug: string }[];
}

const COLOR_PRESETS = [
  {
    name: "Obsidian Crimson (Dark)",
    dark: "#e11d48",
    light: "#0b0b0e",
    border: "border-rose-500/30",
  },
  {
    name: "Classic Monochrome",
    dark: "#000000",
    light: "#ffffff",
    border: "border-slate-300",
  },
  {
    name: "Crimson on White",
    dark: "#e11d48",
    light: "#ffffff",
    border: "border-rose-200",
  },
  {
    name: "Emerald Green",
    dark: "#059669",
    light: "#ffffff",
    border: "border-emerald-200",
  },
];

export function AdminToolsView({
  initialLinks,
  events,
  forms,
}: AdminToolsViewProps) {
  const [activeTab, setActiveTab] = useState<"shortener" | "qr">("shortener");

  // Shortener Form State
  const [links, setLinks] = useState<ShortLink[]>(initialLinks);
  const [slug, setSlug] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [title, setTitle] = useState("");
  const [savingLink, setSavingLink] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // QR Code Studio State
  const [qrUrl, setQrUrl] = useState("https://yugagmc.in");
  const [qrTitle, setQrTitle] = useState("YUGA Official Conclave");
  const [colorPreset, setColorPreset] = useState(0);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrSvg, setQrSvg] = useState<string>("");
  const [copiedQr, setCopiedQr] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set initial QR URL from domain if in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      setQrUrl(window.location.origin);
    }
  }, []);

  // Generate QR Canvas and SVG whenever options change
  useEffect(() => {
    if (!qrUrl) return;

    const preset = COLOR_PRESETS[colorPreset];

    // Generate high-res canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;

    QRCode.toCanvas(
      canvas,
      qrUrl,
      {
        width: 1000,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: preset.dark,
          light: preset.light,
        },
      },
      (err) => {
        if (err) {
          console.error("QR canvas error:", err);
          return;
        }

        const ctx = canvas.getContext("2d");
        if (ctx && includeLogo) {
          // Draw center emblem circle badge
          const center = 500;
          const radius = 90;

          ctx.save();
          ctx.beginPath();
          ctx.arc(center, center, radius, 0, Math.PI * 2);
          ctx.fillStyle = preset.light;
          ctx.fill();
          ctx.lineWidth = 12;
          ctx.strokeStyle = preset.dark;
          ctx.stroke();

          // Draw YUGA lettermark or text in center
          ctx.fillStyle = preset.dark;
          ctx.font = "bold 56px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("YUGA", center, center);
          ctx.restore();
        }

        setQrDataUrl(canvas.toDataURL("image/png"));
      }
    );

    // Generate SVG string
    QRCode.toString(
      qrUrl,
      {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: preset.dark,
          light: preset.light,
        },
      },
      (err, svg) => {
        if (!err && svg) {
          setQrSvg(svg);
        }
      }
    );
  }, [qrUrl, colorPreset, includeLogo]);

  // Handle Short Link Submission
  const handleCreateShortLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLink(true);
    setFormError(null);

    const fd = new FormData();
    fd.append("slug", slug);
    fd.append("targetUrl", targetUrl);
    fd.append("title", title);

    const res = await createShortLink(fd);
    if (!res.success) {
      setFormError(res.error || "Failed to create short link.");
      setSavingLink(false);
      return;
    }

    // Refresh local list
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, "");

    const newLink: ShortLink = {
      id: `sl-${Date.now()}`,
      slug: cleanSlug,
      targetUrl,
      title: title || cleanSlug,
      clicks: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLinks((prev) => [newLink, ...prev.filter((l) => l.slug !== cleanSlug)]);
    setSlug("");
    setTargetUrl("");
    setTitle("");
    setSavingLink(false);
  };

  const handleDelete = async (targetSlug: string) => {
    if (!confirm(`Are you sure you want to delete /s/${targetSlug}?`)) return;
    setLinks((prev) => prev.filter((l) => l.slug !== targetSlug));
    await deleteShortLink(targetSlug);
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(identifier);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const downloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `yuga-qr-${qrTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
    a.click();
  };

  const downloadSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yuga-qr-${qrTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printFlyer = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${qrTitle} - Official QR</title>
          <style>
            @page { size: A4 portrait; margin: 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; color: #111; margin: 0; padding: 20px; }
            .header { border-bottom: 3px solid #e11d48; padding-bottom: 20px; margin-bottom: 40px; }
            .college { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #666; font-weight: 700; }
            .union { font-size: 32px; font-weight: 900; margin: 8px 0; color: #0b0b0e; }
            .event-title { font-size: 24px; font-weight: 700; color: #e11d48; margin-top: 15px; }
            .qr-box { margin: 40px auto; width: 340px; height: 340px; border: 2px solid #eee; padding: 20px; border-radius: 20px; }
            .qr-box img { width: 100%; height: 100%; object-fit: contain; }
            .url { font-family: monospace; font-size: 16px; font-weight: 700; color: #333; margin-top: 20px; word-break: break-all; }
            .footer { margin-top: 50px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="college">Government Medical College, Kozhikode</div>
            <div class="union">YUGA College Union</div>
            <div class="event-title">${qrTitle}</div>
          </div>
          <div class="qr-box">
            <img src="${qrDataUrl}" alt="QR Code" />
          </div>
          <div class="url">Scan to Open: ${qrUrl}</div>
          <div class="footer">
            Official Union Portal &bull; Verified GMC Kozhikode
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const originUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-primary)]">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-subtle)] border border-[var(--border-primary)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>Campus Utility Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            Admin Tools Studio
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">
            Create branded short links (`/s/[slug]`) and generate high-resolution QR codes with center YUGA crests.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("shortener")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "shortener"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Link Shortener</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "qr"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>QR Code Generator</span>
          </button>
        </div>
      </div>

      {/* ======================= TAB 1: LINK SHORTENER ======================= */}
      {activeTab === "shortener" && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Create Form */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 shadow-xs sticky top-24">
              <h2 className="text-base font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-[var(--accent)]" />
                <span>Create New Short Link</span>
              </h2>
              <p className="text-xs text-[var(--text-muted)] mb-5">
                Generates a quick-share link under <span className="font-mono text-[var(--accent)]">/s/[slug]</span>.
              </p>

              <form onSubmit={handleCreateShortLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Link Title / Label
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Arts Fest Entry Passes"
                    className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Custom Slug *
                  </label>
                  <div className="flex items-center rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] overflow-hidden focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]">
                    <span className="px-3 py-2.5 bg-[var(--bg-elevated)] text-[var(--text-muted)] text-xs font-mono border-r border-[var(--border-primary)]">
                      /s/
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="artsfest"
                      className="w-full bg-transparent px-3 py-2.5 text-xs text-[var(--text-primary)] font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                    Destination URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://... or /events/caduceus-night"
                    className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  />

                  {/* Quick Pick Links */}
                  <div className="mt-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] mb-1.5">
                      Quick Pick Campus Destination:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {events.slice(0, 3).map((ev) => (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => {
                            setTargetUrl(`/events/${ev.slug}`);
                            if (!title) setTitle(ev.title);
                            if (!slug) setSlug(ev.slug.slice(0, 12));
                          }}
                          className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] px-2 py-1 text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                        >
                          {ev.title}
                        </button>
                      ))}
                      {forms.slice(0, 2).map((fm) => (
                        <button
                          key={fm.id}
                          type="button"
                          onClick={() => {
                            setTargetUrl(`/forms/${fm.slug}`);
                            if (!title) setTitle(fm.title);
                            if (!slug) setSlug(fm.slug.slice(0, 12));
                          }}
                          className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] px-2 py-1 text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                        >
                          Form: {fm.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {formError && (
                  <p className="text-xs text-red-400 font-medium">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={savingLink}
                  className="w-full mt-2 rounded-xl bg-[var(--accent)] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--accent-dark)] transition-transform active:scale-98 disabled:opacity-50"
                >
                  {savingLink ? "Creating Short Link…" : "Save & Generate Short URL"}
                </button>
              </form>
            </div>
          </div>

          {/* Existing Links List */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    Configured Short Links ({links.length})
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Real-time redirect and visitor click tracking.
                  </p>
                </div>
              </div>

              {links.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--border-primary)] p-10 text-center text-xs text-[var(--text-muted)]">
                  No shortened links created yet. Use the form on the left to create your first link.
                </div>
              ) : (
                <div className="space-y-3">
                  {links.map((link) => {
                    const fullShortUrl = `${originUrl}/s/${link.slug}`;
                    const isCopied = copiedSlug === link.slug;

                    return (
                      <div
                        key={link.id || link.slug}
                        className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 shadow-2xs hover:border-[var(--accent)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                              {link.title || link.slug}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] font-mono font-bold text-[var(--accent)]">
                              <MousePointerClick className="h-3 w-3" />
                              <span>{link.clicks || 0} visits</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-mono font-semibold text-[var(--accent)]">
                              /s/{link.slug}
                            </span>
                            <span className="text-[var(--text-faint)]">&rarr;</span>
                            <span className="text-[var(--text-secondary)] truncate max-w-[200px] sm:max-w-[280px]">
                              {link.targetUrl}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(fullShortUrl, link.slug)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
                            title="Copy link"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setQrUrl(fullShortUrl);
                              setQrTitle(link.title || link.slug);
                              setActiveTab("qr");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition-colors"
                            title="Generate QR code for this link"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            <span>QR</span>
                          </button>

                          <a
                            href={`/s/${link.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                            title="Test redirect"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDelete(link.slug)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            title="Delete short link"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================= TAB 2: LINK TO QR CODE GENERATOR ======================= */}
      {activeTab === "qr" && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <QrCode className="h-4 w-4 text-[var(--accent)]" />
                <span>QR Code Customization</span>
              </h2>

              {/* Flyer Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Flyer / Event Title
                </label>
                <input
                  type="text"
                  value={qrTitle}
                  onChange={(e) => setQrTitle(e.target.value)}
                  placeholder="e.g. Arts Fest Official Passes"
                  className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              {/* Destination URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                  Link / Destination URL *
                </label>
                <input
                  type="text"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] font-mono outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                />

                {/* Preload from configured links */}
                {links.length > 0 && (
                  <div className="mt-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-faint)] mb-1.5">
                      Or pick from Short Links:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {links.slice(0, 4).map((l) => (
                        <button
                          key={l.slug}
                          type="button"
                          onClick={() => {
                            setQrUrl(`${originUrl}/s/${l.slug}`);
                            setQrTitle(l.title || l.slug);
                          }}
                          className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)] px-2 py-1 text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                        >
                          /s/{l.slug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color Scheme Presets */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Color Theme Presets
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {COLOR_PRESETS.map((preset, idx) => {
                    const active = colorPreset === idx;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setColorPreset(idx)}
                        className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all ${
                          active
                            ? "border-[var(--accent)] bg-[var(--accent-subtle)] ring-1 ring-[var(--accent)]"
                            : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
                        }`}
                      >
                        <div
                          className="h-6 w-6 rounded-lg border border-black/20 shrink-0"
                          style={{ backgroundColor: preset.dark }}
                        />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-[var(--text-primary)] truncate">
                            {preset.name}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* YUGA Center Crest Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-3.5">
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    Center YUGA Emblem Badge
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Embeds official union badge in the center of the code
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeLogo(!includeLogo)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    includeLogo ? "bg-[var(--accent)]" : "bg-[var(--border-primary)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      includeLogo ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview & Export Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6 shadow-xs flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] mb-2">
                Live High-Definition QR Preview
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                {qrTitle}
              </h3>
              <p className="text-xs font-mono text-[var(--text-muted)] mb-6 truncate max-w-sm">
                {qrUrl}
              </p>

              {/* The QR Container */}
              <div className="p-4 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-lg mb-6 flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Generated QR"
                    className="h-64 w-64 rounded-2xl object-contain shadow-xs"
                  />
                ) : (
                  <div className="h-64 w-64 flex items-center justify-center text-xs text-[var(--text-muted)]">
                    Generating preview…
                  </div>
                )}
              </div>

              {/* Export Buttons */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={downloadPng}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] py-2.5 px-3 text-xs font-bold text-white shadow hover:bg-[var(--accent-dark)] transition-transform active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={downloadSvg}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] py-2.5 px-3 text-xs font-bold text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download SVG</span>
                </button>

                <button
                  type="button"
                  onClick={printFlyer}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] py-2.5 px-3 text-xs font-bold text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Poster</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
