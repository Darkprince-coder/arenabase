import Script from 'next/script';

/**
 * Google Analytics 4
 *
 * Injects the gtag.js snippet via next/script with strategy="afterInteractive"
 * so it never blocks the main thread or First Contentful Paint.
 *
 * Only loads in production — completely absent during local dev so you
 * don't pollute your GA4 data.
 *
 * Setup:
 *   1. Create a GA4 property at analytics.google.com
 *   2. Copy the Measurement ID (G-XXXXXXXXXX)
 *   3. Add to .env.local:  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *   4. Add to Vercel environment variables (same key)
 *
 * Placed in app/(public)/layout.js — tracks only public-facing pages.
 * Admin panel is intentionally excluded.
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId || process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />
    </>
  );
}
