import Link from 'next/link';

import { formatPrice } from '@/lib/format';

import { GlassSurface } from './GlassSurface';
import { PriceTag } from './PriceTag';
import { ProductImage } from './ProductImage';
import { ProductPlaceholder } from './ProductPlaceholder';

import styles from './ProductCard.module.css';

export interface ProductCardProps {
  readonly href: string;
  readonly nombre: string;
  readonly precio: number;
  readonly imagenUrl?: string | null | undefined;
  readonly categoria?: string | null | undefined;
  readonly outOfStock?: boolean | undefined;
  readonly preventa?: boolean | undefined;
  /** Few units left (shown as a crystal chip, never colour alone). */
  readonly lowStock?: boolean | undefined;
  readonly loading?: boolean | undefined;
  /** `sizes` for the product image; defaults to a 4-up catalogue grid. */
  readonly sizes?: string | undefined;
  /** Above-the-fold cards: load the image eagerly. */
  readonly priority?: boolean | undefined;
}

/**
 * Image-first product card (KORVAE / Almada). The price floats on the photograph as a
 * crystal price tag; status, when there is one, is a crystal chip with text.
 * No shadow and no lift: hover is an image filter swap plus a title underline.
 */
export function ProductCard({
  href,
  nombre,
  precio,
  imagenUrl,
  categoria,
  outOfStock = false,
  preventa = false,
  lowStock = false,
  loading = false,
  sizes = '(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw',
  priority = false,
}: ProductCardProps) {
  if (loading) {
    return (
      <div className={styles.root} aria-hidden="true">
        <div className={`${styles.media} ${styles.skeleton}`} />
        <span className={`${styles.skeletonLine} ${styles.short}`} />
        <span className={styles.skeletonLine} />
      </div>
    );
  }

  const status = outOfStock
    ? 'Agotado'
    : preventa
      ? 'Preventa'
      : lowStock
        ? 'Últimas unidades'
        : null;
  const label = [nombre, formatPrice(precio), status].filter(Boolean).join(', ');
  const placeholder = <ProductPlaceholder nombre={nombre} categoria={categoria} />;

  return (
    <Link
      href={href}
      className={`${styles.root} ${outOfStock ? styles.out : ''}`}
      aria-label={label}
    >
      <div className={styles.media}>
        {imagenUrl ? (
          <ProductImage
            className={styles.image}
            src={imagenUrl}
            alt=""
            sizes={sizes}
            priority={priority}
            fallback={placeholder}
          />
        ) : (
          placeholder
        )}
        {status ? (
          <GlassSurface as="span" variant="crystal" strong className={styles.status}>
            {status}
          </GlassSurface>
        ) : null}
        <PriceTag amount={precio} glass strong className={styles.price} />
      </div>
      <div className={styles.text}>
        {categoria ? <span className={styles.category}>{categoria}</span> : null}
        <h3 className={styles.title}>
          <span className={styles.titleText}>{nombre}</span>
        </h3>
      </div>
    </Link>
  );
}
