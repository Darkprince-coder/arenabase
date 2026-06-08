import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://www.arenabase.co.ke';

export default async function sitemap() {
  /* ── Static routes ──────────────────────────────────── */
  const staticRoutes = [
    { path: '',                changeFrequency: 'daily',   priority: 1.0 },
    { path: '/fixtures',       changeFrequency: 'daily',   priority: 0.9 },
    { path: '/results',        changeFrequency: 'daily',   priority: 0.9 },
    { path: '/tournaments',    changeFrequency: 'weekly',  priority: 0.8 },
    { path: '/announcements',  changeFrequency: 'daily',   priority: 0.8 },
    { path: '/about',          changeFrequency: 'monthly', priority: 0.5 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  /* ── Dynamic tournament routes ──────────────────────── */
  /*
   * Tournament pages are the highest-value SEO target — someone searching
   * "Kajiado Super Cup fixtures" should land directly on the tournament page.
   * Priority 0.85 — higher than the announcements list but below the
   * top-level fixtures/results pages.
   */
  let tournamentRoutes = [];
  try {
    const { data: tournaments } = await supabase
      .from('tournaments')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    tournamentRoutes = (tournaments ?? []).map((t) => ({
      url: `${BASE_URL}/tournaments/${t.slug}`,
      lastModified: new Date(t.updated_at),
      changeFrequency: 'daily',
      priority: 0.85,
    }));
  } catch {
    // Supabase unavailable at build time — static routes still generated
  }

  /* ── Dynamic announcement routes ───────────────────── */
  /*
   * Individual announcement pages are indexable — a search for
   * "Kajiado Super Cup venue change" might land on a specific announcement.
   * Priority 0.6 — useful but secondary to tournament and list pages.
   * changeFrequency: monthly because announcements don't change after publish.
   */
  let announcementRoutes = [];
  try {
    const { data: announcements } = await supabase
      .from('announcements')
      .select('slug, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    announcementRoutes = (announcements ?? []).map((a) => ({
      url: `${BASE_URL}/announcements/${a.slug}`,
      lastModified: new Date(a.published_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch {
    // Supabase unavailable at build time — fail gracefully
  }

  return [...staticRoutes, ...tournamentRoutes, ...announcementRoutes];
}
