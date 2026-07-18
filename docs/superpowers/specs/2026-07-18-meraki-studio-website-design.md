# Meraki Studio Website — Design

Date: 2026-07-18

## Purpose

A marketing/portfolio website for Meraki, an audio recording studio. The site
presents the studio's services, team, work, and clientele in a minimalistic,
professional, work-oriented way, and lets visitors reach out via WhatsApp to
book. No pricing is shown anywhere. The studio owner (non-technical) needs to
be able to add/update client logos, work samples, team members, studio
photos, equipment, and ad-slot creative herself, without editing code.

## Architecture

- **Next.js (App Router)** with **static export** (`output: 'export'`),
  TypeScript, Tailwind CSS. The build produces plain static HTML/CSS/JS,
  deployable to any host (including traditional shared hosting), no Node
  server required.
- **Sanity** as a hosted headless CMS for all content that changes over
  time (team, clientele, works, studio photos, equipment, ad-slot
  creative). Sanity Studio is deployed standalone (`sanity deploy`, hosted
  free at `<project>.sanity.studio`) rather than embedded as a route in the
  Next.js app — this keeps the main site fully static (embedding Studio
  would require dynamic rendering, which conflicts with static export).
- The site fetches content from Sanity's API/CDN **at runtime, client-side**.
  This means content updates the owner makes in Sanity Studio (e.g. a new
  client logo) appear on the live site immediately, with no rebuild or
  redeploy needed — the "no-code, independent of the codebase" requirement.
- Sanity's free tier comfortably covers this site's content volume (image
  storage, API requests, single-user access for the owner).
- Images are hosted and optimized by Sanity's CDN — no manual image
  processing needed by the owner.

## Site Structure

Three routes total:

- **`/`** — the full single-scroll homepage (all sections below)
- **`/our-works`** — dedicated page, work samples grouped by service category
- **`/terms`** — Terms & Conditions, plain long-form text page in the same
  theme

## Homepage Sections (in order)

1. **Hero** — tagline, "Book Now" and "Our Works" CTAs, studio photo/video
   backdrop
2. **About** — studio story/philosophy
3. **Services** — 5 cards: Recording, Music Production, Mixing &
   Mastering, Audiobook Productions, Music Distribution & Publishing
4. **Ad Slot** — one banner slot; shows the studio's own campaign creative
   when one is set in Sanity, otherwise falls back to Google AdSense
5. **Studio** — studio photo gallery (grid, click-to-enlarge) + equipment
   showcase (name, short spec line, image — kept minimal, not spec-sheet
   heavy)
6. **Our Works (teaser)** — a few highlighted samples + "View All Works"
   link to `/our-works`
7. **Team** — 2 member cards (photo, name, role, bio, social links)
8. **Clientele** — auto-scrolling logo strip (pauses on hover), built to
   handle 10+ logos gracefully as the list grows
9. **Contact** — address, phone, email, embedded Google Map, WhatsApp
   "Book Now" button (`wa.me/<number>?text=...`)
10. **Footer** — logotype, quick nav links, social icons, link to `/terms`

Navigation is a sticky header: logotype, section links (smooth-scroll on
the homepage), theme toggle, and an always-visible "Book Now" button. On
mobile, nav links collapse into a hamburger menu; "Book Now" stays visible.
No contact form — WhatsApp plus static contact info is the only contact
method, so the site has no backend logic beyond the ad-slot fallback and
Sanity content fetching.

## Design System

**Color palette** (locked):

| Token | Light mode | Dark mode |
|---|---|---|
| Background (primary) | `#FAF6EC` | `#211511` |
| Background (alt/section) | `#F3ECDC` | `#2E1F18` |
| Text (heading/primary) | `#2F1B12` | `#EFDCC4` / `#F1E9D6` |
| Text (secondary) | `#5c5750` / `#6b5d4f` | `#c9bfae` / `#b8ab97` |
| Brand accent (primary) | `#2F1B12` | `#C98B52` (lightened tint) |
| CTA — "Book Now" button | `#2F1B12` | `#E0952F` |
| Secondary accent (sofa blue) | `#7C93A8` | `#8FA8BA` |

Dark mode's background leans warm brown-charcoal rather than cold grey, so
the cozy feeling carries across both themes.

**Mode default**: matches the visitor's system/OS preference on first
load; manual override via the toggle persists in `localStorage`.

**Logo**: text-based logotype ("MERAKI STUDIO") styled with the palette
for now; swappable for a real logo file later without a redesign.

**Typography**: a clean, professional sans-serif for body/UI text (e.g.
Inter or similar), paired with a warmer/heavier display weight for
headings so the site doesn't feel cold or corporate. Exact font finalized
during implementation.

**Hyperlinks**: visibly styled (underline or accent-color + underline on
hover) per the "present hyperlinks" requirement — applies to in-body
links, social icons, and footer links.

**No pricing**: enforced as a content rule across every section.

## Components

- `ServiceCard`, `TeamMemberCard`, `WorkSampleCard`, `EquipmentCard` — data-
  driven, rendered from Sanity content
- `AdSlot` — checks Sanity for an active campaign; renders it if present,
  otherwise renders a Google AdSense unit
- `ClientLogoStrip` — auto-scrolling, pauses on hover, scales to any logo
  count
- `StudioGallery` — grid with click-to-enlarge

## Sanity Schemas

`teamMember`, `clientLogo`, `workSample` (with a `category` field matching
the 5 service categories, used to group `/our-works`), `studioPhoto`,
`equipmentItem`, `adCampaign` (image + link; empty means AdSense fallback).

A `siteSettings` singleton document covers everything else the owner
should be able to edit without code: address, phone number, email,
WhatsApp number (used to build the `wa.me` link), Google Maps embed URL,
and the Terms & Conditions body text.

## Non-Functional

- **Responsive**: mobile-first; all grids reflow to single/double column
  on small screens; clientele strip keeps scrolling horizontally
- **Accessibility**: sufficient contrast in both themes against the locked
  palette, semantic HTML landmarks, alt text on all images/logos,
  keyboard-navigable nav and theme toggle
- **Hosting**: `next build` static export (`out/` folder) deploys to any
  static host, including the owner's existing hosting
- **Verification**: no backend/business logic beyond ad-slot fallback and
  Sanity fetching, so verification is primarily manual/visual — each
  section rendering correctly in both themes and at mobile/tablet/desktop
  widths, the ad-slot fallback logic, the WhatsApp link, and confirming
  Sanity content changes appear on the live site without a redeploy

## Out of Scope

- Contact form with email backend (WhatsApp + static info instead, by
  request)
- Any pricing display
- Real content assets at launch — the site ships with placeholder
  text/images; the owner replaces them via Sanity Studio
