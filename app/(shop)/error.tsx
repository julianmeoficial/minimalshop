'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

import { StateMessage } from '@/components/features/StateMessage';
import { Button } from '@/components/ui';

interface ShopErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/** Unexpected render error: plain language, a retry, and the digest for support. */
export default function ShopError({ error, reset }: ShopErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StateMessage
      level="h1"
      tone="error"
      title="Algo no salió como esperábamos"
      correlationId={error.digest}
      action={
        <>
          <Button onClick={reset}>
            <RotateCcw size={16} strokeWidth={1.5} aria-hidden />
            Reintentar
          </Button>
          <Button href="/" variant="tertiary">
            Volver al inicio
          </Button>
        </>
      }
    >
      <p>La página no se pudo mostrar. Tu carrito y tus pedidos están a salvo.</p>
    </StateMessage>
  );
}
