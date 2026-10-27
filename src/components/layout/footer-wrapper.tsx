import { db } from "@/lib/db";
import { Footer } from "./footer";
import { COLLEGE, YUGA } from "@/lib/site";

const DEFAULT_FOOTER = {
  tagline:
    "Official student union of Government Medical College, Kozhikode — representing every medico across academics, culture, sport, and advocacy.",
  copyright: `© ${new Date().getFullYear()} YUGA College Union · Government Medical College, Kozhikode`,
  col1Heading: "Explore",
  col1Links: [
    { label: "Home", href: "/" },
    { label: "Events & Fests", href: "/events" },
    { label: "Achievements", href: "/achievements" },
    { label: "Notifications", href: "/notifications" },
  ],
  col2Heading: "Union",
  col2Links: [
    { label: "Interventions", href: "/interventions" },
    { label: "Subcommittees", href: "/subcommittees" },
    { label: "Union Accounts", href: "/finance" },
    { label: "About YUGA", href: "/about" },
  ],
  col3Heading: "Support",
  col3Links: [
    { label: "Drop a Suggestion", href: "/complaints" },
    { label: "Emergency Directory", href: "/emergency" },
    { label: "Contact Us", href: "/contact" },
  ],
  phone: COLLEGE.phone,
  email: YUGA.email,
  address: COLLEGE.address,
  instagram: YUGA.socials.instagram,
  youtube: YUGA.socials.youtube,
  telegram: YUGA.socials.telegram,
  whatsapp: YUGA.socials.whatsapp,
};

export async function FooterWrapper() {
  let footerSettings = DEFAULT_FOOTER;

  try {
    const [footerRow, contactRow, socialsRow] = await Promise.all([
      db.setting.findUnique({ where: { key: "footer" } }).catch(() => null),
      db.setting.findUnique({ where: { key: "contact" } }).catch(() => null),
      db.setting.findUnique({ where: { key: "socials" } }).catch(() => null),
    ]);

    if (footerRow?.value) {
      const saved = JSON.parse(footerRow.value);
      footerSettings = { ...footerSettings, ...saved };
    }
    if (contactRow?.value) {
      const c = JSON.parse(contactRow.value);
      footerSettings = {
        ...footerSettings,
        phone: c.phone || footerSettings.phone,
        email: c.email || footerSettings.email,
        address: c.address || footerSettings.address,
      };
    }
    if (socialsRow?.value) {
      const s = JSON.parse(socialsRow.value);
      footerSettings = {
        ...footerSettings,
        instagram: s.instagram || footerSettings.instagram,
        youtube: s.youtube || footerSettings.youtube,
        telegram: s.telegram || footerSettings.telegram,
        whatsapp: s.whatsapp || footerSettings.whatsapp,
      };
    }
  } catch {
    // fallback to defaults
  }

  return <Footer settings={footerSettings} />;
}
