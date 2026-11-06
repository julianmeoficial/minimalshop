import type { Metadata } from 'next';
import Link from 'next/link';

import { SellerProductForm } from '@/components/features/SellerProductForm';
import { StateMessage } from '@/components/features/StateMessage';
import { Button } from '@/components/ui';
import { listarCategorias } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';

import styles from '../productos.module.css';

export const metadata: Metadata = { title: 'Nuevo producto' };
export const dynamic = 'force-dynamic';

export default async function NuevoProductoPage() {
  try {
    const categorias = await listarCategorias(createApiClient());
    return (
      <div className={styles.page}>
        <header className={styles.formHeader}>
          <nav aria-label="Migas de pan" className={styles.crumbs}>
            <Link href="/vendedor/productos">Productos</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Nuevo</span>
          </nav>
          <h1>Nuevo producto</h1>
          <p className={styles.lede}>
            Cuatro pasos: foto, información, precio y visibilidad. A la derecha ves cómo
            quedará en el catálogo.
          </p>
        </header>
        <SellerProductForm categorias={categorias} />
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        level="h1"
        title="No se pudieron cargar las categorías"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/vendedor/productos/nuevo">Reintentar</Button>}
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
