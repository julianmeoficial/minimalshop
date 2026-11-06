import type { MetadataRoute } from 'next';

import { listarCategorias, listarProductos } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { API_PAGE_SIZE_MAX, type ProductoListado } from '@/lib/api/types';
import { absoluteUrl } from '@/lib/site';

/** Regenerate at most once an hour. */
export const revalidate = 3600;

const MAX_PAGES = 20; // 1 000 products — plenty for the catalogue's size

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/catalogo'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/funcionamiento'), changeFrequency: 'monthly', priority: 0.5 },
    { url: absoluteUrl('/preguntas-frecuentes'), changeFrequency: 'monthly', priority: 0.4 },
    { url: absoluteUrl('/creditos'), changeFrequency: 'yearly', priority: 0.1 },
  ];

  try {
    const client = createApiClient();
    const categorias = await listarCategorias(client);
    for (const c of categorias) {
      entries.push({
        url: absoluteUrl(`/catalogo?categoriaId=${c.id}`),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    const productos: ProductoListado[] = [];
    for (let pagina = 0; pagina < MAX_PAGES; pagina += 1) {
      const page = await listarProductos({ pagina, tamano: API_PAGE_SIZE_MAX }, client);
      productos.push(...page.contenido);
      if (pagina + 1 >= page.totalPaginas) break;
    }
    for (const p of productos) {
      entries.push({
        url: absoluteUrl(`/catalogo/${p.id}`),
        lastModified: new Date(p.creadoEn),
        changeFrequency: 'weekly',
        priority: 0.7,
        ...(p.imagenUrl ? { images: [p.imagenUrl] } : {}),
      });
    }
  } catch {
    // API unreachable: publish the static routes only.
  }

  return entries;
}
