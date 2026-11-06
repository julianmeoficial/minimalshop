'use client';

import { useEffect, useState } from 'react';

import { StatusChip } from '@/components/ui';

import styles from './PaymentStatus.module.css';

export interface PaymentStatusProps {
  readonly pedidoId: string;
  readonly initialLabel?: string;
}

type PollState = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' | 'UNKNOWN';

export function PaymentStatusPoll({
  pedidoId,
  initialLabel = 'Consultando pago…',
}: PaymentStatusProps) {
  const [estado, setEstado] = useState<PollState>('PENDING');
  const [label, setLabel] = useState(initialLabel);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function tick() {
      try {
        const res = await fetch(`/api/pagos/${pedidoId}`, {
          method: 'GET',
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error('poll failed');
        }
        const data = (await res.json()) as { estado?: string };
        const next = (data.estado ?? 'UNKNOWN').toUpperCase() as PollState;
        if (cancelled) return;
        setEstado(
          ['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED'].includes(next)
            ? next
            : 'UNKNOWN',
        );
        setLabel(
          next === 'SUCCEEDED'
            ? 'Pago confirmado'
            : next === 'FAILED' || next === 'CANCELED'
              ? 'Pago no completado'
              : 'Pago pendiente',
        );
        setTries((t) => t + 1);
        if (next === 'PENDING' || next === 'UNKNOWN') {
          timer = window.setTimeout(() => {
            void tick();
          }, 2000);
        }
      } catch {
        if (cancelled) return;
        setTries((t) => {
          const n = t + 1;
          if (n < 30) {
            timer = window.setTimeout(() => {
              void tick();
            }, 2000);
          } else {
            setLabel('Tiempo de espera del pago agotado');
          }
          return n;
        });
      }
    }

    void tick();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [pedidoId]);

  const variant =
    estado === 'SUCCEEDED'
      ? 'paid'
      : estado === 'FAILED' || estado === 'CANCELED'
        ? 'failed'
        : 'pending';

  return (
    <div className={styles.wrap}>
      <StatusChip variant={variant} label={label} />
      {estado === 'PENDING' ? (
        <p className={styles.note}>
          Intento {tries}/30. En demo mock un superadmin puede aprobar el pago
          en el simulador de la API.
        </p>
      ) : null}
    </div>
  );
}
