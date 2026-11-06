import Image from 'next/image';
import type { ReactNode } from 'react';

import { EnterFade } from '@/components/features/EnterFade';
import { photos } from '@/lib/content/photos';

import styles from './AuthShell.module.css';

export interface AuthShellProps {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly lede: string;
  readonly children: ReactNode;
  readonly footer: ReactNode;
}

/** Sign-in / sign-up composition: form column on paper, a quiet photograph beside it. */
export function AuthShell({ eyebrow, title, lede, children, footer }: AuthShellProps) {
  return (
    <div className={styles.shell}>
      <EnterFade className={styles.panel}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lede}>{lede}</p>
        {children}
        <div className={styles.footer}>{footer}</div>
      </EnterFade>
      <figure className={styles.media}>
        <Image
          src={photos.sombra.src}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="(max-width: 1023px) 10vw, 45vw"
          className={styles.image}
        />
      </figure>
    </div>
  );
}
