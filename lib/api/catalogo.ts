import type { ApiClient } from './client';
import { getApiClient } from './client';
import {
  API_PAGE_SIZE_DEFAULT,
  API_PAGE_SIZE_MAX,
  CATALOGUE_PAGE_SIZE,
  type CatalogoQuery,
  type Categoria,
  type CuponPublico,
  type Pagina,
  type ProductoListado,
} from './types';

function clampPageSize(tamano: number | undefined, fallback: number): number {
  const value = tamano ?? fallback;
  return Math.min(Math.max(1, value), API_PAGE_SIZE_MAX);
}

function toSearchParams(query: CatalogoQuery, fallbackSize: number): string {
  const params = new URLSearchParams();
  params.set('pagina', String(query.pagina ?? 0));
  params.set('tamano', String(clampPageSize(query.tamano, fallbackSize)));
  if (query.q) {
    params.set('q', query.q);
  }
  if (query.categoriaId) {
    params.set('categoriaId', query.categoriaId);
  }
  if (query.orden) {
    params.set('orden', query.orden);
  }
  return params.toString();
}

export function listarProductos(
  query: CatalogoQuery = {},
  client: ApiClient = getApiClient(),
): Promise<Pagina<ProductoListado>> {
  const qs = toSearchParams(query, CATALOGUE_PAGE_SIZE);
  return client.request<Pagina<ProductoListado>>(
    `/v1/catalogo/productos?${qs}`,
    { auth: false },
  );
}

export function obtenerProducto(
  id: string,
  client: ApiClient = getApiClient(),
): Promise<ProductoListado> {
  return client.request<ProductoListado>(`/v1/catalogo/productos/${id}`, {
    auth: false,
  });
}

export function listarCategorias(
  client: ApiClient = getApiClient(),
): Promise<Categoria[]> {
  return client.request<Categoria[]>('/v1/catalogo/categorias', {
    auth: false,
  });
}

export { API_PAGE_SIZE_DEFAULT };

export interface ProductoVisual {
  readonly imagenUrl: string | null;
  readonly categoria: string | null;
}

/**
 * Photo and category for a set of product ids (cart and checkout DTOs carry neither).
 * One request per id, in parallel; a failed lookup just means no thumbnail.
 */
export async function obtenerVisuales(
  ids: readonly string[],
  client: ApiClient = getApiClient(),
): Promise<ReadonlyMap<string, ProductoVisual>> {
  const unique = [...new Set(ids)];
  const results = await Promise.allSettled(unique.map((id) => obtenerProducto(id, client)));
  const map = new Map<string, ProductoVisual>();
  results.forEach((r, i) => {
    const id = unique[i];
    if (id && r.status === 'fulfilled') {
      map.set(id, {
        imagenUrl: r.value.imagenUrl ?? null,
        categoria: r.value.categoria.nombre,
      });
    }
  });
  return map;
}

/** Public coupon lookup (module `cupones`). Throws ApiClientError when invalid. */
export function consultarCupon(
  codigo: string,
  client: ApiClient = getApiClient(),
): Promise<CuponPublico> {
  return client.request<CuponPublico>(`/v1/cupones/${encodeURIComponent(codigo.trim())}`, {
    auth: false,
  });
}
