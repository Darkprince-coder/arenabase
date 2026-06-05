import styles from './PageHeader.module.css';

/**
 * PageHeader
 * Props:
 *   title     – large Anton heading
 *   subtitle  – smaller descriptive text
 *   children  – optional right-side slot (badges, counts, etc.)
 */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <section className={styles.header}>
      <div className={`${styles.inner} container`}>
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {children && (
          <div className={styles.aside}>{children}</div>
        )}
      </div>
    </section>
  );
}
