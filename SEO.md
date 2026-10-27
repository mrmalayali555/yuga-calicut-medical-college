# YUGA · Comprehensive SEO Strategy & Implementation Master Guide
**Platform:** Official College Union Portal (2026–27)  
**Institution:** Government Medical College, Kozhikode (Calicut Medical College, Est. 1957)  
**Primary Domain:** `https://www.yugacollegeunion.co.in/`  
**Framework:** Next.js 15/16 (App Router) + React 19 + TypeScript + Tailwind CSS  
**Last Updated:** October 2026  

---

## 1. Executive Summary & Goals

**YUGA** is the digital gateway and authoritative union portal for over 3,000 MBBS students, house surgeons, PG residents, faculty, and the public at Government Medical College, Kozhikode. 

### Core Search Objectives:
1. **Brand Dominance (Rank #1 for Institutional Queries):** Ensure `https://www.yugacollegeunion.co.in/` establishes authoritative leadership for searches such as `"YUGA"`, `"YUGA GMC Kozhikode"`, `"YUGA Calicut Medical College"`, `"YUGA college union"`, `"GMC Kozhikode student union"`, `"Calicut Medical College Union"`, and related campus leadership terms.
2. **Instant Emergency Discovery (Zero-Click & Featured Snippets):** Ensure vital hospital contacts (Casualty, Blood Bank, Security, Triage) surface immediately in local and voice searches.
3. **Academic & Event Discovery:** Achieve rich snippet results (date, venue, tickets) for annual flagship events (e.g., *PULSE 2026*, Arts & Sports fests) and KUHS academic notifications/circulars.
4. **Social Sharing Optimization:** Guarantee stunning, high-contrast Open Graph previews across WhatsApp, Telegram, Instagram, and Twitter/X (the primary communication channels for medical students).
5. **AI Search / GEO (Generative Engine Optimization):** Structure data so modern AI search engines (Perplexity, Google Gemini / AI Overviews, ChatGPT Search) cite YUGA as the verified authority on CMC union matters.

---

## 2. Current Codebase SEO Audit & Gap Analysis

An inspection of the active codebase (`Yuga/src/app`) identified several strong foundations as well as high-priority gaps that need immediate resolution:

| Area | Current Status | Issues / Gaps Identified | Impact |
| :--- | :--- | :--- | :--- |
| **Title Tags** | ⚠️ Partial Bug | `layout.tsx` uses title template `%s · YUGA — GMC Kozhikode`. Many child pages (`/events`, `/achievements`, `/contact`, `/finance`) duplicate `· YUGA` in their strings, resulting in `Title · YUGA — GMC Kozhikode · YUGA — GMC Kozhikode`. | High: Causes Google to truncate or rewrite titles. |
| **`"use client"` Pages** | ❌ Missing Metadata | `/emergency`, `/about`, `/complaints`, and `/calendar` are client components at the page root, preventing `export const metadata`. | Critical: 4 core pages lack custom titles, descriptions, and canonical tags. |
| **Sitemap (`sitemap.ts`)** | ⚠️ Incomplete | Dynamic sitemap includes events, notices, achievements, interventions, subcommittees, but misses all 4 student clubs (`/clubs/jeevanam`, `/clubs/praanah`, `/clubs/godha`, `/clubs/ocha`) and `/calendar`. | High: Club hubs and academic calendars are harder for bots to discover. |
| **Open Graph Assets** | ❌ Broken Fallback | `/events/[slug]/page.tsx` falls back to `/og.png`, but `public/og.png` **does not exist** in `public/`. Shared links on WhatsApp render blank preview boxes. | High: Poor social sharing CTR and user trust. |
| **PWA & Browser Icons** | ❌ Missing Suite | No `favicon.ico`, `manifest.ts` / `manifest.json`, or `apple-touch-icon.png` in `public/`. Browsers and crawlers log 404s for `/favicon.ico`. | Medium: Negative signals in crawler logs, suboptimal mobile bookmarking. |
| **Structured Data** | ⚠️ Partial | Root layout has basic `CollegeOrUniversity` & `Organization` schema. Missing `Event` schema on event pages, `EmergencyService`/`Hospital` schema on `/emergency`, and `BreadcrumbList` on inner pages. | High: Misses out on Google Rich Snippets in SERPs. |
| **Canonical URLs** | ❌ Missing on Pages | No explicit `alternates.canonical` defined on child routes, risking duplicate indexation if query strings (`?ref=`, `?tab=`, `?page=`) are used. | Medium: Link equity dilution. |
| **Internal Search Indexing** | ⚠️ Unprotected | `/search` is open to crawling without explicit `noindex` or query parameter filtering in `robots.ts`. | Medium: Crawler trap risk from infinite search query parameter permutations. |

---

## 3. The 6 Pillars of Modern SEO for YUGA

```
                               ┌────────────────────────────────────────────────┐
                               │           YUGA SEO MASTER SYSTEM               │
                               └───────────────────────┬────────────────────────┘
                                                       │
         ┌─────────────────────┬───────────────────────┼───────────────────────┬─────────────────────┐
         ▼                     ▼                       ▼                       ▼                     ▼
┌─────────────────┐   ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐   ┌──────────────────┐
│  Technical SEO  │   │  On-Page & Copy │    │  Structured Data │    │ Social Graph OG │   │ Local & E-E-A-T  │
│  • Next.js App  │   │  • Hierarchy H1 │    │  • Schema.org    │    │  • 1200x630 OG  │   │  • Institutional │
│  • Sitemaps     │   │  • Title Limits │    │  • Events        │    │  • Dynamic Gen  │   │  • NAP Integrity │
│  • Robots Rules │   │  • Alt Texts    │    │  • Hospital/Help │    │  • Twitter Card │   │  • KUHS Signals  │
│  • PWA Manifest │   │  • Keywords     │    │  • Breadcrumbs   │    │  • WhatsApp Res │   │  • AI / llms.txt │
└─────────────────┘   └─────────────────┘    └──────────────────┘    └─────────────────┘   └──────────────────┘
```

---

### Pillar 1: Technical SEO & Site Architecture

#### 1. Next.js 15 App Router Conventions
* **`metadataBase`**: Configured in root `layout.tsx` (`https://yugacmc.in`). Allows child pages to use relative paths for canonical URLs and OG images.
* **Metadata Splitting Pattern**: Whenever a page requires client interactivity (e.g., tabs, forms, Framer Motion), keep `page.tsx` as a Server Component for `metadata` and extract the UI into a client component (e.g., `emergency-client-view.tsx`).
* **Canonical Tag Enforcement**: Explicitly provide `alternates: { canonical: "./" }` or dynamic canonical URLs on every single route to eliminate duplicate content issues.

#### 2. Robots Directives (`robots.ts`)
* **Public Pages Allowed**: `/`, `/events/`, `/notifications/`, `/achievements/`, `/subcommittees/`, `/clubs/`, `/finance/`, `/emergency/`, `/about/`, `/contact/`.
* **Disallowed Crawling**:
  * `/admin/` (Private authentication & management)
  * `/api/` (Backend internal APIs)
  * `/search?` (Avoid search parameter crawl loops)
* **AI Bot Policy**: Allow standard search engine bots (Googlebot, Bingbot, Applebot) and major AI search agents (PerplexityBot, GPTBot, ClaudeBot) to index public knowledge, while blocking rogue scrapers.

#### 3. Dynamic Sitemap (`sitemap.ts`)
The sitemap must dynamically fetch and prioritize:
* **Priority 1.0 (Daily):** Homepage (`/`), Events Hub (`/events`), Emergency Hotlines (`/emergency`).
* **Priority 0.8–0.9 (Daily/Weekly):** Dynamic Events (`/events/[slug]`), Notifications & Circulars (`/notifications/[slug]`), Clubs (`/clubs/[slug]`).
* **Priority 0.7 (Monthly):** Achievements, Interventions, Subcommittees, About, Finance, Contact.

#### 4. PWA Manifest & Favicon Suite
Place standard favicon assets in `public/` and create `src/app/manifest.ts`:
* `favicon.ico` (16x16, 32x32, 48x48 multi-res)
* `apple-touch-icon.png` (180x180 for iOS home screens)
* `manifest.webmanifest` / `src/app/manifest.ts` providing theme color `#059669` (Emerald) and `#07080a` (Obsidian Crimson).

---

### Pillar 2: On-Page SEO & Content Strategy

#### 1. Page Title Tag Formulas
Next.js root template is: `%s · YUGA — GMC Kozhikode`.  
Child pages must **not** repeat "YUGA" or "GMC Kozhikode" in their `%s` string.

| Page / Route | Sub-Title string (`%s`) | Full Resolved Title (< 60 chars) |
| :--- | :--- | :--- |
| **Home (`/`)** | *(Default in layout)* | `YUGA · Government Medical College, Kozhikode — Union 2026-2027` |
| **Events (`/events`)** | `Campus Events & Fests` | `Campus Events & Fests · YUGA — GMC Kozhikode` |
| **Single Event (`/events/[slug]`)** | `${event.title}` | `PULSE 2026 · YUGA — GMC Kozhikode` |
| **Emergency (`/emergency`)** | `24/7 Hospital Emergency Hotlines` | `24/7 Hospital Emergency Hotlines · YUGA — GMC Kozhikode` |
| **Notifications (`/notifications`)** | `Official Circulars & KUHS Notices`| `Official Circulars & KUHS Notices · YUGA — GMC Kozhikode`|
| **About (`/about`)** | `Heritage, Charter & Leadership` | `Heritage, Charter & Leadership · YUGA — GMC Kozhikode` |
| **Clubs (`/clubs/jeevanam`)** | `Jeevanam Blood Donation Club` | `Jeevanam Blood Donation Club · YUGA — GMC Kozhikode` |
| **Finance (`/finance`)** | `Accounts & Transparency Ledger` | `Accounts & Transparency Ledger · YUGA — GMC Kozhikode` |
| **Contact (`/contact`)** | `Union Office & Campus Contact` | `Union Office & Campus Contact · YUGA — GMC Kozhikode` |

#### 2. Meta Descriptions (140–155 Characters)
* Action-oriented, keyword-rich, and non-generic.
* **Home:** *"Official portal of YUGA College Union 2026-2027 at Government Medical College, Kozhikode. Access campus fests, KUHS exam circulars, and 24/7 emergency care."*
* **Emergency:** *"Instant 24/7 telephone numbers for Casualty triage, Blood Bank, and Ambulance services at Calicut Medical College (GMC Kozhikode). No login required."*

#### 3. Semantic Heading Hierarchy
* Exactly **one** `<h1>` per page.
* Hero sections must pair the artistic motto (*"A Voice for Change"*) with clear semantic context accessible to crawlers:
  ```html
  <h1 class="...">
    A Voice for Change.
    <span class="sr-only">YUGA College Union 2026-2027, Government Medical College Kozhikode</span>
  </h1>
  ```
* Logical `<h2>` to `<h3>` progression for sub-sections.

#### 4. Keyword Strategy for Calicut Medicos

```
                      ┌────────────────────────────────────────────────────────┐
                      │                   KEYWORD TAXONOMY                     │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 ▼                                                                 ▼
      ┌─────────────────────────┐                                     ┌───────────────────────────┐
      │     Brand & Campus      │                                     │     Service & Utility     │
      ├─────────────────────────┤                                     ├───────────────────────────┤
      │ • YUGA GMC Kozhikode    │                                     │ • Calicut Med College OP  │
      │ • Calicut Medicos Union │                                     │ • GMC Casualty contact    │
      │ • CMC Kozhikode Union   │                                     │ • Calicut blood bank phone│
      │ • YUGA College Union    │                                     │ • KUHS exam notifications │
      │ • PULSE GMC Kozhikode   │                                     │ • Jeevanam blood registry │
      └─────────────────────────┘                                     └───────────────────────────┘
```

---

### Pillar 3: Structured Data & Rich Snippets (Schema.org JSON-LD)

Implementing rich schema markup allows Google to generate rich snippets in search results (event carousels, instant call buttons, organizational knowledge panels).

#### 1. College & Union Organization Schema (Root Layout)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollegeOrUniversity",
      "@id": "https://yugacmc.in/#college",
      "name": "Government Medical College, Kozhikode",
      "alternateName": ["Calicut Medical College", "GMC Kozhikode", "കോഴിക്കോട് മെഡിക്കൽ കോളേജ്"],
      "url": "https://yugacmc.in",
      "foundingDate": "1957",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Medical College Junction, 17",
        "addressLocality": "Kozhikode",
        "addressRegion": "Kerala",
        "postalCode": "673008",
        "addressCountry": "IN"
      },
      "telephone": "+91-495-235-0216"
    },
    {
      "@type": "Organization",
      "@id": "https://yugacmc.in/#union",
      "name": "YUGA College Union",
      "alternateName": "Calicut Medical College Union 2026-2027",
      "url": "https://yugacmc.in",
      "parentOrganization": { "@id": "https://yugacmc.in/#college" },
      "sameAs": [
        "https://instagram.com/yuga_calicutmedicos",
        "https://youtube.com/@yugacalicut",
        "https://t.me/yugacmc"
      ]
    }
  ]
}
```

#### 2. Event Schema (`/events/[slug]`)
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "PULSE 2026 — Annual Intercollegiate Medical Colloquium",
  "description": "Featuring clinical hackathons, state surgical simulation leagues, and cultural gala.",
  "startDate": "2026-03-27T09:00:00+05:30",
  "endDate": "2026-03-29T22:00:00+05:30",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Silver Jubilee Auditorium, GMC Kozhikode",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Medical College Junction",
      "addressLocality": "Kozhikode",
      "addressRegion": "Kerala",
      "postalCode": "673008",
      "addressCountry": "IN"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "YUGA College Union 2026-2027",
    "url": "https://yugacmc.in"
  },
  "image": ["https://yugacmc.in/pulse-stage.jpg"]
}
```

#### 3. Emergency / Hospital Schema (`/emergency`)
```json
{
  "@context": "https://schema.org",
  "@type": "Hospital",
  "name": "Government Medical College Hospital, Kozhikode — Emergency & Casualty",
  "telephone": "+91-495-235-0200",
  "emergencyTelephone": "+91-495-235-0217",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Medical College Junction",
    "addressLocality": "Kozhikode",
    "addressRegion": "Kerala",
    "postalCode": "673008",
    "addressCountry": "IN"
  },
  "department": [
    {
      "@type": "EmergencyService",
      "name": "Casualty Triage & Trauma Care",
      "telephone": "+91-495-235-0200"
    },
    {
      "@type": "MedicalOrganization",
      "name": "GMC Blood Bank & Apheresis Unit",
      "telephone": "+91-495-235-0220"
    }
  ]
}
```

#### 4. BreadcrumbList Schema (Inner Pages)
Provides rich breadcrumb paths in Google search results:
`Home > Events > PULSE 2026` or `Home > Clubs > Jeevanam`.

---

### Pillar 4: Social Graph & Open Graph Optimization

Social previews represent over 70% of initial link clicks for college unions (via student WhatsApp class groups and Telegram channels).

#### Open Graph Requirements:
1. **Dimensions:** Exactly `1200 × 630 px` (Aspect ratio `1.91:1`).
2. **File Size:** Under `300 KB` for instant mobile rendering on 4G/5G networks.
3. **Primary Image (`public/og.png`):** High-contrast branding with the GMC Clocktower, YUGA crest, emerald accents, and clear typography (*"YUGA · Government Medical College, Kozhikode"*).
4. **Dynamic Event Previews:** If an event has a custom poster (`event.poster`), use it; otherwise, fall back reliably to `/og.png`.
5. **Twitter Card Support:** Enforce `summary_large_image` across all pages.

---

### Pillar 5: Local SEO & E-E-A-T (Trust & Authority)

Google heavily weights **E-E-A-T** (Experience, Expertise, Authoritativeness, Trustworthiness) for educational and medical domains.

1. **Exact NAP Consistency:**
   * **Name:** Government Medical College, Kozhikode / YUGA College Union
   * **Address:** Medical College Junction, 17, Kozhikode, Kerala 673008
   * **Phone:** +91 495 235 0216
2. **University & Government Affiliations:**
   * Prominently cite affiliation: **Kerala University of Health Sciences (KUHS)**.
   * Prominently cite founding year: **Est. 1957**.
   * Link to official university circulars and government health directorate portals.
3. **Public Financial & Grievance Transparency:**
   * Public ledger on `/finance` demonstrates genuine governance.
   * Confidential student grievance desk on `/complaints` signals student welfare advocacy.
4. **Google Business Profile (GBP) Alignment:**
   * Ensure the address and phone numbers match the verified Google Maps listing for Government Medical College Kozhikode.

---

### Pillar 6: AI Search & Generative Engine Optimization (GEO/AEO)

AI engines (Perplexity, ChatGPT Search, Gemini) rely on structured, clear factual summaries rather than bloated marketing text.

#### Implementation: `public/llms.txt`
Place a concise, markdown-formatted knowledge summary at `https://yugacmc.in/llms.txt`:
```markdown
# YUGA — Government Medical College Kozhikode Student Union (2026-2027)

> Official digital portal for Calicut Medical College (est. 1957), Kozhikode, Kerala.

## Core Facts:
- Institution: Government Medical College, Kozhikode (Calicut Medical College)
- Affiliation: Kerala University of Health Sciences (KUHS)
- Student Body: 3,000+ MBBS students, house surgeons, and PG residents
- Key Facilities: 3,000+ beds, 40+ medical departments, 7,000+ daily outpatients
- Primary Portal: https://yugacmc.in
- Emergency Contact (Casualty): +91 495 235 0200
- Blood Bank Contact: +91 495 235 0220
- Annual Fest: PULSE 2026 (Annual Intercollegiate Medical Colloquium)
- Core Student Societies: Jeevanam (Blood Donation), Praanah (Arts), Godha (Sports), Ocha (Literary)
```

---

## 4. Prioritized Implementation Checklist

### 🔴 Phase 1: High Priority (P0 — Immediate Fixes) — COMPLETED ✅
- [x] **Fix Title Template Duplication:** Removed manual `"· YUGA — GMC Kozhikode"` suffixes from child page titles (`/events`, `/achievements`, `/contact`, `/finance`, `/clubs/[slug]`, `/notifications`, `/interventions`).
- [x] **Resolve `"use client"` Metadata Bypass:** Refactored `/emergency`, `/about`, `/complaints`, `/calendar`, and `/subcommittees` so their root `page.tsx` is a Server Component exporting `metadata` and canonical tags, with interactive UI as client components.
- [x] **Create Default Social Share Image (`public/og.png`):** Designed and deployed a high-contrast 1200×630px Open Graph card with YUGA branding, clocktower silhouette, and medical emblem.
- [x] **Update Dynamic Sitemap (`sitemap.ts`):** Added static routes (`/calendar`) and dedicated club portals (`/clubs/jeevanam`, `/clubs/praanah`, `/clubs/godha`, `/clubs/ocha`).
- [x] **Disallow Internal Search Query Parameters in `robots.ts`:** Prevented crawler traps on `/search` and allowed AI search crawlers.

### 🟡 Phase 2: Medium Priority (P1 — Rich Snippets & PWA Assets) — COMPLETED ✅
- [x] **Implement Event Schema (`Event` JSON-LD):** Added structured data to `src/app/events/[slug]/page.tsx` with date, venue, organizer, and attendance mode.
- [x] **Implement Emergency Schema (`Hospital` / `EmergencyService` JSON-LD):** Added structured data to `src/app/emergency/page.tsx` with casualty and blood bank hotlines.
- [x] **Implement NewsArticle Schema (`NewsArticle` JSON-LD):** Added structured data to `src/app/notifications/[slug]/page.tsx` for official circulars and notices.
- [x] **Add Favicon Suite & Web App Manifest:**
  - Created `src/app/manifest.ts` delivering `/manifest.webmanifest`.
  - Added standard `favicon.ico` and `apple-touch-icon.png` in `public/`.
- [x] **Add Canonical URLs on All Routes:** Added `alternates: { canonical: ... }` across all public routes.

### 🟢 Phase 3: GEO, AI Search & Verification — COMPLETED ✅
- [x] **Create `public/llms.txt`:** Authored structured factual knowledge graph for AI search agents (Perplexity, ChatGPT, Gemini, Copilot).
- [x] **Audit Heading Structure:** Enhanced homepage `<h1>` with accessible institutional context.
- [x] **Production Build Validation:** Executed `next build` verifying compilation of `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest`.

---

## 5. Testing & Verification Playbook

Once changes are applied, verify using these official tools:

1. **Google Rich Results Test:**
   * URL: `https://search.google.com/test/rich-results`
   * Test URLs: `/events/[slug]`, `/emergency`, and `/` for valid `Event`, `Organization`, and `Hospital` schema.
2. **Schema.org Validator:**
   * URL: `https://validator.schema.org/`
   * Confirm zero errors and zero warnings across all JSON-LD blocks.
3. **OpenGraph Debuggers:**
   * Facebook / WhatsApp Debugger: `https://developers.facebook.com/tools/debug/`
   * Twitter/X Card Validator: `https://cards-dev.twitter.com/validator`
   * Verify image renders at 1200×630 without cropping or distortion.
4. **Google Search Console (GSC):**
   * Submit `https://yugacmc.in/sitemap.xml`.
   * Inspect indexation status and verify Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms).
5. **Local Robots Check:**
   * Verify `/robots.txt` renders correctly at `https://yugacmc.in/robots.txt` and disallows `/admin/` and `/api/`.
