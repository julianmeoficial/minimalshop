import Image from 'next/image';
import type { ReactNode } from 'react';

import type { EditorialPhoto } from '@/lib/content/photos';

import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly photo: EditorialPhoto;
  readonly children?: ReactNode;
  readonly action?: ReactNode;
  /** Heading level; empty pages own the screen's single `h1`. */
  readonly level?: 'h1' | 'h2';
}

/** Empty state with a useful action and a quiet photograph (DESIGN.md §9). */
export function EmptyState({
  eyebrow,
  title,
  photo,
  children,
  action,
  level = 'h1',
}: EmptyStateProps) {
  const Heading = level;
  return (
    <section className={styles.root}>
      <figure className={styles.media}>
        <Image
          src={photo.src}
          alt=""
          fill
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 40vw"
          className={styles.image}
        />
      </figure>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <Heading className={styles.title}>{title}</Heading>
        {children ? <div className={styles.body}>{children}</div> : null}
        {action ? <div className={styles.actions}>{action}</div> : null}
      </div>
    </section>
  );
}
