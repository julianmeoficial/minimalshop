'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

import { createMediaWipe, createScrollReveal } from '@/lib/motion';

export interface ScrollRevealProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly as?: ElementType;
  readonly id?: string | undefined;
  readonly 'aria-labelledby'?: string | undefined;
}

/**
 * GSAP + ScrollTrigger section wrapper.
 * - `[data-reveal]` children rise 24px and fade in with a 120ms stagger (Ledup).
 * - `[data-reveal-media]` children wipe in with clip-path, once.
 * Never put Motion (motion.dev) animations on these same elements.
 */
export function ScrollReveal({
  children,
  className,
  as: Tag = 'div',
  id,
  'aria-labelledby': labelledBy,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = root.querySelectorAll('[data-reveal]');
    const media = root.querySelectorAll('[data-reveal-media]');
    const reveal =
      targets.length > 0
        ? createScrollReveal(targets, { trigger: root, reducedMotion: reduced })
        : null;
    const wipe =
      media.length > 0 ? createMediaWipe(media, { reducedMotion: reduced }) : null;
    return () => {
      reveal?.kill();
      wipe?.kill();
    };
  }, []);

  return (
    <Tag ref={ref} className={className} id={id} aria-labelledby={labelledBy}>
      {children}
    </Tag>
  );
}
