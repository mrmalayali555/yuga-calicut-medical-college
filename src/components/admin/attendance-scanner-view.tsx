"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ScanLine,
  Camera,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Download,
  Users,
  ShieldCheck,
  UserCheck,
  Clock,
  Sparkles,
  RefreshCw,
  Volume2,
  VolumeX,
  FlipHorizontal,
  ChevronRight,
  Filter,
} from "lucide-react";
import { scanCheckIn, toggleAttendance, AttendanceItem } from "@/lib/actions/attendance";

interface AttendanceScannerViewProps {
  initialData: {
    totalRegistered: number;
    totalAttended: number;
    totalPending: number;
    attendanceRate: number;
    recentScans: AttendanceItem[];
    attendees: AttendanceItem[];
  };
  adminName: string;
}

// Sound synthesizer using Web Audio API (zero audio files needed)
function playTone(type: "success" | "warning" | "error") {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "success") {
      // Pleasant double-chime (880Hz -> 1320Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);

      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1320, ctx.currentTime);
        gain2.gain.setValueAtTime(0.25, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.25);
      }, 100);
    } else if (type === "warning") {
      // Lower double buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      // Error buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Audio context may be restricted by autoplay policy
  }
}

export function AttendanceScannerView({ initialData, adminName }: AttendanceScannerViewProps) {
  const [data, setData] = useState(initialData);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraError, setCameraError] = useState("");

  // Scan Result Feedback Card
  const [lastScanResult, setLastScanResult] = useState<{
    status: "CHECKED_IN" | "ALREADY_CHECKED_IN" | "NOT_FOUND";
    message: string;
    attendee?: AttendanceItem;
    timestamp: string;
  } | null>(null);

  // Manual Check-in Input
  const [manualCode, setManualCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter & Search in Attendee Table
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ATTENDED" | "PENDING">("ALL");

  const scannerRef = useRef<any>(null);
  const isScanningLocked = useRef(false);

  // Start Camera QR Scanner
  const startScanner = async (facing: "environment" | "user" = facingMode) => {
    try {
      setCameraError("");
      const { Html5Qrcode } = await import("html5-qrcode");

      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
        } catch {}
      }

      const html5QrCode = new Html5Qrcode("qr-reader-container");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: facing },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          if (isScanningLocked.current) return;
          isScanningLocked.current = true;

          // Process the scan!
          await handleScan(decodedText);

          // Cooldown before scanning next ticket
          setTimeout(() => {
            isScanningLocked.current = false;
          }, 2500);
        },
        () => {
          // ignore scan frame misses
        }
      );

      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera scanner error:", err);
      setCameraError(
        err?.message || "Could not access device camera. Please check camera permissions in browser."
      );
      setCameraActive(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch {}
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  const flipCamera = async () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    if (cameraActive) {
      await startScanner(next);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Process Scanned or Manual Ticket Code
  const handleScan = async (code: string) => {
    if (!code || !code.trim()) return;

    try {
      setIsProcessing(true);
      const res = await scanCheckIn(code.trim(), adminName);

      if (res.status === "CHECKED_IN") {
        if (soundEnabled) playTone("success");
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([100, 50, 100]);
      } else if (res.status === "ALREADY_CHECKED_IN") {
        if (soundEnabled) playTone("warning");
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(250);
      } else {
        if (soundEnabled) playTone("error");
      }

      setLastScanResult({
        status: res.status,
        message: res.message,
        attendee: res.attendee,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      });

      // Update local state metrics & attendees list immediately
      if (res.attendee) {
        setData((prev) => {
          const updatedList = prev.attendees.map((att) =>
            att.id === res.attendee!.id ? res.attendee! : att
          );
          if (!prev.attendees.some((att) => att.id === res.attendee!.id)) {
            updatedList.unshift(res.attendee!);
          }
          const attendedCount = updatedList.filter((a) => a.attended).length;
          const total = updatedList.length;

          return {
            ...prev,
            attendees: updatedList,
            totalRegistered: total,
            totalAttended: attendedCount,
            totalPending: total - attendedCount,
            attendanceRate: total > 0 ? Math.round((attendedCount / total) * 100) : 0,
            recentScans: [res.attendee!, ...prev.recentScans.filter((r) => r.id !== res.attendee!.id)].slice(0, 10),
          };
        });
      }
    } catch (err: any) {
      console.error("Scan error:", err);
      setLastScanResult({
        status: "NOT_FOUND",
        message: err?.message || "Failed to process pass verification.",
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsProcessing(false);
      setManualCode("");
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(manualCode);
  };

  const handleToggle = async (id: string, currentAttended: boolean) => {
    try {
      const nextAttended = !currentAttended;
      await toggleAttendance(id, nextAttended, adminName);

      setData((prev) => {
        const updated = prev.attendees.map((a) =>
          a.id === id
            ? {
                ...a,
                attended: nextAttended,
                attendedAt: nextAttended ? new Date().toISOString() : null,
                attendedBy: nextAttended ? adminName : null,
              }
            : a
        );
        const attendedCount = updated.filter((a) => a.attended).length;
        const total = updated.length;

        return {
          ...prev,
          attendees: updated,
          totalAttended: attendedCount,
          totalPending: total - attendedCount,
          attendanceRate: total > 0 ? Math.round((attendedCount / total) * 100) : 0,
        };
      });
    } catch (e) {
      console.error("Toggle attendance error:", e);
    }
  };

  // CSV Export for union records
  const handleExportCsv = () => {
    const headers = ["Ticket Ref", "Name", "Email", "Tier", "Additional", "Event", "Attended", "Check-in Time", "Checked In By"];
    const rows = data.attendees.map((a) => [
      `"${a.ticketRef}"`,
      `"${a.name}"`,
      `"${a.email}"`,
      `"${a.tier}"`,
      `"${a.additional || ""}"`,
      `"${a.eventTitle}"`,
      a.attended ? "YES" : "NO",
      `"${a.attendedAt ? new Date(a.attendedAt).toLocaleString() : ""}"`,
      `"${a.attendedBy || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `YUGA-Attendance-Report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Attendees list
  const filteredAttendees = data.attendees.filter((att) => {
    const matchesSearch =
      att.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.ticketRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (att.additional && att.additional.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === "ATTENDED") return att.attended;
    if (statusFilter === "PENDING") return !att.attended;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-primary)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              Live Gate Entry Counter
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">Marshal: {adminName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            QR Entry Scanner &amp; Attendance
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Scan attendee passes with your phone camera or verify spot entries in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] transition-colors cursor-pointer"
            title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-primary)] transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-rose-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ===================== ATTENDANCE STATS CARDS ===================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Registered</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            {data.totalRegistered}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Total delegate passes</span>
        </div>

        {/* Checked In */}
        <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] shadow-xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Checked In</span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-500">
            {data.totalAttended}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Inside event venue</span>
        </div>

        {/* Pending */}
        <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] shadow-xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Pending</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-amber-500">
            {data.totalPending}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting arrival</span>
        </div>

        {/* Attendance Rate */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-xs">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Turnout Rate</span>
            <Sparkles className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            {data.attendanceRate}%
          </div>
          <div className="w-full bg-[var(--border-primary)] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(data.attendanceRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===================== SCANNER & FEEDBACK SECTION ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera Viewfinder (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[var(--border-primary)]">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-rose-500" />
                <h2 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider">
                  Camera QR Scanner
                </h2>
              </div>

              {cameraActive && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={flipCamera}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-primary)] text-[var(--text-secondary)] transition-colors cursor-pointer"
                  >
                    <FlipHorizontal className="h-3 w-3" />
                    Flip
                  </button>
                  <button
                    type="button"
                    onClick={stopScanner}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>

            {/* Viewfinder Container */}
            <div className="relative w-full aspect-video sm:aspect-[4/3] rounded-2xl bg-[#090b11] border border-white/10 overflow-hidden flex flex-col items-center justify-center text-center p-4">
              {/* html5-qrcode video element attaches here */}
              <div id="qr-reader-container" className="w-full h-full overflow-hidden [&_video]:object-cover" />

              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#090b11] z-10 space-y-4">
                  <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                    <ScanLine className="h-8 w-8 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Camera Scanner Idle</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Point your phone or webcam at the attendee pass QR code for instant entry validation.
                    </p>
                  </div>

                  {cameraError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold max-w-sm">
                      {cameraError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => startScanner()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 active:scale-[0.98] transition-all shadow-md shadow-rose-500/25 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    Launch Camera Scanner
                  </button>
                </div>
              )}

              {/* Scanning Active Overlay HUD */}
              {cameraActive && (
                <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center">
                  {/* Scanner Target Box with Animated Laser */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-rose-500/60 rounded-2xl overflow-hidden">
                    {/* Laser line moving vertically */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#ff2e56] animate-bounce" />
                    {/* Corner brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-rose-500" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-rose-500" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-rose-500" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-rose-500" />
                  </div>
                  <span className="mt-4 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/10">
                    Align QR Code inside box
                  </span>
                </div>
              )}
            </div>

            {/* Manual Code Input Bar */}
            <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Manual ticket verification (e.g. YUG_R_2L3 or YUG-XXXXXX)..."
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-rose-500 font-mono font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!manualCode.trim() || isProcessing}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {isProcessing ? "Checking..." : "Verify Entry"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Live Scan Result Feedback (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[var(--border-primary)]">
              <h2 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider">
                Scan Verification Status
              </h2>
              {lastScanResult && (
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {lastScanResult.timestamp}
                </span>
              )}
            </div>

            {lastScanResult ? (
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  lastScanResult.status === "CHECKED_IN"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300"
                    : lastScanResult.status === "ALREADY_CHECKED_IN"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-300"
                }`}
              >
                {/* Result Status Header */}
                <div className="flex items-center gap-3 mb-3">
                  {lastScanResult.status === "CHECKED_IN" && (
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  {lastScanResult.status === "ALREADY_CHECKED_IN" && (
                    <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  )}
                  {lastScanResult.status === "NOT_FOUND" && (
                    <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <XCircle className="h-6 w-6" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-base leading-tight">
                      {lastScanResult.status === "CHECKED_IN" && "VERIFIED · CHECKED IN"}
                      {lastScanResult.status === "ALREADY_CHECKED_IN" && "WARNING: ALREADY CHECKED IN"}
                      {lastScanResult.status === "NOT_FOUND" && "PASS NOT FOUND"}
                    </h3>
                    <p className="text-xs opacity-90 mt-0.5">{lastScanResult.message}</p>
                  </div>
                </div>

                {/* Attendee Details Card */}
                {lastScanResult.attendee && (
                  <div className="mt-4 pt-3.5 border-t border-black/10 dark:border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] uppercase opacity-70">Pass ID:</span>
                      <span className="font-mono font-bold tracking-wider">
                        #{lastScanResult.attendee.ticketRef}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] uppercase opacity-70">Attendee:</span>
                      <span className="font-bold">{lastScanResult.attendee.name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] uppercase opacity-70">Email:</span>
                      <span className="font-mono text-[11px] truncate max-w-[180px]">
                        {lastScanResult.attendee.email}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] uppercase opacity-70">Tier:</span>
                      <span className="font-bold px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px]">
                        {lastScanResult.attendee.tier}
                      </span>
                    </div>

                    {lastScanResult.attendee.additional && (
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] uppercase opacity-70">Details:</span>
                        <span>{lastScanResult.attendee.additional}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] uppercase opacity-70">Event:</span>
                      <span className="font-semibold truncate max-w-[180px]">
                        {lastScanResult.attendee.eventTitle}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--text-muted)] space-y-2">
                <ShieldCheck className="h-10 w-10 mx-auto text-slate-300 opacity-60" />
                <p className="text-xs">No scan yet. Point the camera at a QR code to begin validation.</p>
              </div>
            )}

            {/* Quick Test Barcodes */}
            <div className="mt-5 pt-4 border-t border-[var(--border-primary)]">
              <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Quick Test Passes (Click to check in):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.attendees.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleScan(a.ticketRef)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-[var(--bg-surface)] hover:bg-rose-500 hover:text-white border border-[var(--border-primary)] transition-all cursor-pointer"
                  >
                    #{a.ticketRef} ({a.name.split(" ")[0]})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== ATTENDANCE ROSTER & AUDIT LOG ===================== */}
      <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
              Attendee Attendance Roster
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Real-time directory of all enrolled delegates and entry statuses.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)]">
            {(["ALL", "ATTENDED", "PENDING"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-rose-500 text-white shadow-2xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search attendees by name, email, ticket ID, or batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-surface)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-rose-500 font-medium"
          />
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--border-primary)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-surface)] text-[var(--text-muted)] uppercase font-mono text-[10px] tracking-wider border-b border-[var(--border-primary)]">
              <tr>
                <th className="py-3 px-4">Pass ID</th>
                <th className="py-3 px-4">Attendee Name</th>
                <th className="py-3 px-4">College / Batch</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Check-in Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-primary)]">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((att) => (
                  <tr key={att.id} className="hover:bg-[var(--bg-surface)]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-rose-500">
                      #{att.ticketRef}
                    </td>
                    <td className="py-3 px-4 font-bold text-[var(--text-primary)]">
                      <div>{att.name}</div>
                      <div className="text-[10px] font-normal text-[var(--text-muted)] font-mono">
                        {att.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                      <span className="inline-block px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-primary)] text-[10px] font-semibold mr-1.5">
                        {att.tier}
                      </span>
                      {att.additional}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] max-w-[160px] truncate">
                      {att.eventTitle}
                    </td>
                    <td className="py-3 px-4">
                      {att.attended ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[var(--text-muted)]">
                      {att.attendedAt
                        ? new Date(att.attendedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggle(att.id, att.attended)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          att.attended
                            ? "bg-slate-500/10 hover:bg-slate-500/20 text-slate-500 border border-slate-500/20"
                            : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs"
                        }`}
                      >
                        {att.attended ? "Undo" : "Check In"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--text-muted)]">
                    No attendees match the selected query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
