# ARENABASE — Deployment Guide

> Complete step-by-step guide for taking ARENABASE from local development to live on `arenabase.co.ke`.
> Follow sections in order — each step has dependencies on the one before it.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [GitHub — Push your code](#2-github--push-your-code)
3. [Supabase — Production database](#3-supabase--production-database)
4. [Cloudinary — Image CDN](#4-cloudinary--image-cdn)
5. [Vercel — Deploy the application](#5-vercel--deploy-the-application)
6. [Environment variables](#6-environment-variables)
7. [Custom domain — arenabase.co.ke](#7-custom-domain--arenabasecoke)
8. [Create the admin user](#8-create-the-admin-user)
9. [Content checklist](#9-content-checklist)
10. [Post-deploy verification](#10-post-deploy-verification)
11. [Analytics](#11-analytics)
12. [Ongoing operations](#12-ongoing-operations)
13. [Quick reference](#13-quick-reference)

---

## 1. Prerequisites

You need accounts on four services before starting. All have free tiers that are sufficient for launch.

| Service | Sign-up URL | Notes |
|---|---|---|
| **GitHub** | github.com | Any plan — free works |
| **Supabase** | supabase.com | Free tier: 500MB DB, 2GB bandwidth |
| **Vercel** | vercel.com | Free Hobby plan is fine for launch |
| **Cloudinary** | cloudinary.com | Free tier: 25GB storage, 25GB bandwidth/month |

Optional (can be added post-launch):

| Service | Sign-up URL |
|---|---|
| Google Analytics 4 | analytics.google.com |
| Microsoft Clarity | clarity.microsoft.com |
| Google Search Console | search.google.com/search-console |

---

## 2. GitHub — Push your code

### 2.1 Create the repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `arenabase`
3. Visibility: **Private** (recommended — keeps your env variable history private)
4. Do **not** tick "Add a README file" — your project already has one
5. Click **Create repository**

### 2.2 Push from your local project

In your project root:

```bash
git init
git add .
git commit -m "Initial commit — ARENABASE MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/arenabase.git
git push -u origin main
```

Confirm the push succeeded at `github.com/YOUR_USERNAME/arenabase` before proceeding.

> **Tip:** Make sure `.gitignore` is working correctly — `.env.local` must never be committed. The project's existing `.gitignore` already covers this.

---

## 3. Supabase — Production database

> ⚠️ **Create a brand new Supabase project for production.** Do not reuse your development project. Production and development should be completely separate so test data never appears on the live site and vice versa.

### 3.1 Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Name: `arenabase-production`
3. Database password: click **Generate a password**, copy it somewhere safe
4. Region: **West EU (Ireland)** or **US East (N. Virginia)** — no East Africa region exists yet; Ireland typically gives the best latency from Kenya
5. Click **Create new project** — takes about two minutes

### 3.2 Run the schema

1. In your project dashboard, go to **SQL Editor**
2. Click **New query**
3. Open `supabase/schema.sql` from your project locally and paste the entire contents
4. Click **RUN**

> ⚠️ **Critical — do not skip this warning:** `schema.sql` v1.1 contains explicit `GRANT` statements at the bottom that are required for all Supabase projects created after **May 30, 2025**. Without them, all Supabase queries silently return empty arrays — no error is thrown. If you see empty fixture/results lists on the live site and can't figure out why, missing GRANTs is the cause. The GRANTs are already in `schema.sql` — just make sure you run the whole file.

Check the SQL Editor output — it should end with several `GRANT` confirmations and no red errors. You can verify tables were created under **Table Editor** in the left sidebar.

### 3.3 Configure authentication

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to `https://www.arenabase.co.ke`
3. Under **Redirect URLs**, add both variants:
   ```
   https://www.arenabase.co.ke/**
   https://arenabase.co.ke/**
   ```
4. Click **Save**

This ensures Supabase auth redirects work correctly after login and when refreshing sessions on the live domain.

### 3.4 Collect your credentials

Go to **Project Settings → API**. Copy all three values — you'll need them in step 6.

| Variable | Where to find it | Scope |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` public key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret key | **Server only** |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security entirely. It must never appear in client-side code or be committed to Git. It is used only in server actions and route handlers via `createAdminClient()` in `lib/supabase.js`.

---

## 4. Cloudinary — Image CDN

Cloudinary hosts and transforms all team logos and tournament banners. The free tier covers everything you need at launch.

### 4.1 Create an account

Sign up at [cloudinary.com](https://cloudinary.com). After signing in you land on the dashboard — your **Cloud name** is displayed at the top.

### 4.2 Create the upload preset

The admin panel uses an unsigned upload preset so images can be uploaded directly from the browser without exposing your API secret.

1. Go to **Settings → Upload → Upload presets → Add upload preset**
2. Configure as follows:

   | Setting | Value |
   |---|---|
   | Preset name | `arenabase_upload` |
   | Signing mode | **Unsigned** |
   | Folder | `arenabase` |

3. Click **Save**

> The preset name must be exactly `arenabase_upload` — it is referenced in the admin's ImageUpload component. The folder `arenabase` keeps all your uploads organised under one root folder in your Cloudinary media library.

### 4.3 Folder structure (for reference)

When you upload images via the admin, they will appear in Cloudinary under:

```
arenabase/
├── teams/
│   └── {team-slug}/     ← team logos
└── tournaments/
    └── {tournament-slug}/  ← tournament banners
```

### 4.4 Collect your credentials

Go to **Dashboard → Product Environment Credentials**:

| Variable | Where to find it | Scope |
|---|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name | Public |
| `CLOUDINARY_API_KEY` | API Key | Public (safe) |
| `CLOUDINARY_API_SECRET` | API Secret | **Server only** |

---

## 5. Vercel — Deploy the application

### 5.1 Import the project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Connect your GitHub account if not already connected
3. Find and click **Import** next to your `arenabase` repository
4. Vercel detects Next.js automatically. Confirm these settings:

   | Setting | Value |
   |---|---|
   | Framework Preset | Next.js |
   | Root Directory | `./` (leave default) |
   | Build Command | `next build` |
   | Output Directory | `.next` |
   | Install Command | `npm install` |
   | Node.js Version | 20.x |

**Do not click Deploy yet** — you must add environment variables first.

### 5.2 Add environment variables

Still on the import screen, scroll to **Environment Variables** and add each one below. Use the values collected in steps 3 and 4.

> Set the scope to **Production** for all variables. Also add them to **Preview** if you want branch deployments to work.

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_SITE_URL            → https://www.arenabase.co.ke
```

### 5.3 Deploy

Click **Deploy**. The first build takes 2–3 minutes. When it completes, Vercel gives you a preview URL like `arenabase-abc123.vercel.app`.

Open that URL and confirm the site loads before moving to the domain step.

---

## 6. Environment variables

Full reference of every variable the application uses:

```env
# ── Supabase ─────────────────────────────────────────────
# Both are required. ANON_KEY is safe in the browser bundle.
NEXT_PUBLIC_SUPABASE_URL          = https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SERVICE_ROLE_KEY is server-side only — never prefix with NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY         = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── Cloudinary ───────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY                = 123456789012345

# API_SECRET is server-side only
CLOUDINARY_API_SECRET             = AbCdEfGhIjKlMnOpQrSt

# ── App ──────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL              = https://www.arenabase.co.ke

# ── Analytics (add post-launch) ──────────────────────────
# NEXT_PUBLIC_GA_ID               = G-XXXXXXXXXX
```

**Security summary:**

| Variable | In client bundle? | In Git? |
|---|---|---|
| `NEXT_PUBLIC_*` | ✅ Yes (by design) | ❌ Never |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Never | ❌ Never |
| `CLOUDINARY_API_SECRET` | ❌ Never | ❌ Never |

If you need to update any variable after deployment, go to **Vercel → Project → Settings → Environment Variables**, edit the value, then trigger a redeploy (step 12.1).

---

## 7. Custom domain — arenabase.co.ke

### 7.1 Add the domain in Vercel

1. In your Vercel project, go to **Settings → Domains**
2. Type `arenabase.co.ke` → click **Add**
3. Type `www.arenabase.co.ke` → click **Add**
4. On the `www` entry, set it to **redirect** to `arenabase.co.ke` (or the other way — pick one canonical form and be consistent everywhere)

Vercel will display the exact DNS records you need. They will match what is below.

### 7.2 Add DNS records at your registrar

Log in to wherever `arenabase.co.ke` is registered (Webmaster Kenya, Sasahost, HostPinnacle, or similar) and add the following records:

**Root domain — `arenabase.co.ke`:**

| Type | Name/Host | Value | TTL |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | 3600 |

**www subdomain — `www.arenabase.co.ke`:**

| Type | Name/Host | Value | TTL |
|---|---|---|---|
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |

> **Note:** Some Kenyan registrar control panels label the "Name/Host" column differently — you may see "Hostname", "Host record", or "Subdomain". For the `A` record, `@` means the root domain itself. For the `CNAME`, enter `www` without the full domain name.

### 7.3 Wait for DNS propagation

DNS changes take between 15 minutes and 48 hours to propagate globally. Vercel shows a spinning indicator on the domain until it resolves. You can check progress at [dnschecker.org](https://dnschecker.org) by looking up `arenabase.co.ke` with record type `A`.

### 7.4 SSL certificate

Once DNS resolves, Vercel automatically provisions a free SSL certificate via Let's Encrypt. **No action is required.** Both `http://` and `https://` are handled — all HTTP traffic is automatically redirected to HTTPS.

---

## 8. Create the admin user

The admin panel at `/admin` requires a logged-in Supabase Auth user who also has a record in the `admin_users` table. This is a two-step process done entirely in the Supabase dashboard.

### Step 1 — Create the auth account

1. In your **production** Supabase project, go to **Authentication → Users**
2. Click **Add user → Create new user**
3. Enter the email address and a strong password for the admin account
4. Click **Create user**
5. In the user list, click on the new user and **copy the UUID** — it looks like `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### Step 2 — Create the admin_users record

1. Go to **SQL Editor → New query**
2. Run the following SQL, replacing all three placeholders:

```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'paste-the-uuid-from-step-1',
  'the-admin-email@example.com',
  'Your Name',
  'super_admin'
);
```

### Verify access

1. Go to `https://www.arenabase.co.ke/admin`
2. You should be redirected to `/admin/login`
3. Log in with the credentials from step 1
4. The dashboard should load

> If login redirects you back to the login page, double-check that the `admin_users` INSERT ran without error and that the UUID matches exactly. The `id` column in `admin_users` is a foreign key to `auth.users(id)` — if the UUID is wrong it will fail silently.

---

## 9. Content checklist

These are zero-code improvements that make a significant difference to how the site looks and works. Complete them before formally announcing the site.

### Images (high impact)

- [ ] **Hero background photo** — drop any football action photo into `/public/hero-bg.jpg`. The hero section automatically shows it at 18% opacity as a cinematic layer behind the gradient. Without it the gradient looks fine; with it the homepage looks excellent.
- [ ] **OG image** — create a 1200×630px branded image and save as `/public/og-image.jpg`. This is what appears when the site is shared on WhatsApp, Twitter, and Facebook. Reference: `app/layout.js` metadata already points to `/og-image.jpg`.
- [ ] **Favicon and Apple touch icon** — `favicon.ico` and `apple-touch-icon.png` are already generated from the logo's hex badge (done in design session). Drop them into `/public/`. Referenced in `app/layout.js` under `icons`.
- [ ] **Team logos** — upload each team's logo to Cloudinary under `arenabase/teams/{team-slug}`, then update `logo_public_id` for each team via the admin panel. Until logos are added, the deterministic initials fallback displays automatically.
- [ ] **Tournament banners** — upload a banner image for each tournament to Cloudinary under `arenabase/tournaments/{tournament-slug}`, then update `banner_public_id` via the admin panel. Without a banner, gradient fallbacks display automatically.

### Data

- [ ] **Add real venues** — replace the seed venues (CTK ground, Katoo Stadium, Loitoktok Stadium) with accurate names and locations via the admin Venues section.
- [ ] **Add real teams** — replace seed teams with the actual teams competing in your first tournament.
- [ ] **Create the first live tournament** — set status to `ongoing`, add teams, add fixtures.

### Social links

- [ ] Update the footer social links in `components/layout/Footer.js` with real handles for Facebook, Instagram, X, YouTube, TikTok. Currently set to placeholder `#` URLs.
- [ ] Update the About page social links similarly if added there.

### Analytics / SEO

- [ ] **Google Search Console** — after setting up in step 11, paste the verification token into `app/layout.js` under `metadata.verification.google: ''`.
- [ ] Submit `https://www.arenabase.co.ke/sitemap.xml` to Search Console after verification.

---

## 10. Post-deploy verification

Work through this checklist after DNS resolves and SSL is active on `arenabase.co.ke`.

### Public site

- [ ] Homepage loads — fonts render correctly (Anton for headings, Inter for body)
- [ ] Hero shows "KAJIADO FOOTBALL. FRONT AND CENTRE." and the animated stat counters increment on scroll
- [ ] "For Organisers" section visible below tournaments — WhatsApp and Call buttons work
- [ ] Fixtures page loads with real data from Supabase
- [ ] Tournament filter and date filter work on fixtures page
- [ ] Results page loads with real data
- [ ] Tournaments grid loads — clicking a tournament opens its detail page
- [ ] Tournament tabs (Fixtures / Results / Teams) each load correctly
- [ ] Announcements list and individual announcement pages load
- [ ] About page loads — WhatsApp button opens `wa.me/254717813478`, Call button opens dialler
- [ ] Footer links all resolve correctly
- [ ] Visiting a non-existent URL (e.g. `/xyz`) shows the "OFFSIDE." 404 page
- [ ] On mobile: hamburger menu opens and closes, fixture rows collapse correctly, tournament cards scroll horizontally

### Admin

- [ ] `https://www.arenabase.co.ke/admin` redirects to `/admin/login`
- [ ] Logging in with credentials from step 8 works
- [ ] All sidebar sections load (Dashboard, Fixtures, Results, Tournaments, Announcements, Teams, Venues)
- [ ] Dashboard stat cards show correct counts
- [ ] Create a test announcement, set it to Published — verify it appears on the public `/announcements` page within 60 seconds (ISR revalidation window)
- [ ] Signing out redirects to `/admin/login`
- [ ] Visiting `/admin` after sign-out redirects back to `/admin/login`

### SEO and infrastructure

- [ ] `https://www.arenabase.co.ke/sitemap.xml` returns valid XML including tournament URLs
- [ ] `https://www.arenabase.co.ke/robots.txt` confirms `/admin` is disallowed
- [ ] Paste the homepage URL into [opengraph.xyz](https://www.opengraph.xyz) — title and description appear correctly in the preview
- [ ] Check that `https://arenabase.co.ke` (without www) redirects correctly to the canonical `www` version (or vice versa depending on your choice in step 7.1)

### Performance (recommended)

Run the homepage URL through [PageSpeed Insights](https://pagespeed.web.dev/). The site should score above 85 on mobile and 95 on desktop given the ISR architecture, CSS Modules, and `next/font`. Main opportunities will likely be image-related (OG image, hero background).

---

## 11. Analytics

These can be set up any time post-launch. Add them before you start promoting the site so data collection starts from day one.

### 11.1 Google Analytics 4

1. Go to [analytics.google.com](https://analytics.google.com) → **Admin → Create property** for `arenabase.co.ke`
2. Choose **Web** as the platform
3. Copy the **Measurement ID** — format: `G-XXXXXXXXXX`
4. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
   ```
5. Add the GA4 script to `app/layout.js` (place just before `</body>` inside `RootLayout`):

```jsx
import Script from 'next/script';

// Inside RootLayout, in <html> but after <body>:
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `,
    }} />
  </>
)}
```

6. Trigger a redeploy after adding the env var, then verify data appears in the GA4 Realtime report.

### 11.2 Microsoft Clarity

Clarity adds heatmaps and session recordings — valuable for understanding how fans navigate the site on mobile.

1. Go to [clarity.microsoft.com](https://clarity.microsoft.com) → **New project** for `arenabase.co.ke`
2. Copy the **Project ID** — a short alphanumeric string
3. Add the script to `app/layout.js` alongside the GA4 script:

```jsx
<Script id="clarity-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
  __html: `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_CLARITY_PROJECT_ID");
  `,
}} />
```

### 11.3 Google Search Console

Search Console shows what people are searching when they find your site and tracks how Google indexes your pages.

1. Go to [search.google.com/search-console](https://search.google.com/search-console) → **Add property** → URL prefix → `https://www.arenabase.co.ke`
2. Choose **HTML tag** verification
3. Copy the `content` value from the meta tag shown (a long token string — not the full HTML tag, just the value)
4. In `app/layout.js`, find the verification object and paste the token:

```js
export const metadata = {
  // ...existing metadata
  verification: {
    google: 'paste-your-verification-token-here',
  },
};
```

5. Push the change, wait for Vercel to redeploy, then click **Verify** in Search Console
6. Go to **Sitemaps → Add a new sitemap** and submit: `sitemap.xml`

Google should start indexing tournament and announcement pages within a few days. The sitemap is dynamic — it automatically includes all tournament slugs.

---

## 12. Ongoing operations

### 12.1 Deploying updates

Push a commit to the `main` branch — Vercel automatically builds and deploys. No manual action required. Preview deployments are created for every non-main branch push and get a unique URL for testing.

For content-only changes via the admin panel (adding fixtures, publishing results, writing announcements), **no redeploy is needed.** Data is live-fetched by Supabase. Due to ISR (`revalidate = 60`), public pages reflect admin changes within 60 seconds.

### 12.2 Adding a new admin user

Repeat the two-step process from section 8 for each additional admin:

```sql
-- Run in Supabase SQL Editor after creating the auth user
INSERT INTO admin_users (id, email, full_name, role)
VALUES (
  'new-user-uuid-from-auth-dashboard',
  'newadmin@example.com',
  'Admin Name',
  'super_admin'  -- or 'tournament_admin' or 'content_admin'
);
```

### 12.3 Forcing a cache revalidation

ISR caches pages for 60 seconds. If you need a page to update immediately (e.g. correcting a published result), you can trigger a full revalidation by going to **Vercel → Project → Deployments → Redeploy** on the latest production deployment. This clears the Next.js cache entirely.

Alternatively, add an on-demand revalidation API route in a future session (`/api/revalidate`) that can be called from server actions after writes.

### 12.4 Monitoring errors

- **Server errors (Next.js / Supabase):** Vercel → Project → **Logs** — filter by **Error** level
- **Database query issues:** Supabase Dashboard → **Database → Logs**
- **Auth problems:** Supabase Dashboard → **Authentication → Logs**

### 12.5 Database backups

Supabase automatically backs up the database daily on all plans. To download a manual backup: **Project Settings → Database → Backups → Download**. Good practice before any significant schema change.

### 12.6 Updating environment variables

Edit the variable value in **Vercel → Project → Settings → Environment Variables**, then trigger a redeploy. Changes to environment variables do not take effect until the next deployment.

---

## 13. Quick reference

### All environment variables

```env
# ── Supabase ─────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL          =
NEXT_PUBLIC_SUPABASE_ANON_KEY     =
SUPABASE_SERVICE_ROLE_KEY         =     # server-side only

# ── Cloudinary ───────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME =
CLOUDINARY_API_KEY                =
CLOUDINARY_API_SECRET             =     # server-side only

# ── App ──────────────────────────────────────────
NEXT_PUBLIC_SITE_URL              = https://www.arenabase.co.ke

# ── Analytics (post-launch) ──────────────────────
# NEXT_PUBLIC_GA_ID               = G-XXXXXXXXXX
```

### Key URLs after deployment

| URL | Purpose |
|---|---|
| `https://www.arenabase.co.ke` | Public homepage |
| `https://www.arenabase.co.ke/admin` | Admin panel (redirects to login if not authenticated) |
| `https://www.arenabase.co.ke/sitemap.xml` | Dynamic XML sitemap |
| `https://www.arenabase.co.ke/robots.txt` | Robots rules |
| Your Vercel project URL | Vercel dashboard for logs, deployments, env vars |
| Your Supabase project URL | Supabase dashboard for DB, auth, logs |

### Vercel DNS record summary

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

### Deployment order

```
GitHub → Supabase → Cloudinary → Vercel (env vars) → Deploy → Custom domain → Admin user → Content
```

---

*ARENABASE — Local Sports. One Platform.*
