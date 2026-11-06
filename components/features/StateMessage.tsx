import { CircleAlert, Info } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './StateMessage.module.css';

export interface StateMessageProps {
  readonly title: string;
  readonly children?: ReactNode | undefined;
  readonly correlationId?: string | undefined;
  readonly action?: ReactNode | undefined;
  /** `error` when something failed; `neutral` for empty or informative states. */
  readonly tone?: 'neutral' | 'error';
  /** Use `h1` when the message is the whole screen (one h1 per screen). */
  readonly level?: 'h1' | 'h2';
}

/** Plain-language state: icon + text (never colour alone), optional support id and action. */
export function StateMessage({
  title,
  children,
  correlationId,
  action,
  tone = correlationId ? 'error' : 'neutral',
  level = 'h2',
}: StateMessageProps) {
  const Heading = level;
  const Icon = tone === 'error' ? CircleAlert : Info;
  return (
    <div
      className={`${styles.root} ${tone === 'error' ? styles.error : ''}`}
      role={tone === 'error' ? 'alert' : undefined}
    >
      <Icon className={styles.icon} size={24} strokeWidth={1.5} aria-hidden />
      <div className={styles.content}>
        <Heading className={styles.title}>{title}</Heading>
        {children ? <div className={styles.body}>{children}</div> : null}
        {correlationId ? (
          <p className={styles.meta}>Código de soporte: {correlationId}</p>
        ) : null}
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
    </div>
  );
}
