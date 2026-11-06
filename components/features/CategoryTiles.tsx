import { ArrowUpRight } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

import { GlassSurface, ProductImage } from '@/components/ui';
import { listarCategorias, listarProductos } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { API_PAGE_SIZE_MAX } from '@/lib/api/types';
import { photos } from '@/lib/content/photos';

import styles from './CategoryTiles.module.css';

interface Tile {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string | null;
  readonly count: number;
  readonly cover: string | StaticImageData;
  readonly alternates: readonly string[];
  readonly fallback: StaticImageData;
}

/** Editorial fallback when a category has no product photo yet. */
function fallbackCover(nombre: string): StaticImageData {
  const n = nombre.toLowerCase();
  if (n.includes('ropa') || n.includes('general')) return photos.camiseta.src;
  if (n.includes('hogar')) return photos.cuencos.src;
  return photos.lino.src;
}

/**
 * Categories from the API, each with the photo of its most recent product as the cover
 * and a crystal label floating on it. Renders nothing if the catalogue is unreachable:
 * the section is an invitation, not core content.
 */
export async function CategoryTiles({ max = 6 }: { readonly max?: number }) {
  let tiles: Tile[] = [];
  let exactCounts = false;
  try {
    const client = createApiClient();
    const [categorias, productos] = await Promise.all([
      listarCategorias(client),
      listarProductos({ pagina: 0, tamano: API_PAGE_SIZE_MAX, orden: 'recientes' }, client),
    ]);
    exactCounts = productos.totalElementos <= productos.contenido.length;
    tiles = categorias
      .map((c) => {
        const own = productos.contenido.filter((p) => p.categoria.id === c.id);
        const images = own.flatMap((p) => (p.imagenUrl ? [p.imagenUrl] : []));
        const [first, ...rest] = images;
        return {
          id: c.id,
          nombre: c.nombre,
          descripcion: c.descripcion ?? null,
          count: own.length,
          cover: first ?? fallbackCover(c.nombre),
          alternates: rest.slice(0, 3),
          fallback: fallbackCover(c.nombre),
        };
      })
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, max);
  } catch {
    return null;
  }

  if (tiles.length === 0) {
    return null;
  }

  return (
    <ul className={styles.grid}>
      {tiles.map((tile, i) => (
        <li key={tile.id}>
          <Link className={styles.tile} href={`/catalogo?categoriaId=${tile.id}`}>
            <div className={styles.media}>
              <ProductImage
                src={tile.cover}
                alt=""
                sizes="(max-width: 767px) 50vw, 33vw"
                className={styles.image}
                priority={i < 2}
                alternates={tile.alternates}
                fallback={
                  <Image
                    src={tile.fallback}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 50vw, 33vw"
                    className={styles.image}
                  />
                }
              />
              <GlassSurface as="span" variant="crystal" strong className={styles.label}>
                <span className={styles.name}>{tile.nombre}</span>
                {exactCounts ? (
                  <span className={styles.count}>
                    {tile.count} {tile.count === 1 ? 'pieza' : 'piezas'}
                  </span>
                ) : null}
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
              </GlassSurface>
            </div>
            {tile.descripcion ? <p className={styles.body}>{tile.descripcion}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
