import { Eye, EyeOff, Plus } from 'lucide-react';
import Link from 'next/link';

import { FlashToast } from '@/components/features/FlashToast';
import { StateMessage } from '@/components/features/StateMessage';
import {
  Button,
  DataTable,
  PriceTag,
  ProductImage,
  ProductPlaceholder,
} from '@/components/ui';
import { togglePublishAction } from '@/lib/actions/vendedor';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import type { ProductoListado } from '@/lib/api/types';
import { listarMisProductos } from '@/lib/api/vendedor';

import styles from './productos.module.css';

interface VendedorProductosProps {
  readonly searchParams: Promise<{ guardado?: string }>;
}

export default async function VendedorProductosPage({ searchParams }: VendedorProductosProps) {
  const { guardado } = await searchParams;
  try {
    const client = await createServerApiClient();
    const pagina = await listarMisProductos({ pagina: 0, tamano: 50 }, client);

    return (
      <div className={styles.page}>
        {guardado === 'creado' ? <FlashToast message="Producto creado." /> : null}
        {guardado === 'editado' ? <FlashToast message="Cambios guardados." /> : null}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Catálogo propio</p>
            <h1>Productos ({pagina.totalElementos})</h1>
          </div>
          <Button href="/vendedor/productos/nuevo">
            <Plus size={16} strokeWidth={1.5} aria-hidden />
            Nuevo producto
          </Button>
        </header>

        <DataTable<ProductoListado>
          caption="Mis productos"
          rows={pagina.contenido}
          rowKey={(row) => row.id}
          empty={
            <StateMessage
              title="Sin productos todavía"
              action={<Button href="/vendedor/productos/nuevo">Publicar el primero</Button>}
            >
              <p>Tu primera pieza aparecerá en el catálogo en cuanto la publiques.</p>
            </StateMessage>
          }
          columns={[
            {
              key: 'nombre',
              header: 'Nombre',
              render: (row) => (
                <Link href={`/vendedor/productos/${row.id}`} className={styles.product}>
                  <span className={styles.thumb}>
                    {row.imagenUrl ? (
                      <ProductImage
                        src={row.imagenUrl}
                        alt=""
                        sizes="48px"
                        fallback={
                          <ProductPlaceholder
                            nombre={row.nombre}
                            categoria={row.categoria.nombre}
                            size="thumb"
                          />
                        }
                      />
                    ) : (
                      <ProductPlaceholder
                        nombre={row.nombre}
                        categoria={row.categoria.nombre}
                        size="thumb"
                      />
                    )}
                  </span>
                  <span className={styles.productText}>
                    <span className={styles.productName}>{row.nombre}</span>
                    <span className={styles.productMeta}>{row.categoria.nombre}</span>
                  </span>
                </Link>
              ),
            },
            {
              key: 'precio',
              header: 'Precio',
              render: (row) => <PriceTag amount={row.precio} />,
            },
            {
              key: 'stock',
              header: 'Stock',
              render: (row) => <span className={styles.mono}>{row.existencias}</span>,
            },
            {
              key: 'estado',
              header: 'Publicado',
              render: (row) => (
                <span className={styles.published}>
                  {row.activo ? (
                    <Eye size={16} strokeWidth={1.5} aria-hidden />
                  ) : (
                    <EyeOff size={16} strokeWidth={1.5} aria-hidden />
                  )}
                  {row.activo ? 'Publicado' : 'Oculto'}
                </span>
              ),
            },
            {
              key: 'acciones',
              header: 'Acciones',
              render: (row) => (
                <form action={togglePublishAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input
                    type="hidden"
                    name="publish"
                    value={row.activo ? '0' : '1'}
                  />
                  <Button type="submit" variant="tertiary">
                    {row.activo ? 'Despublicar' : 'Publicar'}
                  </Button>
                </form>
              ),
            },
          ]}
        />
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        title="No se pudieron cargar productos"
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
