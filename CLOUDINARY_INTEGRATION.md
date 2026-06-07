# Cloudinary Integration Guide — ARENABASE

## What Cloudinary Does in This Project

Cloudinary stores and serves all images: team logos and tournament banners.
Images are uploaded once (via the admin panel), stored with a **public ID** in the database,
and served on the frontend as optimised URLs built by `lib/cloudinary.js`.

---

## Step 1 — Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com) and sign up for a free account.
2. The free tier gives you **25 GB storage** and **25 GB bandwidth/month** — more than enough to launch.
3. After signing up, you land on the **Dashboard**. Keep this tab open.

---

## Step 2 — Get Your Credentials

On the Cloudinary Dashboard, find the **API Keys** section (or go to **Settings → Access Keys**).

Copy these three values into your `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> `CLOUD_NAME` is safe to expose publicly (it appears in every image URL).
> `API_KEY` and `API_SECRET` are server-side only — never prefix them with `NEXT_PUBLIC_`.

---

## Step 3 — Create an Upload Preset

An **upload preset** lets the admin panel upload images directly from the browser
without exposing your API secret. This is the standard Cloudinary approach for web apps.

1. In Cloudinary, go to **Settings → Upload → Upload Presets**.
2. Click **Add upload preset**.
3. Configure it:

| Setting | Value |
|---|---|
| Preset name | `arenabase_upload` |
| Signing mode | **Unsigned** |
| Folder | `arenabase` |
| Allowed formats | `jpg, jpeg, png, webp` |
| Max file size | `5 MB` |
| Quality | `auto` |
| Format | `auto` |

4. Click **Save**.

> The folder `arenabase` will be the root. Sub-folders will be created automatically:
> - `arenabase/teams/` — team logos
> - `arenabase/tournaments/` — tournament banners

---

## Step 4 — Folder Structure Convention

When uploading through the admin panel (built in a later session), use these public ID conventions:

| Image type | Cloudinary public ID format | Example |
|---|---|---|
| Team logo | `arenabase/teams/{team-slug}` | `arenabase/teams/green-fc` |
| Tournament banner | `arenabase/tournaments/{tournament-slug}` | `arenabase/tournaments/kajiado-super-cup` |

This keeps images organised and makes it easy to replace a logo by re-uploading with the same public ID.

---

## Step 5 — How `lib/cloudinary.js` Works

The library does **not** use the Cloudinary npm package on the frontend.
It builds transformation URLs directly — faster, zero dependencies.

### Basic usage

```js
import { img } from '@/lib/cloudinary';

// In a component:
<img src={img.teamLogo('arenabase/teams/green-fc')} alt="Green FC" />
<img src={img.tournamentCard('arenabase/tournaments/kajiado-super-cup')} alt="Kajiado Super Cup" />
```

### Available presets

| Preset | Dimensions | Use case |
|---|---|---|
| `img.teamLogo(id)` | 64 × 64 | Match cards, fixture rows |
| `img.teamLogoLarge(id)` | 128 × 128 | Tournament detail, team profiles |
| `img.tournamentCard(id)` | 800 × 320 | Tournament grid cards |
| `img.tournamentBanner(id)` | 1200 × 420 | Tournament detail hero |
| `img.ogImage(id)` | 1200 × 630 | Open Graph / social share |

### Custom size (if a preset doesn't fit)

```js
import { getImageUrl } from '@/lib/cloudinary';

const url = getImageUrl('arenabase/teams/green-fc', {
  width: 200,
  height: 200,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
});
```

---

## Step 6 — Using with Next.js `<Image />`

When using the Next.js `<Image />` component (recommended for LCP performance),
pass the Cloudinary URL as the `src`:

```jsx
import Image from 'next/image';
import { img } from '@/lib/cloudinary';

<Image
  src={img.teamLogo(team.logo_public_id)}
  alt={team.name}
  width={64}
  height={64}
  unoptimized   // Cloudinary already optimises — skip Next.js double-processing
/>
```

> The `unoptimized` prop prevents Next.js from re-processing an already-optimised Cloudinary URL.
> The `remotePatterns` entry in `next.config.mjs` allows `res.cloudinary.com` as a trusted host.

---

## Step 7 — Uploading Images (Admin Panel Preview)

The admin panel (built in a later session) will use the **unsigned upload preset** to upload directly from the browser. Here is how it will work when we build it:

```js
// This code is for reference — it will be built into the admin panel in a later session.
async function uploadImage(file, folder) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'arenabase_upload');
  formData.append('folder', `arenabase/${folder}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  const data = await res.json();
  return data.public_id; // Save this to the database
}
```

The returned `public_id` is what gets stored in `teams.logo_public_id` or `tournaments.banner_public_id`.

---

## Checklist Before Moving to Session 02

- [ ] Cloudinary account created
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` added to `.env.local`
- [ ] `CLOUDINARY_API_KEY` added to `.env.local`
- [ ] `CLOUDINARY_API_SECRET` added to `.env.local`
- [ ] Upload preset `arenabase_upload` created (unsigned, folder: `arenabase`)
- [ ] Schema v1.1 (`schema.sql`) run in Supabase SQL Editor
- [ ] Supabase env vars in `.env.local`
- [ ] `npm run dev` runs without errors
