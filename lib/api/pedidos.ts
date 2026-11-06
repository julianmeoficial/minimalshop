import type { ApiClient } from './client';
import { getApiClient } from './client';
import {
  API_PAGE_SIZE_DEFAULT,
  API_PAGE_SIZE_MAX,
  type CrearPedidoInput,
  type Pagina,
  type PageQuery,
  type Pedido,
} from './types';

function clamp(tamano: number | undefined): number {
  const value = tamano ?? API_PAGE_SIZE_DEFAULT;
  return Math.min(Math.max(1, value), API_PAGE_SIZE_MAX);
}

export function crearPedido(
  input: CrearPedidoInput,
  idempotencyKey: string,
  client: ApiClient = getApiClient(),
): Promise<Pedido> {
  return client.request<Pedido>('/v1/pedidos', {
    method: 'POST',
    body: input,
    idempotencyKey,
  });
}

export function listarPedidos(
  query: PageQuery = {},
  client: ApiClient = getApiClient(),
): Promise<Pagina<Pedido>> {
  const params = new URLSearchParams({
    pagina: String(query.pagina ?? 0),
    tamano: String(clamp(query.tamano)),
  });
  return client.request<Pagina<Pedido>>(`/v1/pedidos?${params}`);
}

export function obtenerPedido(
  id: string,
  client: ApiClient = getApiClient(),
): Promise<Pedido> {
  return client.request<Pedido>(`/v1/pedidos/${id}`);
}

export function cancelarPedido(
  id: string,
  client: ApiClient = getApiClient(),
): Promise<Pedido> {
  return client.request<Pedido>(`/v1/pedidos/${id}/cancelar`, {
    method: 'POST',
  });
}

export function confirmarPedidoRecibido(
  id: string,
  client: ApiClient = getApiClient(),
): Promise<Pedido> {
  return client.request<Pedido>(`/v1/pedidos/${id}/recibido`, {
    method: 'POST',
  });
}
