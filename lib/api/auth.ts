import type { ApiClient } from './client';
import { getApiClient } from './client';
import type { SesionAuth, UserRole } from './types';

export interface CredencialesIngreso {
  readonly email: string;
  readonly password: string;
}

export interface CredencialesRegistro extends CredencialesIngreso {
  readonly nombre: string;
  readonly rol: Extract<UserRole, 'COMPRADOR' | 'VENDEDOR'>;
  readonly telefono?: string;
}

export function ingreso(
  credenciales: CredencialesIngreso,
  client: ApiClient = getApiClient(),
): Promise<SesionAuth> {
  return client.request<SesionAuth>('/v1/auth/ingreso', {
    method: 'POST',
    body: credenciales,
    auth: false,
  });
}

export function registro(
  datos: CredencialesRegistro,
  client: ApiClient = getApiClient(),
): Promise<SesionAuth> {
  return client.request<SesionAuth>('/v1/auth/registro', {
    method: 'POST',
    body: datos,
    auth: false,
  });
}

export function refrescar(
  refreshToken: string,
  client: ApiClient = getApiClient(),
): Promise<SesionAuth> {
  return client.request<SesionAuth>('/v1/auth/refrescar', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
    skipRefresh: true,
  });
}

export function salir(
  refreshToken: string,
  client: ApiClient = getApiClient(),
): Promise<void> {
  return client.request<void>('/v1/auth/salir', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
    skipRefresh: true,
  });
}
