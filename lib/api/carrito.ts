import type { ApiClient } from './client';
import { getApiClient } from './client';
import type { ResumenCarrito } from './types';

export function obtenerCarrito(
  client: ApiClient = getApiClient(),
): Promise<ResumenCarrito> {
  return client.request<ResumenCarrito>('/v1/carrito');
}

export function agregarItemCarrito(
  productoId: string,
  cantidad: number,
  client: ApiClient = getApiClient(),
): Promise<ResumenCarrito> {
  return client.request<ResumenCarrito>('/v1/carrito/items', {
    method: 'POST',
    body: { productoId, cantidad },
  });
}

export function actualizarItemCarrito(
  productoId: string,
  cantidad: number,
  client: ApiClient = getApiClient(),
): Promise<ResumenCarrito> {
  return client.request<ResumenCarrito>(`/v1/carrito/items/${productoId}`, {
    method: 'PUT',
    body: { cantidad },
  });
}

export function quitarItemCarrito(
  productoId: string,
  client: ApiClient = getApiClient(),
): Promise<ResumenCarrito> {
  return client.request<ResumenCarrito>(`/v1/carrito/items/${productoId}`, {
    method: 'DELETE',
  });
}

export function vaciarCarrito(
  client: ApiClient = getApiClient(),
): Promise<void> {
  return client.request<void>('/v1/carrito', { method: 'DELETE' });
}
