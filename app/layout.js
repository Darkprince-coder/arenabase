import { Anton, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

/* -- Fonts -------------------------------------------- */
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/* ── Metadata ─────────────────────────────────────────── */
export const metadata = {
  title: {
    default: 'ARENABASE | Where Local Sports Live',
    template: '%s | ARENABASE',
  },
  description:
    'Fixtures, results, tournaments and announcements from local sports across Kajiado. Follow your favorite teams, discover upcoming matches and never miss a game.',
  keywords: [
    'football fixtures Kajiado',
    'grassroots football Kenya',
    'Kajiado Super Cup',
    'local football results',
    'sports tournaments Kajiado',
    'Arenabase',
  ],
  metadataBase: new URL('https://www.arenabase.co.ke'),
  openGraph: {
    title: 'ARENABASE | Where Local Sports Live',
    description:
      'Fixtures, results, tournaments and announcements from local sports across Kajiado. Follow your favorite teams, discover upcoming matches and never miss a game.',
    url: 'https://www.arenabase.co.ke',
    siteName: 'ARENABASE',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ARENABASE — Where Local Sports Live',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARENABASE | Where Local Sports Live',
    description:
      'Fixtures, results, tournaments and announcements from local sports across Kajiado. Follow your favorite teams, discover upcoming matches and never miss a game.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  /*
   * Google Search Console verification.
   * 1. Go to search.google.com/search-console
   * 2. Add property → URL prefix → https://www.arenabase.co.ke
   * 3. Choose "HTML tag" verification method
   * 4. Copy the content value from the meta tag (the part after content=)
   * 5. Set in .env.local: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_token_here
   * 6. Add same key to Vercel environment variables
   */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};

/* -- Root Layout -----------------------------------------
 * Intentionally bare — no Navbar or Footer here.
 *
 * Public pages  → wrapped by app/(public)/layout.js  (Navbar + Footer + Analytics)
 * Admin pages   → wrapped by app/admin/layout.js     (Admin sidebar shell)
 *
 * Vercel Analytics and Speed Insights live here (root) so they capture
 * performance data across all routes including admin — useful for diagnosing
 * any slow server-side renders on admin pages.
 * -------------------------------------------------------- */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>
        {children}
        {/*
         * Vercel Analytics — tracks page views, Web Vitals, and geography.
         * Works out of the box on Vercel. Zero config.
         * Dashboard: vercel.com → your project → Analytics tab.
         */}
        <Analytics />
        {/*
         * Vercel Speed Insights — Core Web Vitals per route.
         * Shows LCP, FID, CLS, TTFB broken down by page.
         * Dashboard: vercel.com → your project → Speed Insights tab.
         */}
        <SpeedInsights />
      </body>
    </html>
  );
}
