import type { ApiClient } from './client';
import { getApiClient } from './client';
import type { EstadoPago, IntentoPago } from './types';

export function iniciarIntentoPago(
  pedidoId: string,
  client: ApiClient = getApiClient(),
): Promise<IntentoPago> {
  return client.request<IntentoPago>(`/v1/pagos/pedidos/${pedidoId}/intento`, {
    method: 'POST',
  });
}

export function consultarPago(
  pedidoId: string,
  client: ApiClient = getApiClient(),
): Promise<EstadoPago> {
  return client.request<EstadoPago>(`/v1/pagos/pedidos/${pedidoId}`);
}
