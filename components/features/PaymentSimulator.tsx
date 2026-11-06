'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { useActionState, useState } from 'react';

import { Button, Field } from '@/components/ui';
import { simulatePaymentAction, type AdminActionState } from '@/lib/actions/admin';

import styles from './PaymentSimulator.module.css';
import { useActionToast } from './useActionToast';

const initial: AdminActionState = { ok: true };

/** Closes a pending mock payment. The order id comes from the buyer's order page or URL. */
export function PaymentSimulator() {
  const [state, action, pending] = useActionState(simulatePaymentAction, initial);
  const [pedidoId, setPedidoId] = useState('');
  useActionToast(state);

  return (
    <form action={action} className={styles.form}>
      <Field
        id="pedidoId"
        name="pedidoId"
        label="Identificador del pedido"
        value={pedidoId}
        onChange={(e) => setPedidoId(e.target.value.trim())}
        placeholder="p. ej. 3f2b…-…"
        autoComplete="off"
        spellCheck={false}
        hint="Cópialo de la URL del pedido (/cuenta/pedidos/…) o del correo de confirmación."
        required
      />
      <div className={styles.actions}>
        <Button type="submit" name="resultado" value="aprobar" disabled={pending || !pedidoId}>
          <CheckCircle2 size={16} strokeWidth={1.5} aria-hidden />
          Aprobar pago
        </Button>
        <Button
          type="submit"
          name="resultado"
          value="rechazar"
          variant="secondary"
          disabled={pending || !pedidoId}
        >
          <XCircle size={16} strokeWidth={1.5} aria-hidden />
          Rechazar pago
        </Button>
      </div>
      <p className={styles.status} aria-live="polite">
        {pending ? 'Enviando al simulador…' : state.message ?? ''}
      </p>
    </form>
  );
}
