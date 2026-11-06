import { Check, Circle, CircleDot, XCircle } from 'lucide-react';

import type { OrderStatus } from '@/lib/api/types';

import styles from './OrderTimeline.module.css';

const FLOW: readonly { readonly estado: OrderStatus; readonly label: string }[] = [
  { estado: 'PENDIENTE_PAGO', label: 'Pago' },
  { estado: 'PAGADO', label: 'Pagado' },
  { estado: 'EN_PREPARACION', label: 'En preparación' },
  { estado: 'ENVIADO', label: 'Enviado' },
  { estado: 'ENTREGADO', label: 'Entregado' },
];

export interface OrderTimelineProps {
  readonly estado: OrderStatus;
}

/** Order progress as text + icon per step, never colour alone. */
export function OrderTimeline({ estado }: OrderTimelineProps) {
  if (estado === 'CANCELADO' || estado === 'REEMBOLSADO') {
    return (
      <p className={styles.stopped}>
        <XCircle size={18} strokeWidth={1.5} aria-hidden />
        {estado === 'CANCELADO'
          ? 'Este pedido fue cancelado.'
          : 'Este pedido fue reembolsado.'}
      </p>
    );
  }

  const normalized = estado === 'CREADO' ? 'PENDIENTE_PAGO' : estado;
  const current = FLOW.findIndex((s) => s.estado === normalized);

  return (
    <ol className={styles.list} aria-label="Progreso del pedido">
      {FLOW.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        const Icon = state === 'done' ? Check : state === 'current' ? CircleDot : Circle;
        return (
          <li
            key={step.estado}
            className={`${styles.step} ${styles[state]}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <Icon size={18} strokeWidth={1.5} aria-hidden />
            <span>{step.label}</span>
            <span className="sr-only">
              {state === 'done' ? ' (completado)' : state === 'current' ? ' (actual)' : ' (pendiente)'}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
