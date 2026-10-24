import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Send, ShieldAlert, Sparkles } from "lucide-react";
import { COLLEGE, YUGA, SITE } from "@/lib/site";
import { ContactClientForm } from "./contact-form-client";

export const metadata: Metadata = {
  title: "Official Contact Desk & Campus Location · YUGA",
  description:
    "Get in touch with YUGA College Union 2026-2027 at Government Medical College, Kozhikode. Office location, 24/7 casualty phone, emergency hotline, and official enquiry form.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 bg-gradient-to-b from-emerald-50/20 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 mb-4 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Campus Communication
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
            Contact Union Office
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
            Have questions regarding upcoming cultural conclaves, academic representations,
            or student facilities? Reach the YUGA office bearers directly or visit us at
            the Medical College campus.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr]">
          {/* Left Column: Direct Info Cards */}
          <div className="space-y-6">
            {/* Campus Address Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Physical Office Address
                  </h3>
                  <div className="mt-1 font-semibold text-slate-900 leading-snug">
                    YUGA Union Office, Students Amenities Centre
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
                    {COLLEGE.name}, Medical College Junction, 17, Kozhikode, Kerala 673008
                  </p>
                </div>
              </div>
            </div>

            {/* Telephone & Hotlines */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-3 w-full">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Union Office Line
                    </h3>
                    <a
                      href={`tel:${COLLEGE.phone}`}
                      className="mt-1 block font-semibold text-emerald-800 hover:underline"
                    >
                      {COLLEGE.phone}
                    </a>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Main Casualty Desk:</span>
                      <a
                        href={`tel:${COLLEGE.casualtyPhone}`}
                        className="font-semibold text-slate-800 hover:text-emerald-700"
                      >
                        {COLLEGE.casualtyPhone}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Ambulance Emergency:</span>
                      <a
                        href={`tel:${COLLEGE.emergencyPhone}`}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        {COLLEGE.emergencyPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email & Working Hours */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Official Email
                    </h3>
                    <a
                      href={`mailto:${YUGA.email}`}
                      className="mt-1 block text-xs font-semibold text-emerald-800 hover:underline truncate"
                    >
                      {YUGA.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Office Hours
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-slate-800">
                      9:00 AM – 5:00 PM
                    </p>
                    <span className="text-[10px] text-slate-400">Mon through Sat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xs">
              <iframe
                src="https://maps.google.com/maps?q=Government+Medical+College+Kozhikode&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="GMC Kozhikode Campus Location Map"
              />
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-1">
              Send an Official Message
            </h3>
            <p className="text-xs text-slate-500 font-normal mb-6">
              Messages submitted here are delivered to the General Secretary and respective executive committee.
            </p>
            <ContactClientForm />
          </div>
        </div>
      </div>
    </div>
  );
}
