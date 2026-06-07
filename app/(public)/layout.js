import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './layout.module.css';

/**
 * Public site layout.
 *
 * All pages inside app/(public)/ inherit this shell.
 * The (public) route group prefix is ignored in URLs —
 * app/(public)/fixtures/page.js still routes to /fixtures.
 *
 * Renders:
 *   Fixed Navbar (68px) → padded <main> → Footer
 */
export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
      <Footer />
    </>
  );
}
