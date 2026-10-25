"use client";

import { useState, useTransition } from "react";
import { updateAchievementsSliderAction } from "@/lib/actions/achievements";
import { Sliders, Clock, Play, CheckCircle2, AlertCircle } from "lucide-react";

interface AchievementsSliderControlProps {
  initialSettings: {
    autoplay: boolean;
    interval: number;
  };
}

export function AchievementsSliderControl({ initialSettings }: AchievementsSliderControlProps) {
  const [autoplay, setAutoplay] = useState(initialSettings.autoplay);
  const [interval, setInterval] = useState(initialSettings.interval);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    // Client-side validation
    let validInterval = Number(interval);
    if (isNaN(validInterval) || validInterval < 2) {
      validInterval = 2;
    } else if (validInterval > 30) {
      validInterval = 30;
    }
    setInterval(validInterval);

    setStatus("idle");
    setErrorMessage("");

    startTransition(async () => {
      try {
        const res = await updateAchievementsSliderAction({
          autoplay,
          interval: validInterval,
        });
        if (res.success) {
          setStatus("saved");
          setTimeout(() => setStatus("idle"), 3500);
        } else {
          setStatus("error");
          setErrorMessage("Failed to save slider settings.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(err?.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--border-primary)]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff2e56]/10 text-[#ff2e56]">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Honors &amp; Laurels Carousel Settings
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Manage automatic slide timing and autoplay across desktop &amp; mobile devices.
            </p>
          </div>
        </div>

        {status === "saved" && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 animate-fade-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Saved &amp; Live
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Toggle Autoplay */}
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
          <div className="space-y-0.5">
            <label htmlFor="achievements-autoplay-toggle" className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 cursor-pointer">
              <Play className={`h-4 w-4 ${autoplay ? "text-[#ff2e56]" : "text-[var(--text-muted)]"}`} />
              Enable Automatic Sliding
            </label>
            <p className="text-xs text-[var(--text-muted)]">
              Automatically advance to the next achievement card when active.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="achievements-autoplay-toggle"
              type="checkbox"
              name="achievements_autoplay"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff2e56]"></div>
          </label>
        </div>

        {/* Slide Interval Input */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label htmlFor="achievements-interval-input" className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--accent)]" />
                Slide Interval Duration
              </label>
              <p className="text-xs text-[var(--text-muted)]">
                Configurable duration between slides (minimum 2 seconds, maximum 30 seconds).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="achievements-interval-input"
                type="number"
                name="achievements_interval"
                min={2}
                max={30}
                step={1}
                value={interval}
                onChange={(e) => setInterval(Math.max(2, Math.min(30, Number(e.target.value))))}
                className="w-20 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] px-3 py-1.5 text-center font-mono text-sm font-bold text-[var(--text-primary)] focus:border-[#ff2e56] focus:outline-none"
              />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">seconds</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--border-primary)]/50">
            <span className="text-[11px] font-medium text-[var(--text-muted)]">Quick presets:</span>
            {[2, 3, 5, 8, 10].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setInterval(sec)}
                className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors ${
                  interval === sec
                    ? "bg-[#ff2e56] text-white font-bold"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)]"
                }`}
              >
                {sec}s{sec === 3 ? " (Default)" : ""}
              </button>
            ))}
          </div>
        </div>

        {status === "error" && (
          <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="btn-primary text-xs font-semibold py-2 px-4 shadow-sm"
          >
            {isPending ? "Saving Carousel Settings..." : "Save Carousel Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
