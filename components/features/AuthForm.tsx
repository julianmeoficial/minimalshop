'use client';

import { useActionState } from 'react';

import { Button, Field } from '@/components/ui';
import {
  loginAction,
  registerAction,
  type AuthActionState,
} from '@/lib/auth/session';

import styles from './AuthForm.module.css';

const initial: AuthActionState = { ok: true };

export interface AuthFormProps {
  readonly mode: 'ingreso' | 'registro';
  /** Internal path to return to after signing in (validated server-side). */
  readonly next?: string | undefined;
  /** Registration only: which role is preselected (e.g. from «Vender»). */
  readonly defaultRol?: 'COMPRADOR' | 'VENDEDOR';
}

export function AuthForm({ mode, next, defaultRol = 'COMPRADOR' }: AuthFormProps) {
  const action = mode === 'ingreso' ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form className={styles.form} action={formAction}>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {mode === 'registro' ? (
        <>
          <Field
            id="nombre"
            name="nombre"
            label="Nombre"
            autoComplete="name"
            required
            minLength={2}
          />
          <Field
            id="rol"
            name="rol"
            label="Quiero"
            as="select"
            required
            defaultValue={defaultRol}
            hint="Puedes vender o comprar; cada cuenta tiene un rol."
          >
            <option value="COMPRADOR">Comprar piezas</option>
            <option value="VENDEDOR">Vender mis piezas</option>
          </Field>
        </>
      ) : null}
      <Field
        id="email"
        name="email"
        label="Correo"
        type="email"
        autoComplete="email"
        required
      />
      <Field
        id="password"
        name="password"
        label="Contraseña"
        type="password"
        autoComplete={mode === 'ingreso' ? 'current-password' : 'new-password'}
        required
        minLength={mode === 'registro' ? 10 : 1}
        hint={mode === 'registro' ? 'Mínimo 10 caracteres.' : undefined}
      />
      <Button type="submit" fullWidth disabled={pending}>
        {pending
          ? 'Un momento…'
          : mode === 'ingreso'
            ? 'Ingresar'
            : 'Crear cuenta'}
      </Button>
      <div aria-live="polite">
        {state.message ? (
          <p className={styles.error} role="alert">
            {state.message}
            {state.correlationId ? (
              <span className={styles.meta}> · Soporte: {state.correlationId}</span>
            ) : null}
          </p>
        ) : null}
      </div>
    </form>
  );
}
