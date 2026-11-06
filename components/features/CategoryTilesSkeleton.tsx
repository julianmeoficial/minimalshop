import styles from './CategoryTiles.module.css';

export interface CategoryTilesSkeletonProps {
  readonly count?: number;
}

/** Category tiles at their final size while the catalogue loads. */
export function CategoryTilesSkeleton({ count = 6 }: CategoryTilesSkeletonProps) {
  return (
    <ul className={styles.grid} aria-busy="true" aria-label="Cargando categorías">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className={styles.media} />
        </li>
      ))}
    </ul>
  );
}
