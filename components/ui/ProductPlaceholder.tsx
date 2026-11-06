import {
  Dumbbell,
  Footprints,
  Laptop,
  Package,
  Shirt,
  Sofa,
  Watch,
  type LucideIcon,
} from 'lucide-react';

import styles from './ProductPlaceholder.module.css';

/** Category name → icon. Matching by keyword keeps it working when categories are renamed. */
const ICONS: readonly (readonly [RegExp, LucideIcon])[] = [
  [/ropa|camis|prenda|vest/i, Shirt],
  [/calzado|zapat|tenis/i, Footprints],
  [/accesor|reloj|joy/i, Watch],
  [/hogar|casa|deco/i, Sofa],
  [/tecno|electr|comput/i, Laptop],
  [/deport|fitness|bici/i, Dumbbell],
];

export function categoryIcon(categoria: string | null | undefined): LucideIcon {
  if (!categoria) return Package;
  return ICONS.find(([re]) => re.test(categoria))?.[1] ?? Package;
}

export interface ProductPlaceholderProps {
  readonly nombre: string;
  readonly categoria?: string | null | undefined;
  readonly size?: 'card' | 'large' | 'thumb';
}

/**
 * Designed stand-in when a product has no usable photo: the category's icon and a quiet
 * "Foto pendiente" note on a paper gradient. Decorative; the card label carries the name.
 */
export function ProductPlaceholder({
  nombre,
  categoria,
  size = 'card',
}: ProductPlaceholderProps) {
  const Icon = categoryIcon(categoria);
  return (
    <div className={`${styles.root} ${styles[size]}`} aria-hidden="true">
      <span className={styles.initial}>{nombre.trim().charAt(0)}</span>
      <Icon className={styles.icon} strokeWidth={1.25} />
      {size !== 'thumb' ? <span className={styles.note}>Foto pendiente</span> : null}
    </div>
  );
}
