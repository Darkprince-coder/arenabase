import { Anton, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/* -- Fonts ------------------------------------ */
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

/* ── Default Metadata (overridden per-page) ─────────── */
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
        url: '/og-image.jpg',      // Add a 1200x630 image to /public
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
    google: '',   // ← Paste your Google Search Console verification token here
  },
};

/* -- Root Layout -------------------------------- */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
