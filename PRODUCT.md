# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** MBBS students (Phase 1-Final), House Surgeons (interns), and PG Residents at Government Medical College, Kozhikode - approx. 3,000 enrolled medicos. They access the site from mobile (majority) and desktop, often between clinical postings. They need quick access to event registrations, official circulars, emergency contacts, and grievance submission.

**Secondary:** Union executive council members and subcommittee heads who manage content through the admin panel - publishing events, uploading circulars, managing registration forms, tracking submissions, and moderating grievances.

**Tertiary:** Faculty, hospital staff, and prospective students.

## Product Purpose

YUGA is the official digital portal for the YUGA College Union 2026-2027 at Government Medical College, Kozhikode (Calicut Medical College, est. 1957). It is the single authoritative source for campus fests and event registrations (interactive Ovio ticket passes), academic schedules and KUHS exam timetables, official circulars and union communications, student grievance submission, 24/7 emergency hospital contacts, union achievements and Hall of Fame, and student intervention/welfare case tracking.

Success = a medico can register for an event, find an emergency number, or submit a grievance in under 30 seconds on a mobile browser.

## Positioning

The only official, admin-managed union portal for Calicut Medicos - replacing scattered WhatsApp broadcasts, PDF circulars, and paper registration forms with a single authenticated, real-time platform. No equivalent college union in the KUHS network has an interactive event ticketing system (Ovio) or a structured grievance+intervention management workflow.

## Operating Context

- Students access primarily on mobile (Android) during campus hours; admin panel used on desktop by office bearers
- College runs 40+ departments, 3,000+ beds, 7,000+ daily outpatients - emergency contacts must be instantly visible without login
- Academic calendar follows KUHS affiliation - exam dates, clinical posting rotations, and assessment periods are mission-critical data
- The union operates 16 subcommittees (fine arts, sports, literary, social aid, etc.)
- Event registrations use a custom form builder - forms link to events and submissions are downloadable as CSV by admin
- Grievances are confidential - no public disclosure of complainant identity

## Capabilities and Constraints

**Confirmed capabilities:**
- Next.js 15 (App Router) + Prisma + PostgreSQL
- Tailwind CSS v4 + custom CSS design system (white and emerald green, WCAG AAA)
- Framer Motion animations throughout
- Ovio EventTicket component (minimal variant) for interactive event passes
- Admin panel: events, forms, submissions, committees, achievements, interventions, media, emergency, notifications, marquee, complaints, sessions
- Authentication via NextAuth (admin-only)
- File upload for circulars/media
- Registration form builder with custom field types
- CSV export of form submissions
- Emergency registry (public, no auth required)

**Constraints:**
- No dark mode (white and emerald green - client specified)
- Must remain WCAG AAA compliant - all text fully visible on white backgrounds
- Emergency contacts must always be accessible without login
- Grievances must be anonymous/confidential
- Platform: web only

## Brand Commitments

- Name: YUGA - meaning epoch/era in Malayalam; the 2026-2027 union identity
- College: Government Medical College, Kozhikode (Calicut Medical College / Calicut Medicos)
- Color: White canvas + rich medical emerald green (#059669 accent, #047857 dark) - client-specified, no dark mode
- Typography: Inter (body/UI) + Instrument Serif (display/editorial headings)
- Tone: Official, trusted, and authoritative - but approachable and student-facing. Not corporate. Not casual.
- Domain: yugacmc.in
- Socials: Instagram @yuga_calicutmedicos, YouTube @yugacalicut, Telegram @yugacmc

## Evidence on Hand

- Full codebase with working admin panel, forms system, interventions module, and public-facing pages
- Mock data seeded for events, achievements, circulars, leadership, and emergency contacts
- Prisma schema with: Event, RegistrationForm, FormField, Submission, Committee, Member, Achievement, Circular, Complaint, Intervention, EmergencyContact, MediaItem, Marquee, Session
- Ovio EventTicket (minimal variant) installed and wired to featured event on homepage

## Product Principles

1. Speed for the stressed: A medico between rounds should reach any critical information in under 30 seconds on mobile.
2. Authoritative but human: Official communications must feel trustworthy, never bureaucratic or cold. The union speaks with students, not at them.
3. Admin is the product too: The admin panel must be as polished as the public site - slow admin workflows create stale public content.
4. Every pixel earns its place: White and green is the constraint; richness must come from typography, spacing, hierarchy, and motion.
5. Emergency above all: Any feature that slows access to emergency contacts is a defect, not a trade-off.

## Accessibility & Inclusion

- WCAG AAA target across all user-facing pages
- All text must remain legible on pure white backgrounds (high-contrast slate palette)
- Reduced-motion media query respected throughout
- Emergency section must function without JavaScript enabled
