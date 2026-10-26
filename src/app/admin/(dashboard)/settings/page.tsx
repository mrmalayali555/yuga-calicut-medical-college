import { AdminHeader, AdminCard } from "@/components/admin/admin-ui";
import { Field, TextArea, SubmitBtn } from "@/components/admin/form-fields";
import { db } from "@/lib/db";
import { saveSettingsForm } from "@/lib/actions/content";
import { COLLEGE, YUGA, SITE } from "@/lib/site";
import { ThemeSwitcher } from "@/components/admin/theme-switcher";
import { GridLayoutControl } from "@/components/admin/grid-layout-control";
import { AchievementsSliderControl } from "@/components/admin/achievements-slider-control";
import { getGridLayoutSettings, getAchievementsSliderSettings, type SiteTheme } from "@/lib/queries";

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await db.setting.findUnique({ where: { key } });
    return row?.value ? (JSON.parse(row.value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default async function AdminSettingsPage() {
  const [hero, identity, contact, stats, socials, navSearch, themeSetting, heroCard, gridLayout, sliderSettings] = await Promise.all([
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
    getSetting<{ active: SiteTheme }>("theme", { active: "obsidian-crimson" }),
    getSetting("hero_card", {
      visible: true,
      cardStyle: "white",
      tag: "ALL-KERALA CONCLAVE",
      date: "MARCH 27–29, 2026",
      category: "Annual Intercollegiate Medical Colloquium",
      title: "PULSE 2026: The Sovereign Vanguard",
      description: "Featuring 42 clinical hackathons, state surgical simulation leagues, national med-law panels, and Calicut's landmark cultural gala.",
      venue: "Silver Jubilee Auditorium, GMC",
      btnText: "Delegate Pass →",
      btnLink: "/events",
      image: "/pulse-stage.jpg",
    }),
    getGridLayoutSettings(),
    getAchievementsSliderSettings(),
  ]);

  return (
    <>
      <AdminHeader
        title="Site Branding & Configuration"
        description="Central site configuration system. Change theme aesthetic, union identity, college name, branding, contact hotlines, social channels, and public visibility without rewriting code."
      />

      <div className="mb-8 space-y-6">
        <AchievementsSliderControl initialSettings={sliderSettings} />
      </div>

      <form action={saveSettingsForm} className="space-y-8">
        {/* Dynamic Theme Switcher */}
        <AdminCard>
          <ThemeSwitcher initialTheme={themeSetting.active || "emerald"} />
        </AdminCard>

        {/* Public Grid Layouts & Display Columns */}
        <AdminCard>
          <div className="mb-4">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Public Page Grid Layouts &amp; Card Columns
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Admin control to switch between 1 card per row, 2 cards per row, or 3 cards per row across public pages.
            </p>
          </div>

          <div className="space-y-4">
            <GridLayoutControl
              type="interventions"
              label="Public Union Interventions Listing"
              initialColumns={gridLayout.interventionsColumns}
              initialMobileColumns={gridLayout.interventionsMobileColumns}
            />
            <GridLayoutControl
              type="events"
              label="Public Events Listing"
              initialColumns={gridLayout.eventsColumns}
              initialMobileColumns={gridLayout.eventsMobileColumns}
            />
            <GridLayoutControl
              type="achievements"
              label="Public Honors &amp; Achievements Listing"
              initialColumns={gridLayout.achievementsColumns}
              initialMobileColumns={gridLayout.achievementsMobileColumns}
            />
            <GridLayoutControl
              type="notifications"
              label="Public Circulars &amp; Notifications Listing"
              initialColumns={gridLayout.notificationsColumns}
            />
          </div>
        </AdminCard>

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

        {/* Homepage Featured Event Card (Desktop & Mobile) */}
        <AdminCard>
          <div className="flex items-start justify-between border-b border-[var(--border-primary)] pb-4 mb-4 gap-4">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Homepage Featured Event Card (Hero Banner on Desktop &amp; Mobile)
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Control the featured event card shown in the hero section across both desktop and mobile screens. You can customize the title, dates, category, description, venue, button link, thumbnail image, or completely turn it OFF (hide from public view).
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-[var(--bg-surface-elevated)] border border-[var(--border-primary)] px-3 py-1.5 rounded-lg shrink-0">
              <input
                type="checkbox"
                name="hero_card_visible"
                defaultChecked={heroCard.visible !== false}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-[var(--text-primary)]">
                Card Visible (Display ON / OFF)
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Card Aesthetic Style
                </label>
                <select
                  name="hero_card_style"
                  defaultValue={heroCard.cardStyle || "dark"}
                  className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="dark">Stealth Obsidian Glass (Dark)</option>
                  <option value="white">High-Contrast White</option>
                </select>
                <p className="mt-1 text-[11px] text-[var(--text-faint)]">
                  Matches the obsidian crimson theme system across devices.
                </p>
              </div>

              <Field
                label="Header Badge / Tag"
                name="hero_card_tag"
                defaultValue={heroCard.tag || "FEATURED EVENT"}
                hint="e.g. FEATURED EVENT, ALL-KERALA CONCLAVE, ANNUAL FEST"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Date & Schedule"
                name="hero_card_date"
                defaultValue={heroCard.date || "MARCH 27 – 29, 2026"}
              />
              <Field
                label="Sub-Category Label"
                name="hero_card_category"
                defaultValue={heroCard.category || "Annual Intercollegiate Medical Colloquium"}
              />
            </div>

            <Field
              label="Headline / Event Title"
              name="hero_card_title"
              defaultValue={heroCard.title || "PULSE 2026"}
            />

            <TextArea
              label="Event Description"
              name="hero_card_description"
              defaultValue={heroCard.description || "Featuring clinical hackathons, state surgical simulation leagues, national med-law panels, and a landmark cultural gala."}
              rows={2}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Venue / Campus Location"
                name="hero_card_venue"
                defaultValue={heroCard.venue || "Silver Jubilee Auditorium, GMC"}
              />
              <Field
                label="Thumbnail Image URL / Path"
                name="hero_card_image"
                defaultValue={heroCard.image || "/pulse-stage.jpg"}
                hint="Default: /pulse-stage.jpg or custom image URL"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Button Text"
                name="hero_card_btn_text"
                defaultValue={heroCard.btnText || "Explore event →"}
              />
              <Field
                label="Button Link URL"
                name="hero_card_btn_link"
                defaultValue={heroCard.btnLink || "/events"}
                hint="e.g. /events or specific event page /events/pulse-2026"
              />
            </div>
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
