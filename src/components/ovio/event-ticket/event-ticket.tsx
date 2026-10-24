"use client";

import React, { useState, useId } from "react";
import { useRouter } from "next/navigation";
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
  ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from "../qr-code";
import { EventTicketProps, Attendee } from "../types";

export function EventTicket({
  event,
  variant = "minimal",
  layout = "horizontal",
  ticketId: propTicketId,
  defaultAttendee,
  onBook,
  onTear,
  flipped: controlledFlipped,
  defaultFlipped = false,
  onFlippedChange,
  className = "",
}: EventTicketProps) {
  const router = useRouter();
  const autoId = useId().replace(/:/g, "");
  const ticketId = propTicketId || `YUG-${autoId.slice(0, 6).toUpperCase()}`;

  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const [attendee, setAttendee] = useState<Attendee>(
    defaultAttendee || { name: "", email: "" }
  );
  const [isBooked, setIsBooked] = useState(Boolean(defaultAttendee?.name));
  const [isTorn, setIsTorn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!attendee.name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (!attendee.email.trim() || !attendee.email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    // Check if event has more than 3 custom fields -> route to full Google Form page!
    const fieldsCount = event.fieldsCount ?? 0;
    if (fieldsCount > 3) {
      const targetSlug = event.slug || "event";
      const params = new URLSearchParams({
        name: attendee.name.trim(),
        email: attendee.email.trim(),
      });
      router.push(`/events/${targetSlug}/register?${params.toString()}`);
      return;
    }

    // Otherwise book on the spot
    try {
      setIsSubmitting(true);
      if (onBook) {
        await onBook(attendee);
      } else {
        // Default simulated instant reserve
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setIsBooked(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to reserve spot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTitle = event.title || event.name;
  const fieldsCount = event.fieldsCount ?? 0;

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto font-sans text-slate-800 ${className}`}
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="relative w-full transition-transform duration-700 ease-out preserve-3d"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ===================== FRONT FACE (TICKET & STUB) ===================== */}
        <div
          className="w-full grid md:grid-cols-[1fr_auto_280px] rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-20px_rgba(16,24,40,0.12)] overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Main Ticket Body */}
          <div className="relative p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-white to-emerald-50/30">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" />
                    Official Entry Pass
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-400">
                    #{ticketId}
                  </span>
                </div>

                {/* Flip button */}
                <button
                  type="button"
                  onClick={handleFlip}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 transition-colors cursor-pointer"
                  title="Flip to show QR Code pass"
                >
                  <QrCode className="h-3.5 w-3.5 text-emerald-600" />
                  Show QR
                </button>
              </div>

              {/* Title & Description */}
              <div className="mt-6">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-snug">
                  {eventTitle}
                </h3>
                {event.description && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Meta & Details */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-mono uppercase tracking-wider text-[10px] font-semibold text-slate-400">
                    Date
                  </span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {event.date}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono uppercase tracking-wider text-[10px] font-semibold text-slate-400">
                    Time & Venue
                  </span>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {event.venue || "College Auditorium"}
                  </p>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="font-mono uppercase tracking-wider text-[10px] font-semibold text-slate-400">
                    Admit Status
                  </span>
                  <p className="font-semibold text-slate-800">
                    {isBooked ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {attendee.name.split(" ")[0]} (Confirmed)
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium">Unreserved</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Perforated Divider / Tear Cut-Line */}
          <div className="relative flex md:flex-col items-center justify-between py-2 md:py-0 px-0 md:px-0 bg-slate-50 border-y md:border-y-0 md:border-x border-dashed border-slate-300">
            {/* Notch top */}
            <div className="hidden md:block -mt-3 h-6 w-6 rounded-full bg-[var(--bg-main)] border border-slate-200" />
            {/* Dashed line indicator */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest px-4 md:px-0 md:py-6 [writing-mode:horizontal-tb] md:[writing-mode:vertical-rl] select-none">
              <Scissors className="h-3 w-3 text-slate-400 rotate-90 md:rotate-0" />
              <span>Tear Here</span>
            </div>
            {/* Notch bottom */}
            <div className="hidden md:block -mb-3 h-6 w-6 rounded-full bg-[var(--bg-main)] border border-slate-200" />
          </div>

          {/* Tearable Stub & Booking Panel */}
          <motion.div
            animate={{
              x: isTorn ? 18 : 0,
              rotate: isTorn ? 2 : 0,
              opacity: isTorn ? 0.9 : 1,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className={`p-6 sm:p-7 flex flex-col justify-between ${
              isTorn
                ? "bg-emerald-50/40 border-l-2 border-emerald-400 shadow-inner"
                : "bg-slate-50/70"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Attendee Stub
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  {event.tier || "STUDENT PASS"}
                </span>
              </div>

              {!isBooked ? (
                /* Booking Form */
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rahul Nair"
                      value={attendee.name}
                      onChange={(e) =>
                        setAttendee((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      College / Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@gmc.edu"
                      value={attendee.email}
                      onChange={(e) =>
                        setAttendee((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs font-medium text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
                      {errorMsg}
                    </p>
                  )}

                  {fieldsCount > 3 ? (
                    <div className="pt-1">
                      <p className="text-[11px] text-slate-500 mb-2 leading-tight">
                        📋 Additional details required (Year, Batch, etc.)
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        Continue Registration
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RotateCw className="h-3.5 w-3.5 animate-spin" />
                          Reserving Spot...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          Book Your Spot
                        </>
                      )}
                    </button>
                  )}
                </form>
              ) : (
                /* Booked Status View */
                <div className="space-y-4 py-2">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Spot Confirmed!
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {attendee.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      {attendee.email}
                    </p>
                  </div>

                  {!isTorn ? (
                    <button
                      type="button"
                      onClick={handleTear}
                      className="w-full py-2 px-3 rounded-xl border border-dashed border-emerald-400 bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Scissors className="h-3.5 w-3.5" />
                      Tear Stub / Check In
                    </button>
                  ) : (
                    <div className="text-center py-1">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                        Stub Detached
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Simulated Barcode at bottom of stub */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col items-center">
              <div className="flex items-center gap-[2.5px] h-8 w-full justify-center opacity-70">
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2,
                  1, 3, 1, 2,
                ].map((w, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-800 h-full inline-block"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400 mt-1">
                {ticketId}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ===================== BACK FACE (QR CODE PASS & SCHEDULE) ===================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Digital Verification Pass
              </p>
              <h4 className="text-lg font-bold text-slate-900">{eventTitle}</h4>
            </div>

            <button
              type="button"
              onClick={handleFlip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Flip Back
            </button>
          </div>

          {/* Central QR Code & Pass info */}
          <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center my-auto py-4">
            <div className="flex flex-col items-center justify-center">
              <QRCodeSVG
                value={`https://yugagmc.org/pass/${ticketId}?attendee=${encodeURIComponent(
                  attendee.name || "Guest"
                )}`}
                size={160}
              />
              <span className="text-[11px] font-mono text-slate-500 font-semibold mt-2">
                Scan at Gate Verification
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Authorized Delegate
                </span>
                <p className="text-base font-bold text-slate-900">
                  {attendee.name || "Registered Delegate"}
                </p>
                <p className="text-xs text-slate-600 font-mono">
                  {attendee.email || "Verification on File"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Pass Reference
                  </span>
                  <p className="font-mono font-bold text-emerald-800">#{ticketId}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Security Hash
                  </span>
                  <p className="font-mono font-bold text-slate-700">YUGA-VERIFIED</p>
                </div>
              </div>

              {event.schedule && event.schedule.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Schedule Overview
                  </span>
                  <ul className="mt-1 space-y-1 text-xs text-slate-600">
                    {event.schedule.map((slot, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        {slot}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>YUGA Union 2026-2027 · Calicut Medical College</span>
            <span className="text-emerald-700 font-bold">Admit One · Non-Transferable</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
