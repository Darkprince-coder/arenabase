import { Anton, Inter } from 'next/font/google';
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
    default: 'ARENABASE | Local Sports. One Platform.',
    template: '%s | ARENABASE',
  },
  description:
    'Fixtures, results, tournaments and announcements from your local sports community in Kajiado. Your first stop for grassroots football.',
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
    title: 'ARENABASE | Local Sports. One Platform.',
    description:
      'Fixtures, results, tournaments and announcements from your local sports community in Kajiado.',
    url: 'https://www.arenabase.co.ke',
    siteName: 'ARENABASE',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ARENABASE — Local Sports. One Platform.',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARENABASE | Local Sports. One Platform.',
    description:
      'Fixtures, results, tournaments and announcements from your local sports community.',
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
  verification: {
    google: '',
  },
};

/* -- Root Layout -----------------------------------------
 * Intentionally bare — no Navbar or Footer here.
 *
 * Public pages  → wrapped by app/(public)/layout.js  (Navbar + Footer)
 * Admin pages   → wrapped by app/admin/layout.js     (Admin sidebar shell)
 *
 * This separation prevents the public Navbar from appearing in the admin.
 * -------------------------------------------------------- */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
