"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  QrCode,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import { submitRegistration } from "@/lib/actions/forms";
import { EventTicket } from "@/components/ovio/event-ticket/event-ticket";

interface FieldItem {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string | null;
  options: string | null;
  order: number;
}

interface EventRegistrationViewProps {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    date: string;
    time: string | null;
    venue: string | null;
    tier?: string;
  };
  form: {
    id: string;
    title: string;
    description: string | null;
    deadline: string | null;
    fields: FieldItem[];
  };
}

export function EventRegistrationView({
  event,
  form,
}: EventRegistrationViewProps) {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || "";
  const initialEmail = searchParams.get("email") || "";

  // Initialize form state with prefilled values where applicable
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    for (const f of form.fields) {
      const lower = f.label.toLowerCase();
      if ((lower.includes("name") || f.type === "text") && initialName && !init["name"]) {
        init[f.id] = initialName;
      }
      if ((lower.includes("email") || f.type === "email") && initialEmail && !init["email"]) {
        init[f.id] = initialEmail;
      }
    }
    // Also store generic name & email
    init["_name"] = initialName;
    init["_email"] = initialEmail;
    return init;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedTicket, setConfirmedTicket] = useState<{
    ticketId: string;
    attendeeName: string;
    attendeeEmail: string;
  } | null>(null);

  const handleFieldChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxToggle = (fieldId: string, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const exists = current.includes(option);
      const next = exists
        ? current.filter((item: string) => item !== option)
        : [...current, option];
      return { ...prev, [fieldId]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Identify attendee name & email
    let attendeeName = answers["_name"] || "";
    let attendeeEmail = answers["_email"] || "";

    for (const f of form.fields) {
      const lower = f.label.toLowerCase();
      if (!attendeeName && (lower.includes("name") || f.type === "text")) {
        attendeeName = answers[f.id] || "";
      }
      if (!attendeeEmail && (lower.includes("email") || f.type === "email")) {
        attendeeEmail = answers[f.id] || "";
      }
    }

    try {
      setIsSubmitting(true);
      const res = await submitRegistration(form.id, answers);

      setConfirmedTicket({
        ticketId: res.ticketId,
        attendeeName: attendeeName || "Registered Delegate",
        attendeeEmail: attendeeEmail || "Verified Attendee",
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit registration. Please check required fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-slate-50 via-white to-emerald-50/20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Events
          </Link>
        </div>

        {/* Confirmed State: Displays the verified Ovio Ticket */}
        <AnimatePresence mode="wait">
          {confirmedTicket ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Success Banner */}
              <div className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 shadow-sm text-center space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Registration Confirmed
                  </span>
                  <h1 className="text-3xl font-display font-bold text-slate-900 mt-1">
                    You&apos;re Officially Booked!
                  </h1>
                  <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                    Your spot for <strong>{event.title}</strong> has been secured. Your digital pass and QR gate verification code are rendered below.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Ticket Pass
                  </button>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Return to Campus Calendar
                  </Link>
                </div>
              </div>

              {/* The Ovio Interactive Event Ticket */}
              <div>
                <EventTicket
                  variant="minimal"
                  event={{
                    name: event.title,
                    date: event.date,
                    venue: event.venue || undefined,
                    description: event.description,
                    tier: event.tier || "DELEGATE PASS",
                  }}
                  ticketId={confirmedTicket.ticketId}
                  defaultAttendee={{
                    name: confirmedTicket.attendeeName,
                    email: confirmedTicket.attendeeEmail,
                  }}
                  defaultFlipped={false}
                />
              </div>
            </motion.div>
          ) : (
            /* ===================== REGISTRATION FORM VIEW ===================== */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Event Header Banner */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Official Registration
                  </span>
                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    YUGA Union Conclave
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight">
                  {event.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-slate-600 font-medium pb-4 border-b border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    {event.date}
                  </span>
                  {event.time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      {event.time}
                    </span>
                  )}
                  {event.venue && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      {event.venue}
                    </span>
                  )}
                </div>

                {form.description ? (
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed font-normal">
                    {form.description}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed font-normal">
                    Please fill out the delegate registration details below to reserve your entry pass for this event.
                  </p>
                )}
              </div>

              {/* Dynamic Google-Form-Style Question Card */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-7">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-display font-bold text-slate-900">
                      Participant Details
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Fields marked with <span className="text-rose-500 font-bold">*</span> are required.
                    </p>
                  </div>

                  {form.fields.map((field) => {
                    const defaultBatches = [
                      "MBBS 2021",
                      "MBBS 2022",
                      "MBBS 2023",
                      "MBBS 2024",
                      "MBBS 2025",
                      "House Surgeon / Intern",
                      "PG Resident",
                      "Alumni",
                      "Faculty / Staff",
                    ];
                    const defaultGender = ["Male", "Female", "Other", "Prefer not to say"];
                    const defaultYesNo = ["Yes", "No"];

                    let parsedOptions: string[] = [];
                    if (field.type === "batch") {
                      parsedOptions = field.options && field.options.trim().length > 0
                        ? field.options.split(/[\n,]+/).map((o) => o.trim()).filter(Boolean)
                        : defaultBatches;
                    } else if (field.type === "gender") {
                      parsedOptions = field.options && field.options.trim().length > 0
                        ? field.options.split(/[\n,]+/).map((o) => o.trim()).filter(Boolean)
                        : defaultGender;
                    } else if (field.type === "yes_no") {
                      parsedOptions = defaultYesNo;
                    } else if (field.options) {
                      parsedOptions = field.options
                        .split(/[\n,]+/)
                        .map((opt) => opt.trim())
                        .filter(Boolean);
                    }

                    return (
                      <div
                        key={field.id}
                        className="p-5 rounded-2xl bg-slate-50/50 border border-slate-200/80 hover:border-emerald-300 transition-colors space-y-2.5"
                      >
                        <label className="block text-sm font-bold text-slate-900">
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-rose-500">*</span>
                          )}
                        </label>

                        {/* 1. Short Text & Roll Number */}
                        {(field.type === "text" || field.type === "roll_number") && (
                          <input
                            type="text"
                            required={field.required}
                            placeholder={field.placeholder || (field.type === "roll_number" ? "e.g. 21010045 / Admission ID" : "Your answer")}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 2. Email */}
                        {field.type === "email" && (
                          <input
                            type="email"
                            required={field.required}
                            placeholder={field.placeholder || "name@gmc.edu"}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 3. Phone / WhatsApp */}
                        {field.type === "tel" && (
                          <input
                            type="tel"
                            required={field.required}
                            placeholder={field.placeholder || "+91 98765 43210"}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 4. Number */}
                        {field.type === "number" && (
                          <input
                            type="number"
                            required={field.required}
                            placeholder={field.placeholder || "e.g. Age, Quantity, or Year"}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 5. Date Selection */}
                        {field.type === "date" && (
                          <input
                            type="date"
                            required={field.required}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 6. Time Selection */}
                        {field.type === "time" && (
                          <input
                            type="time"
                            required={field.required}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 7. Date & Time Combined */}
                        {field.type === "datetime-local" && (
                          <input
                            type="datetime-local"
                            required={field.required}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 8. Textarea */}
                        {field.type === "textarea" && (
                          <textarea
                            rows={3}
                            required={field.required}
                            placeholder={field.placeholder || "Enter your response..."}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 9. Dropdown Select & Batch Preset */}
                        {(field.type === "select" || field.type === "batch") && (
                          <select
                            required={field.required}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
                          >
                            <option value="">
                              {field.type === "batch" ? "-- Choose Academic Batch --" : "-- Select an option --"}
                            </option>
                            {parsedOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* 10. Radio Buttons */}
                        {field.type === "radio" && (
                          <div className="space-y-2 pt-1">
                            {parsedOptions.map((opt, i) => (
                              <label
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer transition-colors"
                              >
                                <input
                                  type="radio"
                                  name={field.id}
                                  value={opt}
                                  required={field.required}
                                  checked={answers[field.id] === opt}
                                  onChange={() => handleFieldChange(field.id, opt)}
                                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-slate-800">
                                  {opt}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* 11. Gender Selection (Interactive Pills) */}
                        {field.type === "gender" && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                            {parsedOptions.map((opt, i) => {
                              const isSelected = answers[field.id] === opt;
                              return (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => handleFieldChange(field.id, opt)}
                                  className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                      : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* 12. Yes / No Confirmation (Interactive Switch Pills) */}
                        {field.type === "yes_no" && (
                          <div className="flex items-center gap-3 pt-1">
                            {parsedOptions.map((opt, i) => {
                              const isSelected = answers[field.id] === opt;
                              return (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => handleFieldChange(field.id, opt)}
                                  className={`px-6 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    isSelected
                                      ? opt === "Yes"
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                        : "bg-slate-700 text-white border-slate-700 shadow-sm"
                                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* 13. Checkboxes (Multi-select) */}
                        {field.type === "checkbox" && (
                          <div className="space-y-2 pt-1">
                            {parsedOptions.map((opt, i) => {
                              const checked = Array.isArray(answers[field.id]) &&
                                answers[field.id].includes(opt);
                              return (
                                <label
                                  key={i}
                                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                      handleCheckboxToggle(field.id, opt)
                                    }
                                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                  />
                                  <span className="text-sm font-medium text-slate-800">
                                    {opt}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* 14. URL / Link */}
                        {field.type === "url" && (
                          <input
                            type="url"
                            required={field.required}
                            placeholder={field.placeholder || "https://example.com/link"}
                            value={answers[field.id] || ""}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        )}

                        {/* 15. File / Attachment / Screenshot URL */}
                        {field.type === "file" && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              required={field.required}
                              placeholder={field.placeholder || "Google Drive link, Cloudinary URL, or transaction ID..."}
                              value={answers[field.id] || ""}
                              onChange={(e) =>
                                handleFieldChange(field.id, e.target.value)
                              }
                              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                            />
                            <p className="text-[11px] text-slate-500">
                              Upload your file/screenshot to Google Drive, Imgur, or iCloud and paste the sharing link here.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {errorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                      By submitting, you agree to official GMC Kozhikode union event protocols.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RotateCw className="h-4 w-4 animate-spin" />
                          Securing Delegate Pass...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Complete Registration & Generate Pass
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
