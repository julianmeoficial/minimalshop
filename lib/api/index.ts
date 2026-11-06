export {
  ApiClient,
  createApiClient,
  getApiClient,
  type ApiClientOptions,
  type RequestOptions,
} from './client';
export {
  ApiClientError,
  mapApiError,
  userFacingMessage,
  type ApiErrorBody,
  type ApiErrorCode,
  type MappedApiError,
} from './errors';
export {
  ingreso,
  refrescar,
  registro,
  salir,
  type CredencialesIngreso,
  type CredencialesRegistro,
} from './auth';
export {
  listarCategorias,
  listarProductos,
  obtenerProducto,
} from './catalogo';
export {
  agregarItemCarrito,
  actualizarItemCarrito,
  obtenerCarrito,
  quitarItemCarrito,
  vaciarCarrito,
} from './carrito';
export {
  cancelarPedido,
  confirmarPedidoRecibido,
  crearPedido,
  listarPedidos,
  obtenerPedido,
} from './pedidos';
export { consultarPago, iniciarIntentoPago } from './pagos';
export {
  crearDireccion,
  eliminarDireccion,
  listarDirecciones,
} from './direcciones';
export {
  actualizarProducto,
  ajustarExistencias,
  cambiarEstadoPedidoVendedor,
  crearProducto,
  despublicarProducto,
  listarMisProductos,
  listarPedidosVendedor,
  publicarProducto,
  subirImagenProducto,
} from './vendedor';
export { createServerApiClient } from './server';
export { pingListo, pingVida } from './salud';
export {
  API_PAGE_SIZE_DEFAULT,
  API_PAGE_SIZE_MAX,
  CATALOGUE_PAGE_SIZE,
  type ActualizarProductoInput,
  type CatalogoQuery,
  type Categoria,
  type CrearDireccionInput,
  type CrearPedidoInput,
  type CrearProductoInput,
  type Direccion,
  type EstadoPago,
  type IntentoPago,
  type ItemCarrito,
  type ItemPedido,
  type OrderStatus,
  type PageQuery,
  type Pagina,
  type PaymentStatus,
  type Pedido,
  type ProductoListado,
  type ResumenCarrito,
  type SellerOrderStatus,
  type SesionAuth,
  type TokenStore,
  type UserRole,
  type UsuarioResumen,
} from './types';
