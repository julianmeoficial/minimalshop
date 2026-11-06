'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

import { duration, fadeRise, reducedFade } from '@/lib/motion';

import { GlassSurface } from './GlassSurface';

import styles from './Dialog.module.css';

export interface DialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly children: ReactNode;
  readonly actions?: ReactNode | undefined;
  readonly onClose: () => void;
}

export function Dialog({
  open,
  title,
  children,
  actions,
  onClose,
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const variants = reduced ? reducedFade : fadeRise;

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.backdrop}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduced ? duration.reduced : duration.componentMin,
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <GlassSurface
              as="div"
              variant="liquid"
              strong
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              ref={panelRef}
            >
              <h2 className={styles.title} id={titleId}>
                {title}
              </h2>
              <div>{children}</div>
              {actions ? <div className={styles.actions}>{actions}</div> : null}
            </GlassSurface>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
