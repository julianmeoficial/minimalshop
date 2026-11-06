import type { ApiClient } from './client';
import { getApiClient } from './client';
import type { CrearDireccionInput, Direccion } from './types';

export function listarDirecciones(
  client: ApiClient = getApiClient(),
): Promise<Direccion[]> {
  return client.request<Direccion[]>('/v1/usuarios/yo/direcciones');
}

export function crearDireccion(
  input: CrearDireccionInput,
  client: ApiClient = getApiClient(),
): Promise<Direccion> {
  return client.request<Direccion>('/v1/usuarios/yo/direcciones', {
    method: 'POST',
    body: input,
  });
}

export function eliminarDireccion(
  id: string,
  client: ApiClient = getApiClient(),
): Promise<void> {
  return client.request<void>(`/v1/usuarios/yo/direcciones/${id}`, {
    method: 'DELETE',
  });
}
