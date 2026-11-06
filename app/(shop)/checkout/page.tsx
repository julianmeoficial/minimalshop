import type { Metadata } from 'next';

import { CheckoutForm } from '@/components/features/CheckoutForm';
import { EmptyState } from '@/components/features/EmptyState';
import { StateMessage } from '@/components/features/StateMessage';
import { Button } from '@/components/ui';
import { obtenerCarrito } from '@/lib/api/carrito';
import { obtenerVisuales } from '@/lib/api/catalogo';
import { listarDirecciones } from '@/lib/api/direcciones';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import { photos } from '@/lib/content/photos';

import styles from './checkout.module.css';

export const metadata: Metadata = { title: 'Checkout' };

export default async function CheckoutPage() {
  try {
    const client = await createServerApiClient();
    const [carrito, direcciones] = await Promise.all([
      obtenerCarrito(client),
      listarDirecciones(client),
    ]);

    const visualMap = await obtenerVisuales(
      carrito.items.map((i) => i.productoId),
      client,
    );
    const visuales = Object.fromEntries(visualMap);

    if (carrito.items.length === 0) {
      return (
        <EmptyState
          eyebrow="Checkout"
          title="No hay nada que pagar"
          photo={photos.taza}
          action={<Button href="/catalogo">Explorar el catálogo</Button>}
        >
          <p>Agrega al menos una pieza al carrito para continuar.</p>
        </EmptyState>
      );
    }

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Checkout</p>
          <h1 className={styles.title}>
            Casi tuyo. <em>Confirma el envío.</em>
          </h1>
        </header>
        <CheckoutForm carrito={carrito} direcciones={direcciones} visuales={visuales} />
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        level="h1"
        title="No se pudo abrir el checkout"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/carrito" variant="secondary">Volver al carrito</Button>}
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'No pudimos preparar el pago. Tu carrito sigue intacto.'}
        </p>
      </StateMessage>
    );
  }
}
