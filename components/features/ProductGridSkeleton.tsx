import { ProductCard } from '@/components/ui';

import styles from './RecentProducts.module.css';

export interface ProductGridSkeletonProps {
  readonly count?: number;
}

/** Loading state for product grids: final dimensions, so nothing shifts on arrival. */
export function ProductGridSkeleton({ count = 4 }: ProductGridSkeletonProps) {
  return (
    <ul className={styles.grid} aria-busy="true" aria-label="Cargando productos">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <ProductCard loading href="#" nombre="" precio={0} />
        </li>
      ))}
    </ul>
  );
}
