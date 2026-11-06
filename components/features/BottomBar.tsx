'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';

import { GlassSurface } from '@/components/ui';
import { fadeRise, reducedFade } from '@/lib/motion';

import styles from './BottomBar.module.css';

export interface BottomBarProps {
  /** Element id whose visibility hides the bar (the real buy / summary block). */
  readonly watchId: string;
  readonly label: string;
  readonly children: ReactNode;
}

/**
 * Mobile and tablet only: a liquid-glass bar floating at the bottom with the price and
 * the next action. It steps aside while the block it mirrors is on screen, so the same
 * action is never shown twice. Motion handles enter/exit (component scale).
 */
export function BottomBar({ watchId, label, children }: BottomBarProps) {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry ? !entry.isIntersecting : false),
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  return (
    <div className={styles.dock}>
      <AnimatePresence>
        {visible ? (
          <motion.div
            variants={reduced ? reducedFade : fadeRise}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <GlassSurface
              as="section"
              variant="liquid"
              strong
              className={styles.bar}
              aria-label={label}
            >
              {children}
            </GlassSurface>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
