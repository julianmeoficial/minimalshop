import { ProductGridSkeleton } from '@/components/features/ProductGridSkeleton';

import styles from './catalogo.module.css';

/** Catalogue skeleton: twelve cards at their final size, no full-screen spinner. */
export default function CatalogoLoading() {
  return (
    <div className={styles.page} aria-busy="true">
      <p className="sr-only" role="status">
        Cargando el catálogo…
      </p>
      <ProductGridSkeleton count={12} />
    </div>
  );
}
