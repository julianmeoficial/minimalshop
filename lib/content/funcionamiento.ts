/** Copy and data for /funcionamiento. Module list mirrors the API's capabilities doc. */

export const API_REPO_URL = 'https://github.com/julianmeoficial/minimalecommerceapi';
export const STOREFRONT_REPO_URL = 'https://github.com/julianmeoficial/minimalshop';

export interface Principle {
  readonly title: string;
  readonly body: string;
}

export const PRINCIPLES: readonly Principle[] = [
  {
    title: 'Contenido primero',
    body: 'El producto y su precio ocupan el centro. La interfaz se aparta: hairlines, aire y una sola capa de cristal para lo que flota.',
  },
  {
    title: 'Un solo motor',
    body: 'Catálogo, carrito, checkout, pagos y pedidos viven en minimalecommerceAPI. Ninguna tienda tiene que reinventarlos.',
  },
  {
    title: 'Tu identidad',
    body: 'La vitrina es tuya: colores, tipografía, fotografía, textos y animación se cambian sin tocar la lógica de negocio.',
  },
];

export type ModuleKind = 'base' | 'activable';

export interface KeyModule {
  readonly id: string;
  readonly name: string;
  readonly body: string;
  readonly kind: ModuleKind;
}

/** MinimalShop Key: lo que una tienda recibe al conectarse a la API. */
export const KEY_MODULES: readonly KeyModule[] = [
  { id: 'identidad', name: 'Cuentas y roles', body: 'Comprador, vendedor y administración, con sesión segura y renovación de tokens.', kind: 'base' },
  { id: 'catalogo', name: 'Catálogo', body: 'Productos, categorías, búsqueda, orden y paginación de hasta 50 por página.', kind: 'base' },
  { id: 'vendedor', name: 'Panel del vendedor', body: 'Crear, editar, publicar productos, fotos y existencias.', kind: 'base' },
  { id: 'carrito', name: 'Carrito', body: 'Precios vigentes y existencias verificadas en cada cambio.', kind: 'base' },
  { id: 'checkout', name: 'Checkout seguro', body: 'Pedidos con clave de idempotencia y reserva de existencias.', kind: 'base' },
  { id: 'pagos', name: 'Pagos', body: 'Pasarela externa y simulador para pruebas, sin guardar tarjetas.', kind: 'base' },
  { id: 'pedidos', name: 'Pedidos', body: 'Estados claros de pendiente a entregado, cancelación y confirmación.', kind: 'base' },
  { id: 'reportes', name: 'Reportes', body: 'Métricas de ventas por vendedor y resumen de la plataforma.', kind: 'base' },
  { id: 'cupones', name: 'Cupones', body: 'Descuentos por porcentaje o monto fijo, validados en el checkout.', kind: 'activable' },
  { id: 'resenas', name: 'Reseñas', body: 'Opiniones de compradores con pedidos entregados.', kind: 'activable' },
  { id: 'favoritos', name: 'Favoritos', body: 'Listas de deseos por comprador.', kind: 'activable' },
  { id: 'contenido', name: 'Contenido', body: 'Publicaciones y eventos para contar la historia de la tienda.', kind: 'activable' },
  { id: 'notificaciones', name: 'Notificaciones', body: 'Avisos por correo y en la cuenta, enviados en segundo plano.', kind: 'activable' },
];

export interface LaunchStep {
  readonly title: string;
  readonly body: string;
  readonly code?: string;
}

export const LAUNCH_STEPS: readonly LaunchStep[] = [
  {
    title: 'Usa el código',
    body: 'Clona minimalecommerceAPI. Es el mismo motor que mueve a MinimalShop.',
    code: 'git clone https://github.com/julianmeoficial/minimalecommerceapi',
  },
  {
    title: 'Configura tu motor',
    body: 'Define base de datos, pasarela de pagos y qué módulos activar (cupones, reseñas, favoritos…).',
    code: 'PAYMENT_CURRENCY=cop',
  },
  {
    title: 'Conecta tu vitrina',
    body: 'Apunta este storefront, o uno propio, a tu API. Todas las rutas viven bajo /api/v1.',
    code: 'NEXT_PUBLIC_API_URL=https://tu-api.example/api',
  },
  {
    title: 'Personaliza',
    body: 'Cambia los tokens de color, tipografía y cristal; sube tus fotos y escribe tus textos.',
    code: 'styles/tokens.css',
  },
  {
    title: 'Publica y vende',
    body: 'Despliega API y vitrina, crea tu cuenta de vendedor y publica tu primer producto.',
  },
];
