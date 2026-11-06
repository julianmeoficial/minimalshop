import type { ClaveModulo } from '@/lib/api/types';

/** Human copy for the API's activable modules (keys from `/v1/admin/modulos`). */
export const MODULE_COPY: Record<ClaveModulo, { readonly nombre: string; readonly descripcion: string }> = {
  cupones: {
    nombre: 'Cupones',
    descripcion: 'Descuentos por código en el checkout. Si lo apagas, los pedidos con cupón se rechazan.',
  },
  resenas: {
    nombre: 'Reseñas',
    descripcion: 'Opiniones de compradores con pedidos entregados, visibles en cada producto.',
  },
  favoritos: {
    nombre: 'Favoritos',
    descripcion: 'Listas de deseos para compradores con sesión.',
  },
  contenido: {
    nombre: 'Contenido',
    descripcion: 'Publicaciones y eventos de la tienda.',
  },
  notificaciones: {
    nombre: 'Notificaciones',
    descripcion: 'Avisos por correo y en la cuenta sobre pedidos y pagos.',
  },
};
