"use client";

import React, { useState, useId } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle2,
  ArrowRight,
  RotateCw,
  Download,
  Printer,
  ShieldCheck,
  Ticket as TicketIcon,
} from "lucide-react";
import { QRCodeSVG } from "../qr-code";
import { EventTicketProps, Attendee } from "../types";
import { downloadTicketPdf } from "@/lib/ticket-pdf";

export function EventTicket({
  event,
  ticketId: propTicketId,
  defaultAttendee,
  onBook,
  onTear,
  flipped: controlledFlipped,
  defaultFlipped = false,
  onFlippedChange,
  className = "",
}: EventTicketProps) {
  const autoId = useId().replace(/:/g, "");
  const ticketId = propTicketId || `YUG_R_2L3`;

  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const [attendee, setAttendee] = useState<Attendee>(
    defaultAttendee || { name: "", email: "" }
  );
  const [isBooked, setIsBooked] = useState(Boolean(defaultAttendee?.name));
  const [isTorn, setIsTorn] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleFlip = () => {
    const next = !isFlipped;
    setInternalFlipped(next);
    onFlippedChange?.(next);
  };

  const handleTear = () => {
    if (isTorn) return;
    setIsTorn(true);
    onTear?.(isBooked ? attendee : null);
  };

  const handleDownloadPdf = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDownloadingPdf(true);
      await downloadTicketPdf({
        ticketId,
        eventName: event.title || event.name || "Medical Cultural Fest",
        date: event.date || "Nov 19 – 22, 2026",
        venue: event.venue || "Main Open Air Auditorium",
        tier: event.tier || "UNRESERVED",
        attendeeName: attendee.name || defaultAttendee?.name || "Dr. Rahul Nair",
        attendeeEmail: attendee.email || defaultAttendee?.email || "name@gmc.edu",
      });
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const eventTitle = event.title || event.name || "Medical Cultural Fest";

  return (
    <div
      className={`relative w-full max-w-[390px] mx-auto select-none ${className}`}
      style={{ perspective: 1600 }}
    >
      <motion.div
        className="relative w-full transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ===================== FRONT FACE (OFF-WHITE REALISTIC PASS) ===================== */}
        <div
          className="relative w-full rounded-[2rem] bg-[#fbfaf6] border border-[#e8e4d8] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden text-slate-800"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Subtle paper grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-multiply"
            style={{
              backgroundImage: `radial-gradient(#000 1px, transparent 0)`,
              backgroundSize: "6px 6px",
            }}
          />

          {/* Top Section */}
          <div className="relative p-7 pb-6">
            {/* Header: YUGA '26 + ID */}
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-black text-2xl tracking-tight text-slate-900">
                  YUGA <span className="text-[#ff2e56]">&apos;26</span>
                </span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400 tracking-wider">
                #{ticketId}
              </span>
            </div>

            {/* Subhead + Title + Clock Tower Artwork */}
            <div className="relative mt-2 min-h-[175px]">
              {/* Artwork: GMC Kozhikode Green-Trimmed Clock Tower */}
              <div className="absolute right-0 top-0 w-[170px] h-[180px] pointer-events-none select-none">
                {/* Soft blush radial glow behind the tower */}
                <div className="absolute inset-0 -top-3 rounded-full bg-gradient-to-br from-rose-200/50 via-rose-300/30 to-transparent blur-md transform translate-x-3" />
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  <Image
                    src="/ticket-clocktower.png"
                    alt="Government Medical College Kozhikode Clock Tower"
                    fill
                    sizes="200px"
                    className="object-cover object-[62%_35%] scale-[1.35] transition-transform duration-500 hover:scale-[1.42]"
                    priority
                  />
                  {/* Subtle blend gradient on the left edge of the photo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/20 to-transparent w-16" />
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#fbfaf6] to-transparent" />
                </div>
              </div>

              {/* Text Content (Left aligned with high visual hierarchy) */}
              <div className="relative z-10 max-w-[210px] pr-2">
                <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-1.5">
                  ALL-KERALA INTER-COLLEGIATE
                </span>

                <h3 className="font-serif text-2xl sm:text-[26px] font-bold text-slate-900 leading-[1.12] tracking-tight">
                  Medical Cultural
                  <span className="block text-slate-900 font-serif">Fest</span>
                </h3>

                <p className="mt-3 text-[11px] text-slate-500 leading-relaxed font-sans font-normal line-clamp-3">
                  The flagship 4-Day Cultural Extravaganza of Calicut Medicos.
                </p>
              </div>
            </div>
          </div>

          {/* ===================== PERFORATION CUT & NOTCHES ===================== */}
          <div className="relative flex items-center justify-between my-1">
            {/* Left circular cutout notch */}
            <div className="absolute -left-3.5 h-7 w-7 rounded-full bg-[#07090e] border border-[#e8e4d8]/60 shadow-inner z-20" />

            {/* Dashed perforation line */}
            <div className="w-full mx-5 border-b-2 border-dashed border-[#dcd8cb]" />

            {/* Right circular cutout notch */}
            <div className="absolute -right-3.5 h-7 w-7 rounded-full bg-[#07090e] border border-[#e8e4d8]/60 shadow-inner z-20" />
          </div>

          {/* ===================== LOWER STUB SECTION ===================== */}
          <div className="relative p-6 pt-5 bg-[#f6f5ef]/80">
            {/* 3 Columns: Date, Venue, Admit Status */}
            <div className="grid grid-cols-3 gap-2 pb-5 border-b border-dashed border-[#dcd8cb] text-center">
              {/* Col 1: Date */}
              <div className="flex flex-col items-center justify-center px-1">
                <Calendar className="h-4 w-4 text-slate-700 mb-1" />
                <span className="text-[11px] font-bold text-slate-800 leading-tight">
                  Nov 19 – 22,
                  <span className="block text-[10px] font-semibold text-slate-700">2026</span>
                </span>
                <span className="font-mono text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                  DATE
                </span>
              </div>

              {/* Col 2: Venue */}
              <div className="flex flex-col items-center justify-center px-1 border-x border-slate-200/80">
                <MapPin className="h-4 w-4 text-slate-700 mb-1" />
                <span className="text-[11px] font-bold text-slate-800 leading-tight">
                  Main Open Air
                  <span className="block text-[10px] font-semibold text-slate-700">Auditorium</span>
                </span>
                <span className="font-mono text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                  VENUE
                </span>
              </div>

              {/* Col 3: Admit Status */}
              <div className="flex flex-col items-center justify-center px-1">
                <TicketIcon className="h-4 w-4 text-amber-600 mb-1" />
                <span className="text-[11px] font-bold text-amber-600 leading-tight">
                  Unreserved
                </span>
                <span className="font-mono text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                  ADMIT STATUS
                </span>
              </div>
            </div>

            {/* Barcode & Pass Identifier */}
            <div className="pt-4 flex flex-col items-center justify-center">
              {/* Realistic High-Density Vector Barcode */}
              <div className="flex items-center justify-center gap-[2px] h-9 w-full max-w-[240px] px-2 opacity-90">
                {[
                  3, 1, 2, 4, 1, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4,
                  1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3,
                ].map((w, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-900 h-full inline-block rounded-[0.5px]"
                    style={{ width: `${w * 1.3}px` }}
                  />
                ))}
              </div>

              <span className="font-mono text-[10px] tracking-[0.25em] font-semibold text-slate-500 uppercase mt-1.5">
                {ticketId}
              </span>

              {/* Footer */}
              <p className="mt-3 font-mono text-[8.5px] tracking-wider text-slate-400 uppercase">
                CALICUT MEDICAL COLLEGE UNION • YUGA &apos;26
              </p>
            </div>

            {/* Quick Interactive Actions Floating Pill */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleFlip}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                title="Flip to show scannable QR Code"
              >
                <QrCode className="h-3.5 w-3.5 text-[#ff2e56]" />
                Show QR Pass
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                title="Download printable digital pass as PDF"
              >
                {isDownloadingPdf ? (
                  <RotateCw className="h-3.5 w-3.5 animate-spin text-[#ff2e56]" />
                ) : (
                  <Download className="h-3.5 w-3.5 text-[#ff2e56]" />
                )}
                PDF Pass
              </button>
            </div>
          </div>
        </div>

        {/* ===================== BACK FACE (REAL SCANNABLE QR CODE PASS) ===================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-[2rem] bg-[#fbfaf6] border border-[#e8e4d8] shadow-2xl p-7 flex flex-col justify-between text-slate-800"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#ff2e56]">
                Gate Entry Verification
              </span>
              <h4 className="font-sans font-bold text-base text-slate-900 leading-tight">
                {eventTitle}
              </h4>
            </div>

            <button
              type="button"
              onClick={handleFlip}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5 text-slate-500" />
              Flip Back
            </button>
          </div>

          {/* Central QR Code Piece */}
          <div className="my-auto py-2 flex flex-col items-center justify-center text-center">
            <QRCodeSVG value={ticketId} size={150} showCenterLogo={true} />

            <div className="mt-3.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                VERIFIED PASS #{ticketId}
              </span>
            </div>

            {/* Attendee details */}
            <div className="mt-3 max-w-[260px] text-center">
              <p className="font-sans font-bold text-sm text-slate-900 truncate">
                {attendee.name || defaultAttendee?.name || "Registered Delegate"}
              </p>
              <p className="font-mono text-[10.5px] text-slate-500 truncate">
                {attendee.email || defaultAttendee?.email || "verified.entry@gmc.edu"}
              </p>
            </div>
          </div>

          {/* Instructions & Actions */}
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            <p className="text-[10px] text-slate-500 text-center font-sans leading-tight">
              Present this encrypted QR code at the counter. Gate marshals will scan for instant check-in.
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#ff2e56] hover:bg-[#e0264a] active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isDownloadingPdf ? (
                  <RotateCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                Download PDF
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-slate-600" />
                Print
              </button>
            </div>

            <p className="font-mono text-[8px] text-slate-400 text-center uppercase tracking-wider">
              Calicut Medical College Union 2026-2027 · Non-Transferable
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
