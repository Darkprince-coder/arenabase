import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://www.arenabase.co.ke';

export default async function sitemap() {
  /* ── Static routes ──────────────────────────────── */
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

  /* ── Dynamic tournament routes ──────────────────── */
  let tournamentRoutes = [];
  try {
    const { data: tournaments } = await supabase
      .from('tournaments')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false });

    tournamentRoutes = (tournaments || []).map((t) => ({
      url: `${BASE_URL}/tournaments/${t.slug}`,
      lastModified: new Date(t.updated_at),
      changeFrequency: 'daily',
      priority: 0.85,
    }));
  } catch {
    // Supabase unavailable at build time — static routes still generated
  }

  return [...staticRoutes, ...tournamentRoutes];
}
