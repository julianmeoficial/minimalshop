import type { Metadata } from 'next';
import { ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

import { BottomBar } from '@/components/features/BottomBar';
import { CartLine } from '@/components/features/CartLine';
import { EmptyState } from '@/components/features/EmptyState';
import { FlashToast } from '@/components/features/FlashToast';
import { StateMessage } from '@/components/features/StateMessage';
import { Button, PriceTag } from '@/components/ui';
import { clearCartAction } from '@/lib/actions/carrito';
import { obtenerCarrito } from '@/lib/api/carrito';
import { obtenerVisuales } from '@/lib/api/catalogo';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import { photos } from '@/lib/content/photos';

import styles from './carrito.module.css';

export const metadata: Metadata = { title: 'Carrito' };

interface CarritoPageProps {
  readonly searchParams: Promise<{ agregado?: string }>;
}

export default async function CarritoPage({ searchParams }: CarritoPageProps) {
  const { agregado } = await searchParams;
  try {
    const client = await createServerApiClient();
    const carrito = await obtenerCarrito(client);
    const visuales = await obtenerVisuales(
      carrito.items.map((i) => i.productoId),
      client,
    );

    if (carrito.items.length === 0) {
      return (
        <EmptyState
          eyebrow="Carrito"
          title="Tu carrito está vacío"
          photo={photos.taza}
          action={<Button href="/catalogo">Explorar el catálogo</Button>}
        >
          <p>Cuando agregues una pieza aparecerá aquí, con su cantidad y subtotal.</p>
        </EmptyState>
      );
    }

    return (
      <div className={styles.page}>
        {agregado === '1' ? <FlashToast message="Agregado al carrito." /> : null}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Carrito</p>
            <h1 className={styles.title}>
              {carrito.unidades} {carrito.unidades === 1 ? 'pieza' : 'piezas'}{' '}
              <em>en tu carrito</em>
            </h1>
          </div>
          <form action={clearCartAction}>
            <Button type="submit" variant="tertiary">
              Vaciar carrito
            </Button>
          </form>
        </header>

        <ul className={styles.list} aria-label="Productos en el carrito">
          {carrito.items.map((item) => (
            <CartLine
              key={item.productoId}
              item={item}
              imagenUrl={visuales.get(item.productoId)?.imagenUrl}
              categoria={visuales.get(item.productoId)?.categoria}
            />
          ))}
        </ul>

        <aside className={styles.summary} aria-labelledby="resumen-carrito" id="resumen">
          <h2 id="resumen-carrito" className={styles.summaryTitle}>
            Resumen
          </h2>
          <dl className={styles.rows}>
            <div>
              <dt>Productos</dt>
              <dd>{carrito.cantidadItems}</dd>
            </div>
            <div>
              <dt>Unidades</dt>
              <dd>{carrito.unidades}</dd>
            </div>
            <div>
              <dt>Envío y cupones</dt>
              <dd>En el checkout</dd>
            </div>
          </dl>
          <div className={styles.total}>
            <span>Subtotal</span>
            <PriceTag amount={carrito.subtotal} variant="large" />
          </div>
          {!carrito.comprable ? (
            <p className={styles.warn} role="status">
              Hay productos sin existencias suficientes. Ajusta las cantidades para
              continuar.
            </p>
          ) : null}
          {carrito.comprable ? (
            <Button href="/checkout" fullWidth>
              Ir al checkout
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
            </Button>
          ) : (
            <Button fullWidth disabled>
              Ir al checkout
            </Button>
          )}
          <p className={styles.note}>
            <Lock size={14} strokeWidth={1.5} aria-hidden />
            Pago con pasarela externa.
          </p>
          <Link className={styles.continue} href="/catalogo">
            Seguir comprando
          </Link>
        </aside>

        <BottomBar watchId="resumen" label="Total del carrito">
          <span className={styles.barText}>
            <span className={styles.barLabel}>Subtotal</span>
            <PriceTag amount={carrito.subtotal} />
          </span>
          {carrito.comprable ? (
            <Button href="/checkout">
              Pagar
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Button>
          ) : (
            <Button href="#resumen" variant="secondary">
              Revisar
            </Button>
          )}
        </BottomBar>
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        level="h1"
        title="No se pudo cargar el carrito"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/carrito">Reintentar</Button>}
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'No pudimos conectar con tu carrito. Tus productos siguen guardados.'}
        </p>
      </StateMessage>
    );
  }
}
