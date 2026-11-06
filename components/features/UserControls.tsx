'use client';

import { UserCheck, UserX } from 'lucide-react';
import { useActionState, useState, useTransition } from 'react';

import { Button, Dialog } from '@/components/ui';
import { updateUserAction, type AdminActionState } from '@/lib/actions/admin';
import type { UserRole } from '@/lib/api/types';

import styles from './UserControls.module.css';
import { useActionToast } from './useActionToast';

const initial: AdminActionState = { ok: true };

const ROLES: readonly { readonly value: UserRole; readonly label: string }[] = [
  { value: 'COMPRADOR', label: 'Comprador' },
  { value: 'VENDEDOR', label: 'Vendedor' },
  { value: 'SUPERADMIN', label: 'Administrador' },
];

export interface UserControlsProps {
  readonly id: string;
  readonly nombre: string;
  readonly rol: UserRole;
  readonly activo: boolean;
  /** The signed-in admin: their own row is read-only. */
  readonly self: boolean;
}

/** Role and access for one account. Deactivating asks for confirmation first. */
export function UserControls({ id, nombre, rol, activo, self }: UserControlsProps) {
  const [state, dispatch, pending] = useActionState(updateUserAction, initial);
  const [, start] = useTransition();
  const [nextRol, setNextRol] = useState<UserRole>(rol);
  const [confirmOpen, setConfirmOpen] = useState(false);
  useActionToast(state);

  const send = (input: { rol?: UserRole; activo?: boolean }) => {
    const fd = new FormData();
    fd.set('id', id);
    if (input.rol) fd.set('rol', input.rol);
    if (input.activo !== undefined) fd.set('activo', String(input.activo));
    start(() => dispatch(fd));
  };

  if (self) {
    return <p className={styles.self}>Tu cuenta · no editable aquí</p>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.role}>
        <label className="sr-only" htmlFor={`rol-${id}`}>
          Rol de {nombre}
        </label>
        <select
          id={`rol-${id}`}
          className={styles.select}
          value={nextRol}
          disabled={pending}
          onChange={(e) => setNextRol(e.target.value as UserRole)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {nextRol !== rol ? (
          <Button variant="secondary" disabled={pending} onClick={() => send({ rol: nextRol })}>
            Guardar rol
          </Button>
        ) : null}
      </div>
      {activo ? (
        <Button variant="tertiary" disabled={pending} onClick={() => setConfirmOpen(true)}>
          <UserX size={16} strokeWidth={1.5} aria-hidden />
          Desactivar
        </Button>
      ) : (
        <Button variant="secondary" disabled={pending} onClick={() => send({ activo: true })}>
          <UserCheck size={16} strokeWidth={1.5} aria-hidden />
          Reactivar
        </Button>
      )}
      <Dialog
        open={confirmOpen}
        title={`¿Desactivar la cuenta de ${nombre}?`}
        onClose={() => setConfirmOpen(false)}
        actions={
          <>
            <Button variant="tertiary" onClick={() => setConfirmOpen(false)}>
              Mantener activa
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmOpen(false);
                send({ activo: false });
              }}
            >
              Sí, desactivar
            </Button>
          </>
        }
      >
        <p>
          No podrá iniciar sesión hasta que la reactives. Sus pedidos y productos se conservan.
        </p>
      </Dialog>
    </div>
  );
}
