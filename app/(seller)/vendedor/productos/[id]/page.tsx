import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FlashToast } from '@/components/features/FlashToast';
import { SellerProductForm } from '@/components/features/SellerProductForm';
import { StateMessage } from '@/components/features/StateMessage';
import { Button } from '@/components/ui';
import { listarCategorias } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import { listarMisProductos } from '@/lib/api/vendedor';

import styles from '../productos.module.css';

export const metadata: Metadata = { title: 'Editar producto' };

interface EditProductoProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ aviso?: string }>;
}

export default async function EditarProductoPage({ params, searchParams }: EditProductoProps) {
  const { id } = await params;
  const { aviso } = await searchParams;

  try {
    const [client, categorias] = await Promise.all([
      createServerApiClient(),
      listarCategorias(createApiClient()),
    ]);
    const pagina = await listarMisProductos({ pagina: 0, tamano: 50 }, client);
    const producto = pagina.contenido.find((p) => p.id === id);
    if (!producto) {
      notFound();
    }

    return (
      <div className={styles.page}>
        {aviso === 'foto' ? (
          <FlashToast
            tone="error"
            message="El producto se guardó, pero la foto no se pudo subir. Inténtalo de nuevo desde aquí."
          />
        ) : null}
        <header className={styles.formHeader}>
          <nav aria-label="Migas de pan" className={styles.crumbs}>
            <Link href="/vendedor/productos">Productos</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{producto.nombre}</span>
          </nav>
          <div className={styles.headerRow}>
            <h1>Editar producto</h1>
            {producto.activo ? (
              <Button href={`/catalogo/${producto.id}`} variant="tertiary">
                <ExternalLink size={16} strokeWidth={1.5} aria-hidden />
                Ver en la tienda
              </Button>
            ) : null}
          </div>
        </header>
        <SellerProductForm categorias={categorias} producto={producto} />
      </div>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.mapped.kind === 'not_found') {
      notFound();
    }
    return (
      <StateMessage
        level="h1"
        title="No se pudo cargar el producto"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/vendedor/productos" variant="secondary">Volver a productos</Button>}
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'No pudimos conectar con tu tienda.'}
        </p>
      </StateMessage>
    );
  }
}
