import Script from 'next/script';

/**
 * Microsoft Clarity — heatmaps + session recordings
 *
 * Free tool (no cap on traffic) that shows exactly how users interact
 * with each page: click maps, scroll depth, rage clicks, dead clicks,
 * and full session recordings.
 *
 * Particularly useful for Kajiado launch — helps you see if mobile users
 * are struggling with any part of the UI and where fans spend the most time.
 *
 * Only loads in production.
 *
 * Setup:
 *   1. Go to clarity.microsoft.com → Create new project → "ARENABASE"
 *   2. Copy the Project ID (10-character string, e.g. "abc1234xyz")
 *   3. Add to .env.local:  NEXT_PUBLIC_CLARITY_PROJECT_ID=abc1234xyz
 *   4. Add to Vercel environment variables (same key)
 *
 * Placed in app/(public)/layout.js alongside GoogleAnalytics.
 */
export default function MicrosoftClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId || process.env.NODE_ENV !== 'production') return null;

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}
