"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Ticket as TicketIcon,
  User,
  Mail,
  FileText,
  QrCode,
  RotateCw,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EventTicket } from "@/components/ovio/event-ticket/event-ticket";
import { submitRegistration } from "@/lib/actions/forms";

interface EventShowcaseProps {
  dbFeaturedEvent?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    date: string;
    time?: string | null;
    venue?: string | null;
    fieldsCount?: number;
  } | null;
  dbRestEvents?: {
    id: string;
    title: string;
    slug?: string;
    subtitle?: string;
    description?: string;
    date: string;
    time?: string | null;
    venue?: string | null;
    category?: string;
  }[] | null;
}

export function EventShowcase({ dbFeaturedEvent, dbRestEvents }: EventShowcaseProps) {
  // Real event details as specified by user:
  // YUGA '26 — All-Kerala Inter-Collegiate Medical Cultural Fest, Nov 19–22, 2026, Main Open Air Auditorium
  const eventData = {
    id: dbFeaturedEvent?.id || "yuga-2026-fest",
    title: dbFeaturedEvent?.title || "Medical Cultural Fest",
    name: "YUGA '26 — Medical Cultural Fest",
    slug: dbFeaturedEvent?.slug || "yuga-2026",
    description:
      dbFeaturedEvent?.description ||
      "The flagship 4-Day Cultural Extravaganza of Calicut Medicos featuring collegiate arts, medical colloquiums, battle of bands, and star nights.",
    date: "November 19 – 22, 2026",
    venue: "Main Open Air Auditorium",
    tier: "UNRESERVED",
  };

  // Attendee type selection tab
  const [attendeeType, setAttendeeType] = useState<"STUDENT" | "DELEGATE" | "ATTENDEE">("STUDENT");

  // Form input fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [additional, setAdditional] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Ticket flip state
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState("YUG_R_2L3");
  const [activeAttendee, setActiveAttendee] = useState({
    name: "Dr. Rahul Nair",
    email: "name@gmc.edu",
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitRegistration(eventData.slug, {
        _name: fullName.trim(),
        _email: email.trim(),
        _tier: attendeeType,
        _additional: additional.trim(),
        "Full Name": fullName.trim(),
        "Email Address": email.trim(),
        Batch: additional.trim(),
      });

      if (res && res.ticketId) {
        setActiveTicketId(res.ticketId);
        setActiveAttendee({
          name: fullName.trim(),
          email: email.trim(),
        });
        setIsSuccess(true);
        // Automatically flip ticket to reveal verified QR Code pass!
        setTimeout(() => {
          setIsFlipped(true);
        }, 300);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[#07090e] text-white relative overflow-hidden transition-colors border-t border-white/10">
      {/* Subtle background ambient mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 46, 86, 0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#ff2e56]/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===================== 3-COLUMN DESKTOP / STACKED MOBILE LAYOUT ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* ===================== LEFT COLUMN: EVENT DETAILS & HEADLINE ===================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pill Badge */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/5 text-[#ff2e56] border border-white/10 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff2e56] animate-pulse" />
                Live Spot Pass &amp; Conclave
              </span>
            </div>

            {/* Editorial Heading */}
            <div className="space-y-1.5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.12]">
                Featured Event &amp;
                <span className="block font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d6d] to-[#ff2e56]">
                  Entry Pass
                </span>
              </h2>

              <p className="pt-2 text-sm text-slate-300/80 leading-relaxed max-w-md font-sans">
                Reserve your spot instantly with our interactive pass. Flip for your encrypted gate
                QR code or tear the stub to check in at the venue.
              </p>
            </div>

            {/* Meta Info List */}
            <div className="space-y-4 pt-2">
              {/* Date */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-[#ff2e56]" />
                </div>
                <div>
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    DATE
                  </span>
                  <span className="text-sm font-bold text-white tracking-wide">
                    {eventData.date}
                  </span>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-[#ff2e56]" />
                </div>
                <div>
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    VENUE
                  </span>
                  <span className="text-sm font-bold text-white tracking-wide">
                    {eventData.venue}
                  </span>
                </div>
              </div>

              {/* Admit Status */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <TicketIcon className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    ADMIT STATUS
                  </span>
                  <span className="inline-block px-2.5 py-0.5 mt-0.5 rounded-full text-xs font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/30">
                    {eventData.tier}
                  </span>
                </div>
              </div>
            </div>

            {/* View All Events Action + Handwritten script accent */}
            <div className="pt-4 flex items-center justify-between">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all shadow-sm group"
              >
                View all campus events
                <ArrowRight className="h-3.5 w-3.5 text-[#ff2e56] transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Cursive handwritten accent text as in ref image */}
              <div className="font-serif italic text-slate-500/80 text-sm tracking-tight text-right leading-tight select-none pr-2">
                Students
                <span className="block text-slate-400/90">Culture</span>
                <span className="block text-slate-500/80 text-xs">Community</span>
              </div>
            </div>
          </div>

          {/* ===================== CENTER COLUMN: REALISTIC DIGITAL TICKET ===================== */}
          <div className="lg:col-span-4 flex items-center justify-center py-4 lg:py-0">
            <EventTicket
              ticketId={activeTicketId}
              defaultAttendee={activeAttendee}
              flipped={isFlipped}
              onFlippedChange={setIsFlipped}
              event={{
                title: eventData.title,
                name: eventData.name,
                date: eventData.date,
                venue: eventData.venue,
                tier: attendeeType,
                description: eventData.description,
              }}
            />
          </div>

          {/* ===================== RIGHT COLUMN: GET YOUR ENTRY PASS FORM ===================== */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-white/15 bg-[#0e121d]/90 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              {/* Subtle top illumination border */}
              <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-[#ff2e56]/40 to-transparent" />

              {/* Form Title & Subtitle */}
              <div className="mb-5">
                <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                  Get Your Entry Pass
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed font-sans">
                  Fill in your details to reserve your spot. Your entry pass will be generated after
                  successful registration.
                </p>
              </div>

              {/* Attendee Type Pill Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 mb-4">
                {(["STUDENT", "DELEGATE", "ATTENDEE"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAttendeeType(type)}
                    className={`py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      attendeeType === type
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rahul Nair"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff2e56] focus:ring-1 focus:ring-[#ff2e56] transition-all font-medium"
                    />
                  </div>
                  <span className="block mt-1 pl-1 text-[10px] text-slate-400 font-sans">
                    Full Name
                  </span>
                </div>

                {/* College / Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="name@gmc.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff2e56] focus:ring-1 focus:ring-[#ff2e56] transition-all font-medium"
                    />
                  </div>
                  <span className="block mt-1 pl-1 text-[10px] text-slate-400 font-sans">
                    College / Email
                  </span>
                </div>

                {/* Additional Details */}
                <div>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. 2024, Batch A, etc."
                      value={additional}
                      onChange={(e) => setAdditional(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#ff2e56] focus:ring-1 focus:ring-[#ff2e56] transition-all font-medium"
                    />
                  </div>
                  <span className="block mt-1 pl-1 text-[10px] text-slate-400 font-sans">
                    Additional details (Year, Batch, etc.)
                  </span>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <p className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                    {errorMsg}
                  </p>
                )}

                {/* Success Banner */}
                {isSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Pass reserved! Check your card for QR code.</span>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#ff2e56] to-[#e0264a] hover:from-[#ff4065] hover:to-[#ff2e56] active:scale-[0.98] transition-all shadow-md shadow-[#ff2e56]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      Securing Pass...
                    </>
                  ) : (
                    <>
                      Continue Registration
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-[#0e121d]">
                  OR
                </span>
              </div>

              {/* Show QR Code Quick Toggle Card */}
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all flex items-center gap-3 text-left cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#ff2e56]/40 transition-colors">
                  <QrCode className="h-5 w-5 text-[#ff2e56]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white group-hover:text-[#ff4d6d] transition-colors">
                    {isFlipped ? "Show Ticket Front" : "Show QR Code"}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-sans">
                    Already registered? View your pass
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
