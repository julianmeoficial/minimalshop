/** Shared DTOs aligned with the Minimal Ecommerce API contracts. */

export type UserRole = 'COMPRADOR' | 'VENDEDOR' | 'SUPERADMIN';

export type OrderStatus =
  | 'CREADO'
  | 'PENDIENTE_PAGO'
  | 'PAGADO'
  | 'EN_PREPARACION'
  | 'ENVIADO'
  | 'ENTREGADO'
  | 'CANCELADO'
  | 'REEMBOLSADO';

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELED';

export type SellerOrderStatus = Extract<
  OrderStatus,
  'EN_PREPARACION' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO'
>;

/** API page size must never exceed 50. Catalogue UI uses 12. */
export const API_PAGE_SIZE_MAX = 50;
export const API_PAGE_SIZE_DEFAULT = 20;
export const CATALOGUE_PAGE_SIZE = 12;

export interface PageQuery {
  readonly pagina?: number | undefined;
  readonly tamano?: number | undefined;
}

export interface Pagina<T> {
  readonly contenido: readonly T[];
  readonly pagina: number;
  readonly tamano: number;
  readonly totalElementos: number;
  readonly totalPaginas: number;
}

export interface Referencia {
  readonly id: string;
  readonly nombre: string;
}

export interface UsuarioResumen {
  readonly id: string;
  readonly email: string;
  readonly nombre: string;
  readonly telefono?: string | null;
  readonly rol: UserRole;
  readonly activo?: boolean;
}

export interface SesionAuth {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly tokenType?: string;
  readonly usuario: UsuarioResumen;
}

export interface ProductoListado {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion?: string | null;
  readonly precio: number;
  readonly existencias: number;
  readonly disponible: boolean;
  readonly imagenUrl?: string | null;
  readonly categoria: Referencia;
  readonly vendedor: Referencia;
  readonly preventa: boolean;
  readonly activo: boolean;
  readonly creadoEn: string;
}

export interface Categoria {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion?: string | null;
}

export interface CatalogoOrden {
  readonly orden?:
    | 'recientes'
    | 'precio_asc'
    | 'precio_desc'
    | 'nombre_asc'
    | 'nombre_desc'
    | undefined;
}

export interface CatalogoQuery extends PageQuery, CatalogoOrden {
  readonly q?: string | undefined;
  readonly categoriaId?: string | undefined;
}

export interface ItemCarrito {
  readonly productoId: string;
  readonly nombre: string;
  readonly precioUnitario: number;
  readonly cantidad: number;
  readonly subtotal: number;
  readonly existencias: number;
  readonly disponible: boolean;
}

export interface ResumenCarrito {
  readonly items: readonly ItemCarrito[];
  readonly cantidadItems: number;
  readonly unidades: number;
  readonly subtotal: number;
  readonly comprable: boolean;
}

export interface Direccion {
  readonly id: string;
  readonly etiqueta: string;
  readonly direccion: string;
  readonly ciudad?: string | null;
  readonly codigoPostal?: string | null;
  readonly telefono?: string | null;
  readonly principal: boolean;
}

export interface CrearDireccionInput {
  readonly etiqueta: string;
  readonly direccion: string;
  readonly ciudad?: string;
  readonly codigoPostal?: string;
  readonly telefono?: string;
  readonly principal?: boolean;
}

export interface ItemPedido {
  readonly productoId: string;
  readonly vendedorId: string;
  readonly nombre: string;
  readonly cantidad: number;
  readonly precioUnitario: number;
  readonly subtotal: number;
}

export interface Pedido {
  readonly id: string;
  readonly estado: OrderStatus;
  readonly subtotal: number;
  readonly descuento: number;
  readonly total: number;
  readonly direccionEnvio: string;
  readonly cupon: string | null;
  readonly referenciaPago: string | null;
  readonly motivoCancelacion: string | null;
  readonly pagarAntesDe: string | null;
  readonly accionesDisponibles: readonly OrderStatus[];
  readonly creadoEn: string;
  readonly actualizadoEn: string;
  readonly items: readonly ItemPedido[];
}

export interface CrearPedidoInput {
  readonly direccionId?: string;
  readonly direccionEnvio?: string;
  readonly cupon?: string;
}

export interface IntentoPago {
  readonly pedidoId?: string;
  readonly proveedor?: string;
  readonly externalId?: string;
  readonly clientSecret?: string;
  readonly estado?: PaymentStatus | string;
}

export interface EstadoPago {
  readonly pedidoId?: string;
  readonly estado: PaymentStatus | string;
  readonly proveedor?: string;
  readonly externalId?: string | null;
}

export interface CrearProductoInput {
  readonly nombre: string;
  readonly descripcion?: string | undefined;
  readonly precio: number;
  readonly existencias: number;
  readonly categoriaId: string;
  readonly preventa?: boolean | undefined;
}

export interface ActualizarProductoInput {
  readonly nombre?: string | undefined;
  readonly descripcion?: string | undefined;
  readonly precio?: number | undefined;
  readonly categoriaId?: string | undefined;
  readonly preventa?: boolean | undefined;
}

export interface TokenStore {
  getAccessToken(): string | null | Promise<string | null>;
  getRefreshToken(): string | null | Promise<string | null>;
  setSession(session: SesionAuth): void | Promise<void>;
  clearSession(): void | Promise<void>;
}

/** GET /v1/admin/usuarios item. */
export interface UsuarioAdmin {
  readonly id: string;
  readonly nombre: string;
  readonly email: string;
  readonly telefono?: string | null;
  readonly rol: UserRole;
  readonly activo: boolean;
}

export interface AdministrarUsuarioInput {
  readonly rol?: UserRole;
  readonly activo?: boolean;
}

/** GET /v1/admin/reportes/plataforma */
export interface ResumenPlataforma {
  readonly productosActivos: number;
  readonly pedidosPagados: number;
  readonly usuariosPorRol: Readonly<Record<UserRole, number>>;
}

export type ClaveModulo = 'cupones' | 'resenas' | 'favoritos' | 'contenido' | 'notificaciones';

/** GET /v1/admin/modulos item. */
export interface EstadoModulo {
  readonly clave: ClaveModulo;
  readonly activo: boolean;
  readonly actualizadoEn: string | null;
}

export interface CategoriaInput {
  readonly nombre: string;
  readonly descripcion?: string;
}

/** GET /v1/cupones/:codigo — public, limited view used to preview a discount. */
export interface CuponPublico {
  readonly codigo: string;
  readonly tipo: 'PORCENTAJE' | 'MONTO_FIJO';
  readonly valor: number;
}
