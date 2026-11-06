'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { fadeRise, reducedFade } from '@/lib/motion';

import { GlassSurface } from './GlassSurface';

import styles from './Toast.module.css';

export type ToastTone = 'success' | 'error';

export interface ToastItem {
  readonly id: string;
  readonly tone: ToastTone;
  readonly message: string;
  readonly correlationId?: string | undefined;
}

interface ToastContextValue {
  push(toast: Omit<ToastItem, 'id'>): void;
  dismiss(id: string): void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

export interface ToastProviderProps {
  readonly children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const reduced = useReducedMotion();
  const variants = reduced ? reducedFade : fadeRise;

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = crypto.randomUUID();
      setItems((prev) => [...prev, { ...toast, id }]);
      if (toast.tone === 'success') {
        window.setTimeout(() => dismiss(id), 4000);
      }
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} aria-live="polite" aria-relevant="additions">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <GlassSurface
                variant="crystal"
                className={`${styles.toast} ${styles[item.tone]}`}
                role={item.tone === 'error' ? 'alert' : 'status'}
              >
                <p className={styles.message}>{item.message}</p>
                {item.correlationId ? (
                  <p className={styles.meta}>Soporte: {item.correlationId}</p>
                ) : null}
                <button
                  type="button"
                  className={styles.dismiss}
                  onClick={() => dismiss(item.id)}
                >
                  Cerrar
                </button>
              </GlassSurface>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
