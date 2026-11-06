import Image from 'next/image';
import type { ReactNode } from 'react';

import { ScrollReveal } from '@/components/features/ScrollReveal';
import type { EditorialPhoto } from '@/lib/content/photos';

import styles from './FeatureSplit.module.css';

export interface FeatureSplitProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly photo: EditorialPhoto;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
  /** Image on the right instead of the left. */
  readonly reverse?: boolean;
}

/**
 * KORVAE half-and-half: a full-height photograph next to a short editorial column.
 * The image wipes in (GSAP clip-path); the copy rises with the section reveal.
 */
export function FeatureSplit({
  id,
  eyebrow,
  title,
  photo,
  children,
  actions,
  reverse = false,
}: FeatureSplitProps) {
  const titleId = `${id}-titulo`;
  return (
    <ScrollReveal
      as="section"
      id={id}
      aria-labelledby={titleId}
      className={`${styles.split} ${reverse ? styles.reverse : ''}`}
    >
      <figure className={styles.media} data-reveal-media>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          placeholder="blur"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={styles.image}
        />
      </figure>
      <div className={styles.copy}>
        <p className={styles.eyebrow} data-reveal>
          {eyebrow}
        </p>
        <h2 className={styles.title} id={titleId} data-reveal>
          {title}
        </h2>
        <div className={styles.body} data-reveal>
          {children}
        </div>
        {actions ? (
          <div className={styles.actions} data-reveal>
            {actions}
          </div>
        ) : null}
      </div>
    </ScrollReveal>
  );
}
