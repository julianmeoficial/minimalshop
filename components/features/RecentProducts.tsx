import { StateMessage } from '@/components/features/StateMessage';
import { Button, ProductCard } from '@/components/ui';
import { listarProductos } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';

import styles from './RecentProducts.module.css';

export interface RecentProductsProps {
  readonly limit?: number;
  readonly categoriaId?: string | undefined;
  /** Product to leave out (e.g. the one on the detail page). */
  readonly excludeId?: string | undefined;
  readonly emptyTitle?: string;
  readonly emptyHint?: string;
  readonly emptyAction?: { readonly href: string; readonly label: string };
}

/** Server-rendered product grid; wrap in `<Suspense fallback={<ProductGridSkeleton />}>`. */
export async function RecentProducts({
  limit = 4,
  categoriaId,
  excludeId,
  emptyTitle = 'Todavía no hay piezas',
  emptyHint = 'Aún no hay piezas publicadas. Vuelve pronto o abre tu propia tienda.',
  emptyAction = { href: '/cuenta/registro', label: 'Abrir una tienda' },
}: RecentProductsProps) {
  try {
    const pagina = await listarProductos(
      {
        pagina: 0,
        tamano: excludeId ? limit + 1 : limit,
        orden: 'recientes',
        categoriaId,
      },
      createApiClient(),
    );
    const productos = pagina.contenido
      .filter((p) => p.id !== excludeId)
      .slice(0, limit);

    if (productos.length === 0) {
      return (
        <StateMessage
          title={emptyTitle}
          action={
            <Button href={emptyAction.href} variant="secondary">
              {emptyAction.label}
            </Button>
          }
        >
          <p>{emptyHint}</p>
        </StateMessage>
      );
    }

    return (
      <ul className={styles.grid}>
        {productos.map((p, i) => (
          <li key={p.id}>
            <ProductCard
              priority={i < 2}
              lowStock={p.disponible && p.existencias <= 5}
              href={`/catalogo/${p.id}`}
              nombre={p.nombre}
              precio={p.precio}
              imagenUrl={p.imagenUrl}
              categoria={p.categoria.nombre}
              outOfStock={!p.disponible}
              preventa={p.preventa}
            />
          </li>
        ))}
      </ul>
    );
  } catch (error) {
    return (
      <StateMessage
        title="La selección no está disponible"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/catalogo" variant="secondary">Reintentar en el catálogo</Button>}
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'No pudimos conectar con el catálogo.'}
        </p>
      </StateMessage>
    );
  }
}
