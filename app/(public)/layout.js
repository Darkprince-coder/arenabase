import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity';
import styles from './layout.module.css';

/**
 * Public site layout.
 *
 * All pages inside app/(public)/ inherit this shell.
 * The (public) route group prefix is ignored in URLs —
 * app/(public)/fixtures/page.js still routes to /fixtures.
 *
 * Analytics scripts (GA4 + Clarity) are placed here so they only
 * fire on public-facing pages — admin panel is intentionally excluded.
 *
 * Renders:
 *   Analytics scripts → fixed Navbar (68px) → padded <main> → Footer
 */
export default function PublicLayout({ children }) {
  return (
    <>
      {/* Analytics — production only, no effect in dev */}
      <GoogleAnalytics />
      <MicrosoftClarity />

      <Navbar />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <Footer />
    </>
  );
}
