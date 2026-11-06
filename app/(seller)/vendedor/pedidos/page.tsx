import { StateMessage } from '@/components/features/StateMessage';
import { Button, DataTable, StatusChip } from '@/components/ui';
import { changeSellerOrderStatusAction } from '@/lib/actions/vendedor';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import type { Pedido, SellerOrderStatus } from '@/lib/api/types';
import { listarPedidosVendedor } from '@/lib/api/vendedor';
import { formatPrice } from '@/lib/format';
import {
  orderStatusLabel,
  orderStatusVariant,
} from '@/lib/orders/status';

import styles from './pedidos.module.css';

const SELLER_TRANSITIONS: SellerOrderStatus[] = [
  'EN_PREPARACION',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO',
];

export default async function VendedorPedidosPage() {
  try {
    const client = await createServerApiClient();
    const pagina = await listarPedidosVendedor(
      { pagina: 0, tamano: 50 },
      client,
    );

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Ventas</p>
          <h1>Pedidos ({pagina.totalElementos})</h1>
        </header>
        <DataTable<Pedido>
          caption="Pedidos del vendedor"
          rows={pagina.contenido}
          rowKey={(row) => row.id}
          empty={
            <StateMessage title="Sin pedidos por ahora">
              <p>Cuando un comprador pague una de tus piezas, el pedido aparecerá aquí.</p>
            </StateMessage>
          }
          columns={[
            {
              key: 'id',
              header: 'Pedido',
              render: (row) => (
                <span className={styles.mono}>{row.id.slice(0, 8)}…</span>
              ),
            },
            {
              key: 'total',
              header: 'Total',
              render: (row) => formatPrice(row.total),
            },
            {
              key: 'estado',
              header: 'Estado',
              render: (row) => (
                <StatusChip
                  variant={orderStatusVariant(row.estado)}
                  label={orderStatusLabel(row.estado)}
                />
              ),
            },
            {
              key: 'acciones',
              header: 'Cambiar',
              render: (row) => {
                const options = SELLER_TRANSITIONS.filter((estado) =>
                  row.accionesDisponibles.includes(estado),
                );
                if (options.length === 0) {
                  return '—';
                }
                return (
                  <form
                    action={changeSellerOrderStatusAction}
                    className={styles.inline}
                  >
                    <input type="hidden" name="pedidoId" value={row.id} />
                    <select
                      name="estado"
                      className={styles.select}
                      defaultValue={options[0]}
                      aria-label="Nuevo estado"
                    >
                      {options.map((estado) => (
                        <option key={estado} value={estado}>
                          {orderStatusLabel(estado)}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="secondary">
                      Aplicar
                    </Button>
                  </form>
                );
              },
            },
          ]}
        />
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        title="No se pudieron cargar pedidos"
        correlationId={
          error instanceof ApiClientError ? error.correlationId : undefined
        }
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'Error inesperado.'}
        </p>
      </StateMessage>
    );
  }
}
