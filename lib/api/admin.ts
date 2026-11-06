import type { ApiClient } from './client';
import { getApiClient } from './client';
import {
  API_PAGE_SIZE_DEFAULT,
  API_PAGE_SIZE_MAX,
  type AdministrarUsuarioInput,
  type Categoria,
  type CategoriaInput,
  type ClaveModulo,
  type EstadoModulo,
  type Pagina,
  type PageQuery,
  type ResumenPlataforma,
  type UserRole,
  type UsuarioAdmin,
} from './types';

/** SUPERADMIN endpoints (`/v1/admin/*` and the mock payment simulator). */

export function resumenPlataforma(client: ApiClient = getApiClient()): Promise<ResumenPlataforma> {
  return client.request<ResumenPlataforma>('/v1/admin/reportes/plataforma');
}

export interface UsuariosQuery extends PageQuery {
  readonly rol?: UserRole | undefined;
  readonly q?: string | undefined;
}

export function listarUsuarios(
  query: UsuariosQuery = {},
  client: ApiClient = getApiClient(),
): Promise<Pagina<UsuarioAdmin>> {
  const params = new URLSearchParams({
    pagina: String(query.pagina ?? 0),
    tamano: String(Math.min(Math.max(1, query.tamano ?? API_PAGE_SIZE_DEFAULT), API_PAGE_SIZE_MAX)),
  });
  if (query.rol) params.set('rol', query.rol);
  if (query.q) params.set('q', query.q);
  return client.request<Pagina<UsuarioAdmin>>(`/v1/admin/usuarios?${params.toString()}`);
}

export function administrarUsuario(
  id: string,
  input: AdministrarUsuarioInput,
  client: ApiClient = getApiClient(),
): Promise<UsuarioAdmin> {
  return client.request<UsuarioAdmin>(`/v1/admin/usuarios/${id}`, { method: 'PATCH', body: input });
}

export function crearCategoria(
  input: CategoriaInput,
  client: ApiClient = getApiClient(),
): Promise<Categoria> {
  return client.request<Categoria>('/v1/admin/categorias', { method: 'POST', body: input });
}

export function actualizarCategoria(
  id: string,
  input: Partial<CategoriaInput>,
  client: ApiClient = getApiClient(),
): Promise<Categoria> {
  return client.request<Categoria>(`/v1/admin/categorias/${id}`, { method: 'PATCH', body: input });
}

export function eliminarCategoria(id: string, client: ApiClient = getApiClient()): Promise<void> {
  return client.request<void>(`/v1/admin/categorias/${id}`, { method: 'DELETE' });
}

export function listarModulos(client: ApiClient = getApiClient()): Promise<EstadoModulo[]> {
  return client.request<EstadoModulo[]>('/v1/admin/modulos');
}

export function cambiarModulo(
  clave: ClaveModulo,
  activo: boolean,
  client: ApiClient = getApiClient(),
): Promise<EstadoModulo> {
  return client.request<EstadoModulo>(`/v1/admin/modulos/${clave}`, {
    method: 'PATCH',
    body: { activo },
  });
}

/** Mock provider only: closes a pending payment as approved or rejected. */
export function simularPago(
  pedidoId: string,
  resultado: 'aprobar' | 'rechazar',
  client: ApiClient = getApiClient(),
): Promise<unknown> {
  return client.request<unknown>(`/v1/pagos/simulador/pedidos/${pedidoId}/${resultado}`, {
    method: 'POST',
  });
}
