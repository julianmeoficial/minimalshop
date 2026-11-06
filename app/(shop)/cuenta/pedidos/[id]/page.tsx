import type { Metadata } from 'next';
import { PackageCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CancelOrderButton } from '@/components/features/CancelOrderButton';
import { OrderTimeline } from '@/components/features/OrderTimeline';
import { PaymentStatusPoll } from '@/components/features/PaymentStatus';
import { StateMessage } from '@/components/features/StateMessage';
import { Button, PriceTag, StatusChip } from '@/components/ui';
import { confirmReceivedAction } from '@/lib/actions/pedidos';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { obtenerPedido } from '@/lib/api/pedidos';
import { createServerApiClient } from '@/lib/api/server';
import {
  orderStatusLabel,
  orderStatusVariant,
} from '@/lib/orders/status';

import styles from './detalle-pedido.module.css';

export const metadata: Metadata = { title: 'Pedido' };

interface PedidoDetalleProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ pago?: string }>;
}

export default async function PedidoDetallePage({
  params,
  searchParams,
}: PedidoDetalleProps) {
  const { id } = await params;
  const query = await searchParams;

  try {
    const client = await createServerApiClient();
    const pedido = await obtenerPedido(id, client);
    const canCancel = pedido.accionesDisponibles.includes('CANCELADO');
    const canReceive = pedido.estado === 'ENVIADO';

    const ref = pedido.id.slice(0, 8).toUpperCase();
    const fecha = new Date(pedido.creadoEn).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return (
      <article className={styles.page}>
        <nav aria-label="Migas de pan" className={styles.crumbs}>
          <Link href="/cuenta/pedidos">Mis pedidos</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Pedido {ref}</span>
        </nav>

        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Pedido del {fecha}</p>
            <h1 className={styles.title}>
              N.º <span className={styles.ref}>{ref}</span>
            </h1>
          </div>
          <StatusChip
            variant={orderStatusVariant(pedido.estado)}
            label={orderStatusLabel(pedido.estado)}
          />
        </header>

        <OrderTimeline estado={pedido.estado} />

        {query.pago === '1' || pedido.estado === 'PENDIENTE_PAGO' ? (
          <section className={styles.payment} aria-labelledby="pago-titulo">
            <h2 id="pago-titulo" className={styles.blockTitle}>
              Estado del pago
            </h2>
            <PaymentStatusPoll pedidoId={pedido.id} />
            {pedido.pagarAntesDe ? (
              <p className={styles.meta}>
                Completa el pago antes del{' '}
                {new Date(pedido.pagarAntesDe).toLocaleString('es-CO')}.
              </p>
            ) : null}
          </section>
        ) : null}

        <div className={styles.columns}>
          <section className={styles.block} aria-labelledby="items-titulo">
            <h2 id="items-titulo" className={styles.blockTitle}>
              Piezas
            </h2>
            <ul className={styles.items}>
              {pedido.items.map((item) => (
                <li key={`${item.productoId}-${item.vendedorId}`}>
                  <span>
                    <Link href={`/catalogo/${item.productoId}`}>{item.nombre}</Link>{' '}
                    <span className={styles.qty}>× {item.cantidad}</span>
                  </span>
                  <PriceTag amount={item.subtotal} />
                </li>
              ))}
            </ul>
            <dl className={styles.totals}>
              <div>
                <dt>Subtotal</dt>
                <dd>
                  <PriceTag amount={pedido.subtotal} />
                </dd>
              </div>
              {pedido.descuento > 0 ? (
                <div>
                  <dt>Descuento{pedido.cupon ? ` (${pedido.cupon})` : ''}</dt>
                  <dd>
                    −<PriceTag amount={pedido.descuento} />
                  </dd>
                </div>
              ) : null}
              <div className={styles.grand}>
                <dt>Total</dt>
                <dd>
                  <PriceTag amount={pedido.total} variant="large" />
                </dd>
              </div>
            </dl>
          </section>

          <section className={styles.block} aria-labelledby="envio-titulo">
            <h2 id="envio-titulo" className={styles.blockTitle}>
              Envío
            </h2>
            <p className={styles.address}>{pedido.direccionEnvio}</p>
            {pedido.motivoCancelacion ? (
              <p className={styles.meta}>Motivo: {pedido.motivoCancelacion}</p>
            ) : null}
            <div className={styles.actions}>
              {canReceive ? (
                <form action={confirmReceivedAction}>
                  <input type="hidden" name="pedidoId" value={pedido.id} />
                  <Button type="submit">
                    <PackageCheck size={16} strokeWidth={1.5} aria-hidden />
                    Confirmar recibido
                  </Button>
                </form>
              ) : null}
              {canCancel ? <CancelOrderButton pedidoId={pedido.id} /> : null}
            </div>
          </section>
        </div>
      </article>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.mapped.kind === 'not_found') {
      notFound();
    }
    return (
      <StateMessage
        level="h1"
        title="No se pudo cargar el pedido"
        correlationId={
          error instanceof ApiClientError ? error.correlationId : undefined
        }
        action={<Button href="/cuenta/pedidos" variant="secondary">Volver a mis pedidos</Button>}
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
