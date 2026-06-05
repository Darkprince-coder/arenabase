/**
 * ARENABASE — Shared Utility Functions
 * Date formatting · String helpers · Match outcome logic
 */

/* ── Date & Time ────────────────────────────────────── */

/** "SAT, 24 MAY 2024" */
export function formatMatchDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const weekday = d.toLocaleDateString('en-KE', { weekday: 'short' }).toUpperCase();
  const day     = d.getDate();
  const month   = d.toLocaleDateString('en-KE', { month: 'short' }).toUpperCase();
  const year    = d.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

/** "15:00" — 24-hour format */
export function formatKickoffTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString('en-KE', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** "24 MAY" — compact for results rows */
export function formatShortDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return `${d.getDate()} ${d.toLocaleDateString('en-KE', { month: 'short' }).toUpperCase()}`;
}

/** "2 days ago" / "Today" / "Yesterday" — for announcements */
export function formatRelativeDate(isoString) {
  if (!isoString) return '';
  const diffMs   = Date.now() - new Date(isoString).getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <  7) return `${diffDays} days ago`;
  return formatShortDate(isoString);
}

/** "SAT" / "TODAY" / "TOMORROW" — fixture card day label */
export function getDayLabel(isoString) {
  if (!isoString) return '';
  const d    = new Date(isoString);
  const now  = new Date();
  const tom  = new Date(now); tom.setDate(now.getDate() + 1);
  if (d.toDateString() === now.toDateString()) return 'TODAY';
  if (d.toDateString() === tom.toDateString()) return 'TOMORROW';
  return d.toLocaleDateString('en-KE', { weekday: 'short' }).toUpperCase();
}

/* ── Team helpers ───────────────────────────────────── */

/**
 * Deterministic 0-11 colour index from team name.
 * Same team always gets the same fallback colour.
 */
export function getTeamColorIndex(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h);
  }
  return Math.abs(h) % 12;
}

/** "Green FC" → "GF" · "Kajiado All Stars" → "KA" */
export function getTeamInitials(name = '') {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

/* ── String helpers ─────────────────────────────────── */

export function truncate(text = '', n = 110) {
  if (text.length <= n) return text;
  return text.slice(0, n).trimEnd() + '…';
}

export function slugify(text = '') {
  return text.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/* ── Match outcome ──────────────────────────────────── */

export function getOutcome(homeScore, awayScore) {
  return {
    homeWon: homeScore > awayScore,
    awayWon: awayScore > homeScore,
    isDraw:  homeScore === awayScore,
  };
}

/* ── Section label ──────────────────────────────────── */

/** Returns "This Weekend's Fixtures" if first fixture is Sat/Sun, else "Upcoming Fixtures" */
export function getFixturesSectionLabel(fixtures = []) {
  if (!fixtures.length) return "Upcoming Fixtures";
  const day = new Date(fixtures[0].kickoff_time).getDay();
  return (day === 0 || day === 6) ? "This Weekend's Fixtures" : "Upcoming Fixtures";
}
