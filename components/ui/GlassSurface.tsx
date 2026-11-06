import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import styles from './GlassSurface.module.css';

export interface GlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  readonly variant?: 'liquid' | 'crystal';
  readonly strong?: boolean;
  readonly as?: ElementType;
  readonly children: ReactNode;
}

export const GlassSurface = forwardRef<HTMLElement, GlassSurfaceProps>(
  function GlassSurface(
    {
      variant = 'liquid',
      strong = false,
      as: Tag = 'div',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const classes = [
      styles.root,
      variant === 'liquid' ? styles.liquid : styles.crystal,
      strong ? styles.strong : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Tag className={classes} ref={ref} {...rest}>
        {children}
      </Tag>
    );
  },
);
