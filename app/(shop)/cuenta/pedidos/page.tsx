import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { EmptyState } from '@/components/features/EmptyState';
import { StateMessage } from '@/components/features/StateMessage';
import { Button, PriceTag, StatusChip } from '@/components/ui';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { listarPedidos } from '@/lib/api/pedidos';
import { createServerApiClient } from '@/lib/api/server';
import { photos } from '@/lib/content/photos';
import { orderStatusLabel, orderStatusVariant } from '@/lib/orders/status';

import styles from './pedidos.module.css';

export const metadata: Metadata = { title: 'Mis pedidos' };

export default async function PedidosPage() {
  try {
    const client = await createServerApiClient();
    const pagina = await listarPedidos({ pagina: 0, tamano: 20 }, client);

    if (pagina.contenido.length === 0) {
      return (
        <EmptyState
          eyebrow="Pedidos"
          title="Aún no tienes pedidos"
          photo={photos.envio}
          action={<Button href="/catalogo">Explorar el catálogo</Button>}
        >
          <p>Cuando compres, cada pedido aparecerá aquí con su estado.</p>
        </EmptyState>
      );
    }

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Cuenta</p>
          <h1 className={styles.title}>
            Mis pedidos <em>({pagina.totalElementos})</em>
          </h1>
        </header>
        <ul className={styles.list}>
          {pagina.contenido.map((pedido) => {
            const unidades = pedido.items.reduce((n, i) => n + i.cantidad, 0);
            return (
              <li key={pedido.id}>
                <Link href={`/cuenta/pedidos/${pedido.id}`} className={styles.item}>
                  <span className={styles.ref}>
                    N.º {pedido.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className={styles.meta}>
                    {new Date(pedido.creadoEn).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    · {unidades} {unidades === 1 ? 'pieza' : 'piezas'}
                  </span>
                  <StatusChip
                    variant={orderStatusVariant(pedido.estado)}
                    label={orderStatusLabel(pedido.estado)}
                  />
                  <span className={styles.total}>
                    <PriceTag amount={pedido.total} />
                    <ChevronRight size={18} strokeWidth={1.5} aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        level="h1"
        title="No se pudieron cargar los pedidos"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/cuenta/pedidos">Reintentar</Button>}
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'No pudimos conectar con tus pedidos.'}
        </p>
      </StateMessage>
    );
  }
}
