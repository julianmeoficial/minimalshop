import type { ApiClient } from './client';
import { getApiClient } from './client';
import {
  API_PAGE_SIZE_DEFAULT,
  API_PAGE_SIZE_MAX,
  type ActualizarProductoInput,
  type CrearProductoInput,
  type OrderStatus,
  type Pagina,
  type PageQuery,
  type Pedido,
  type ProductoListado,
  type SellerOrderStatus,
} from './types';

function clamp(tamano: number | undefined): number {
  const value = tamano ?? API_PAGE_SIZE_DEFAULT;
  return Math.min(Math.max(1, value), API_PAGE_SIZE_MAX);
}

function pageParams(query: PageQuery): string {
  return new URLSearchParams({
    pagina: String(query.pagina ?? 0),
    tamano: String(clamp(query.tamano)),
  }).toString();
}

export function listarMisProductos(
  query: PageQuery = {},
  client: ApiClient = getApiClient(),
): Promise<Pagina<ProductoListado>> {
  return client.request<Pagina<ProductoListado>>(
    `/v1/vendedor/productos?${pageParams(query)}`,
  );
}

export function crearProducto(
  input: CrearProductoInput,
  client: ApiClient = getApiClient(),
): Promise<ProductoListado> {
  return client.request<ProductoListado>('/v1/vendedor/productos', {
    method: 'POST',
    body: input,
  });
}

export function actualizarProducto(
  id: string,
  input: ActualizarProductoInput,
  client: ApiClient = getApiClient(),
): Promise<ProductoListado> {
  return client.request<ProductoListado>(`/v1/vendedor/productos/${id}`, {
    method: 'PATCH',
    body: input,
  });
}

export function publicarProducto(
  id: string,
  client: ApiClient = getApiClient(),
): Promise<ProductoListado> {
  return client.request<ProductoListado>(
    `/v1/vendedor/productos/${id}/publicar`,
    { method: 'POST' },
  );
}

export function despublicarProducto(
  id: string,
  client: ApiClient = getApiClient(),
): Promise<ProductoListado> {
  return client.request<ProductoListado>(
    `/v1/vendedor/productos/${id}/despublicar`,
    { method: 'POST' },
  );
}

export function subirImagenProducto(
  id: string,
  archivo: Blob,
  filename = 'imagen.jpg',
  client: ApiClient = getApiClient(),
): Promise<ProductoListado> {
  const body = new FormData();
  body.append('archivo', archivo, filename);
  return client.request<ProductoListado>(`/v1/vendedor/productos/${id}/imagen`, {
    method: 'PUT',
    body,
    multipart: true,
  });
}

export function ajustarExistencias(
  id: string,
  existencias: number,
  client: ApiClient = getApiClient(),
): Promise<{ productoId: string; existencias: number }> {
  return client.request(`/v1/vendedor/productos/${id}/existencias`, {
    method: 'PUT',
    body: { existencias },
  });
}

export function listarPedidosVendedor(
  query: PageQuery & { estado?: OrderStatus } = {},
  client: ApiClient = getApiClient(),
): Promise<Pagina<Pedido>> {
  const params = new URLSearchParams(pageParams(query));
  if (query.estado) {
    params.set('estado', query.estado);
  }
  return client.request<Pagina<Pedido>>(
    `/v1/vendedor/pedidos?${params.toString()}`,
  );
}

export function cambiarEstadoPedidoVendedor(
  id: string,
  estado: SellerOrderStatus,
  client: ApiClient = getApiClient(),
): Promise<Pedido> {
  return client.request<Pedido>(`/v1/vendedor/pedidos/${id}/estado`, {
    method: 'PATCH',
    body: { estado },
  });
}
