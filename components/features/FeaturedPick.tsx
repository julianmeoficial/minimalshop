import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { EnterFade } from '@/components/features/EnterFade';
import { GlassSurface, PriceTag, ProductImage, ProductPlaceholder } from '@/components/ui';
import { listarProductos } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { isImageReachable } from '@/lib/images';

import styles from './FeaturedPick.module.css';

/**
 * Liquid-glass card floating on the hero photograph: the newest available piece with a
 * photo. It is a control (a link), never body copy. Renders nothing when the API is down.
 */
export async function FeaturedPick() {
  try {
    const pagina = await listarProductos(
      { pagina: 0, tamano: 8, orden: 'recientes' },
      createApiClient(),
    );
    const candidates = pagina.contenido
      .filter((p) => p.imagenUrl && p.disponible)
      .slice(0, 3);
    const checks = await Promise.all(
      candidates.map((p) => (p.imagenUrl ? isImageReachable(p.imagenUrl) : false)),
    );
    const producto = candidates[checks.indexOf(true)];
    if (!producto?.imagenUrl) {
      return null;
    }
    return (
      <EnterFade className={styles.wrap}>
        <Link href={`/catalogo/${producto.id}`} className={styles.link}>
          <GlassSurface as="span" variant="liquid" strong className={styles.card}>
          <span className={styles.thumb}>
            <ProductImage
              src={producto.imagenUrl}
              alt=""
              sizes="64px"
              fallback={
                <ProductPlaceholder
                  nombre={producto.nombre}
                  categoria={producto.categoria.nombre}
                  size="thumb"
                />
              }
            />
          </span>
          <span className={styles.text}>
            <span className={styles.eyebrow}>Recién llegado</span>
            <span className={styles.name}>{producto.nombre}</span>
            <PriceTag amount={producto.precio} />
          </span>
          <ArrowRight className={styles.arrow} size={18} strokeWidth={1.5} aria-hidden />
          </GlassSurface>
        </Link>
      </EnterFade>
    );
  } catch {
    return null;
  }
}
