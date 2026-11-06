import { Plus } from 'lucide-react';

import type { FaqItem } from '@/lib/content/faq';

import styles from './FaqList.module.css';

export interface FaqListProps {
  readonly items: readonly FaqItem[];
  /** `compact` for short lists inside a product page. */
  readonly variant?: 'default' | 'compact';
}

/**
 * Accordion built on native `<details>`: keyboard and screen-reader support for free,
 * works without JavaScript, and Ctrl+F finds text inside closed answers.
 */
export function FaqList({ items, variant = 'default' }: FaqListProps) {
  return (
    <div className={`${styles.list} ${variant === 'compact' ? styles.compact : ''}`}>
      {items.map((item) => (
        <details key={item.id} className={styles.item} id={item.id}>
          <summary className={styles.question}>
            <span>{item.question}</span>
            <Plus className={styles.icon} size={18} strokeWidth={1.5} aria-hidden />
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
