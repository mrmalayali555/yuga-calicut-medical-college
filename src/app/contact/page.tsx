import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Send, ShieldAlert, Sparkles } from "lucide-react";
import { COLLEGE, YUGA, SITE } from "@/lib/site";
import { ContactClientForm } from "./contact-form-client";
import { db } from "@/lib/db";

async function getContactSettings() {
  try {
    const row = await db.setting.findUnique({ where: { key: "contact" } });
    if (row?.value) {
      const s = JSON.parse(row.value);
      return {
        phone: s.phone || COLLEGE.phone,
        email: s.email || YUGA.email,
        emergencyPhone: s.emergencyPhone || COLLEGE.casualtyPhone,
        address: s.address || COLLEGE.address,
      };
    }
  } catch {}
  return {
    phone: COLLEGE.phone,
    email: YUGA.email,
    emergencyPhone: COLLEGE.casualtyPhone,
    address: COLLEGE.address,
  };
}

export const metadata: Metadata = {
  title: "Official Union Contact Desk & Campus Location",
  description:
    "Get in touch with YUGA College Union 2026-2027 at Government Medical College, Kozhikode. Office location, 24/7 casualty phone, emergency hotline, and official enquiry form.",
  alternates: {
    canonical: "/contact",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  const contact = await getContactSettings();
  return (
    <div className="min-h-screen pt-28 pb-24 bg-[var(--bg-root)] text-[var(--text-primary)] relative overflow-hidden transition-colors">
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(var(--accent)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent-subtle)] px-3.5 py-1 mb-4 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              Campus Communication
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display text-[var(--text-primary)] tracking-tight">
            Contact Union Office
          </h1>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed font-normal">
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
            <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Physical Office Address
                  </h3>
                  <div className="mt-1 font-semibold text-[var(--text-primary)] leading-snug">
                    YUGA Union Office, Students Amenities Centre
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                    {COLLEGE.name}, Medical College Junction, 17, Kozhikode, Kerala 673008
                  </p>
                </div>
              </div>
            </div>

            {/* Telephone & Hotlines */}
            <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-3 w-full">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Union Office Line
                    </h3>
                    <a
                      href={`tel:${contact.phone}`}
                      className="mt-1 block font-semibold text-[var(--accent)] hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  <div className="pt-2 border-t border-[var(--border-primary)] flex flex-col sm:flex-row gap-4 text-xs">
                    <div>
                      <span className="text-[var(--text-muted)] block">Main Casualty Desk:</span>
                      <a
                        href={`tel:${COLLEGE.casualtyPhone}`}
                        className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent)]"
                      >
                        {COLLEGE.casualtyPhone}
                      </a>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block">Ambulance Emergency:</span>
                      <a
                        href={`tel:${COLLEGE.emergencyPhone}`}
                        className="font-semibold text-rose-500 hover:underline"
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
              <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Official Email
                    </h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-1 block text-xs font-semibold text-[var(--accent)] hover:underline truncate"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Office Hours
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-[var(--text-primary)]">
                      9:00 AM – 5:00 PM
                    </p>
                    <span className="text-[10px] text-[var(--text-muted)]">Mon through Sat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="overflow-hidden rounded-3xl border border-[var(--border-primary)] shadow-xs">
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
          <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-8 shadow-xs">
            <h3 className="text-xl font-display font-bold text-[var(--text-primary)] mb-1">
              Send an Official Message
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-normal mb-6">
              Messages submitted here are delivered to the General Secretary and respective executive committee.
            </p>
            <ContactClientForm />
          </div>
        </div>
      </div>
    </div>
  );
}
