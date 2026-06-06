import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatMatchDate } from '@/lib/utils';
import styles from './page.module.css';

export const revalidate = 60;

export const dynamicParams = true;

/* Pre-render all published announcement slugs at build time */
export async function generateStaticParams() {
  const { data } = await supabase
    .from('announcements')
    .select('slug')
    .eq('is_published', true);
  return (data ?? []).map(a => ({ slug: a.slug }));
}

/* ── Dynamic metadata ───────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: announcement } = await supabase
    .from('announcements')
    .select('title, body, tournament:tournament_id(name)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!announcement) return { title: 'Announcement Not Found' };

  const desc = announcement.body?.slice(0, 155).trim() + '…';

  return {
    title: announcement.title,
    description: desc,
    openGraph: {
      title: `${announcement.title} | ARENABASE`,
      description: desc,
    },
  };
}

/* ── JSON-LD (Article schema) ───────────────────────── */
function buildJsonLd(announcement) {
  return {
    '@context': 'https://schema.org',
    '@type':    'Article',
    headline:   announcement.title,
    description: announcement.body?.slice(0, 155).trim(),
    datePublished: announcement.published_at,
    publisher: {
      '@type': 'Organization',
      name:    'ARENABASE',
      url:     'https://www.arenabase.co.ke',
    },
    ...(announcement.tournament?.name && {
      about: {
        '@type': 'SportsEvent',
        name:    announcement.tournament.name,
      },
    }),
  };
}

/* ── Body renderer ──────────────────────────────────── */
/**
 * Turns plain-text body (double-newline paragraphs, single-newline line breaks)
 * into React elements without any markdown dependency.
 */
function BodyText({ text, className }) {
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((para, i) => (
        <p key={i}>
          {para.split('\n').map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default async function AnnouncementDetailPage(props) {
  /* Next.js 15: params is a Promise */
  const { slug } = await props.params;

  const { data: announcement } = await supabase
    .from('announcements')
    .select('id, title, slug, body, published_at, tournament:tournament_id(id, name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!announcement) notFound();

  /* Fetch adjacent announcements for prev/next navigation */
  const [{ data: newerData }, { data: olderData }] = await Promise.all([
    supabase
      .from('announcements')
      .select('title, slug')
      .eq('is_published', true)
      .gt('published_at', announcement.published_at)
      .order('published_at')
      .limit(1),
    supabase
      .from('announcements')
      .select('title, slug')
      .eq('is_published', true)
      .lt('published_at', announcement.published_at)
      .order('published_at', { ascending: false })
      .limit(1),
  ]);

  const newer = newerData?.[0] ?? null;
  const older = olderData?.[0] ?? null;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(announcement)) }}
      />

      {/* ── Header ──────────────────────────────── */}
      <header className={styles.header}>
        <div className={`${styles.headerInner} container`}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/announcements" className={styles.breadcrumbLink}>
              ← Announcements
            </Link>
          </nav>

          {/* Tournament tag */}
          {announcement.tournament?.name && (
            <span className={styles.tournamentTag}>
              {announcement.tournament.name}
            </span>
          )}

          {/* Title */}
          <h1 className={styles.title}>{announcement.title}</h1>

          {/* Published date */}
          <time
            className={styles.date}
            dateTime={announcement.published_at}
          >
            {formatMatchDate(announcement.published_at)}
          </time>
        </div>
      </header>

      {/* ── Body ────────────────────────────────── */}
      <div className={`${styles.articleWrap} container`}>
        <article className={styles.article}>
          <BodyText text={announcement.body} className={styles.body} />
        </article>

        {/* ── Prev / Next navigation ──────────────── */}
        {(newer || older) && (
          <nav className={styles.pagination} aria-label="More announcements">
            <div className={styles.paginationInner}>
              {newer ? (
                <Link href={`/announcements/${newer.slug}`} className={`${styles.pageLink} ${styles.pageLinkNewer}`}>
                  <span className={styles.pageLinkLabel}>← Newer</span>
                  <span className={styles.pageLinkTitle}>{newer.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {older ? (
                <Link href={`/announcements/${older.slug}`} className={`${styles.pageLink} ${styles.pageLinkOlder}`}>
                  <span className={styles.pageLinkLabel}>Older →</span>
                  <span className={styles.pageLinkTitle}>{older.title}</span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        )}

        {/* ── Back button ─────────────────────────── */}
        <div className={styles.backRow}>
          <Link href="/announcements" className={styles.backBtn}>
            ← Back to all announcements
          </Link>
        </div>
      </div>
    </>
  );
}
