# Capacidades de la API (vista frontend)

La Minimal Ecommerce API es un monolito NestJS modular. Prefijo `/api`, versión `/v1`. Algunos dominios se activan o desactivan con flags globales; el storefront debe degradar la UX sin romper el flujo núcleo.

## Núcleo listo para integración

| Área | Capacidad | Notas para MinimalShop |
|------|-----------|------------------------|
| Identidad | Registro, ingreso, refresh rotativo, salir, perfil y direcciones | Access ~15 min |
| Catálogo | Listado paginado (`tamano` ≤ 50), detalle, categorías | Público |
| Vendedor | CRUD productos, publicar, imagen, existencias | Rol `VENDEDOR` |
| Carrito | Resumen con precios vigentes, ítems CRUD | Solo `COMPRADOR` |
| Checkout | Pedido + reserva de stock; `Idempotency-Key` | |
| Pagos | Intento + consulta estado; sin confirm del cliente | Mock o Stripe según API |
| Pedidos | Historial, cancelar, confirmar recibido | Máquina de estados |
| Vendedor pedidos | Listado + cambio de estado post-pago | |
| Observabilidad | `x-correlation-id`, errores tipificados | Mostrar id en soporte |

## Módulos activables

Flags típicos (superadmin: `GET/PATCH /v1/admin/modulos`):

- `cupones`
- `resenas`
- `favoritos`
- `contenido`
- `notificaciones`

Si un módulo está apagado, las rutas con `@RequiereModulo` responden **409** `MODULE_DISABLED`.

### UX recomendada

1. Preferible: leer flags (cuando el rol lo permita) u ocultar menús/secciones según configuración conocida del entorno.
2. Si llega `MODULE_DISABLED` en runtime: mensaje claro via `userFacingMessage`, ocultar la entrada y no reintentar en bucle.
3. Checkout: si cupones están off, no mostrar campo de cupón.
4. Ficha de producto: si reseñas off, no pedir ni listar reseñas.
5. Navegación comprador: favoritos / contenido / notificaciones solo si el módulo está activo.

## Pagos

- `POST /v1/pagos/pedidos/:id/intento` → `clientSecret` (Stripe) o ids mock.
- Cierre por webhook del proveedor o simulador SUPERADMIN (`PAYMENT_PROVIDER=mock`, también en production de demo).
- No hay endpoint de «confirmar» en el cliente.
- Moneda por defecto del backend suele ser USD en mock; Wompi (COP) es adaptador futuro.

## Limitaciones a tener en cuenta

- Una sola tienda; flags globales, no por tenant.
- Imágenes: URL firmada (Supabase) o `/v1/medios/:clave` en local.
- Multi-réplica y métricas Prometheus fuera del alcance actual del backend.

## Criterios de demo frontend

- [ ] CORS del origen del FE configurado en la API
- [ ] Refresh + 401 manejados
- [ ] `Idempotency-Key` estable por intento de checkout
- [ ] Paginación en listados
- [ ] `correlationId` visible en error de soporte
- [ ] Pago no se da por bueno hasta estado terminal
- [ ] Módulos off degradan sin romper compra
