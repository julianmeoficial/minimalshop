import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly lede?: ReactNode;
  readonly action?: { readonly href: string; readonly label: string } | undefined;
  /** `h1` only for page-level headers; sections use `h2`. */
  readonly level?: 'h1' | 'h2';
}

/**
 * KORVAE section header: small eyebrow, serif statement, supporting line on the left,
 * optional text link on the right. Children carry `data-reveal` for GSAP.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  lede,
  action,
  level = 'h2',
}: SectionHeaderProps) {
  const Heading = level;
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <p className={styles.eyebrow} data-reveal>
          {eyebrow}
        </p>
        <Heading
          className={level === 'h1' ? styles.pageTitle : styles.title}
          id={id}
          data-reveal
        >
          {title}
        </Heading>
        {lede ? (
          <p className={styles.lede} data-reveal>
            {lede}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link className={styles.action} href={action.href} data-reveal>
          {action.label}
          <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
        </Link>
      ) : null}
    </header>
  );
}
