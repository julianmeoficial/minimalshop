'use client';

import { useActionState, useOptimistic, useTransition } from 'react';

import { toggleModuleAction, type AdminActionState } from '@/lib/actions/admin';
import type { ClaveModulo } from '@/lib/api/types';

import styles from './ModuleToggle.module.css';
import { useActionToast } from './useActionToast';

const initial: AdminActionState = { ok: true };

export interface ModuleToggleProps {
  readonly clave: ClaveModulo;
  readonly nombre: string;
  readonly descripcion: string;
  readonly activo: boolean;
  readonly actualizadoEn: string | null;
}

/** One activable module as a switch; flips optimistically and rolls back if the API refuses. */
export function ModuleToggle({ clave, nombre, descripcion, activo, actualizadoEn }: ModuleToggleProps) {
  const [state, dispatch, pending] = useActionState(toggleModuleAction, initial);
  const [optimistic, setOptimistic] = useOptimistic(activo);
  const [, start] = useTransition();
  useActionToast(state);
  const id = `mod-${clave}`;

  return (
    <li className={styles.row}>
      <div className={styles.text}>
        <label htmlFor={id} className={styles.name}>
          {nombre}
        </label>
        <p className={styles.desc} id={`${id}-d`}>
          {descripcion}
        </p>
        {actualizadoEn ? (
          <p className={styles.meta}>
            Último cambio:{' '}
            {new Date(actualizadoEn).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        ) : null}
      </div>
      <span className={styles.state} aria-hidden="true">
        {optimistic ? 'Activo' : 'Apagado'}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.switch}
        checked={optimistic}
        disabled={pending}
        aria-describedby={`${id}-d`}
        onChange={(e) => {
          const next = e.target.checked;
          const fd = new FormData();
          fd.set('clave', clave);
          fd.set('activo', String(next));
          start(() => {
            setOptimistic(next);
            dispatch(fd);
          });
        }}
      />
    </li>
  );
}
