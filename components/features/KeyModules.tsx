'use client';

import { Check, Power } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';

import { KEY_MODULES, type ModuleKind } from '@/lib/content/funcionamiento';
import { duration, easeOutQuart } from '@/lib/motion';

import styles from './KeyModules.module.css';

type Filter = 'todos' | ModuleKind;

const FILTERS: readonly { readonly value: Filter; readonly label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'base', label: 'Incluidos' },
  { value: 'activable', label: 'Activables' },
];

/**
 * MinimalShop Key — the modules a store gets from minimalecommerceAPI. Motion only:
 * the filter pill slides (shared layoutId) and cards re-flow with `layout`.
 */
export function KeyModules() {
  const [filter, setFilter] = useState<Filter>('todos');
  const reduced = useReducedMotion();
  const groupId = useId();
  const visible = KEY_MODULES.filter((m) => filter === 'todos' || m.kind === filter);
  const transition = reduced
    ? { duration: duration.reduced }
    : { duration: duration.enter, ease: easeOutQuart };

  return (
    <div className={styles.root}>
      <div className={styles.filters} role="group" aria-label="Filtrar módulos">
        <LayoutGroup id={groupId}>
          {FILTERS.map((f) => {
            const active = filter === f.value;
            const count =
              f.value === 'todos'
                ? KEY_MODULES.length
                : KEY_MODULES.filter((m) => m.kind === f.value).length;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                className={`${styles.filter} ${active ? styles.filterActive : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {active ? (
                  <motion.span layoutId="key-filter-pill" className={styles.pill} transition={transition} />
                ) : null}
                <span className={styles.filterLabel}>
                  {f.label} <span className={styles.count}>{count}</span>
                </span>
              </button>
            );
          })}
        </LayoutGroup>
      </div>

      <motion.ul className={styles.grid} layout={!reduced} transition={transition}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((m) => (
            <motion.li
              key={m.id}
              layout={!reduced}
              className={`${styles.card} ${m.kind === 'activable' ? styles.optional : ''}`}
              initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
              transition={transition}
              whileHover={reduced ? {} : { scale: 1.02 }}
            >
              <span className={styles.kind}>
                {m.kind === 'base' ? (
                  <Check size={14} strokeWidth={1.5} aria-hidden />
                ) : (
                  <Power size={14} strokeWidth={1.5} aria-hidden />
                )}
                {m.kind === 'base' ? 'Incluido' : 'Activable'}
              </span>
              <h3 className={styles.name}>{m.name}</h3>
              <p className={styles.body}>{m.body}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
