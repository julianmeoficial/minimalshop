'use client';

import { XCircle } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Button, Dialog } from '@/components/ui';
import { cancelOrderAction } from '@/lib/actions/pedidos';

export interface CancelOrderButtonProps {
  readonly pedidoId: string;
}

/** Destructive action behind a liquid-glass confirm dialog (DESIGN.md §8). */
export function CancelOrderButton({ pedidoId }: CancelOrderButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const confirm = () => {
    const fd = new FormData();
    fd.set('pedidoId', pedidoId);
    start(async () => {
      await cancelOrderAction(fd);
      setOpen(false);
    });
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <XCircle size={16} strokeWidth={1.5} aria-hidden />
        Cancelar pedido
      </Button>
      <Dialog
        open={open}
        title="¿Cancelar este pedido?"
        onClose={() => {
          if (!pending) setOpen(false);
        }}
        actions={
          <>
            <Button variant="tertiary" onClick={() => setOpen(false)} disabled={pending}>
              Mantener pedido
            </Button>
            <Button variant="danger" onClick={confirm} disabled={pending}>
              {pending ? 'Cancelando…' : 'Sí, cancelar'}
            </Button>
          </>
        }
      >
        <p>
          Liberamos las existencias reservadas y el pedido queda cancelado. Esta
          acción no se puede deshacer.
        </p>
      </Dialog>
    </>
  );
}
