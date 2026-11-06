'use client';

import { ShoppingBag } from 'lucide-react';
import { useActionState, useState } from 'react';

import { Button, QuantityStepper } from '@/components/ui';
import {
  addToCartAction,
  type CartActionState,
} from '@/lib/actions/carrito';

import styles from './AddToCartForm.module.css';

const initial: CartActionState = { ok: true };

export interface AddToCartFormProps {
  readonly productoId: string;
  readonly max: number;
  readonly disabled?: boolean;
}

export function AddToCartForm({
  productoId,
  max,
  disabled = false,
}: AddToCartFormProps) {
  const [cantidad, setCantidad] = useState(1);
  const [state, action, pending] = useActionState(addToCartAction, initial);
  const blocked = disabled || max < 1;

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="productoId" value={productoId} />
      <input type="hidden" name="cantidad" value={cantidad} />
      <div className={styles.row}>
        <QuantityStepper
          id="cantidad-producto"
          value={cantidad}
          min={1}
          max={Math.max(1, max)}
          onChange={setCantidad}
          disabled={blocked || pending}
        />
        <Button type="submit" disabled={blocked || pending} className={styles.submit}>
          <ShoppingBag size={18} strokeWidth={1.5} aria-hidden />
          {blocked ? 'Sin existencias' : pending ? 'Agregando…' : 'Agregar al carrito'}
        </Button>
      </div>
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
