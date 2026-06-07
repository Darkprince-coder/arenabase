# ARENABASE — Complete Project Documentation

> **Last updated:** Session 04 complete  
> **Status:** MVP in progress — public pages 60% built, admin dashboard 0% built

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Technical Stack](#3-technical-stack)
4. [Architecture Decisions & Rationale](#4-architecture-decisions--rationale)
5. [Design System](#5-design-system)
6. [Database Schema](#6-database-schema)
7. [External Services](#7-external-services)
8. [Environment Variables](#8-environment-variables)
9. [Complete File Structure](#9-complete-file-structure)
10. [Sessions Complete](#10-sessions-complete)
11. [Sessions Remaining](#11-sessions-remaining)
12. [Key Patterns Used](#12-key-patterns-used)
13. [SEO Implementation](#13-seo-implementation)
14. [Known Issues & Notes](#14-known-issues--notes)
15. [Post-MVP Roadmap](#15-post-mvp-roadmap)

---

## 1. Project Overview

**ARENABASE** is a grassroots sports platform designed to become the central digital hub for local sports communities, starting in **Kajiado, Kenya**. It aggregates fixtures, results, tournament information, and announcements that are currently scattered across Facebook groups, WhatsApp, and physical posters into a single, reliable, fast platform.

The long-term vision is multi-sport, but the MVP and initial launch is **football-only**, with the architecture built to support basketball, volleyball, rugby, athletics, and school competitions without schema changes.

### Core Tagline
> **LOCAL SPORTS. ONE PLATFORM.**

### Target Audience (MVP)
- Local football fans in Kajiado County
- Tournament organizers and team officials
- Referees and match officials
- Anyone looking for grassroots sports information

### Domain
- Primary: `arenabase.co.ke` (launching on this)
- Future: `arenabase.com` (upgrade as platform grows)

---

## 2. Problem Statement

Currently local sports information in Kajiado is scattered across:
- Facebook groups (often missed, no search)
- WhatsApp group chats (ephemeral, hard to reference)
- Physical posters (no digital reach)

Fans regularly miss:
- Fixture dates, times and venues
- Venue changes and postponements
- Tournament announcements
- Match results and standings

**ARENABASE solves this by being the single source of truth.** The goal is habit formation: *"Let me check Arenabase first."*

---

## 3. Technical Stack

| Layer | Technology | Reason for Choice |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | SSR + ISR for SEO — critical for Google indexing of fixtures/results |
| **Styling** | CSS Modules (vanilla) | Clean, scoped, no runtime overhead, easy per-component changes |
| **Database** | Supabase (PostgreSQL) | Managed Postgres + Auth + Row Level Security + real-time capability |
| **Image CDN** | Cloudinary | On-the-fly transforms, auto-format/quality, generous free tier |
| **Hosting** | Vercel | Native Next.js, zero-config, preview deployments, edge CDN |
| **Fonts** | Anton (headings) + Inter (body) via `next/font/google` | Sports media aesthetic, zero layout shift |
| **Analytics** | Google Analytics 4 + Microsoft Clarity | User behaviour + heatmaps |

### Why Next.js over React + Vite (original proposal)

The original brief specified React + Vite (SPA). This was changed to Next.js for one critical reason: **SEO**. An SPA is client-rendered, meaning Google indexes it unreliably. A fixture page for "Green FC vs Warriors FC | Kajiado Super Cup" needs to be server-rendered HTML so Google can find it, index it, and serve it to people searching for local sports in Kajiado.

Next.js gives SSR + ISR (pages cached as static HTML, revalidated every 60 seconds) with zero infrastructure complexity on Vercel.

### Why CSS Modules over Tailwind (original proposal)

The original brief suggested Tailwind. Changed to vanilla CSS Modules per developer preference. Benefits: zero build-time dependency, easier to read and change individual styles, no purge/JIT complexity, all styles are co-located with their components.

---

## 4. Architecture Decisions & Rationale

### 4.1 URL-Based Filtering (Fixtures + Results Pages)

All filters (tournament, date range) are driven by URL search params, not React state.

```
/fixtures?tournament=kajiado-super-cup&date=this-weekend
/results?tournament=unity-cup-2024&date=this-month
```

**Why:** Every filtered view is a unique URL, meaning:
1. Google can index `/fixtures?tournament=kajiado-super-cup` separately — a fan searching "Kajiado Super Cup fixtures" finds it directly
2. Users can share/bookmark specific filtered views
3. Server components do the data fetching — no client-side loading spinners for the list

The flow: Client component updates URL → Next.js re-renders server component with new `searchParams` → fresh data fetched from Supabase.

### 4.2 Server Components + ISR

All data-fetching pages use `export const revalidate = 60`. This means:
- On first request, page is server-rendered and cached as static HTML
- Cached for 60 seconds
- After 60s, next request triggers a background revalidation
- Users always get a fast response; data is never more than 60 seconds stale

This is optimal for a sports platform: fixture lists don't change every second, but when a result is published, it appears within 1 minute without any manual cache busting.

### 4.3 Multi-Sport Foundation

The `sports` table exists from day one even though only Football is active. Every `teams` and `tournaments` record has a `sport_id`. When Volleyball is added, zero schema changes are needed — just insert a new sport and start creating records.

The UI sport filter is intentionally hidden until a second sport exists in the database. The query layer already supports it.

### 4.4 Role-Based Admin (Schema-Ready, UI-Simple)

The `admin_users` table has a `role` column with `CHECK (role IN ('super_admin', 'tournament_admin', 'content_admin'))`. For MVP, only `super_admin` is used. The `tournament_id` column on `admin_users` supports future tournament-scoped admins (a tournament organizer can only manage their own tournament's data).

### 4.5 Supabase Data API GRANT Requirement (Critical — May 30, 2025+)

From May 30, 2025, Supabase does **not** expose tables to the Data API (supabase-js / PostgREST) by default. Every table requires explicit `GRANT` statements.

The schema (`schema.sql` v1.1) includes grants for three roles:
- `anon` — public visitors: SELECT only
- `authenticated` — logged-in admin: full SELECT/INSERT/UPDATE/DELETE
- `service_role` — server-side admin client: full access (bypasses RLS)

**Failing to run the updated schema.sql will result in empty query results with no error — the most dangerous kind of failure.**

### 4.6 Cloudinary for Images

Team logos and tournament banners are stored in Cloudinary with the public ID saved in the database. A custom `lib/cloudinary.js` builds transformation URLs without the Cloudinary npm package on the client (smaller bundle, same functionality).

Named presets handle all use cases:
```js
img.teamLogo(id)          // 64×64 — match cards
img.teamLogoLarge(id)     // 128×128 — tournament detail
img.tournamentCard(id)    // 800×320 — tournament grid
img.tournamentBanner(id)  // 1200×420 — detail hero
img.ogImage(id)           // 1200×630 — Open Graph
```

When no Cloudinary image exists (pre-upload), `TeamLogo` component shows deterministic initials with a consistent colour derived from the team name hash.

---

## 5. Design System

All design tokens are CSS variables defined in `app/globals.css`.

### Colour Palette

| Variable | Hex | Usage |
|---|---|---|
| `--color-bg-primary` | `#0A0A0A` | Page background |
| `--color-bg-surface` | `#111111` | Cards, sections |
| `--color-bg-elevated` | `#1A1A1A` | Hover states, inputs |
| `--color-accent` | `#B6FF00` | **Brand lime green — use sparingly** |
| `--color-accent-hover` | `#C8FF2E` | Accent hover state |
| `--color-accent-dim` | `rgba(182,255,0,0.10)` | Accent backgrounds |
| `--color-text-primary` | `#FFFFFF` | Main text |
| `--color-text-secondary` | `#D1D1D1` | Supporting text |
| `--color-text-muted` | `#777777` | Labels, metadata |
| `--color-text-inverse` | `#0A0A0A` | Text on accent bg |
| `--color-border` | `#252525` | Standard borders |
| `--color-border-subtle` | `#1C1C1C` | Dividers within cards |
| `--color-live` | `#FF3B30` | Live match indicator |
| `--color-success` | `#00D26A` | FT badge, success states |
| `--color-warning` | `#FFB800` | Upcoming/warning states |

### Typography

| Variable | Font | Use |
|---|---|---|
| `--font-heading` | Anton (Google Fonts) | All H1–H6, scores, stats, section titles |
| `--font-body` | Inter (Google Fonts) | All body text, labels, navigation |

Fonts are loaded via `next/font/google` in `app/layout.js` and exposed as CSS variables `--font-anton` and `--font-inter`. Zero FOUT (Flash of Unstyled Text).

### Logo

The ARENABASE logo is a **React component** (`components/ui/Logo.js`), not an image file. This is deliberate: it uses Anton font (loaded by `next/font`) which would not render correctly in a static `.svg` or `.png` file on external platforms.

The logo consists of:
1. **Hexagonal badge mark** — lime green hexagon with a bold dark "A" letterform inside, with two micro speed bars at the base
2. **ARENA** wordmark in white Anton
3. **BASE** wordmark in lime green Anton
4. **Period** accent in lime green

Size variants: `sm` | `md` (navbar) | `lg` (footer) | `xl`

### Spacing Scale

Uses a 4px base with `--sp-1` through `--sp-24`.

### Global Utilities

| Class | Purpose |
|---|---|
| `.container` | Max-width 1280px, centered, padded |
| `.skeleton` | Shimmer loading animation |
| `.fadeUp` | Entrance animation |
| `.accent` | Apply `color: var(--color-accent)` |
| `.sr-only` | Screen reader only |

---

## 6. Database Schema

### Tables

#### `sports`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `name` | VARCHAR(100) | e.g. "Football" |
| `slug` | VARCHAR(100) UNIQUE | e.g. "football" |
| `icon_url` | TEXT | |
| `is_active` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

**Seeded:** `('Football', 'football')`

#### `venues`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `name` | VARCHAR(200) | |
| `location` | TEXT | Area name |
| `created_at` | TIMESTAMPTZ | |

#### `teams`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `name` | VARCHAR(200) | |
| `slug` | VARCHAR(200) UNIQUE | |
| `logo_public_id` | TEXT | Cloudinary public ID |
| `sport_id` | UUID FK → sports | |
| `is_active` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

#### `tournaments`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `name` | VARCHAR(200) | |
| `slug` | VARCHAR(200) UNIQUE | Used in URLs |
| `sport_id` | UUID FK → sports | |
| `description` | TEXT | |
| `banner_public_id` | TEXT | Cloudinary public ID |
| `status` | VARCHAR(50) | `upcoming` / `ongoing` / `completed` |
| `format` | VARCHAR(50) | `knockout` / `league` / `group_stage` / `mixed` |
| `total_teams` | INT | |
| `start_date` | DATE | |
| `end_date` | DATE | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | Auto-updated by trigger |

#### `tournament_teams` (junction)
| Column | Type |
|---|---|
| `tournament_id` | UUID FK → tournaments |
| `team_id` | UUID FK → teams |

#### `fixtures`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `tournament_id` | UUID FK → tournaments | |
| `home_team_id` | UUID FK → teams | |
| `away_team_id` | UUID FK → teams | |
| `venue_id` | UUID FK → venues | |
| `kickoff_time` | TIMESTAMPTZ | |
| `round` | VARCHAR(100) | e.g. "Round of 16", "Quarter Finals" |
| `status` | VARCHAR(50) | `scheduled` / `live` / `completed` / `postponed` / `cancelled` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | Auto-updated by trigger |

#### `results`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `fixture_id` | UUID FK → fixtures UNIQUE | One result per fixture |
| `home_score` | INT | CHECK ≥ 0 |
| `away_score` | INT | CHECK ≥ 0 |
| `notes` | TEXT | e.g. "Won on penalties (5–4)" |
| `published_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |

#### `announcements`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `title` | VARCHAR(300) | |
| `slug` | VARCHAR(300) UNIQUE | URL-safe identifier |
| `body` | TEXT | Full announcement text |
| `tournament_id` | UUID FK → tournaments NULLABLE | Optional tournament link |
| `is_published` | BOOLEAN | Drafts support |
| `published_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |

#### `admin_users`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK FK → auth.users | Supabase Auth user |
| `email` | VARCHAR(300) UNIQUE | |
| `full_name` | VARCHAR(200) | |
| `role` | VARCHAR(50) | `super_admin` / `tournament_admin` / `content_admin` |
| `tournament_id` | UUID FK → tournaments NULLABLE | Scoped admin |
| `is_active` | BOOLEAN | |
| `created_at` | TIMESTAMPTZ | |

### Row Level Security

| Table | anon | authenticated | service_role |
|---|---|---|---|
| sports | SELECT | ALL | ALL |
| venues | SELECT | ALL | ALL |
| teams | SELECT (active only) | ALL | ALL |
| tournaments | SELECT | ALL | ALL |
| tournament_teams | SELECT | ALL | ALL |
| fixtures | SELECT | ALL | ALL |
| results | SELECT | ALL | ALL |
| announcements | SELECT (published only) | ALL | ALL |
| admin_users | ❌ | Own record only | ALL |

---

## 7. External Services

### Supabase

- **Project:** Create at [supabase.com](https://supabase.com)
- **Required after project creation:** Run `supabase/schema.sql` in SQL Editor
- **Then run:** `supabase/seed.sql` for test data
- **Auth:** Email/password for admin login (configured via Supabase dashboard)
- **Critical:** Projects created after May 30, 2025 require explicit GRANT statements — included in schema.sql v1.1

### Cloudinary

- **Account:** Create at [cloudinary.com](https://cloudinary.com) (free tier sufficient)
- **Upload preset name:** `arenabase_upload` (unsigned, folder: `arenabase`)
- **Folder structure:**
  - `arenabase/teams/{team-slug}` — team logos
  - `arenabase/tournaments/{tournament-slug}` — banners
- **Full setup guide:** `CLOUDINARY_INTEGRATION.md`

### Vercel

- **Deployment:** Connect GitHub repo, set environment variables, deploy
- **Preview URLs:** Auto-generated for every branch push
- **Production:** `arenabase.co.ke` mapped to main branch

### Google Analytics 4

- Add `NEXT_PUBLIC_GA_ID` to environment variables
- GA4 snippet not yet wired up — pending Session 16

### Microsoft Clarity

- Add snippet to `app/layout.js` — pending Session 16

---

## 8. Environment Variables

File: `.env.local` (copy from `.env.local.example`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # SERVER ONLY — never expose

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret              # SERVER ONLY

# App
NEXT_PUBLIC_SITE_URL=https://www.arenabase.co.ke

# Analytics (add in Session 16)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Security rules:**
- Variables prefixed `NEXT_PUBLIC_` are safe in client-side code
- `SUPABASE_SERVICE_ROLE_KEY` and `CLOUDINARY_API_SECRET` must never be in client code
- The `createAdminClient()` in `lib/supabase.js` guards against server-only usage

---

## 9. Complete File Structure

### ✅ Built

```
arenabase/
├── next.config.mjs                          ✅ Cloudinary remote patterns
├── .env.local.example                       ✅ Environment template
│
├── app/
│   ├── globals.css                          ✅ Full design system — all CSS variables
│   ├── layout.js                            ✅ Root layout, fonts, default SEO metadata
│   ├── page.js                              ✅ Homepage (server, ISR 60s)
│   ├── page.module.css                      ✅ Two-column section layout
│   ├── sitemap.js                           ✅ Dynamic XML sitemap (includes tournament slugs)
│   ├── robots.js                            ✅ /admin blocked, sitemap referenced
│   ├── fixtures/
│   │   ├── page.js                          ✅ Fixtures (server, ISR 60s, URL filtering)
│   │   ├── page.module.css                  ✅
│   │   └── loading.js                       ✅ Shimmer skeleton on filter change
│   └── results/
│       ├── page.js                          ✅ Results (server, ISR 60s, URL filtering)
│       ├── page.module.css                  ✅
│       └── loading.js                       ✅ Shimmer skeleton
│
├── components/
│   ├── layout/
│   │   ├── Navbar.js                        ✅ Fixed, scroll-aware, mobile drawer, no admin btn
│   │   ├── Navbar.module.css                ✅
│   │   ├── Footer.js                        ✅ 3-col grid, social links, copyright
│   │   └── Footer.module.css               ✅
│   ├── ui/
│   │   ├── Logo.js                          ✅ Hex badge + Anton wordmark (React component)
│   │   ├── Logo.module.css                  ✅ sm/md/lg/xl size variants
│   │   ├── TeamLogo.js                      ✅ Cloudinary image OR initials fallback
│   │   ├── TeamLogo.module.css              ✅
│   │   ├── SectionHeader.js                 ✅ Title + optional View All link
│   │   ├── SectionHeader.module.css         ✅
│   │   ├── PageHeader.js                    ✅ Large Anton heading for inner pages
│   │   ├── PageHeader.module.css            ✅
│   │   ├── NewsletterBanner.js              ✅ Email subscribe strip (UI complete, API TODO)
│   │   └── NewsletterBanner.module.css      ✅
│   ├── home/
│   │   ├── Hero.js                          ✅ Headline + next match card + stats strip
│   │   ├── Hero.module.css                  ✅ Radial gradient bg, optional hero-bg.jpg
│   │   ├── WeekendFixtures.js               ✅ Date-grouped cards, horiz scroll mobile
│   │   ├── WeekendFixtures.module.css       ✅
│   │   ├── LatestAnnouncements.js           ✅ Dot-indicator list, truncated excerpts
│   │   ├── LatestAnnouncements.module.css   ✅
│   │   ├── LatestResults.js                 ✅ Scoreboard rows, FT badge
│   │   ├── LatestResults.module.css         ✅
│   │   ├── ActiveTournaments.js             ✅ Card grid, gradient bg, Cloudinary ready
│   │   └── ActiveTournaments.module.css     ✅
│   ├── fixtures/
│   │   ├── FixturesFilter.js                ✅ Client — tournament select + date tabs
│   │   ├── FixturesFilter.module.css        ✅
│   │   ├── FixturesList.js                  ✅ Date-grouped rows, empty states
│   │   └── FixturesList.module.css          ✅ 5-col grid, hover accent bar, responsive
│   └── results/
│       ├── ResultsFilter.js                 ✅ Client — tournament select + date tabs
│       ├── ResultsFilter.module.css         ✅
│       ├── ResultsList.js                   ✅ Month-grouped rows, score highlighting
│       └── ResultsList.module.css           ✅ Winner/loser/draw visual treatment
│
├── lib/
│   ├── supabase.js                          ✅ Public client + server admin client factory
│   ├── cloudinary.js                        ✅ URL builder + named presets
│   └── utils.js                             ✅ Date/time formatters, initials, outcome logic
│
└── supabase/
    ├── schema.sql                           ✅ v1.1 — full schema + GRANT statements
    └── seed.sql                             ✅ 3 venues, 12 teams, 3 tournaments, 11 fixtures,
                                                5 results, 4 announcements
```

### 🔲 Not Yet Built

```
arenabase/
├── app/
│   ├── tournaments/
│   │   ├── page.js                          🔲 All tournaments grid with status filter
│   │   ├── page.module.css                  🔲
│   │   ├── loading.js                       🔲
│   │   └── [slug]/
│   │       ├── page.js                      🔲 Tournament detail (tabs: Fixtures/Results/Teams)
│   │       ├── page.module.css              🔲
│   │       └── loading.js                   🔲
│   ├── announcements/
│   │   ├── page.js                          🔲 All announcements list
│   │   ├── page.module.css                  🔲
│   │   └── [slug]/
│   │       └── page.js                      🔲 Single announcement detail
│   ├── about/
│   │   └── page.js                          🔲 Static about/info page
│   └── admin/
│       ├── layout.js                        🔲 Admin shell (sidebar + auth guard)
│       ├── layout.module.css                🔲
│       ├── page.js                          🔲 Dashboard overview (stats, quick actions)
│       ├── page.module.css                  🔲
│       ├── tournaments/
│       │   ├── page.js                      🔲 Tournament list with edit/delete
│       │   ├── new/page.js                  🔲 Create tournament form
│       │   └── [id]/edit/page.js            🔲 Edit tournament form
│       ├── fixtures/
│       │   ├── page.js                      🔲 Fixture list with status management
│       │   ├── new/page.js                  🔲 Create fixture form
│       │   └── [id]/edit/page.js            🔲 Edit/postpone/cancel fixture
│       ├── results/
│       │   ├── page.js                      🔲 Results list (shows fixtures awaiting result)
│       │   └── [fixture-id]/publish/page.js 🔲 Publish result form for a fixture
│       ├── announcements/
│       │   ├── page.js                      🔲 Announcement list with publish/draft toggle
│       │   ├── new/page.js                  🔲 Create announcement (rich text or textarea)
│       │   └── [id]/edit/page.js            🔲 Edit announcement
│       ├── teams/
│       │   └── page.js                      🔲 Teams management (create, upload logo)
│       └── venues/
│           └── page.js                      🔲 Venues management (create, edit)
│
├── components/
│   ├── tournaments/
│   │   ├── TournamentCard.js                🔲 Used on tournaments list page
│   │   ├── TournamentCard.module.css        🔲
│   │   ├── TournamentTabs.js                🔲 Client: Fixtures / Results / Teams tab bar
│   │   ├── TournamentTabs.module.css        🔲
│   │   ├── TournamentFixtures.js            🔲 Fixtures tab content
│   │   ├── TournamentResults.js             🔲 Results tab content
│   │   └── TournamentTeams.js               🔲 Teams tab content (team logo grid)
│   ├── announcements/
│   │   ├── AnnouncementCard.js              🔲 Card for list view
│   │   └── AnnouncementCard.module.css      🔲
│   └── admin/
│       ├── AdminSidebar.js                  🔲 Navigation sidebar
│       ├── AdminSidebar.module.css          🔲
│       ├── StatCard.js                      🔲 Dashboard stat widget
│       ├── DataTable.js                     🔲 Reusable admin table
│       ├── FormField.js                     🔲 Labelled input wrapper
│       ├── ImageUpload.js                   🔲 Cloudinary upload component
│       └── ConfirmModal.js                  🔲 Delete confirmation dialog
│
└── middleware.js                            🔲 Supabase Auth session check — protects /admin/*
```

---

## 10. Sessions Complete

### Session 01 — Project Foundation ✅
**13 files delivered**

- Next.js project configuration with Cloudinary image domains
- Complete design system (CSS variables, reset, typography, animations, skeleton loader)
- Root layout with Anton + Inter fonts via `next/font`, full default SEO metadata
- Fixed navbar with scroll-aware background, active link indicator, hamburger mobile drawer
- Footer with quick links and social icons
- Supabase client (`supabase.js`) — public anon client + server-side admin factory
- Cloudinary URL builder (`cloudinary.js`) with named presets
- Dynamic XML sitemap generator (includes tournament slugs from DB)
- robots.js blocking `/admin`
- Full Supabase schema (8 tables, indexes, RLS, auto-update triggers, Football seeded)

### Supabase GRANT Fix ✅
**2 files delivered**

Discovered that new Supabase projects (post May 30, 2025) require explicit `GRANT` statements on all tables for the Data API to work. Updated `schema.sql` to v1.1 with grants for `anon`, `authenticated`, and `service_role` on all 8 tables.

Also delivered `CLOUDINARY_INTEGRATION.md` with step-by-step Cloudinary setup guide.

### Logo Design ✅
**5 files delivered**

Designed unique ARENABASE logo as a React component:
- Hexagonal lime-green badge with bold dark "A" letterform
- ARENA (white) + BASE (lime green) wordmark in Anton
- 4 size variants: sm / md (navbar) / lg (footer) / xl
- Navbar updated: text logo replaced with Logo component, Admin Login button removed entirely
- Admin accessible only via `/admin` URL directly
- Footer updated with Logo component

### Session 02 — Homepage ✅
**20 files delivered**

- `lib/utils.js` — all date/time formatters, team initials, outcome logic
- `TeamLogo` — Cloudinary image with deterministic initials fallback
- `SectionHeader` — reusable title + View All link
- `NewsletterBanner` — email subscribe UI (API hookup pending)
- **Hero** — headline, featured next-match card, 3-stat strip with live DB counts
- **WeekendFixtures** — date-grouped match cards, horizontal scroll on mobile
- **LatestAnnouncements** — green dot indicator list with excerpts
- **LatestResults** — FT badge rows with winner highlighting
- **ActiveTournaments** — card grid with CSS gradient fallbacks (Cloudinary-ready)
- `app/page.js` — parallel Supabase queries (7 concurrent), ISR 60s, JSON-LD schema.org
- `supabase/seed.sql` — full test data set

### Session 03 — Fixtures Page ✅
**9 files delivered**

- `PageHeader` — reusable large-title header for all inner pages
- `FixturesFilter` — client component with tournament dropdown + 5 date tabs (All / Today / This Week / This Weekend / This Month), URL-param driven via `useSearchParams` + `useRouter`, `useTransition` for pending states
- `FixturesList` — date-grouped fixture rows, 5-col grid, accent hover bar, per-column responsive collapse
- `app/fixtures/page.js` — server component, reads `searchParams`, date bound calculation, ISR 60s, Suspense boundary around filter, `generateMetadata`
- `loading.js` — skeleton shown by Next.js during filter-change re-renders

### Session 04 — Results Page ✅
**7 files delivered**

- `ResultsFilter` — client component, tournament + date tabs (All / Today / This Week / This Month)
- `ResultsList` — **month-grouped** result rows (not date-grouped like fixtures — results accumulate historically), score highlighting at three levels: winner (text-primary), loser (text-muted), draw (text-secondary), FT badge in success green
- `app/results/page.js` — tournament filter resolves slug → tournament ID → completed fixture IDs → filter results (correct join path through schema), ISR 60s
- `loading.js` — skeleton

---

## 11. Sessions Remaining

### Session 05 — Tournaments List + Tournament Detail Page
**Estimated: ~16 files**

**Tournaments List (`/tournaments`):**
- Filter by status (All / Ongoing / Upcoming / Completed)
- Card grid matching the homepage ActiveTournaments style
- Tournament count badge per status

**Tournament Detail (`/tournaments/[slug]`):**
- Hero banner (Cloudinary image or gradient fallback)
- Tournament info (format, team count, start date, status)
- Tab bar: **Fixtures** | **Results** | **Teams**
- Each tab content server-fetched, URL param driven (`?tab=fixtures`)
- `generateMetadata` for dynamic OG tags per tournament
- JSON-LD `SportsEvent` schema for each fixture in the tournament
- `notFound()` for invalid slugs

### Session 06 — Announcements Page + Detail
**Estimated: ~8 files**

**Announcements List (`/announcements`):**
- Filterable by tournament
- Card layout showing title, date, excerpt, tournament badge

**Announcement Detail (`/announcements/[slug]`):**
- Full announcement body
- Related tournament link
- `generateMetadata` with dynamic title + description from body

### Session 07 — About Page
**Estimated: ~3 files**

Simple static page covering:
- What ARENABASE is
- Contact information / social links
- How to submit fixtures/announcements (link to admin or contact)

### Session 08 — Admin Authentication
**Estimated: ~4 files**

- `middleware.js` — checks Supabase Auth session, redirects unauthenticated users to `/admin/login`
- `app/admin/login/page.js` — email/password login form (Supabase Auth)
- `app/admin/login/page.module.css`
- Admin layout shell with auth state

This session is a prerequisite for all other admin sessions.

### Session 09 — Admin Dashboard + Layout
**Estimated: ~8 files**

- `app/admin/layout.js` — sidebar navigation + auth guard
- `AdminSidebar` component (links to all admin sections)
- `app/admin/page.js` — dashboard with:
  - 4 stat cards (fixtures, results, tournaments, announcements)
  - Upcoming fixtures list (quick view)
  - Recent announcements (quick view)
  - Quick action buttons

### Session 10 — Admin: Tournaments CRUD
**Estimated: ~10 files**

- Tournament list with edit/delete/status change
- Create tournament form: name, format, total_teams, start/end date, description, banner upload (Cloudinary)
- Edit tournament form (pre-filled)
- Server Actions for create/update/delete using `createAdminClient()`

### Session 11 — Admin: Fixtures CRUD
**Estimated: ~10 files**

- Fixtures list (upcoming/past, filter by tournament)
- Create fixture form: tournament, home team, away team, venue, kickoff time, round
- Edit fixture (change time, venue, status — postpone/cancel)
- Fixture status management (scheduled → live → completed)
- Server Actions

### Session 12 — Admin: Results Publishing
**Estimated: ~8 files**

- Results list (shows completed fixtures with/without results)
- Publish result form: for a specific fixture, enter home_score, away_score, optional notes
- Auto-updates fixture status to `completed` on result publish
- Edit/delete result

### Session 13 — Admin: Announcements CRUD
**Estimated: ~10 files**

- Announcements list with publish/draft toggle
- Create announcement: title, body (textarea), tournament link (optional), publish date
- Edit announcement
- Draft support (`is_published = false`)

### Session 14 — Admin: Teams & Venues
**Estimated: ~10 files**

- Teams list: create, edit name/logo
- Logo upload via Cloudinary (unsigned upload preset in browser)
- Venues list: create, edit name/location
- `ImageUpload` component (reusable for teams + tournaments)

### Session 15 — SEO Finalization
**Estimated: ~5 files**

- Dynamic `generateMetadata` for fixture pages (when individual fixture pages are added)
- JSON-LD `SportsEvent` schema on tournament detail page for each fixture
- OG image strategy for tournaments (using Cloudinary banner as OG image)
- Google Analytics 4 integration
- Microsoft Clarity integration
- Google Search Console verification token in `app/layout.js`

### Session 16 — Deployment Guide
**Estimated: 1 file (DEPLOYMENT.md)**

- GitHub repository setup
- Vercel project configuration
- Environment variables on Vercel
- Custom domain setup for `arenabase.co.ke` on Vercel
- Supabase project production checklist
- Cloudinary production checklist
- Post-deploy verification steps

---

## 12. Key Patterns Used

### Server Component + URL Filtering Pattern

Used on: Fixtures page, Results page (and will be used on Tournaments page, Announcements page)

```
User changes filter
       ↓
FixturesFilter (client) calls router.push('/fixtures?tournament=x&date=y')
       ↓
Next.js detects URL change → shows loading.js skeleton
       ↓
page.js (server) re-executes with new searchParams
       ↓
Fresh Supabase query → new fixtures data
       ↓
FixturesList (server display) renders new rows
```

### Supabase Foreign Key Join Syntax

For tables with multiple FKs to the same table (e.g. `fixtures` has `home_team_id` AND `away_team_id` both pointing to `teams`), use the column name as the FK hint:

```js
supabase.from('fixtures').select(`
  *,
  home_team:home_team_id(id, name, slug, logo_public_id),
  away_team:away_team_id(id, name, slug, logo_public_id),
  venue:venue_id(name),
  tournament:tournament_id(name, slug)
`)
```

### Admin Client vs Public Client

```js
// Public read — use in Server Components, Client Components
import { supabase } from '@/lib/supabase';
const { data } = await supabase.from('fixtures').select('*');

// Admin write — use ONLY in Server Actions / Route Handlers
import { createAdminClient } from '@/lib/supabase';
const admin = createAdminClient(); // Uses service_role key, bypasses RLS
await admin.from('fixtures').insert({ ... });
```

### ISR (Incremental Static Regeneration)

```js
export const revalidate = 60; // at top of every data page
```

Page is cached as static HTML for 60 seconds. After that, the next request triggers background re-fetch. Fast for users, fresh enough for sports data.

---

## 13. SEO Implementation

### What's Implemented

| Feature | Status | Location |
|---|---|---|
| Default metadata (title, description, OG, Twitter) | ✅ | `app/layout.js` |
| Title template (`%s \| ARENABASE`) | ✅ | `app/layout.js` |
| Dynamic sitemap (includes tournament slugs) | ✅ | `app/sitemap.js` |
| robots.txt (blocks /admin) | ✅ | `app/robots.js` |
| Page-level metadata | ✅ | All built pages |
| JSON-LD: WebSite + SportsOrganization | ✅ | `app/page.js` |
| JSON-LD: SearchAction (sitelinks searchbox) | ✅ | `app/page.js` |
| Geographic targeting (Kajiado, KE locale) | ✅ | `app/layout.js` |
| SSR (no client-only rendering) | ✅ | All pages |
| Open Graph images | 🔲 | `/public/og-image.jpg` not yet created |
| Per-tournament JSON-LD | 🔲 | Session 05 |
| Google Search Console verification | 🔲 | Token needed in `app/layout.js` |
| GA4 integration | 🔲 | Session 15 |
| Core Web Vitals monitoring | 🔲 | Auto via Vercel Analytics |

### URL Structure for SEO

```
/                           Homepage — daily revalidation
/fixtures                   All upcoming fixtures
/fixtures?tournament=slug   Tournament-specific fixtures (indexable unique URL)
/fixtures?date=this-weekend Weekend fixtures
/results                    All results
/results?tournament=slug    Tournament-specific results
/tournaments                All tournaments
/tournaments/[slug]         Tournament detail (most SEO value — specific tournament pages)
/announcements              All announcements
/announcements/[slug]       Single announcement
/about                      About
/sitemap.xml                Dynamic sitemap
/robots.txt                 Robots rules
```

### Hero Background Image (Pending)

Drop any sports action photo into `/public/hero-bg.jpg`. The hero section will automatically show it at 18% opacity as a cinematic background layer. Without it, the gradient background is intentional and looks complete.

---

## 14. Known Issues & Notes

### 1. Newsletter API Not Connected

`NewsletterBanner.js` has a `// TODO` in the submit handler — currently simulates success after 800ms. Wire up to Mailchimp/Brevo/Resend when an email service is chosen.

### 2. No OG Image File

`/public/og-image.jpg` is referenced in metadata but doesn't exist yet. Create a 1200×630px branded image and add it to `/public/` before launch.

### 3. No Favicon

`/public/favicon.ico` and `/public/apple-touch-icon.png` are referenced in layout.js but not created. Export the hexagonal badge mark from the Logo component as an ICO/PNG.

### 4. No hero-bg.jpg

The hero section has a CSS background image reference to `/public/hero-bg.jpg`. Without it the gradient shows. With it, the photo shows at 18% opacity behind the gradient.

### 5. Newsletter + Analytics Pending

`NewsletterBanner` needs email service. GA4 and Clarity need their scripts added in Session 15.

### 6. Admin Route Has No Auth Yet

`/admin` URL exists in robots.js and referenced in the codebase but no page has been built and no auth middleware exists. Sessions 08–14 build the complete admin system.

### 7. Next.js Version — searchParams is a Promise

In Next.js 15 (current latest as of 2026), `searchParams` in page.js is a `Promise`. All page.js files use `const params = await props.searchParams` which works in both Next.js 14 and 15.

### 8. Mobile Fixture Row Layout

The fixture row on the Fixtures page uses `grid` with a 5-column layout on desktop. On screens < 540px, the CSS switches to a flex column which may need testing on specific device sizes once deployed.

### 9. Seed Data Dates Are Relative

`seed.sql` uses `CURRENT_TIMESTAMP + INTERVAL 'X days'` for fixture kickoff times, so the "upcoming" fixtures are always in the near future relative to when the seed is run. Re-running the seed adds duplicate rows (prevented by `ON CONFLICT DO NOTHING` on IDs).

---

## 15. Post-MVP Roadmap

These are NOT part of MVP — do not build until the MVP is fully launched and used.

| Feature | Priority | Notes |
|---|---|---|
| **Standings / League Table** | High | Requires league-format tournament support, auto-calculation from results |
| **Live Score Updates** | High | Polling pattern chosen (check Supabase every 30s during live match) |
| **Team Profile Pages** | Medium | `/teams/[slug]` — squad, recent results, upcoming fixtures |
| **Player Profiles** | Low | `players` table needed; not in MVP scope |
| **Push Notifications** | Medium | Web Push API — notify subscribers of new fixtures/results |
| **Multi-Sport Expansion** | High | Architecture ready — just add sport records and content |
| **Organizer Self-Service** | Medium | Tournament admins submit their own data; super admin approves |
| **Sponsorship Module** | Low | Banner ads, sponsor logos on tournament pages |
| **Match Gallery / Media** | Low | Photo uploads per match |
| **Mobile App (PWA)** | Medium | Next.js is PWA-capable with minimal additions |
| **School Competitions** | Medium | Under-18 divisions, school team management |
| **Statistics Engine** | Low | Top scorers, clean sheets, team form guides |
| **Email Notifications** | Medium | Subscriber alerts for fixture reminders, results |
| **WhatsApp Bot** | High | Share fixture/result cards automatically to WhatsApp groups |

---

## Quick Reference — Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Fill in Supabase URL, keys, and Cloudinary cloud name

# 3. Set up database
# Go to Supabase Dashboard → SQL Editor
# Run supabase/schema.sql  (must use v1.1 with GRANT statements)
# Run supabase/seed.sql    (optional — adds test data)

# 4. Start development server
npm run dev

# 5. Open
# http://localhost:3000
```

---

*Documentation generated during active development. Update after each session.*
