import type { ApiClient } from './client';
import { getApiClient } from './client';

/** Liveness — outside /v1. */
export function pingVida(
  client: ApiClient = getApiClient(),
): Promise<unknown> {
  return client.request('/salud/vida', { auth: false });
}

/** Readiness — outside /v1. */
export function pingListo(
  client: ApiClient = getApiClient(),
): Promise<unknown> {
  return client.request('/salud/listo', { auth: false });
}
