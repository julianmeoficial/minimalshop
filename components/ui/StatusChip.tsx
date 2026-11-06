import {
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { GlassSurface } from './GlassSurface';

import styles from './StatusChip.module.css';

export type StatusChipVariant =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface StatusChipProps {
  readonly variant: StatusChipVariant;
  readonly label: string;
  /**
   * Crystal glass finish. Only for a chip that floats over content (max two glass
   * surfaces per screen); chips inside tables and lists stay flat tints.
   */
  readonly glass?: boolean;
}

const ICONS: Record<StatusChipVariant, ReactNode> = {
  pending: <Clock3 className={styles.icon} size={16} strokeWidth={1.5} aria-hidden />,
  paid: <CheckCircle2 className={styles.icon} size={16} strokeWidth={1.5} aria-hidden />,
  shipped: <Truck className={styles.icon} size={16} strokeWidth={1.5} aria-hidden />,
  delivered: <Package className={styles.icon} size={16} strokeWidth={1.5} aria-hidden />,
  failed: <XCircle className={styles.icon} size={16} strokeWidth={1.5} aria-hidden />,
  cancelled: <XCircle className={styles.icon} size={16} strokeWidth={1.5} aria-hidden />,
};

export function StatusChip({ variant, label, glass = false }: StatusChipProps) {
  const className = `${styles.root} ${styles[variant]}`;
  if (glass) {
    return (
      <GlassSurface variant="crystal" className={className}>
        {ICONS[variant]}
        <span>{label}</span>
      </GlassSurface>
    );
  }
  return (
    <span className={`${className} ${styles.flat}`}>
      {ICONS[variant]}
      <span>{label}</span>
    </span>
  );
}
