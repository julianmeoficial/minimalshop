import { CategoryManager } from '@/components/features/CategoryManager';
import { StateMessage } from '@/components/features/StateMessage';
import { Button } from '@/components/ui';
import { listarCategorias, listarProductos } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { API_PAGE_SIZE_MAX } from '@/lib/api/types';

import styles from '../admin.module.css';

export const metadata = { title: 'Categorías' };
export const dynamic = 'force-dynamic';

export default async function AdminCategoriasPage() {
  try {
    const client = createApiClient();
    const [categorias, productos] = await Promise.all([
      listarCategorias(client),
      listarProductos({ pagina: 0, tamano: API_PAGE_SIZE_MAX }, client).catch(() => null),
    ]);
    // Counts are exact only when the whole public catalogue fits in one page.
    const counts: Record<string, number> = {};
    if (productos && productos.totalElementos <= productos.contenido.length) {
      for (const c of categorias) counts[c.id] = 0;
      for (const p of productos.contenido) counts[p.categoria.id] = (counts[p.categoria.id] ?? 0) + 1;
    }

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Administración</p>
            <h1>Categorías ({categorias.length})</h1>
          </div>
        </header>
        <p className={styles.lede}>
          Los estantes del catálogo. Los vendedores eligen entre estas categorías al publicar y los
          compradores filtran por ellas.
        </p>
        <CategoryManager categorias={categorias} counts={counts} />
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        level="h1"
        title="No se pudieron cargar las categorías"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/admin/categorias">Reintentar</Button>}
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'No pudimos conectar con la API.'}
        </p>
      </StateMessage>
    );
  }
}
