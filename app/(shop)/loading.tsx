import styles from './loading.module.css';

/** Route-level loading: a quiet hairline progress, never a full-screen spinner. */
export default function ShopLoading() {
  return (
    <div className={styles.root} aria-busy="true">
      <p className="sr-only" role="status">
        Cargando…
      </p>
      <span className={styles.bar} aria-hidden="true" />
      <span className={styles.title} aria-hidden="true" />
      <span className={styles.line} aria-hidden="true" />
      <span className={`${styles.line} ${styles.short}`} aria-hidden="true" />
    </div>
  );
}
