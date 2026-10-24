import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { saveSettingsForm } from "@/lib/actions/content";
import { COLLEGE, YUGA, SITE } from "@/lib/site";

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.setting.findUnique({ where: { key } });
  try {
    return row?.value ? (JSON.parse(row.value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default async function AdminSettingsPage() {
  const [hero, identity, contact, stats, socials, navSearch] = await Promise.all([
    getSetting("hero", {
      badge: COLLEGE.name,
      title: "The Voice of Calicut Medicos",
      subtitle: YUGA.description,
    }),
    getSetting("identity", {
      unionName: YUGA.name,
      unionMalayalam: YUGA.nameMalayalam,
      collegeName: COLLEGE.name,
      academicYear: YUGA.year,
      tagline: YUGA.tagline,
    }),
    getSetting("contact", {
      address: COLLEGE.address,
      phone: COLLEGE.phone,
      emergencyPhone: COLLEGE.casualtyPhone,
      email: YUGA.email,
    }),
    getSetting("stats", {
      students: 3000,
      events: 48,
      achievements: 96,
      committees: 12,
    }),
    getSetting("socials", {
      instagram: YUGA.socials.instagram,
      youtube: YUGA.socials.youtube,
      whatsapp: YUGA.socials.whatsapp,
      telegram: YUGA.socials.telegram,
    }),
    getSetting("nav_search", { showMobile: true, showDesktop: true }),
  ]);

  return (
    <>
      <AdminHeader
        title="Site Branding & Configuration"
        description="Central site configuration system. Change union identity, college name, branding, contact hotlines, social channels, and public visibility without rewriting code."
      />

      <form action={saveSettingsForm} className="space-y-8">
        {/* Union Identity */}
        <AdminCard>
          <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">
            Union Brand & Institutional Identity
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full Union Name"
              name="union_name"
              defaultValue={identity.unionName}
              required
            />
            <Field
              label="Local Language Name (Malayalam / Regional)"
              name="union_malayalam"
              defaultValue={identity.unionMalayalam}
            />
            <Field
              label="College / Institution Name"
              name="college_name"
              defaultValue={identity.collegeName}
              required
            />
            <Field
              label="Academic Year / Epoch"
              name="academic_year"
              defaultValue={identity.academicYear}
              required
            />
            <div className="sm:col-span-2">
              <Field
                label="Union Tagline"
                name="tagline"
                defaultValue={identity.tagline}
              />
            </div>
          </div>
        </AdminCard>

        {/* Homepage Hero */}
        <AdminCard>
          <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">
            Homepage Hero Section
          </h3>
          <div className="grid gap-4">
            <Field
              label="Badge Pill Text"
              name="hero_badge"
              defaultValue={hero.badge}
              hint="The small medical pill above the primary hero headline"
            />
            <Field
              label="Main Hero Title"
              name="hero_title"
              defaultValue={hero.title}
              required
            />
            <TextArea
              label="Hero Subtitle & Introduction"
              name="hero_subtitle"
              defaultValue={hero.subtitle}
              rows={2}
            />
          </div>
        </AdminCard>

        {/* Contact Details & Hotlines */}
        <AdminCard>
          <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">
            Official Contact Desk & Emergency Numbers
          </h3>
          <div className="grid gap-4">
            <TextArea
              label="Physical Campus Address"
              name="contact_address"
              defaultValue={contact.address}
              rows={2}
              required
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Office Telephone"
                name="contact_phone"
                defaultValue={contact.phone}
                required
              />
              <Field
                label="Casualty / Emergency Desk"
                name="contact_emergency_phone"
                defaultValue={contact.emergencyPhone}
                required
              />
              <Field
                label="Official Email Address"
                name="contact_email"
                type="email"
                defaultValue={contact.email}
                required
              />
            </div>
          </div>
        </AdminCard>

        {/* Social Media Channels */}
        <AdminCard>
          <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">
            Social & Community Channels
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Instagram URL"
              name="social_instagram"
              defaultValue={socials.instagram}
            />
            <Field
              label="YouTube URL"
              name="social_youtube"
              defaultValue={socials.youtube}
            />
            <Field
              label="WhatsApp Community / Group URL"
              name="social_whatsapp"
              defaultValue={socials.whatsapp}
            />
            <Field
              label="Telegram Channel URL"
              name="social_telegram"
              defaultValue={socials.telegram}
            />
          </div>
        </AdminCard>

        {/* Stat Counters */}
        <AdminCard>
          <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">
            Campus Metric Counters
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field
              label="Medicos Enrolled"
              name="stats_students"
              type="number"
              defaultValue={stats.students}
            />
            <Field
              label="Annual Events"
              name="stats_events"
              type="number"
              defaultValue={stats.events}
            />
            <Field
              label="State / National Laurels"
              name="stats_achievements"
              type="number"
              defaultValue={stats.achievements}
            />
            <Field
              label="Active Clubs & Wings"
              name="stats_committees"
              type="number"
              defaultValue={stats.committees}
            />
          </div>
        </AdminCard>

        {/* Search Visibility */}
        <AdminCard>
          <h3 className="mb-2 text-base font-bold text-[var(--text-primary)]">
            Navigation Search Visibility
          </h3>
          <p className="mb-4 text-xs text-[var(--text-secondary)] font-normal">
            Control whether the quick search icon is visible across mobile and desktop navigation bars.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="search_show_mobile"
                defaultChecked={navSearch.showMobile}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Show search shortcut on Mobile screens
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="search_show_desktop"
                defaultChecked={navSearch.showDesktop}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                Show search bar / ⌘K command trigger on Desktop screens
              </span>
            </label>
          </div>
        </AdminCard>

        <div className="flex justify-end pt-4">
          <SubmitBtn>Save All Branding Settings</SubmitBtn>
        </div>
      </form>
    </>
  );
}
