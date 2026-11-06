'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

import { fadeRise, reducedFade } from '@/lib/motion';

export interface EnterFadeProps {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}

/**
 * Motion (motion.dev) component enter: 8px rise, 340ms, ease-out-quart (KORVAE).
 * Reduced motion: 120ms fade. Never wrap elements that GSAP also animates.
 */
export function EnterFade({ children, className }: EnterFadeProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduced ? reducedFade : fadeRise}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
