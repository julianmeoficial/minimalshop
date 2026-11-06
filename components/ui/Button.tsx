import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger';

interface CommonProps {
  readonly variant?: Variant;
  readonly fullWidth?: boolean;
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

export type ButtonProps = CommonProps &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & { readonly href?: undefined })
    | {
        /** Renders a navigation link styled as a button (never `<a><button>`). */
        readonly href: string;
        readonly 'aria-current'?: 'page' | undefined;
      }
  );

function buildClasses(
  variant: Variant,
  fullWidth: boolean,
  className: string | undefined,
): string {
  return [styles.root, styles[variant], fullWidth ? styles.fullWidth : '', className ?? '']
    .filter(Boolean)
    .join(' ');
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = 'primary', fullWidth = false, className, children, href } = props;
    if (/^https?:\/\//.test(href)) {
      return (
        <a
          href={href}
          className={buildClasses(variant, fullWidth, className)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
          <span className="sr-only"> (abre en otra pestaña)</span>
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={buildClasses(variant, fullWidth, className)}
        aria-current={props['aria-current']}
      >
        {children}
      </Link>
    );
  }

  const {
    variant = 'primary',
    fullWidth = false,
    className,
    children,
    type = 'button',
    ...rest
  } = props;

  return (
    <button className={buildClasses(variant, fullWidth, className)} type={type} {...rest}>
      {children}
    </button>
  );
}
