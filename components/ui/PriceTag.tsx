import { formatPrice } from '@/lib/format';

import { GlassSurface } from './GlassSurface';

import styles from './PriceTag.module.css';

export interface PriceTagProps {
  readonly amount: number;
  readonly variant?: 'normal' | 'struck' | 'large';
  /** Crystal glass tag — for prices that float over photography or content. */
  readonly glass?: boolean;
  /** Stronger glass surface; use it whenever the tag sits on a photograph. */
  readonly strong?: boolean;
  readonly className?: string | undefined;
}

export function PriceTag({
  amount,
  variant = 'normal',
  glass = false,
  strong = false,
  className,
}: PriceTagProps) {
  const content = (
    <span className={`${styles.root} ${styles[variant]}`}>{formatPrice(amount)}</span>
  );

  if (!glass) {
    return className ? <span className={className}>{content}</span> : content;
  }

  return (
    <GlassSurface
      as="span"
      variant="crystal"
      strong={strong}
      className={`${styles.glassWrap} ${className ?? ''}`}
    >
      {content}
    </GlassSurface>
  );
}
